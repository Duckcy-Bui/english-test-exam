import { readFile, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import {
  ANSWER_FIELDS,
  SCHEMA_VERSION,
  TEST_IDS,
  type TestId,
  type UnitExam,
} from "@/types/exam";
import type { PublicExam, TestSummary, UnitSummary } from "@/types/app";
import { AppError } from "./errors";

const hidden = new Set<string>([...ANSWER_FIELDS, "sourceNotes", "script"]);
export function stripPrivate(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripPrivate);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !hidden.has(key))
        .map(([key, item]) => [key, stripPrivate(item)]),
    );
  }
  return value;
}
export function publicExam(exam: UnitExam): PublicExam {
  return stripPrivate(exam) as PublicExam;
}
export function stripSourceNotes<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripSourceNotes) as T;
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "sourceNotes")
        .map(([key, child]) => [key, stripSourceNotes(child)]),
    ) as T;
  return value;
}
function validateUnit(unit: number): void {
  if (!Number.isInteger(unit) || unit < 1 || unit > 8)
    throw new AppError(400, "Unit không hợp lệ.");
}
function dataDirectory(): string {
  // Runtime-selected data is explicitly included by next.config.ts (or mounted).
  // Do not let the bundler trace the entire repository for an arbitrary path.
  return resolve(
    /* turbopackIgnore: true */ process.env.EXAM_DATA_DIR || "data/units",
  );
}
async function examNames(dir: string): Promise<string[]> {
  try {
    return await readdir(/* turbopackIgnore: true */ dir);
  } catch {
    return [];
  }
}
function examName(names: string[], unit: number, testId: TestId): string | null {
  return names.includes(`unit-${unit}-${testId}.json`)
    ? `unit-${unit}-${testId}.json`
    : testId === "A" && names.includes(`unit-${unit}.sample.json`)
      ? `unit-${unit}.sample.json`
      : null;
}
export async function loadExam(
  unit: number,
  testId: TestId = "A",
): Promise<UnitExam> {
  validateUnit(unit);
  if (!TEST_IDS.includes(testId))
    throw new AppError(400, "Mã đề không hợp lệ.");
  const dir = dataDirectory();
  const name = examName(await examNames(dir), unit, testId);
  if (!name) throw new AppError(404, "Đề này chưa có dữ liệu.");
  try {
    const exam = JSON.parse(
      await readFile(
        /* turbopackIgnore: true */ join(/* turbopackIgnore: true */ dir, name),
        "utf8",
      ),
    ) as UnitExam;
    if (
      exam.schemaVersion !== SCHEMA_VERSION ||
      exam.unit !== unit ||
      exam.testId !== testId ||
      (exam.source !== "teacher" && exam.source !== "ai") ||
      !exam.reading ||
      !exam.listening ||
      !exam.writing ||
      !exam.speaking
    )
      throw new Error("schema");
    return exam;
  } catch {
    throw new AppError(
      500,
      "Dữ liệu đề chưa sẵn sàng. Vui lòng báo người quản lý.",
    );
  }
}
export async function listTests(unit: number): Promise<TestSummary[]> {
  validateUnit(unit);
  const names = await examNames(dataDirectory());
  return Promise.all(
    TEST_IDS.filter((testId) => examName(names, unit, testId)).map(
      async (testId) => {
        const exam = await loadExam(unit, testId);
        return { testId, source: exam.source };
      },
    ),
  );
}
export async function listUnits(): Promise<UnitSummary[]> {
  return Promise.all(
    Array.from({ length: 8 }, async (_, i) => {
      try {
        const tests = await listTests(i + 1);
        if (!tests.length) throw new AppError(404, "Unit này chưa có đề.");
        const e = await loadExam(i + 1, tests[0].testId);
        return {
          unit: i + 1,
          title: e.unitTitle,
          available: true,
          grammarFocus: e.grammarFocus,
          tests,
          testCount: tests.length,
        };
      } catch (error) {
        if (!(error instanceof AppError) || error.status !== 404) throw error;
        return {
          unit: i + 1,
          title: `Unit ${i + 1}`,
          available: false,
          grammarFocus: [],
          tests: [],
          testCount: 0,
        };
      }
    }),
  );
}
