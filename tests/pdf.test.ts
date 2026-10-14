import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sample from "../fixtures/unit-6.sample.json";
import { ANSWER_FIELDS, type UnitExam } from "../src/types/exam";
import { authorizePdfRender, pdfListeningUrl, pdfQrCode, pdfSelection, readExamPdf } from "../src/server/pdf";
import { renderPdfDocument } from "../src/server/pdf-document";
import { AppError } from "../src/server/errors";

const original = { token: process.env.PDF_RENDER_TOKEN, base: process.env.PDF_BASE_URL, dir: process.env.PDF_DATA_DIR };
afterEach(() => {
  for (const [key, value] of [["PDF_RENDER_TOKEN", original.token], ["PDF_BASE_URL", original.base], ["PDF_DATA_DIR", original.dir]]) {
    if (value === undefined) delete process.env[key!]; else process.env[key!] = value;
  }
});

test("print rendering is disabled by default and requires its own bearer token", () => {
  delete process.env.PDF_RENDER_TOKEN;
  assert.throws(() => authorizePdfRender(new Request("http://localhost/internal/print/6/A/answers")), (e: unknown) => e instanceof AppError && e.status === 404);
  process.env.PDF_RENDER_TOKEN = "private-render-token";
  const invalidHeaders: Record<string, string>[] = [{}, { authorization: "Bearer wrong" }, { cookie: "et_access=any-cookie" }];
  for (const headers of invalidHeaders) {
    assert.throws(() => authorizePdfRender(new Request("http://localhost/internal/print/6/A/answers", { headers })), (e: unknown) => e instanceof AppError && e.status === 401);
  }
  assert.doesNotThrow(() => authorizePdfRender(new Request("http://localhost/internal/print/6/A/answers", { headers: { authorization: "Bearer private-render-token" } })));
});

test("PDF selections reject traversal and noncanonical identifiers", () => {
  assert.deepEqual(pdfSelection("6", "C", "exam"), { unit: 6, testId: "C", kind: "exam" });
  for (const unit of [0, 9, 1.5, NaN, "../6", "06", "6e0", null])
    assert.throws(() => pdfSelection(unit, "A", "answers"), AppError);
  for (const id of ["a", "E", "../A", "A/../B", undefined, null])
    assert.throws(() => pdfSelection(6, id, "answers"), AppError);
  for (const kind of ["../answers", "answer", undefined, null])
    assert.throws(() => pdfSelection(6, "A", kind), AppError);
});

test("QR listening URLs use the configured public base and exact test identity", async () => {
  delete process.env.PDF_BASE_URL;
  assert.equal(pdfListeningUrl(6, "B"), "https://english.webs.id.vn/listen/6/B");
  process.env.PDF_BASE_URL = "https://example.org/course/?ignored=true#fragment";
  const url = pdfListeningUrl(2, "D");
  assert.equal(url, "https://example.org/course/listen/2/D");
  assert.match(await pdfQrCode(url), /<svg/);
  for (const base of ["javascript:alert(1)", "https://user:password@example.org", "invalid"] ) {
    process.env.PDF_BASE_URL = base;
    assert.throws(() => pdfListeningUrl(6, "A"), AppError);
  }
});

test("question PDF renders all tasks while excluding every private answer field and transcript", () => {
  const exam = structuredClone(sample) as UnitExam;
  const markers: string[] = [];
  function mark(value: unknown) {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if ([...ANSWER_FIELDS, "script"].includes(key as never)) {
        const marker = `PRIVATE_SENTINEL_${markers.length}_HIDDEN`;
        markers.push(marker);
        (value as Record<string, unknown>)[key] = key === "script" ? [{ speaker: "Hidden", text: marker }] : marker;
      } else mark(child);
    }
  }
  mark(exam);
  const html = renderPdfDocument(exam, "exam", "https://example.org/listen/6/A", "<svg id=\"qr-marker\"></svg>");
  for (const marker of markers) assert.ok(!html.includes(marker), marker);
  for (const id of ["L1", "L10", "R1", "R30", "W31", "W35", "S1", "S2", "S3"]) assert.ok(html.includes(id), id);
  for (const label of ["From:", "To:", "Date:", "Subject:", "First,", "Then,", "Next,", "After that,", "Finally,", "Best wishes", "qr-marker", "Time allowed", "Đề AI"]) assert.ok(html.includes(label), label);
  assert.match(html, /@page/);
  assert.match(html, /A4/);
});

test("answer PDF includes explanations, transcripts, translations and models with HTML escaping", () => {
  const exam = structuredClone(sample) as UnitExam;
  exam.source = "teacher";
  exam.unitTitle = '<img src=x onerror="alert(1)">';
  const html = renderPdfDocument(exam, "answers", "https://example.org/listen/6/A", "");
  for (const text of [exam.listening.parts[0].script[0].text, exam.listening.parts[0].questions[0].explanation,
    exam.reading.matching.items[0].explanation, exam.writing.translation.items[0].referenceTranslation])
    assert.ok(html.includes(text), text);
  assert.ok(html.includes("Đề cô"));
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(!html.includes(exam.sourceNotes[0]));
  for (const part of [exam.speaking.parts[1], exam.speaking.parts[2]]) {
    assert.ok(html.includes(part.sampleAnswer.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;")));
  }
});

test("PDF filesystem loading distinguishes each test and returns 404 for missing artifacts", async () => {
  const directory = await mkdtemp(join(tmpdir(), "english-it-pdf-test-"));
  process.env.PDF_DATA_DIR = directory;
  try {
    await writeFile(join(directory, "unit-6-B-exam.pdf"), "%PDF-B-exam");
    assert.equal((await readExamPdf(6, "B", "exam")).toString(), "%PDF-B-exam");
    await assert.rejects(readExamPdf(6, "A", "exam"), (e: unknown) => e instanceof AppError && e.status === 404);
    await assert.rejects(readExamPdf(6, "B", "answers"), (e: unknown) => e instanceof AppError && e.status === 404);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
