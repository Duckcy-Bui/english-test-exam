import "server-only";
import { authorize, reserveAi } from "@/server/security";
import {
  getSession,
  finalAnswers,
  discardSessionAudio,
} from "@/server/sessions";
import { gradeSession } from "@/server/grading";
import { parseAnswers } from "@/server/answers";
import { failure, json, readBody } from "@/server/http";
import { AppError } from "@/server/errors";
import { AiGradingError } from "@/server/ai";
import { assertSafeResult, UnsafeAiOutputError } from "@/server/secrets";
export const runtime = "nodejs";
export const maxDuration = 180;
export async function GET(request: Request) {
  try {
    const s = getSession(
      new URL(request.url).searchParams.get("sessionId"),
      authorize(request),
    );
    if (!s.result)
      throw new AppError(409, "Chỉ xem được kết quả sau khi nộp bài.");
    try {
      assertSafeResult(s.result);
    } catch (error) {
      delete s.result;
      s.status = "idle";
      throw error;
    }
    return json({ result: s.result });
  } catch (error) {
    if (error instanceof UnsafeAiOutputError)
      return failure(new AppError(502, error.message));
    return failure(error);
  }
}
export async function POST(request: Request) {
  let pending: ReturnType<typeof getSession> | undefined;
  try {
    const device = authorize(request),
      body = await readBody(request, 42 * 1024 * 1024);
    if (Object.keys(body).some((k) => k !== "sessionId" && k !== "answers"))
      throw new AppError(
        400,
        "Không được đổi chế độ hoặc phạm vi khi nộp bài.",
      );
    const s = getSession(body.sessionId, device);
    if (s.result) {
      try {
        assertSafeResult(s.result);
      } catch (error) {
        delete s.result;
        s.status = "idle";
        throw error;
      }
      return json({ result: s.result });
    }
    if (s.status === "grading")
      throw new AppError(409, "Bài đang được chấm. Vui lòng chờ.");
    const answers = parseAnswers(body.answers);
    if (
      s.mode === "exam" &&
      s.completed.length < 3 &&
      !(s.expires && s.expires <= Date.now())
    )
      throw new AppError(
        409,
        "Cần nộp lần lượt Listening, Reading và Writing trước.",
      );
    const cost =
      s.scope === "full"
        ? 2
        : s.scope === "writing" || s.scope === "speaking"
          ? 1
          : 0;
    const retry =
      s.mode === "exam" && s.completed.length === 4
        ? finalAnswers(s, answers)
        : undefined;
    reserveAi(request, device, cost);
    const lockedAnswers = retry ?? finalAnswers(s, answers);
    s.status = "grading";
    pending = s;
    const result = await gradeSession(s, lockedAnswers);
    assertSafeResult(result);
    s.result = result;
    s.status = "submitted";
    return json({ result });
  } catch (error) {
    if (pending) pending.status = "idle";
    if (error instanceof AiGradingError || error instanceof UnsafeAiOutputError)
      return failure(new AppError(502, error.message));
    return failure(error);
  } finally {
    if (pending) discardSessionAudio(pending);
  }
}
