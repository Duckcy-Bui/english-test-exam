// So đáp án giải mù của et-auditor với đáp án của et-author (docs/PROTOCOL.md mục 5).
//
// Cách dùng:
//   npm run compare -- 6                         so audit/unit-6.blind.json
//   npm run compare -- 6 audit/unit-6.blind-r1.json --partial
//        chỉ so các câu có trong file (dùng khi giải lại câu đã viết lại)
//
// Mã thoát: 0 nếu khớp hết, 1 nếu có câu AMBIGUOUS hoặc thiếu.
import { join } from "node:path";
import { normalizeAnswer, type UnitExam } from "../src/types/exam";
import { AUDIT_DIR, autoGradedQuestions, parseUnitArg, readJson, unitPath } from "./lib";

interface BlindFile {
  unit: number;
  solver?: string;
  answers: Record<string, string>;
  notes?: Record<string, string>;
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const partial = process.argv.includes("--partial");
  const unit = parseUnitArg(args[0]);
  const blindPath = args[1] ?? join(AUDIT_DIR, `unit-${unit}.blind.json`);

  const exam = readJson<UnitExam>(unitPath(unit));
  const blind = readJson<BlindFile>(blindPath);
  if (blind.unit !== unit) {
    console.error(`File giải mù ghi unit = ${blind.unit}, không khớp Unit ${unit}`);
    process.exit(2);
  }

  const ambiguous: string[] = [];
  const missing: string[] = [];
  let compared = 0;

  for (const q of autoGradedQuestions(exam)) {
    const raw = blind.answers[q.id];
    if (raw === undefined || raw.trim() === "") {
      if (!partial) missing.push(q.id);
      continue;
    }
    compared++;
    let ok: boolean;
    let expected: string;
    if ("acceptedAnswers" in q) {
      ok = q.acceptedAnswers.includes(normalizeAnswer(raw));
      expected = q.acceptedAnswers.join(" | ");
    } else {
      ok = raw.trim().toUpperCase() === q.answerKey;
      expected = q.answerKey;
    }
    if (!ok) {
      const note = blind.notes?.[q.id] ? ` — ghi chú auditor: ${blind.notes[q.id]}` : "";
      ambiguous.push(`${q.id}: author = ${expected}; auditor = ${raw}${note}`);
    }
  }

  console.log(`Unit ${unit}: so ${compared} câu, người giải: ${blind.solver ?? "(không ghi)"}`);
  ambiguous.forEach((a) => console.log(`AMBIGUOUS  ${a}`));
  if (missing.length) console.log(`THIẾU  ${missing.join(", ")}`);
  const pass = ambiguous.length === 0 && missing.length === 0;
  console.log(pass ? "Kết quả: KHỚP HẾT" : `Kết quả: ${ambiguous.length} câu AMBIGUOUS, ${missing.length} câu thiếu`);
  process.exit(pass ? 0 : 1);
}

main();
