import "server-only";
import { authorize } from "@/server/security";
import { createPaperListeningSession, sessionView } from "@/server/sessions";
import { failure, json, readBody } from "@/server/http";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const device = authorize(request);
    const body = await readBody(request, 2048);
    return json({ session: sessionView(await createPaperListeningSession(device, body.unit, body.test)) });
  } catch (error) { return failure(error); }
}
