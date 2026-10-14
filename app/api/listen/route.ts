import "server-only";
import { authorize, signListenToken } from "@/server/security";
import { listeningAudioPath } from "@/server/audio";
import { getSession } from "@/server/sessions";
import { failure, json, readBody } from "@/server/http";
import { AppError } from "@/server/errors";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const device = authorize(request),
      body = await readBody(request, 2048),
      session = getSession(body.sessionId, device);
    if (body.partId !== "A" && body.partId !== "B")
      throw new AppError(400, "Phần nghe không hợp lệ.");
    if (session.scope !== "full" && session.scope !== "listening")
      throw new AppError(403, "Phiên này không có Listening.");
    if (session.mode === "exam" && session.completed.length > 0)
      throw new AppError(403, "Listening đã nộp và bị khoá.");
    if (
      session.status !== "idle" ||
      (session.expires && session.expires <= Date.now())
    )
      throw new AppError(409, "Phiên thi đã kết thúc.");
    if (session.mode === "exam" && session.listens[body.partId] >= 2)
      throw new AppError(
        429,
        "Mỗi phần chỉ được nghe tối đa 2 lần trong Thi thử.",
      );
    session.listens[body.partId]++;
    const part = session.exam.listening.parts.find(
      (p) => p.id === body.partId,
    )!;
    return json({
      playback: {
        partId: part.id,
        script: part.script.map(({ speaker, text }) => ({ speaker, text })),
        speakers: part.speakers.map(({ name, voice }) => ({ name, voice })),
        remaining:
          session.mode === "exam" ? 2 - session.listens[part.id] : null,
        audioUrl: listeningAudioPath(
          session.exam.unit,
          session.exam.testId,
          part.id,
        )
          ? `/api/listen/audio?t=${encodeURIComponent(signListenToken(session.id, part.id))}`
          : undefined,
      },
    });
  } catch (error) {
    return failure(error);
  }
}
