import { test, expect, request as createRequest, type Page } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import type { ExamResult } from "../../src/types/app";
import type { UnitExam } from "../../src/types/exam";

const root = process.cwd();
const baseURL = "http://localhost:3109";
const accessCode = "local-multi-test-code";
let runtimeDir: string;
let app: ChildProcess | undefined;
test.use({ baseURL });

test.beforeAll(async () => {
  runtimeDir = mkdtempSync(join(tmpdir(), "english-it-multi-test-e2e-"));
  const unitsDir = join(runtimeDir, "units");
  cpSync(join(root, "data/units"), unitsDir, { recursive: true });
  mkdirSync(join(runtimeDir, "audio"));
  // These temporary copies exercise routing and storage only. They are not
  // authored or audited exam content and never enter the committed data.
  const original = JSON.parse(readFileSync(join(unitsDir, "unit-6-A.json"), "utf8")) as UnitExam;
  for (const testId of ["B", "C"] as const) {
    const exam = structuredClone(original);
    exam.testId = testId;
    exam.source = "ai";
    exam.reading.matching.items[0].term = `Synthetic routing marker ${testId}`;
    exam.listening.parts[0].script[0].text = `Synthetic listening marker ${testId}.`;
    writeFileSync(join(unitsDir, `unit-6-${testId}.json`), JSON.stringify(exam));
  }
  app = spawn(process.execPath, [".next/standalone/server.js"], {
    cwd: root, detached: true, stdio: "ignore",
    env: {
      ...process.env,
      PORT: "3109", HOSTNAME: "127.0.0.1", ACCESS_CODE: accessCode,
      SESSION_SECRET: "synthetic-multi-test-session-secret-long-enough",
      AI_MOCK: "1", AI_API_KEY: "synthetic-unused-multi-test-key",
      EXAM_DATA_DIR: unitsDir, AUDIO_DIR: join(runtimeDir, "audio"),
      PDF_DATA_DIR: resolve(root, "data/pdf"),
      RATE_LIMIT_DB: join(runtimeDir, "quota.sqlite"), TRUST_PROXY: "0",
    },
  });
  const probe = await createRequest.newContext({ baseURL });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 90; attempt++) {
      if (app.exitCode !== null || app.signalCode !== null)
        throw new Error("Multi-test regression app exited before readiness");
      try {
        if ((await probe.get("/api/access", { timeout: 500 })).ok()) {
          ready = true;
          break;
        }
      } catch { /* Startup connection failures are expected. */ }
      await delay(250);
    }
    expect(ready, "Multi-test regression app became ready").toBe(true);
  } finally { await probe.dispose(); }
});

test.beforeEach(async ({ page }) => {
  expect((await page.request.post("/api/access", { data: { code: accessCode } })).status()).toBe(200);
});

test.afterAll(async () => {
  if (app && app.exitCode === null && app.signalCode === null) {
    const child = app;
    const exited = new Promise<void>((done) => child.once("exit", () => done()));
    process.kill(-child.pid!, "SIGTERM");
    await Promise.race([exited, delay(5_000)]);
    if (child.exitCode === null && child.signalCode === null) {
      process.kill(-child.pid!, "SIGKILL");
      await exited;
    }
  }
  if (runtimeDir) rmSync(runtimeDir, { recursive: true, force: true });
});

function historyResult(overrides: Partial<ExamResult> = {}): ExamResult {
  return {
    id: "old-a", unit: 6, unitTitle: "Interactions", testId: "A", source: "teacher",
    mode: "practice", scope: "full", submittedAt: "2026-10-14T15:00:00Z",
    total: 5.25, mock: true, skills: {}, review: {}, ...overrides,
  };
}

test("three test cards keep sources, PDF links, submissions and best scores separate", async ({ page }) => {
  await page.goto("/");
  const { testId: _test, source: _source, ...old } = historyResult();
  await page.evaluate((attempts) => localStorage.setItem("english-it-history-v1", JSON.stringify(attempts)), [
    { result: old },
    { result: historyResult({ id: "best-b", testId: "B", source: "ai", total: 9 }) },
    { result: { ...historyResult({ id: "invalid", total: 10 }), testId: "Z" } },
  ]);
  await page.reload();
  const homeUnit = page.locator(".unit-card").filter({ has: page.getByRole("link", { name: "Luyện tập Unit 6", exact: true }) });
  await expect(homeUnit.getByText("3 đề", { exact: true })).toBeVisible();
  await expect(homeUnit.locator(".test-best-score").nth(0)).toContainText("5.25 / 10");
  await expect(homeUnit.locator(".test-best-score").nth(1)).toContainText("9.00 / 10");
  await expect(homeUnit.locator(".test-best-score").nth(2)).toContainText("—");
  await homeUnit.getByRole("link", { name: "Luyện tập Unit 6", exact: true }).click();
  await expect(page.locator(".test-card")).toHaveCount(3);
  const cardA = page.locator('.test-card[data-test-id="A"]');
  const cardB = page.locator('.test-card[data-test-id="B"]');
  const cardC = page.locator('.test-card[data-test-id="C"]');
  await expect(cardA.getByText("Đề cô", { exact: true })).toBeVisible();
  await expect(cardB.getByText("Đề AI", { exact: true })).toBeVisible();
  await expect(cardC.getByText("Đề AI", { exact: true })).toBeVisible();
  await expect(cardA.locator(".best-score")).toContainText("5.25 / 10");
  await expect(cardB.locator(".best-score")).toContainText("9.00 / 10");
  for (const testId of ["A", "B", "C"]) {
    const card = page.locator(`.test-card[data-test-id="${testId}"]`);
    for (const [label, kind] of [["Tải PDF đề", "exam"], ["Tải PDF đáp án", "answers"]])
      await expect(card.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", `/api/pdf?unit=6&test=${testId}&kind=${kind}`);
  }
  const submitted = page.waitForRequest((req) => req.url().endsWith("/api/session") && req.method() === "POST");
  await cardB.locator(".skill-reading").getByRole("button", { name: "Luyện kỹ năng này", exact: true }).click();
  expect((await submitted).postDataJSON()).toEqual({ unit: 6, test: "B", mode: "practice", scope: "reading" });
  await expect(page).toHaveURL(/\/exam\//);
  await expect(page.locator(".exam-topline")).toContainText("Đề B");
  await expect(page.locator(".exam-topline")).toContainText("Đề AI");
  await expect(page.locator('label[for="R1"]')).toContainText("Synthetic routing marker B");
  await page.locator('label[for="R1"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/multi-test-reading-b-marker.png" });
  await page.getByRole("button", { name: "Nộp bài & xem kết quả", exact: true }).click();
  await page.locator(".confirm-panel").getByRole("button", { name: "Xác nhận nộp", exact: true }).click();
  await expect(page).toHaveURL(/\/results\//);
  await expect(page.locator(".page-heading")).toContainText("Đề B");
  await expect(page.locator(".page-heading")).toContainText("Đề AI");
  await page.goto("/history");
  await expect(page.locator(".history-row")).toHaveCount(3);
  await expect(page.locator(".history-row").filter({
    has: page.locator(".unit-label").filter({ hasText: /Đề A$/ }),
  })).toContainText("Đề cô");
  await expect(page.locator(".history-row").filter({
    has: page.locator(".unit-label").filter({ hasText: /Đề B$/ }),
  })).toHaveCount(2);
  await page.goto("/unit/6");
  await expect(cardB.locator(".best-score")).toContainText("9.00 / 10");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "test-results/multi-test-unit-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Thi thử", exact: true }).click();
  const examStart = page.waitForRequest((req) => req.url().endsWith("/api/session") && req.method() === "POST");
  await cardC.getByRole("button", { name: "Thi cả đề", exact: true }).click();
  expect((await examStart).postDataJSON()).toEqual({ unit: 6, test: "C", mode: "exam", scope: "full" });
  await expect(page.locator(".exam-topline")).toContainText("Đề C");
  await expect(page.locator("#R1")).toHaveCount(0);
  await page.screenshot({ path: "test-results/multi-test-exam-c.png" });
});

async function mockSpeech(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const spoken: string[] = [];
    Object.defineProperty(window, "__spoken", { value: spoken });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      cancel() {}, getVoices: () => [], addEventListener() {}, removeEventListener() {},
      speak(utterance: SpeechSynthesisUtterance) {
        spoken.push(utterance.text);
        setTimeout(() => utterance.onend?.(new Event("end") as SpeechSynthesisEvent), 0);
      },
    } });
  });
}

test("an additional test without MP3 uses browser speech and its QR landing shows listening only", async ({ page }) => {
  await mockSpeech(page);
  await page.goto("/listen/6/C");
  await expect(page.locator(".page-heading")).toContainText("Đề AI");
  await expect(page.getByRole("button", { name: "Nghe Part A", exact: true })).toBeVisible();
  await expect(page.locator('input[name="L1"]')).toHaveCount(0);
  await expect(page.getByText("Synthetic listening marker C.", { exact: true })).toHaveCount(0);
  const listenResponse = page.waitForResponse((response) => response.url().endsWith("/api/listen") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Nghe Part A", exact: true }).click();
  const { playback } = await (await listenResponse).json();
  expect(playback.audioUrl).toBeUndefined();
  expect(playback.remaining).toBeNull();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken)).toContain("Synthetic listening marker C.");
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toContain("Synthetic listening marker C.");
  await expect(page.getByText("Synthetic listening marker C.", { exact: true })).toHaveCount(0);

  const response = await page.request.post("/api/session", { data: { unit: 6, test: "D", mode: "practice", scope: "reading" } });
  expect(response.status()).toBe(404);
  const malformed = await page.request.post("/api/session", { data: { unit: 6, test: "c", mode: "practice", scope: "reading" } });
  expect(malformed.status()).toBe(400);
  const unauthenticated = await createRequest.newContext({ baseURL });
  try {
    expect((await unauthenticated.post("/api/session", { data: { unit: 6, test: "C", mode: "practice", scope: "listening" } })).status()).toBe(401);
  } finally { await unauthenticated.dispose(); }
});

test("a QR visitor can unlock the selected additional test without losing its identity", async ({ browser }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto("/listen/6/C");
    await expect(page.getByLabel("Mã truy cập", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Nghe Part A", exact: true })).toHaveCount(0);
    await page.getByLabel("Mã truy cập", { exact: true }).fill("wrong");
    await page.getByRole("button", { name: "Mở bài nghe", exact: true }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await page.getByLabel("Mã truy cập", { exact: true }).fill(accessCode);
    const started = page.waitForResponse((response) => response.url().endsWith("/api/listen/paper-session") && response.request().method() === "POST");
    await page.getByRole("button", { name: "Mở bài nghe", exact: true }).click();
    const response = await started;
    expect(response.request().postDataJSON()).toEqual({ unit: 6, test: "C" });
    const { session } = await response.json();
    expect(session.exam.testId).toBe("C");
    expect(session.exam.source).toBe("ai");
    expect(session.mode).toBe("practice");
    expect(session.scope).toBe("listening");
    await expect(page.getByRole("button", { name: "Nghe Part A", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Nghe Part B", exact: true })).toBeVisible();
    await expect(page.getByLabel("Mã truy cập", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Synthetic listening marker C.", { exact: true })).toHaveCount(0);
    const resumed = page.waitForResponse((res) => res.url().endsWith("/api/listen/paper-session") && res.request().method() === "POST");
    await page.reload();
    expect((await (await resumed).json()).session.sessionId).toBe(session.sessionId);
    await expect(page.getByRole("button", { name: "Nghe Part A", exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.screenshot({ path: "test-results/qr-listening-c-mobile.png", fullPage: true });
  } finally { await context.close(); }
});
