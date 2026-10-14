import type {
  ExamAnswers,
  ExamResult,
  ExamSession,
  ListeningPlayback,
  Mode,
  Scope,
  UnitSummary,
} from "../types/app";
import type { TestId } from "../types/exam";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    credentials: "same-origin",
    cache: "no-store",
    ...(body === undefined
      ? {}
      : {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : "Không thể kết nối. Vui lòng thử lại.";
    throw new ApiError(message, response.status);
  }
  return data as T;
}

export const api = {
  access: () => request<{ authenticated: boolean }>("/api/access"),
  unlock: (code: string) =>
    request<{ authenticated: boolean }>("/api/access", { code }),
  units: () => request<{ units: UnitSummary[] }>("/api/units"),
  start: (unit: number, testId: TestId, mode: Mode, scope: Scope) =>
    request<{ session: ExamSession }>("/api/session", {
      unit,
      test: testId,
      mode,
      scope,
    }),
  session: (sessionId: string) =>
    request<{ session: ExamSession }>(
      `/api/session?sessionId=${encodeURIComponent(sessionId)}`,
    ),
  paperSession: (unit: number, test: TestId) =>
    request<{ session: ExamSession }>("/api/listen/paper-session", { unit, test }),
  section: (sessionId: string, skill: string, answers: ExamAnswers) =>
    request<{ session: ExamSession }>("/api/section", {
      sessionId,
      skill,
      answers,
    }),
  listen: (sessionId: string, partId: "A" | "B") =>
    request<{ playback: ListeningPlayback }>("/api/listen", {
      sessionId,
      partId,
    }),
  grade: (sessionId: string, answers: ExamAnswers) =>
    request<{ result: ExamResult }>("/api/grade", { sessionId, answers }),
};
