import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { isIP } from "node:net";
import { DatabaseSync } from "node:sqlite";
import { AppError } from "./errors";

export const AUTH_COOKIE = "et_access";
export const DEVICE_COOKIE = "et_device";
const COOKIE_SECONDS = 30 * 24 * 60 * 60;
function secret(): string {
  const code = process.env.ACCESS_CODE;
  if (!code?.trim())
    throw new AppError(503, "Chưa cấu hình mã truy cập trên máy chủ.");
  return `${process.env.SESSION_SECRET || code}:${code}`;
}
function mac(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}
function equal(a: string, b: string): boolean {
  const aa = Buffer.from(a),
    bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
function signed(value: string): string {
  return `${value}.${mac(value)}`;
}
function verified(value?: string): string | null {
  if (!value || value.length > 512) return null;
  const dot = value.lastIndexOf("."),
    plain = value.slice(0, dot);
  return dot > 0 && equal(value.slice(dot + 1), mac(plain)) ? plain : null;
}
export function cookieValue(
  request: Request,
  name: string,
): string | undefined {
  const value = request.headers
    .get("cookie")
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${name}=`))
    ?.slice(name.length + 1);
  // NextResponse serializes ':' in the signed access value as '%3A'.
  // Decode once before validating the signature, exactly as RequestCookies does.
  try {
    return value === undefined ? undefined : decodeURIComponent(value);
  } catch {
    return undefined;
  }
}
export function checkCode(code: unknown): boolean {
  const expected = process.env.ACCESS_CODE;
  secret();
  return (
    typeof code === "string" &&
    code.length <= 256 &&
    equal(mac(`code:${code}`), mac(`code:${expected}`))
  );
}
export function issueAuth(): string {
  return signed(`access:${Date.now() + COOKIE_SECONDS * 1000}`);
}
export function issueDevice(): string {
  return signed(randomUUID());
}
export function deviceId(request: Request): string | null {
  const id = verified(cookieValue(request, DEVICE_COOKIE));
  return id && /^[a-f0-9-]{36}$/.test(id) ? id : null;
}
export function authenticated(request: Request): boolean {
  if (!process.env.ACCESS_CODE?.trim()) return false;
  const plain = verified(cookieValue(request, AUTH_COOKIE));
  const expiry = plain?.match(/^access:(\d+)$/)?.[1];
  return !!expiry && Number(expiry) > Date.now();
}
export function authorize(request: Request): string {
  if (!authenticated(request))
    throw new AppError(401, "Vui lòng nhập mã truy cập trước.");
  const device = deviceId(request);
  if (!device)
    throw new AppError(
      401,
      "Phiên thiết bị đã hết hạn. Vui lòng nhập lại mã truy cập.",
    );
  return device;
}
export const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_SECONDS,
};
export function checkOrigin(request: Request): void {
  if (request.headers.get("sec-fetch-site") === "cross-site")
    throw new AppError(403, "Yêu cầu khác nguồn bị từ chối.");
  const origin = request.headers.get("origin");
  if (!origin) return;
  try {
    const source = new URL(origin),
      target = new URL(request.url);
    if (
      source.origin !== target.origin &&
      source.host !== request.headers.get("host")
    )
      throw new Error("origin");
  } catch {
    throw new AppError(403, "Yêu cầu khác nguồn bị từ chối.");
  }
}
export function clientIp(request: Request): string {
  if (process.env.TRUST_PROXY === "1") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
    if (ip && isIP(ip)) return ip;
  }
  // Next's portable Request has no socket address. One conservative shared
  // bucket protects the direct server; controlled proxies supply the real IP.
  return "direct-connection";
}
const state = globalThis as typeof globalThis & {
  etQuotaDb?: { path: string; db: DatabaseSync };
};
function database(): DatabaseSync {
  const path = resolve(
    /* turbopackIgnore: true */ process.env.RATE_LIMIT_DB ||
      ".runtime/rate-limits.sqlite",
  );
  if (state.etQuotaDb?.path !== path) {
    state.etQuotaDb?.db.close();
    mkdirSync(/* turbopackIgnore: true */ dirname(path), { recursive: true });
    const db = new DatabaseSync(path);
    db.exec(
      "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS quota (bucket TEXT NOT NULL, identity TEXT NOT NULL, used INTEGER NOT NULL, PRIMARY KEY(bucket,identity));",
    );
    state.etQuotaDb = { path, db };
  }
  return state.etQuotaDb.db;
}
function limit(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isSafeInteger(parsed) || parsed < 1)
    throw new AppError(503, "Cấu hình giới hạn chấm chưa hợp lệ.");
  return parsed;
}
function reserve(
  bucket: string,
  identities: { key: string; max: number }[],
  cost: number,
): void {
  const db = database();
  db.exec("BEGIN IMMEDIATE");
  try {
    for (const item of identities) {
      const row = db
        .prepare("SELECT used FROM quota WHERE bucket=? AND identity=?")
        .get(bucket, item.key) as { used: number } | undefined;
      if ((row?.used || 0) + cost > item.max)
        throw new AppError(
          429,
          "Đã hết lượt chấm. Vui lòng thử lại vào ngày mai.",
        );
    }
    for (const item of identities)
      db.prepare(
        "INSERT INTO quota(bucket,identity,used) VALUES(?,?,?) ON CONFLICT(bucket,identity) DO UPDATE SET used=used+excluded.used",
      ).run(bucket, item.key, cost);
    db.prepare("DELETE FROM quota WHERE bucket < ?").run(
      new Date(Date.now() - 3 * 86400_000).toISOString().slice(0, 10),
    );
    db.prepare(
      "DELETE FROM quota WHERE bucket LIKE 'login:%' AND CAST(substr(bucket,7) AS INTEGER) < ?",
    ).run(Math.floor(Date.now() / 900_000) - 96);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
export function reserveAi(
  request: Request,
  device: string,
  cost: number,
): void {
  if (!Number.isInteger(cost) || cost < 0 || cost > 2)
    throw new AppError(400, "Số lượt chấm không hợp lệ.");
  if (!cost) return;
  // Daily buckets use the project's Asia/Bangkok timezone (+07).
  const day = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  reserve(
    day,
    [
      {
        key: `device:${mac(device)}`,
        max: limit(process.env.RATE_LIMIT_PER_DEVICE, 10),
      },
      {
        key: `ip:${mac(clientIp(request))}`,
        max: limit(process.env.RATE_LIMIT_PER_IP, 100),
      },
    ],
    cost,
  );
}
export function reserveAccess(request: Request): void {
  const bucket = `login:${Math.floor(Date.now() / 900_000)}`;
  try {
    reserve(bucket, [{ key: `ip:${mac(clientIp(request))}`, max: 30 }], 1);
  } catch (error) {
    if (error instanceof AppError && error.status === 429)
      throw new AppError(
        429,
        "Bạn đã thử mã quá nhiều lần. Vui lòng thử lại sau 15 phút.",
      );
    throw error;
  }
}
