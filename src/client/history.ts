import type { ExamAnswers, ExamResult } from "../types/app";

const HISTORY_KEY = "english-it-history-v1";
const RESULT_KEY = "english-it-result-";
export interface SavedAttempt {
  result: ExamResult;
  answers?: ExamAnswers;
}
const volatileResults = new Map<string, SavedAttempt>();

export function readHistory(): SavedAttempt[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.filter(
      (item): item is SavedAttempt =>
        !!item &&
        typeof item === "object" &&
        "result" in item &&
        !!item.result &&
        typeof item.result.id === "string" &&
        typeof item.result.unit === "number" &&
        typeof item.result.total === "number" &&
        typeof item.result.skills === "object",
    );
  } catch {
    return [];
  }
}

export function saveAttempt(result: ExamResult, answers: ExamAnswers): boolean {
  // Audio is used for grading only; browser history keeps the text and result.
  const saved: SavedAttempt = {
    result,
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
      const parsed = JSON.parse(stored) as SavedAttempt;
      if (parsed?.result?.id === id) return parsed;
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

export function bestScores(attempts: SavedAttempt[]): Record<number, number> {
  return attempts.reduce<Record<number, number>>((scores, { result }) => {
    if (result.scope === "full")
      scores[result.unit] = Math.max(scores[result.unit] ?? 0, result.total);
    return scores;
  }, {});
}
