import "server-only";
import { readFile } from "node:fs/promises";
import { listeningAudioPath } from "@/server/audio";
import { authenticated, verifyListenToken } from "@/server/security";
import { getSession } from "@/server/sessions";
import { deviceId } from "@/server/security";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const token = verifyListenToken(new URL(request.url).searchParams.get("t"));
    const device = deviceId(request);
    if (!token || !device || !authenticated(request))
      return new Response("Không có quyền nghe.", { status: 403 });
    const session = getSession(token.sessionId, device);
    const file = listeningAudioPath(session.exam.unit, token.partId);
    if (!file) return new Response("Không có file âm thanh.", { status: 404 });
    const data = await readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(data.length),
        "Cache-Control": "private, max-age=900",
      },
    });
  } catch {
    return new Response("Không phát được bài nghe.", { status: 404 });
  }
}
