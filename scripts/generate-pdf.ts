// Render every canonical exam using a short-lived, loopback-only Next server.
// PDF_BASE_URL controls the public listening links; no access code goes into PDFs.
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, readdir, rename, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium, type Browser } from "@playwright/test";

async function freePort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Không lấy được cổng render.");
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

async function main() {
  const dataDir = resolve(process.env.EXAM_DATA_DIR || "data/units");
  const outputDir = resolve(process.env.PDF_DATA_DIR || "data/pdf");
  const exams = (await readdir(dataDir)).flatMap((name) => {
    const match = /^unit-([1-8])-([A-D])\.json$/.exec(name);
    return match ? [{ unit: match[1], testId: match[2] }] : [];
  }).sort((a, b) => `${a.unit}${a.testId}`.localeCompare(`${b.unit}${b.testId}`));
  if (!exams.length) throw new Error("Không có đề unit-<N>-<Test>.json để sinh PDF.");
  await mkdir(outputDir, { recursive: true });
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const token = randomBytes(32).toString("hex");
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "development", NEXT_TELEMETRY_DISABLED: "1", PDF_RENDER_TOKEN: token, EXAM_DATA_DIR: dataDir },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let serverLog = "";
  server.stdout.on("data", (chunk) => { serverLog = (serverLog + String(chunk)).slice(-5000); });
  server.stderr.on("data", (chunk) => { serverLog = (serverLog + String(chunk)).slice(-5000); });
  let spawnError: Error | undefined;
  server.on("error", (error) => { spawnError = error; });
  let browser: Browser | undefined;
  const temporary = new Set<string>();
  const stop = () => { server.kill("SIGTERM"); };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  try {
    const deadline = Date.now() + 120_000;
    while (true) {
      if (spawnError) throw spawnError;
      if (server.exitCode !== null || server.signalCode !== null) throw new Error("Máy chủ render dừng sớm.");
      try {
        const response = await fetch(base, { signal: AbortSignal.timeout(2000) });
        if (response.ok) break;
      } catch { /* Await compilation and listening socket. */ }
      if (Date.now() > deadline) throw new Error("Máy chủ render không sẵn sàng sau 120 giây.");
      await delay(300);
    }
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ extraHTTPHeaders: { Authorization: `Bearer ${token}` } });
    const page = await context.newPage();
    await page.emulateMedia({ media: "print" });
    for (const { unit, testId } of exams) {
      for (const kind of ["exam", "answers"] as const) {
        const response = await page.goto(`${base}/internal/print/${unit}/${testId}/${kind}`, { waitUntil: "networkidle", timeout: 120_000 });
        if (!response?.ok()) throw new Error(`Không render được Unit ${unit} Test ${testId} ${kind} (${response?.status()}).`);
        await page.evaluate(() => document.fonts.ready);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        if (overflow) throw new Error(`Trang in Unit ${unit} Test ${testId} ${kind} tràn chiều ngang.`);
        const file = join(outputDir, `unit-${unit}-${testId}-${kind}.pdf`);
        const pending = `${file}.tmp`;
        temporary.add(pending);
        await page.pdf({
          path: pending, format: "A4", preferCSSPageSize: true, printBackground: true,
          displayHeaderFooter: true, headerTemplate: "<span></span>",
          footerTemplate: `<div style="font-family:Arial;font-size:8px;text-align:center;width:100%;color:#666">English for IT — Unit ${unit} · Test ${testId} · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
        });
        await rename(pending, file);
        temporary.delete(pending);
        console.log(`PDF: ${file}`);
      }
    }
    console.log(`Đã sinh ${exams.length * 2} PDF cho ${exams.length} đề.`);
  } catch (error) {
    // The render credential is never printed, even on startup failures.
    if (serverLog) console.error(serverLog.replaceAll(token, "[REDACTED]"));
    throw error;
  } finally {
    try { await browser?.close(); }
    finally {
      stop();
      await Promise.race([new Promise<void>((resolve) => {
        if (server.exitCode !== null || server.signalCode !== null) resolve();
        else server.once("exit", () => resolve());
      }), delay(5000).then(() => { server.kill("SIGKILL"); })]);
      await Promise.all([...temporary].map((file) => rm(file, { force: true })));
      process.removeListener("SIGINT", stop);
      process.removeListener("SIGTERM", stop);
    }
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Không sinh được PDF.");
  process.exitCode = 1;
});
