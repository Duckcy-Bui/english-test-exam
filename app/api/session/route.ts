import "server-only";
import { authorize } from "@/server/security";
import { createSession, getSession, sessionView } from "@/server/sessions";
import { failure, json, readBody } from "@/server/http";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const device = authorize(request);
    return json({
      session: sessionView(
        getSession(new URL(request.url).searchParams.get("sessionId"), device),
      ),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    const device = authorize(request),
      body = await readBody(request, 2048);
    return json({
      session: sessionView(
        await createSession(device, body.unit, body.mode, body.scope, body.test),
      ),
    });
  } catch (error) {
    return failure(error);
  }
}
