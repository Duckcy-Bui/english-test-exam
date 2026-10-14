import { SKILLS, type ExamAnswers, type ExamResult } from "../types/app";
import { TEST_IDS, type TestId } from "../types/exam";

const HISTORY_KEY = "english-it-history-v1";
const RESULT_KEY = "english-it-result-";
export interface SavedAttempt {
  result: ExamResult;
  answers?: ExamAnswers;
}
const volatileResults = new Map<string, SavedAttempt>();

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** Records saved before multiple tests existed belonged to test A. */
function normalizeAttempt(value: unknown): SavedAttempt | null {
  if (!record(value) || !record(value.result)) return null;
  const result = value.result;
  if (
    typeof result.id !== "string" ||
    !result.id ||
    typeof result.unit !== "number" ||
    !Number.isInteger(result.unit) ||
    result.unit < 1 || result.unit > 8 ||
    typeof result.total !== "number" ||
    !Number.isFinite(result.total) ||
    typeof result.unitTitle !== "string" ||
    typeof result.submittedAt !== "string" ||
    (result.mode !== "practice" && result.mode !== "exam") ||
    typeof result.scope !== "string" ||
    !["full", ...SKILLS].includes(result.scope) ||
    !record(result.skills) ||
    !record(result.review)
  ) return null;

  const legacy = !Object.hasOwn(result, "testId") && !Object.hasOwn(result, "source");
  if (!legacy && (
    !TEST_IDS.includes(result.testId as TestId) ||
    (result.source !== "teacher" && result.source !== "ai")
  )) return null;

  return {
    ...value,
    result: {
      ...result,
      ...(legacy ? {
        testId: "A",
        source: [4, 5, 6].includes(result.unit) ? "teacher" : "ai",
      } : {}),
    },
  } as unknown as SavedAttempt;
}

export function readHistory(): SavedAttempt[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.flatMap((item) => {
      const normalized = normalizeAttempt(item);
      return normalized ? [normalized] : [];
    });
  } catch {
    return [];
  }
}

export function saveAttempt(result: ExamResult, answers: ExamAnswers): boolean {
  const normalized = normalizeAttempt({ result });
  if (!normalized) return false;
  // Audio is used for grading only; browser history keeps the text and result.
  const saved: SavedAttempt = {
    result: normalized.result,
    answers: {
      ...answers,
      speaking: Object.fromEntries(
        Object.entries(answers.speaking).map(([id, answer]) => [
          id,
          { text: answer.text },
        ]),
      ),
    },
  };
  volatileResults.set(result.id, saved);
  try {
    sessionStorage.setItem(`${RESULT_KEY}${result.id}`, JSON.stringify(saved));
  } catch {
    /* The in-memory result remains available. */
  }
  try {
    const attempts = [
      saved,
      ...readHistory().filter((item) => item.result.id !== result.id),
    ].slice(0, 40);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(attempts));
    return true;
  } catch {
    return false;
  }
}

export function findAttempt(id: string): SavedAttempt | null {
  const inMemory = volatileResults.get(id);
  if (inMemory) return inMemory;
  try {
    const stored = sessionStorage.getItem(`${RESULT_KEY}${id}`);
    if (stored) {
      const parsed = normalizeAttempt(JSON.parse(stored));
      if (parsed?.result.id === id) return parsed;
    }
  } catch {
    /* Fall back to saved history. */
  }
  return readHistory().find((item) => item.result.id === id) ?? null;
}

export function deleteAttempt(id: string): void {
  volatileResults.delete(id);
  try {
    sessionStorage.removeItem(`${RESULT_KEY}${id}`);
  } catch {
    /* Storage can be unavailable. */
  }
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(readHistory().filter((item) => item.result.id !== id)),
  );
}

export function clearHistory(): void {
  volatileResults.clear();
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(RESULT_KEY))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /* Storage can be unavailable. */
  }
  localStorage.removeItem(HISTORY_KEY);
}

export function scoreKey(unit: number, testId: TestId): string {
  return `${unit}:${testId}`;
}

export function bestScores(attempts: SavedAttempt[]): Record<string, number> {
  return attempts.reduce<Record<string, number>>((scores, attempt) => {
    const normalized = normalizeAttempt(attempt);
    if (!normalized) return scores;
    const { result } = normalized;
    if (result.scope === "full") {
      const key = scoreKey(result.unit, result.testId);
      scores[key] = Math.max(scores[key] ?? 0, result.total);
    }
    return scores;
  }, {});
}
