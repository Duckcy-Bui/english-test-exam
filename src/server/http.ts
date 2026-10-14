import { NextResponse } from "next/server";
import { AppError } from "./errors";
import { checkOrigin } from "./security";

export function json(value: unknown, status = 200): NextResponse {
  return NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "no-store, private" },
  });
}
export function failure(error: unknown): NextResponse {
  return error instanceof AppError
    ? json({ error: error.message }, error.status)
    : json({ error: "Không thể xử lý yêu cầu. Vui lòng thử lại." }, 500);
}
export async function readBody(
  request: Request,
  maxBytes = 64 * 1024,
): Promise<Record<string, unknown>> {
  checkOrigin(request);
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    throw new AppError(415, "Yêu cầu phải dùng JSON.");
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maxBytes)
    throw new AppError(413, "Bài làm vượt giới hạn kích thước.");
  const reader = request.body?.getReader();
  if (!reader) throw new AppError(400, "Thiếu dữ liệu.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new AppError(413, "Bài làm vượt giới hạn kích thước.");
    }
    chunks.push(value);
  }
  try {
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("object");
    return body as Record<string, unknown>;
  } catch {
    throw new AppError(400, "JSON không hợp lệ.");
  }
}
