import "server-only";
import { authorize } from "@/server/security";
import { loadExam } from "@/server/data";
import { pdfSelection, readExamPdf } from "@/server/pdf";
import { failure } from "@/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    authorize(request);
    const search = new URL(request.url).searchParams;
    const { unit, testId, kind } = pdfSelection(search.get("unit"), search.get("test"), search.get("kind"));
    await loadExam(unit, testId);
    const data = await readExamPdf(unit, testId, kind);
    const filename = `English-for-IT-Unit-${unit}-Test-${testId}-${kind === "exam" ? "Exam" : "Answers"}.pdf`;
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(data.length),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, private",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return failure(error);
  }
}
