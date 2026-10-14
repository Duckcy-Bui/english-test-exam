import {
  test,
  expect,
  request,
  type APIRequestContext,
} from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { emptyAnswers, type ExamAnswers } from "../../src/types/app";
import {
  countWords,
  type SpeakingGrade,
  type UnitExam,
  type WritingGrade,
} from "../../src/types/exam";

// Synthetic credentials only. Neither this harness nor its fake upstream uses
// an external service or credentials inherited from the developer's shell.
const secrets = {
  AI_API_KEY: "zQ8mV6pR2+K9w/X4nT7=H3%uY5&bC1",
  SESSION_SECRET: "sJ4dP9wF7!mR3qL8@cV6nZ2#tH5xG1",
  ACCESS_CODE: "aN5cX9vB2/yD7kF4+rM8pQ3=zW6jT1",
};
const root = process.cwd();
const dataDir = resolve(root, process.env.E2E_DATA_DIR || "data/units");
const examFile = join(
  dataDir,
  existsSync(join(dataDir, "unit-6.json"))
    ? "unit-6.json"
    : "unit-6.sample.json",
);
const exam = JSON.parse(readFileSync(examFile, "utf8")) as UnitExam;
const appBase = "http://localhost:3108";
const apiKeyFragment = secrets.AI_API_KEY.slice(3, 19);
function percentEncoded(value: string): string {
  return [...Buffer.from(value)]
    .map((byte) => `%${byte.toString(16).padStart(2, "0").toUpperCase()}`)
    .join("");
}
const probes = Object.entries(secrets).flatMap(([name, value]) =>
  [
    value,
    encodeURIComponent(value),
    percentEncoded(value),
    Buffer.from(value).toString("base64"),
  ].map((token, index) => ({
    name: `${name} representation ${index + 1}`,
    token,
  })),
);
probes.push({ name: "API key fragment", token: apiKeyFragment });

type AiSkill = "writing" | "speaking";
type Placement =
  "translationFeedback" | "feedback" | "original" | "corrected" | "note";
interface Scenario {
  skill: AiSkill;
  placement: Placement;
  token: string;
  recover: boolean;
  calls: number;
  contractErrors: number;
}
const cases: { label: string; placement: Placement; token: string }[] = [
  {
    label: "raw API key in feedback",
    placement: "translationFeedback",
    token: secrets.AI_API_KEY,
  },
  {
    label: "URL encoded API key in corrections.original",
    placement: "original",
    token: percentEncoded(secrets.AI_API_KEY),
  },
  {
    label: "base64 API key in corrections.corrected",
    placement: "corrected",
    token: Buffer.from(secrets.AI_API_KEY).toString("base64"),
  },
  {
    label: "truncated API key in corrections.note",
    placement: "note",
    token: apiKeyFragment,
  },
  {
    label: "session secret in feedback",
    placement: "feedback",
    token: secrets.SESSION_SECRET,
  },
  {
    label: "access code in corrections.note",
    placement: "note",
    token: secrets.ACCESS_CODE,
  },
];

let app: ChildProcess | undefined;
let fake: Server | undefined;
let client: APIRequestContext;
let runtimeDir: string | undefined;
let appLog = "";
let scenario: Scenario | undefined;

function assertSafe(value: string, location: string): void {
  for (const probe of probes)
    // Assert on a boolean: a failure must never print a credential or response.
    expect(
      value.includes(probe.token),
      `${location} contains ${probe.name}`,
    ).toBe(false);
}

function answers(): ExamAnswers {
  const value = emptyAnswers();
  value.writing = {
    translations: Object.fromEntries(
      exam.writing.translation.items.map((item) => [
        item.id,
        item.referenceTranslation,
      ]),
    ),
    email: exam.writing.email.modelAnswer,
  };
  value.speaking = Object.fromEntries(
    ["S1-1", "S1-2", "S1-3", "S2", "S3"].map((id) => [
      id,
      {
        text: "If our team used a reliable video system, we would communicate more clearly and reduce travel costs.",
      },
    ]),
  );
  return value;
}

async function stopApp(): Promise<void> {
  const child = app;
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise<void>((done) => child.once("exit", () => done()));
  try {
    process.kill(-child.pid!, "SIGTERM");
  } catch {
    return;
  }
  await Promise.race([exited, delay(5_000)]);
  if (child.exitCode === null && child.signalCode === null) {
    process.kill(-child.pid!, "SIGKILL");
    await exited;
  }
}

test.beforeAll(async () => {
  runtimeDir = mkdtempSync(join(tmpdir(), "english-it-secret-e2e-"));
  fake = createServer(async (req, res) => {
    try {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const body = JSON.parse(raw);
      const student = JSON.parse(body.contents[0].parts[0].text.split("\n")[1]);
      const writing = Object.hasOwn(student, "email");
      const active = scenario;
      if (!active) throw new Error("No fake scenario configured");
      active.calls++;
      if (
        req.method !== "POST" ||
        req.url !== "/v1beta/models/e2e-secret-primary:generateContent" ||
        req.headers.authorization !== `Bearer ${secrets.AI_API_KEY}` ||
        body.generationConfig.responseMimeType !== "application/json" ||
        body.generationConfig.temperature !== 0 ||
        writing !== (active.skill === "writing")
      ) {
        active.contractErrors++;
        throw new Error("Fake upstream contract failed");
      }
      const corrections = [
        {
          original: "The system work.",
          corrected: "The system works.",
          note: "Chia động từ cho chủ ngữ số ít.",
        },
      ];
      const grade: WritingGrade | SpeakingGrade = writing
        ? {
            translations: ["W31", "W32", "W33", "W34", "W35"].map((id) => ({
              id,
              score: 0.125 as const,
              feedback: "Nhận xét sạch.",
            })),
            email: {
              steps: 0.25,
              layout: 0.125,
              grammar: 0.125,
              vocabulary: 0.125,
              wordCount: countWords(student.email),
              feedback: "Nhận xét sạch.",
              corrections,
            },
          }
        : {
            task: 0.3125,
            unitGrammar: 0.3125,
            vocabulary: 0.3125,
            fluency: 0.3125,
            pronunciationAssessed: false,
            feedback: "Nhận xét sạch.",
            corrections,
          };
      if (!active.recover || active.calls === 1) {
        const tainted = `Nhận xét từ upstream: ${active.token}`;
        if (
          active.placement === "translationFeedback" &&
          "translations" in grade
        )
          grade.translations[0].feedback = tainted;
        else if (
          active.placement === "feedback" ||
          active.placement === "translationFeedback"
        ) {
          if ("email" in grade) grade.email.feedback = tainted;
          else grade.feedback = tainted;
        } else corrections[0][active.placement] = tainted;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          candidates: [
            {
              finishReason: "STOP",
              content: { parts: [{ text: JSON.stringify(grade) }] },
            },
          ],
        }),
      );
    } catch {
      // Never log payloads or raw errors from the simulated upstream.
      if (scenario) scenario.contractErrors++;
      res.writeHead(500, { "content-type": "application/json" });
      res.end("{}");
    }
  });
  await new Promise<void>((done, reject) => {
    fake!.once("error", () =>
      reject(new Error("Fake upstream failed to start")),
    );
    fake!.listen(3198, "127.0.0.1", () => done());
  });
  app = spawn(process.execPath, [".next/standalone/server.js"], {
    cwd: root,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      ...secrets,
      PORT: "3108",
      HOSTNAME: "127.0.0.1",
      AI_MOCK: "0",
      AI_BASE_URL: "http://127.0.0.1:3198",
      AI_MODEL: "e2e-secret-primary",
      AI_MODEL_FALLBACK: "e2e-secret-fallback",
      EXAM_DATA_DIR: dataDir,
      RATE_LIMIT_DB: join(runtimeDir, "quota.sqlite"),
      RATE_LIMIT_PER_DEVICE: "100",
      RATE_LIMIT_PER_IP: "100",
      TRUST_PROXY: "0",
    },
  });
  app.stdout!.on("data", (chunk) => {
    appLog += String(chunk);
  });
  app.stderr!.on("data", (chunk) => {
    appLog += String(chunk);
  });
  const probe = await request.newContext({ baseURL: appBase });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 90; attempt++) {
      if (app.exitCode !== null || app.signalCode !== null)
        throw new Error("Secret regression app exited before readiness");
      try {
        const response = await probe.get("/api/access", { timeout: 500 });
        if (response.ok()) {
          assertSafe(await response.text(), "readiness response");
          ready = true;
          break;
        }
      } catch {
        // Startup connection failures are expected; no raw error reaches logs.
      }
      await delay(500);
    }
    expect(ready, "Secret regression app became ready").toBe(true);
  } finally {
    await probe.dispose();
  }
});

test.beforeEach(async () => {
  // localhost permits the app's production Secure cookies in this HTTP harness.
  client = await request.newContext({ baseURL: appBase });
  const response = await client.post("/api/access", {
    data: { code: secrets.ACCESS_CODE },
  });
  expect(response.status()).toBe(200);
  assertSafe(await response.text(), "access response");
});

test.afterEach(async () => {
  await client?.dispose();
});

test.afterAll(async () => {
  try {
    await stopApp();
    if (fake?.listening)
      await new Promise<void>((done) => fake!.close(() => done()));
    assertSafe(appLog, "standalone server log");
  } finally {
    app?.stdout?.removeAllListeners("data");
    app?.stderr?.removeAllListeners("data");
    fake?.removeAllListeners();
    if (runtimeDir) rmSync(runtimeDir, { recursive: true, force: true });
  }
});

async function start(skill: AiSkill): Promise<string> {
  const response = await client.post("/api/session", {
    data: { unit: 6, mode: "practice", scope: skill },
  });
  expect(response.status()).toBe(200);
  const raw = await response.text();
  assertSafe(raw, "session response");
  const value = JSON.parse(raw).session;
  expect(value.exam.unitTitle).toBe(exam.unitTitle);
  return value.sessionId;
}

for (const skill of ["writing", "speaking"] as const) {
  for (const attack of cases) {
    test(`${skill}: repeated ${attack.label} returns 502 without a saved result`, async () => {
      scenario = {
        skill,
        ...attack,
        recover: false,
        calls: 0,
        contractErrors: 0,
      };
      const sessionId = await start(skill);
      const response = await client.post("/api/grade", {
        data: { sessionId, answers: answers() },
      });
      const raw = await response.text();
      assertSafe(raw, "POST /api/grade");
      expect(response.status()).toBe(502);
      expect(Boolean(JSON.parse(raw).result)).toBe(false);
      expect(scenario.calls, "Exactly one invalid-output retry").toBe(2);
      expect(scenario.contractErrors, "Native Gemini request contract").toBe(0);
      const readback = await client.get(`/api/grade?sessionId=${sessionId}`);
      const readbackRaw = await readback.text();
      assertSafe(readbackRaw, "GET /api/grade");
      expect(readback.status()).toBe(409);
      expect(Boolean(JSON.parse(readbackRaw).result)).toBe(false);
      expect(scenario.calls).toBe(2);
      assertSafe(appLog, "standalone server log");
    });
  }

  test(`${skill}: a clean retry is saved and returned after tainted corrections`, async () => {
    scenario = {
      skill,
      placement: "note",
      token: Buffer.from(secrets.SESSION_SECRET).toString("base64"),
      recover: true,
      calls: 0,
      contractErrors: 0,
    };
    const sessionId = await start(skill);
    const response = await client.post("/api/grade", {
      data: { sessionId, answers: answers() },
    });
    const raw = await response.text();
    assertSafe(raw, "clean retry POST /api/grade");
    expect(response.status()).toBe(200);
    const result = JSON.parse(raw).result;
    expect(result.mock).toBe(false);
    expect(result.total).toBe(1.25);
    const grade = result.skills[skill][skill];
    const cleanCorrections =
      skill === "writing" ? grade.email.corrections : grade.corrections;
    expect(cleanCorrections[0].note).toBe(
      "Chia động từ cho chủ ngữ số ít.",
    );
    expect(scenario.calls, "Tainted first output is retried once").toBe(2);
    expect(scenario.contractErrors, "Native Gemini request contract").toBe(0);
    const readback = await client.get(`/api/grade?sessionId=${sessionId}`);
    const readbackRaw = await readback.text();
    assertSafe(readbackRaw, "clean retry GET /api/grade");
    expect(readback.status()).toBe(200);
    expect(
      JSON.stringify(JSON.parse(readbackRaw).result) === JSON.stringify(result),
    ).toBe(true);
    expect(scenario.calls, "Readback does not call upstream again").toBe(2);
    assertSafe(appLog, "standalone server log");
  });
}
