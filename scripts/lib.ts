// Hàm dùng chung cho các script kiểm chứng (et-lead).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { UnitExam, McqQuestion, TrueFalseQuestion, ShortAnswerQuestion, MatchItem } from "../src/types/exam";

export const ROOT = resolve(import.meta.dirname, "..");
export const UNITS_DIR = join(ROOT, "data", "units");
export const AUDIT_DIR = join(ROOT, "audit");

export function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function unitPath(unit: number): string {
  return join(UNITS_DIR, `unit-${unit}.json`);
}

/** Danh sách file unit-N.json có trong data/units/. */
export function listUnitFiles(): string[] {
  if (!existsSync(UNITS_DIR)) return [];
  return readdirSync(UNITS_DIR)
    .filter((f) => /^unit-[1-8]\.json$/.test(f))
    .sort()
    .map((f) => join(UNITS_DIR, f));
}

/** Đọc số Unit từ tham số dòng lệnh: "6", "unit-6" hoặc đường dẫn file. */
export function parseUnitArg(arg: string | undefined): number {
  const m = arg?.match(/(\d)/);
  const n = m ? Number(m[1]) : NaN;
  if (!(n >= 1 && n <= 8)) {
    console.error(`Thiếu hoặc sai số Unit: "${arg ?? ""}". Ví dụ: 6`);
    process.exit(2);
  }
  return n;
}

export type AutoQuestion = McqQuestion | TrueFalseQuestion | ShortAnswerQuestion | MatchItem;

/** 40 câu chấm tự động theo thứ tự: L1–L10, R1–R30. */
export function autoGradedQuestions(exam: UnitExam): AutoQuestion[] {
  const [a, b] = exam.listening.parts;
  const r = exam.reading;
  return [
    ...a.questions,
    ...b.questions,
    ...r.matching.items,
    ...r.grammar,
    ...r.vocabulary,
    ...r.passageMcq.questions,
    ...r.passageTrueFalse.questions,
  ];
}
