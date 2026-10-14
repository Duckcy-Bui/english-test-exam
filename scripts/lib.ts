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

/** File đề: data/units/unit-<N>-<Test>.json, ví dụ unit-6-B.json. */
export function unitPath(unit: number, test = "A"): string {
  return join(UNITS_DIR, `unit-${unit}-${test}.json`);
}

export const FILE_RE = /^unit-([1-8])-([A-D])\.json$/;

/** Danh sách file đề có trong data/units/, sắp theo Unit rồi theo đề. */
export function listUnitFiles(unit?: number): string[] {
  if (!existsSync(UNITS_DIR)) return [];
  return readdirSync(UNITS_DIR)
    .filter((f) => FILE_RE.test(f) && (unit === undefined || f.startsWith(`unit-${unit}-`)))
    .sort()
    .map((f) => join(UNITS_DIR, f));
}

/** Đọc "6", "6B", "6-B" hoặc "unit-6-B" thành { unit, test }. Thiếu đề thì là A. */
export function parseUnitArg(arg: string | undefined): { unit: number; test: string } {
  const m = arg?.match(/([1-8])\s*-?\s*([A-Da-d])?/);
  if (!m) {
    console.error(`Thiếu hoặc sai mã đề: "${arg ?? ""}". Ví dụ: 6, 6B`);
    process.exit(2);
  }
  return { unit: Number(m[1]), test: (m[2] ?? "A").toUpperCase() };
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
