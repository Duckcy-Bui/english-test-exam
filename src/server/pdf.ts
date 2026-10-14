import { timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import QRCode from "qrcode";
import { TEST_IDS, type TestId } from "@/types/exam";
import { AppError } from "./errors";

export type PdfKind = "exam" | "answers";

export function pdfSelection(unit: unknown, test: unknown, kind: unknown) {
  const number = typeof unit === "string" && /^[1-8]$/.test(unit) ? Number(unit) : unit;
  if (!Number.isInteger(number) || Number(number) < 1 || Number(number) > 8 ||
      !TEST_IDS.includes(test as TestId) || (kind !== "exam" && kind !== "answers"))
    throw new AppError(400, "Unit, đề hoặc loại PDF không hợp lệ.");
  return { unit: number as number, testId: test as TestId, kind: kind as PdfKind };
}

/** This route is disabled outside the local PDF generator by default. */
export function authorizePdfRender(request: Request): void {
  const expected = process.env.PDF_RENDER_TOKEN;
  if (!expected) throw new AppError(404, "Không tìm thấy trang in.");
  const supplied = request.headers.get("authorization") ?? "";
  const a = Buffer.from(supplied), b = Buffer.from(`Bearer ${expected}`);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    throw new AppError(401, "Không có quyền truy cập trang in.");
}

export function pdfListeningUrl(unit: number, testId: TestId): string {
  let base: URL;
  try {
    base = new URL(process.env.PDF_BASE_URL || "https://english.webs.id.vn");
    if (!["http:", "https:"].includes(base.protocol) || base.username || base.password)
      throw new Error("url");
  } catch {
    throw new AppError(500, "PDF_BASE_URL phải là URL HTTP hoặc HTTPS hợp lệ.");
  }
  base.search = "";
  base.hash = "";
  base.pathname = `${base.pathname.replace(/\/$/, "")}/listen/${unit}/${testId}`;
  return base.toString();
}

export async function pdfQrCode(url: string): Promise<string> {
  return QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 4 });
}

export async function readExamPdf(unit: number, testId: TestId, kind: PdfKind): Promise<Buffer> {
  const dir = resolve(/* turbopackIgnore: true */ process.env.PDF_DATA_DIR || "data/pdf");
  try {
    return await readFile(/* turbopackIgnore: true */ join(/* turbopackIgnore: true */ dir,
      `unit-${unit}-${testId}-${kind}.pdf`));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT")
      throw new AppError(404, "PDF của đề này chưa có. Vui lòng làm bài trên web.");
    throw new AppError(500, "Không tải được PDF. Vui lòng thử lại.");
  }
}
