import "server-only";
import { authorize } from "@/server/security";
import { getSession, sessionView, submitSection } from "@/server/sessions";
import { parseAnswers } from "@/server/answers";
import { failure, json, readBody } from "@/server/http";
import { AppError } from "@/server/errors";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const device = authorize(request),
      body = await readBody(request, 128 * 1024);
    if (
      Object.keys(body).some(
        (k) => !["sessionId", "skill", "answers"].includes(k),
      )
    )
      throw new AppError(400, "Dữ liệu nộp kỹ năng không hợp lệ.");
    const session = getSession(body.sessionId, device);
    submitSection(session, body.skill, parseAnswers(body.answers));
    return json({ session: sessionView(session) });
  } catch (error) {
    return failure(error);
  }
}
