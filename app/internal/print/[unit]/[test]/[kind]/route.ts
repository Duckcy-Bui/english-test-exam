import "server-only";
import { loadExam } from "@/server/data";
import { authorizePdfRender, pdfListeningUrl, pdfQrCode, pdfSelection } from "@/server/pdf";
import { renderPdfDocument } from "@/server/pdf-document";
import { failure } from "@/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: {
  params: Promise<{ unit: string; test: string; kind: string }>;
}) {
  try {
    authorizePdfRender(request);
    const path = await params;
    const { unit, testId, kind } = pdfSelection(path.unit, path.test, path.kind);
    const exam = await loadExam(unit, testId);
    const url = pdfListeningUrl(unit, testId);
    const html = renderPdfDocument(exam, kind, url, kind === "exam" ? await pdfQrCode(url) : "");
    return new Response(html, { headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, private",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src 'self'; base-uri 'none'; frame-ancestors 'none'",
    } });
  } catch (error) {
    return failure(error);
  }
}
