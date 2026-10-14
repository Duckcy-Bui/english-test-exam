import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import sample from "../fixtures/unit-6.sample.json";
import { listTests, listUnits, loadExam } from "../src/server/data";
import { AppError } from "../src/server/errors";
import { gradeSession } from "../src/server/grading";
import {
  createPaperListeningSession,
  createSession,
  getSession,
  sessionView,
  type ServerSession,
} from "../src/server/sessions";
import { emptyAnswers } from "../src/types/app";
import { ANSWER_FIELDS, TEST_IDS, type TestId, type UnitExam } from "../src/types/exam";

let directory: string;
let previousDirectory: string | undefined;
const status = (expected: number) => (error: unknown) =>
  error instanceof AppError && error.status === expected;
function fixture(testId: TestId): UnitExam {
  const exam = structuredClone(sample) as UnitExam;
  exam.testId = testId;
  exam.source = testId === "A" ? "teacher" : "ai";
  exam.reading.matching.items[0].answerKey = testId === "A" ? "A" : "B";
  exam.listening.parts[0].questions[0].stem = `Distinct prompt for test ${testId}`;
  exam.listening.parts[0].script[0].text = `Distinct dialogue for test ${testId}`;
  return exam;
}
function save(exam: UnitExam): void {
  writeFileSync(
    join(directory, `unit-${exam.unit}-${exam.testId}.json`),
    JSON.stringify(exam),
  );
}
beforeEach(() => {
  previousDirectory = process.env.EXAM_DATA_DIR;
  directory = mkdtempSync(join(tmpdir(), "et-multi-test-data-"));
  process.env.EXAM_DATA_DIR = directory;
  for (const id of ["C", "A", "B"] as const) save(fixture(id));
});
afterEach(() => {
  if (previousDirectory === undefined) delete process.env.EXAM_DATA_DIR;
  else process.env.EXAM_DATA_DIR = previousDirectory;
  rmSync(directory, { recursive: true, force: true });
});

test("loads the selected A/B/C exam and never falls back to A for an absent test", async () => {
  for (const id of ["A", "B", "C"] as const) {
    const exam = await loadExam(6, id);
    assert.equal(exam.testId, id);
    assert.equal(exam.listening.parts[0].questions[0].stem, `Distinct prompt for test ${id}`);
  }
  assert.equal((await loadExam(6)).testId, "A");
  await assert.rejects(loadExam(6, "D"), status(404));
  await assert.rejects(loadExam(5, "A"), status(404));
});

test("lists ordered test metadata and counts per Unit, including Units without A", async () => {
  const second = fixture("B");
  second.unit = 2;
  second.unitTitle = "Unit without A";
  save(second);
  const tests = [
    { testId: "A", source: "teacher" },
    { testId: "B", source: "ai" },
    { testId: "C", source: "ai" },
  ];
  assert.deepEqual(await listTests(6), tests);
  assert.deepEqual(await listTests(5), []);
  const units = await listUnits();
  assert.equal(units.length, 8);
  assert.deepEqual(units[5], {
    unit: 6,
    title: sample.unitTitle,
    available: true,
    grammarFocus: sample.grammarFocus,
    tests,
    testCount: 3,
  });
  assert.equal(units[1].available, true);
  assert.equal(units[1].title, "Unit without A");
  assert.equal(units[1].testCount, 1);
  assert.deepEqual(units[1].tests, [{ testId: "B", source: "ai" }]);
  assert.deepEqual(units[4], {
    unit: 5,
    title: "Unit 5",
    available: false,
    grammarFocus: [],
    tests: [],
    testCount: 0,
  });
  const serialized = JSON.stringify(units);
  for (const field of [...ANSWER_FIELDS, "script", "reading", "listening"])
    assert.ok(!serialized.includes(`"${field}":`));
});

test("strictly validates unit and test before constructing any data path", async () => {
  for (const unit of [0, 9, 1.5, NaN, Infinity, "6", null]) {
    await assert.rejects(loadExam(unit as number, "A"), status(400));
    await assert.rejects(listTests(unit as number), status(400));
  }
  for (const testId of ["a", "E", "", " A", "A ", "../A", "A.json", 1, null, {}, ["A"]]) {
    await assert.rejects(loadExam(6, testId as TestId), status(400));
    await assert.rejects(
      createSession(randomUUID(), 6, "practice", "reading", testId),
      status(400),
    );
  }
});

test("rejects test identity and source mismatches rather than serving another test", async () => {
  const a = fixture("A");
  writeFileSync(join(directory, "unit-6-B.json"), JSON.stringify(a));
  await assert.rejects(loadExam(6, "B"), status(500));
  await assert.rejects(listTests(6), status(500));
  const c = fixture("C");
  writeFileSync(join(directory, "unit-6-C.json"), JSON.stringify({ ...c, source: "unknown" }));
  await assert.rejects(loadExam(6, "C"), status(500));
  writeFileSync(join(directory, "unit-6-C.json"), "{");
  await assert.rejects(loadExam(6, "C"), status(500));
});

test("sessions and grading retain the selected test and use only its answer key", async () => {
  const device = randomUUID();
  const a = await createSession(device, 6, "practice", "reading");
  const b = await createSession(device, 6, "practice", "reading", "B");
  const c = await createSession(device, 6, "exam", "full", "C");
  assert.notEqual(a.id, b.id);
  assert.equal(a.exam.testId, "A");
  assert.equal(b.exam.testId, "B");
  const view = sessionView(c);
  assert.equal(view.exam.testId, "C");
  assert.equal(view.exam.source, "ai");
  assert.equal(view.activeSkill, "listening");
  const serialized = JSON.stringify(view);
  for (const field of [...ANSWER_FIELDS, "script"])
    assert.ok(!serialized.includes(`"${field}":`));
  assert.ok(!serialized.includes("Distinct dialogue for test C"));
  const answers = emptyAnswers();
  answers.reading.R1 = "A";
  const [resultA, resultB] = await Promise.all([
    gradeSession(a, answers),
    gradeSession(b, answers),
  ]);
  assert.equal(resultA.testId, "A");
  assert.equal(resultA.source, "teacher");
  assert.equal(resultB.testId, "B");
  assert.equal(resultB.source, "ai");
  assert.ok(resultA.total > 0);
  assert.equal(resultB.total, 0);
  assert.equal(resultB.skills.reading!.questions![0].correctAnswer, "B");
});

test("the sample fixture is only an A fallback and a canonical A takes priority", async () => {
  const fallback = fixture("A");
  fallback.unitTitle = "Sample fallback";
  writeFileSync(join(directory, "unit-6.sample.json"), JSON.stringify(fallback));
  assert.equal((await loadExam(6, "A")).unitTitle, sample.unitTitle);
  for (const id of ["A", "B", "C"] as const)
    rmSync(join(directory, `unit-6-${id}.json`));
  assert.equal((await loadExam(6)).unitTitle, "Sample fallback");
  assert.deepEqual(await listTests(6), [{ testId: "A", source: "teacher" }]);
  await assert.rejects(loadExam(6, "B"), status(404));
  rmSync(join(directory, "unit-6.sample.json"));
  writeFileSync(join(directory, "unit-6.json"), JSON.stringify(fallback));
  assert.deepEqual(await listTests(6), []);
  await assert.rejects(loadExam(6, "A"), status(404));
});

test("paper listening reuses one device-bound session per test, including concurrent requests", async () => {
  const device = randomUUID();
  const repeated = await Promise.all(
    Array.from({ length: 25 }, () => createPaperListeningSession(device, 6, "B")),
  );
  const paper = repeated[0];
  assert.equal(new Set(repeated.map((s) => s.id)).size, 1);
  assert.equal(paper.paperListening, true);
  assert.equal(paper.mode, "practice");
  assert.equal(paper.scope, "listening");
  assert.equal(paper.deleteAt - paper.started, 3600_000);
  assert.equal(paper.expires, null);
  assert.equal(getSession(paper.id, device), paper);
  assert.throws(() => getSession(paper.id, randomUUID()), status(404));
  assert.ok(!Object.hasOwn(sessionView(paper), "paperListening"));
  const otherTest = await createPaperListeningSession(device, 6, "C");
  const otherDevice = await createPaperListeningSession(randomUUID(), 6, "B");
  assert.notEqual(paper.id, otherTest.id);
  assert.notEqual(paper.id, otherDevice.id);
  paper.deleteAt = Date.now() - 1;
  const replacement = await createPaperListeningSession(device, 6, "B");
  assert.notEqual(replacement.id, paper.id);
  assert.throws(() => getSession(paper.id, device), status(404));
  for (const invalid of [null, undefined, "b", "../B", {}])
    await assert.rejects(createPaperListeningSession(device, 6, invalid), status(400));
});

test("32 distinct paper sessions have a separate bounded cap and do not consume normal session slots", async () => {
  const device = randomUUID();
  const selections: { unit: number; test: TestId }[] = [];
  for (let unit = 1; unit <= 8; unit++) {
    for (const test of TEST_IDS) {
      const exam = fixture(test);
      exam.unit = unit as UnitExam["unit"];
      save(exam);
      selections.push({ unit, test });
    }
  }
  const papers = await Promise.all(selections.map(({ unit, test }) =>
    createPaperListeningSession(device, unit, test)));
  assert.equal(new Set(papers.map((s) => s.id)).size, 32);
  assert.equal((await createPaperListeningSession(device, 1, "A")).id, papers[0].id);
  // A non-idle paper session cannot be reused, and no 33rd allocation is allowed.
  papers[0].status = "grading";
  await assert.rejects(createPaperListeningSession(device, 1, "A"), status(429));
  const normal = await Promise.allSettled(Array.from({ length: 21 }, () =>
    createSession(device, 6, "practice", "reading", "A")));
  assert.equal(normal.filter((item) => item.status === "fulfilled").length, 20);
  const rejected = normal.filter((item) => item.status === "rejected");
  assert.equal(rejected.length, 1);
  assert.ok(status(429)((rejected[0] as PromiseRejectedResult).reason));
  for (const item of normal)
    if (item.status === "fulfilled") assert.equal(item.value.paperListening, undefined);
});

test("paper and normal allocations both retain the global 1000-session cap while reuse remains possible", async () => {
  const device = randomUUID();
  const paper = await createPaperListeningSession(device, 6, "A");
  const state = globalThis as typeof globalThis & {
    etSessions?: Map<string, ServerSession>;
  };
  const sessions = state.etSessions!;
  const saved = new Map(sessions);
  try {
    sessions.clear();
    sessions.set(paper.id, paper);
    for (let i = 1; i < 1000; i++) {
      const id = randomUUID();
      sessions.set(id, { ...paper, id, device: randomUUID() });
    }
    assert.equal(sessions.size, 1000);
    assert.equal((await createPaperListeningSession(device, 6, "A")).id, paper.id);
    await assert.rejects(createPaperListeningSession(device, 6, "B"), status(429));
    await assert.rejects(createSession(device, 6, "practice", "reading"), status(429));
    assert.equal(sessions.size, 1000);
  } finally {
    sessions.clear();
    for (const [id, session] of saved) sessions.set(id, session);
  }
});
