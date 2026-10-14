import "server-only";
import {
  AUTH_COOKIE,
  DEVICE_COOKIE,
  authenticated,
  checkCode,
  cookieOptions,
  cookieValue,
  deviceId,
  issueAuth,
  issueDevice,
  reserveAccess,
} from "@/server/security";
import { AppError } from "@/server/errors";
import { failure, json, readBody } from "@/server/http";
export const runtime = "nodejs";
export async function GET(request: Request) {
  return json({ authenticated: authenticated(request) && !!deviceId(request) });
}
export async function POST(request: Request) {
  try {
    const body = await readBody(request, 2048);
    reserveAccess(request);
    if (!checkCode(body.code))
      throw new AppError(401, "Mã truy cập không đúng.");
    const response = json({ authenticated: true });
    response.cookies.set(AUTH_COOKIE, issueAuth(), cookieOptions);
    response.cookies.set(
      DEVICE_COOKIE,
      deviceId(request) ? cookieValue(request, DEVICE_COOKIE)! : issueDevice(),
      cookieOptions,
    );
    return response;
  } catch (error) {
    return failure(error);
  }
}
