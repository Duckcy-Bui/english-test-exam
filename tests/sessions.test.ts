import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { afterEach, beforeEach, test } from "node:test";
import sample from "../fixtures/unit-6.sample.json";
import { AppError } from "../src/server/errors";
import {
  createSession,
  discardSessionAudio,
  finalAnswers,
  getSession,
  sessionView,
  submitSection,
  type ServerSession,
} from "../src/server/sessions";
import {
  SKILLS,
  emptyAnswers,
  type ExamAnswers,
  type Skill,
} from "../src/types/app";
import { ANSWER_FIELDS, type UnitExam } from "../src/types/exam";

const exam = sample as UnitExam;
const privateFields = new Set<string>([
  ...ANSWER_FIELDS,
  "script",
  "sourceNotes",
]);
const originalDataDirectory = process.env.EXAM_DATA_DIR;
beforeEach(() => {
  process.env.EXAM_DATA_DIR = "fixtures";
});
afterEach(() => {
  if (originalDataDirectory === undefined) delete process.env.EXAM_DATA_DIR;
  else process.env.EXAM_DATA_DIR = originalDataDirectory;
});

function session(overrides: Partial<ServerSession> = {}): ServerSession {
  const now = Date.now();
  return {
    id: randomUUID(),
    device: randomUUID(),
    exam,
    mode: "exam",
    scope: "full",
    started: now,
    expires: now + 90 * 60_000,
    deleteAt: now + 4 * 3600_000,
    listens: { A: 0, B: 0 },
    status: "idle",
    completed: [],
    answers: emptyAnswers(),
    ...overrides,
  };
}

function answers(): ExamAnswers {
  return {
    listening: { L1: "B", L6: "Tuesday" },
    reading: { R1: "D", R6: "B" },
    writing: {
      translations: { W31: "Ngày càng nhiều đồng nghiệp tham gia." },
      email: "Dear Sam, first check your camera.",
    },
    speaking: {
      "S1-1": { text: "More and more people are joining." },
      S2: { text: "First, open the app." },
      S3: {
        text: "If we used it, we would save time.",
        audio: { mimeType: "audio/wav", data: "AAAA" },
      },
    },
  };
}

function assertPrivateFieldsAbsent(value: unknown, path = "response"): void {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(
      !privateFields.has(key),
      `Private field ${path}.${key} must not be sent before final submission`,
    );
    assertPrivateFieldsAbsent(child, `${path}.${key}`);
  }
}

function assertActiveOnly(s: ServerSession, expected: Skill | null): void {
  const view = sessionView(s);
  assert.equal(view.activeSkill, expected);
  assert.equal(view.mode, "exam");
  assert.equal(view.scope, "full");
  assert.deepEqual(
    SKILLS.filter((skill) => Object.hasOwn(view.exam, skill)),
    expected ? [expected] : [],
  );
  assert.deepEqual(view.completedSkills, s.completed);
  assert.equal(view.exam.unit, 6);
  assert.equal(view.exam.unitTitle, exam.unitTitle);
  assert.equal(view.exam.testId, exam.testId);
  assert.equal(view.exam.source, exam.source);
  assertPrivateFieldsAbsent(view);
}

function conflict(action: () => unknown): void {
  assert.throws(
    action,
    (error: unknown) => error instanceof AppError && error.status === 409,
  );
}

function submitFirstThree(s: ServerSession, data = answers()): void {
  submitSection(s, "listening", data);
  submitSection(s, "reading", data);
  submitSection(s, "writing", data);
}

test("exam sessions require the full scope and use the 90-minute deadline", async () => {
  for (const scope of SKILLS) {
    await assert.rejects(
      createSession(randomUUID(), 6, "exam", scope),
      (error: unknown) => error instanceof AppError && error.status === 400,
    );
  }
  const s = await createSession(randomUUID(), 6, "exam", "full");
  assert.equal(s.scope, "full");
  assert.equal(s.expires! - s.started, 90 * 60_000);
  assert.deepEqual(s.answers, emptyAnswers());
  assert.deepEqual(s.completed, []);
  assertActiveOnly(s, "listening");
});

test("creation rejects invalid unit, mode and scope instead of opening a partial exam", async () => {
  for (const args of [
    ["6", "exam", "full"],
    [9, "exam", "full"],
    [6, "unknown", "full"],
    [6, "exam", "all"],
  ]) {
    await assert.rejects(
      createSession(randomUUID(), ...(args as [unknown, unknown, unknown])),
      (error: unknown) => error instanceof AppError && error.status === 400,
    );
  }
});

test("initial exam view releases only Listening and no private fields or later prompts", () => {
  const s = session();
  assertActiveOnly(s, "listening");
  const view = sessionView(s);
  assert.ok(view.exam.listening);
  assert.equal(view.exam.reading, undefined);
  assert.equal(view.exam.writing, undefined);
  assert.equal(view.exam.speaking, undefined);
  // Positive control: fixture really contains all hidden fields checked by the recursive assertion.
  assert.ok(s.exam.listening.parts[0].script.length);
  assert.ok(s.exam.writing.email.modelAnswer);
  assert.ok(s.exam.speaking.parts[1].sampleAnswer);
  assert.ok(s.exam.reading.grammar[0].answerKey);
  assert.ok(s.exam.writing.translation.items[0].referenceTranslation);
  const json = JSON.stringify(view);
  assert.ok(!json.includes(s.exam.writing.email.modelAnswer));
  assert.ok(!json.includes(s.exam.speaking.parts[2].sampleAnswer));
});

test("session view advances L→R→W→S and never returns completed or future sections", () => {
  const s = session();
  const data = answers();
  assertActiveOnly(s, "listening");
  submitSection(s, "listening", data);
  assertActiveOnly(s, "reading");
  submitSection(s, "reading", data);
  assertActiveOnly(s, "writing");
  submitSection(s, "writing", data);
  assertActiveOnly(s, "speaking");
  finalAnswers(s, data);
  assertActiveOnly(s, null);
});

test("modifying a public session view cannot change stored prompts or completed skills", () => {
  const s = session();
  const originalQuestion = s.exam.listening.parts[0].questions[0].stem;
  const view = sessionView(s);
  view.completedSkills.push("speaking");
  view.exam.listening!.parts[0].questions[0].stem =
    "Changed in client response";
  assert.deepEqual(s.completed, []);
  assert.equal(s.exam.listening.parts[0].questions[0].stem, originalQuestion);
  assertActiveOnly(s, "listening");
});

test("wrong-current, skipped, duplicated and direct-Speaking section submissions are rejected", () => {
  const s = session();
  const data = answers();
  for (const skill of ["reading", "writing", "speaking", "full", undefined])
    conflict(() => submitSection(s, skill, data));
  assert.deepEqual(s.completed, []);
  assert.deepEqual(s.answers, emptyAnswers());
  submitSection(s, "listening", data);
  conflict(() => submitSection(s, "listening", data));
  conflict(() => submitSection(s, "writing", data));
  assert.deepEqual(s.completed, ["listening"]);
  submitSection(s, "reading", data);
  submitSection(s, "writing", data);
  conflict(() => submitSection(s, "speaking", data));
  assert.deepEqual(s.completed, ["listening", "reading", "writing"]);
});

test("section submission stores only the current section and discards prefills for unopened skills", () => {
  const s = session();
  const data = answers();
  submitSection(s, "listening", data);
  assert.deepEqual(s.answers.listening, data.listening);
  assert.deepEqual(s.answers.reading, {});
  assert.deepEqual(s.answers.writing, emptyAnswers().writing);
  assert.deepEqual(s.answers.speaking, {});
  submitSection(s, "reading", data);
  assert.deepEqual(s.answers.writing, emptyAnswers().writing);
  assert.deepEqual(s.answers.speaking, {});
  submitSection(s, "writing", data);
  assert.deepEqual(s.answers.speaking, {});
});

test("submitted Listening, Reading and nested Writing answers are immutable snapshots", () => {
  const s = session();
  const data = answers();
  const expected = structuredClone(data);
  submitSection(s, "listening", data);
  data.listening.L1 = "D";
  assert.deepEqual(s.answers.listening, expected.listening);
  assert.notEqual(s.answers.listening, data.listening);
  submitSection(s, "reading", data);
  data.reading.R1 = "F";
  assert.deepEqual(s.answers.reading, expected.reading);
  submitSection(s, "writing", data);
  data.writing.email = "Changed after submission";
  data.writing.translations.W31 = "Changed nested answer";
  assert.deepEqual(s.answers.writing, expected.writing);
  assert.notEqual(s.answers.writing.translations, data.writing.translations);
});

test("section submission requires exam mode, idle status and remaining time", () => {
  const data = answers();
  for (const s of [
    session({ mode: "practice" }),
    session({ status: "grading" }),
    session({ status: "submitted" }),
    session({ expires: Date.now() - 1 }),
  ]) {
    conflict(() => submitSection(s, "listening", data));
    assert.deepEqual(s.completed, []);
    assert.deepEqual(s.answers, emptyAnswers());
  }
});

test("early final submission is blocked without advancing or releasing future sections", () => {
  const s = session();
  const data = answers();
  conflict(() => finalAnswers(s, data));
  assertActiveOnly(s, "listening");
  submitSection(s, "listening", data);
  conflict(() => finalAnswers(s, data));
  assertActiveOnly(s, "reading");
  submitSection(s, "reading", data);
  conflict(() => finalAnswers(s, data));
  assertActiveOnly(s, "writing");
  assert.deepEqual(s.answers.writing, emptyAnswers().writing);
  assert.deepEqual(s.answers.speaking, {});
});

test("final submission merges server snapshots and ignores forged edits to earlier sections", () => {
  const s = session();
  const original = answers();
  submitFirstThree(s, original);
  const forged = answers();
  forged.listening = { L1: "A" };
  forged.reading = { R1: "F" };
  forged.writing = {
    translations: { W31: "Edited after seeing the next section" },
    email: "Forged new email",
  };
  const result = finalAnswers(s, forged);
  assert.deepEqual(result.listening, original.listening);
  assert.deepEqual(result.reading, original.reading);
  assert.deepEqual(result.writing, original.writing);
  assert.deepEqual(result.speaking, forged.speaking);
  assert.deepEqual(s.completed, SKILLS);
  assertActiveOnly(s, null);
});

test("the final Speaking snapshot survives client mutation and repeated final submission", () => {
  const s = session();
  submitFirstThree(s);
  const first = answers();
  const expected = structuredClone(first.speaking);
  finalAnswers(s, first);
  first.speaking.S3.text = "Edited after final submission";
  first.speaking.S3.audio!.data = "changed-audio";
  const later = answers();
  later.speaking = { S3: { text: "Second attempt" } };
  assert.deepEqual(finalAnswers(s, later).speaking, expected);
  assert.deepEqual(s.answers.speaking, expected);
});

test("a grading caller cannot mutate locked stored answers through the returned object", () => {
  const s = session();
  submitFirstThree(s);
  const expected = structuredClone(s.answers);
  expected.speaking = answers().speaking;
  const output = finalAnswers(s, answers());
  output.listening.L1 = "D";
  output.writing.translations.W31 = "Changed through result";
  output.speaking.S3.audio!.data = "Changed through result";
  assert.deepEqual(finalAnswers(s, answers()), expected);
});

test("timeout finalizes the active section and leaves unopened skills blank despite forged answers", () => {
  const s = session();
  const original = answers();
  submitSection(s, "listening", original);
  s.expires = Date.now() - 1;
  const forged = answers();
  forged.listening = { L1: "D" };
  const result = finalAnswers(s, forged);
  assert.deepEqual(result.listening, original.listening);
  assert.deepEqual(result.reading, forged.reading);
  assert.deepEqual(result.writing, emptyAnswers().writing);
  assert.deepEqual(result.speaking, {});
  assert.deepEqual(s.completed, SKILLS);
  assertActiveOnly(s, null);
});

test("timeout before any section accepts Listening only and keeps R/W/S unopened and blank", () => {
  const s = session({ expires: Date.now() - 1 });
  const data = answers();
  const result = finalAnswers(s, data);
  assert.deepEqual(result.listening, data.listening);
  assert.deepEqual(result.reading, {});
  assert.deepEqual(result.writing, emptyAnswers().writing);
  assert.deepEqual(result.speaking, {});
  assertActiveOnly(s, null);
  conflict(() => submitSection(s, "reading", data));
});

test("a late submission outside the delivery grace cannot add extra answers after expiry", () => {
  const s = session();
  const data = answers();
  submitSection(s, "listening", data);
  s.expires = Date.now() - 16_000;
  const result = finalAnswers(s, data);
  assert.deepEqual(result.listening, data.listening);
  assert.deepEqual(result.reading, {});
  assert.deepEqual(result.writing, emptyAnswers().writing);
  assert.deepEqual(result.speaking, {});
  assertActiveOnly(s, null);
  const late = answers();
  late.reading = { R1: "F" };
  assert.deepEqual(finalAnswers(s, late), result);
});

test("practice with an individual scope releases only that public section and has no deadline", async () => {
  const s = await createSession(randomUUID(), 6, "practice", "writing");
  const view = sessionView(s);
  assert.equal(s.expires, null);
  assert.equal(view.activeSkill, "writing");
  assert.equal(view.scope, "writing");
  assert.deepEqual(
    SKILLS.filter((skill) => Object.hasOwn(view.exam, skill)),
    ["writing"],
  );
  assert.equal(view.exam.listening, undefined);
  assert.equal(view.exam.reading, undefined);
  assert.equal(view.exam.speaking, undefined);
  assertPrivateFieldsAbsent(view);
  const data = answers();
  assert.deepEqual(finalAnswers(s, data), data);
});

test("practice with full scope releases all four public sections together", async () => {
  const s = await createSession(randomUUID(), 6, "practice", "full");
  const view = sessionView(s);
  assert.equal(view.activeSkill, null);
  assert.equal(view.scope, "full");
  assert.equal(view.expiresAt, null);
  assert.deepEqual(
    SKILLS.filter((skill) => Object.hasOwn(view.exam, skill)),
    SKILLS,
  );
  assertPrivateFieldsAbsent(view);
});

test("stored session lookup is device-bound and rejects expired or unknown IDs", async () => {
  const device = randomUUID();
  const s = await createSession(device, 6, "exam", "full");
  assert.equal(getSession(s.id, device), s);
  assert.throws(
    () => getSession(s.id, randomUUID()),
    (error: unknown) => error instanceof AppError && error.status === 404,
  );
  assert.throws(
    () => getSession(randomUUID(), device),
    (error: unknown) => error instanceof AppError && error.status === 404,
  );
  assert.throws(
    () => getSession(null, device),
    (error: unknown) => error instanceof AppError && error.status === 400,
  );
  s.deleteAt = Date.now() - 1;
  assert.throws(
    () => getSession(s.id, device),
    (error: unknown) => error instanceof AppError && error.status === 404,
  );
});

test("concurrent session creation cannot bypass the twenty-open-sessions device cap", async () => {
  const device = randomUUID();
  const outcomes = await Promise.allSettled(
    Array.from({ length: 21 }, () => createSession(device, 6, "exam", "full")),
  );
  const accepted = outcomes.filter((outcome) => outcome.status === "fulfilled");
  const rejected = outcomes.filter((outcome) => outcome.status === "rejected");
  assert.equal(accepted.length, 20);
  assert.equal(rejected.length, 1);
  for (const outcome of rejected) {
    assert.ok(
      outcome.status === "rejected" && outcome.reason instanceof AppError,
    );
    assert.equal(outcome.reason.status, 429);
  }
  for (const outcome of accepted) {
    assert.ok(outcome.status === "fulfilled");
    assert.equal(getSession(outcome.value.id, device), outcome.value);
  }
});

test("audio cleanup removes every raw recording while preserving transcripts and only SHA256 digests", () => {
  const s = session();
  const data = answers();
  data.speaking["S1-1"].audio = {
    mimeType: "audio/wav",
    data: Buffer.from("first-original-audio").toString("base64"),
  };
  submitFirstThree(s, data);
  finalAnswers(s, data);
  const expectedTranscripts = Object.fromEntries(
    Object.entries(data.speaking).map(([id, answer]) => [
      id,
      { text: answer.text },
    ]),
  );
  const expectedHashes = Object.fromEntries(
    Object.entries(data.speaking)
      .filter(([, answer]) => answer.audio)
      .map(([id, answer]) => [
        id,
        createHash("sha256").update(answer.audio!.data).digest("hex"),
      ]),
  );
  discardSessionAudio(s);
  assert.deepEqual(s.answers.speaking, expectedTranscripts);
  assert.deepEqual(s.audioHashes, expectedHashes);
  assert.ok(Object.values(s.answers.speaking).every((answer) => !answer.audio));
  for (const digest of Object.values(s.audioHashes!)) {
    assert.match(digest, /^[a-f0-9]{64}$/);
  }
  // Repeated cleanup after a failed retry cannot erase the immutable digest.
  discardSessionAudio(s);
  assert.deepEqual(s.answers.speaking, expectedTranscripts);
  assert.deepEqual(s.audioHashes, expectedHashes);
});

test("an audio retry accepts only the original recording, preserves locked answers and retains no raw audio", () => {
  const s = session();
  const original = answers();
  submitFirstThree(s, original);
  const expected = finalAnswers(s, original);
  discardSessionAudio(s);
  const stored = structuredClone(s.answers);
  const hashes = structuredClone(s.audioHashes);
  const retry = answers();
  retry.listening.L1 = "D";
  retry.writing.email = "Edited after the first grading attempt";
  retry.speaking.S3.text = "Edited transcript after the first grading attempt";
  const restored = finalAnswers(s, retry);
  assert.deepEqual(restored, expected);
  assert.deepEqual(s.answers, stored);
  assert.deepEqual(s.audioHashes, hashes);
  assert.ok(Object.values(s.answers.speaking).every((answer) => !answer.audio));
  // The reconstruction is a private return value, never reinserted into session state.
  restored.speaking.S3.audio!.data = "modified-return-value";
  assert.deepEqual(finalAnswers(s, retry), expected);
  const wrong = answers();
  wrong.speaking.S3.audio!.data = "BBBB";
  conflict(() => finalAnswers(s, wrong));
  const missing = answers();
  delete missing.speaking.S3.audio;
  conflict(() => finalAnswers(s, missing));
  assert.deepEqual(s.answers, stored);
  assert.deepEqual(s.audioHashes, hashes);
});
