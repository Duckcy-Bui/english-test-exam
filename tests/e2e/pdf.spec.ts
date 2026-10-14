import { test, expect, request as createRequest } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("PDF downloads require both access cookies and serve the packaged, selected artifact", async ({ request, baseURL }) => {
  for (const kind of ["exam", "answers"]) {
    expect((await request.get(`/api/pdf?unit=6&test=A&kind=${kind}`)).status()).toBe(401);
  }
  expect((await request.post("/api/access", { data: { code: "local-e2e-code" } })).status()).toBe(200);
  for (const kind of ["exam", "answers"]) {
    const response = await request.get(`/api/pdf?unit=6&test=A&kind=${kind}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/pdf");
    expect(response.headers()["content-disposition"]).toBe(`attachment; filename="English-for-IT-Unit-6-Test-A-${kind === "exam" ? "Exam" : "Answers"}.pdf"`);
    expect(response.headers()["cache-control"]).toContain("no-store");
    const body = await response.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");
    expect(body.equals(readFileSync(join(process.env.PDF_DATA_DIR || "data/pdf", `unit-6-A-${kind}.pdf`)))).toBe(true);
  }
  for (const query of ["unit=0&test=A&kind=exam", "unit=6&test=..%2FA&kind=exam", "unit=6&test=A&kind=other"])
    expect((await request.get(`/api/pdf?${query}`)).status()).toBe(400);
  expect((await request.get("/api/pdf?unit=6&test=D&kind=exam")).status()).toBe(404);
  // An access cookie alone does not impersonate the device cookie.
  const state = await request.storageState();
  const withoutDevice = await createRequest.newContext({ baseURL, storageState: {
    ...state, cookies: state.cookies.filter((cookie) => cookie.name !== "et_device"),
  } });
  try { expect((await withoutDevice.get("/api/pdf?unit=6&test=A&kind=answers")).status()).toBe(401); }
  finally { await withoutDevice.dispose(); }
});

test("internal print pages and raw PDF paths stay unavailable on the ordinary app server", async ({ request }) => {
  for (const kind of ["exam", "answers"])
    expect((await request.get(`/internal/print/6/A/${kind}`)).status()).toBe(404);
  expect((await request.post("/api/access", { data: { code: "local-e2e-code" } })).status()).toBe(200);
  for (const kind of ["exam", "answers"])
    expect((await request.get(`/internal/print/6/A/${kind}`)).status()).toBe(404);
  expect((await request.get("/data/pdf/unit-6-A-answers.pdf")).status()).toBe(404);
});
