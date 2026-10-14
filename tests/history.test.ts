import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import {
  bestScores,
  clearHistory,
  findAttempt,
  readHistory,
  saveAttempt,
  scoreKey,
  type SavedAttempt,
} from "../src/client/history";
import { emptyAnswers, type ExamResult } from "../src/types/app";

class MemoryStorage {
  private entries = new Map<string, string>();
  getItem(key: string) { return this.entries.get(key) ?? null; }
  setItem(key: string, value: string) { this.entries.set(key, value); }
  removeItem(key: string) { this.entries.delete(key); }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true, value: new MemoryStorage(),
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true, value: new MemoryStorage(),
  });
  clearHistory();
});

function result(overrides: Partial<ExamResult> = {}): ExamResult {
  return {
    id: "attempt-a", unit: 6, unitTitle: "Interactions", testId: "A", source: "teacher",
    mode: "practice", scope: "full", submittedAt: "2026-10-14T15:00:00Z",
    total: 7.5, mock: true, skills: {}, review: {}, ...overrides,
  };
}

function legacy(unit: number): Record<string, unknown> {
  const { testId: _test, source: _source, ...old } = result({ unit, id: `legacy-${unit}` });
  return { result: old };
}

test("legacy history preserves IDs and scores while inferring test A and its original source", () => {
  localStorage.setItem("english-it-history-v1", JSON.stringify([1, 4, 5, 6, 8].map(legacy)));
  const attempts = readHistory();
  assert.deepEqual(attempts.map(({ result }) => [result.unit, result.testId, result.source]), [
    [1, "A", "ai"], [4, "A", "teacher"], [5, "A", "teacher"], [6, "A", "teacher"], [8, "A", "ai"],
  ]);
  assert.equal(attempts[0].result.id, "legacy-1");
  assert.equal(attempts[0].result.total, 7.5);
});

test("best scores stay separate for each unit and test and exclude skill-only attempts", () => {
  const attempts: SavedAttempt[] = [
    { result: result({ total: 5 }) },
    { result: result({ id: "better-a", total: 6.25 }) },
    { result: result({ id: "b", testId: "B", source: "ai", total: 9 }) },
    { result: result({ id: "other-unit", unit: 1, source: "ai", total: 4 }) },
    { result: result({ id: "skill", testId: "C", source: "ai", scope: "reading", total: 2.5 }) },
  ];
  assert.deepEqual(bestScores(attempts), { "6:A": 6.25, "6:B": 9, "1:A": 4 });
  assert.equal(scoreKey(6, "B"), "6:B");
});

test("malformed modern identities are rejected rather than being silently assigned to A", () => {
  const invalid: unknown[] = [
    { result: { ...result(), testId: "a" } },
    { result: { ...result(), testId: "Z" } },
    { result: { ...result(), testId: null } },
    { result: { ...result(), source: "unknown" } },
    { result: { ...result(), source: ["teacher"] } },
    { result: { ...result(), testId: undefined } },
    { result: { ...result(), source: undefined } },
  ];
  localStorage.setItem("english-it-history-v1", JSON.stringify([...invalid, { result: result() }]));
  assert.equal(readHistory().length, 1);
  assert.deepEqual(bestScores(invalid as SavedAttempt[]), {});
  assert.equal(saveAttempt({ ...result(), testId: "Z" } as unknown as ExamResult, emptyAnswers()), false);
  assert.equal(findAttempt("attempt-a")?.result.testId, "A");
});

test("session results use the same migration and identity checks as persistent history", () => {
  sessionStorage.setItem("english-it-result-legacy-6", JSON.stringify(legacy(6)));
  assert.equal(findAttempt("legacy-6")?.result.source, "teacher");
  sessionStorage.setItem("english-it-result-invalid", JSON.stringify({ result: result({ id: "invalid", testId: "?" as "A" }) }));
  assert.equal(findAttempt("invalid"), null);
});

test("saving a B attempt retains A, replaces only the matching result ID, and removes recorded audio", () => {
  localStorage.setItem("english-it-history-v1", JSON.stringify([legacy(6)]));
  const answers = emptyAnswers();
  answers.speaking.S2 = { text: "My answer", audio: { mimeType: "audio/wav", data: "recording" } };
  assert.equal(saveAttempt(result({ id: "b", testId: "B", source: "ai", total: 8 }), answers), true);
  assert.equal(saveAttempt(result({ id: "b", testId: "B", source: "ai", total: 8.5 }), answers), true);
  const attempts = readHistory();
  assert.equal(attempts.length, 2);
  assert.deepEqual(bestScores(attempts), { "6:B": 8.5, "6:A": 7.5 });
  assert.deepEqual(findAttempt("b")?.answers?.speaking.S2, { text: "My answer" });
  const stored = JSON.parse(localStorage.getItem("english-it-history-v1")!);
  assert.equal(stored[1].result.testId, "A");
  assert.equal(stored[1].result.source, "teacher");
});
