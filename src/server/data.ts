import { readFile, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { ANSWER_FIELDS, SCHEMA_VERSION, type UnitExam } from "@/types/exam";
import type { PublicExam, UnitSummary } from "@/types/app";
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
export async function loadExam(unit: number): Promise<UnitExam> {
  if (!Number.isInteger(unit) || unit < 1 || unit > 8)
    throw new AppError(400, "Unit không hợp lệ.");
  // Runtime-selected data is explicitly included by next.config.ts (or mounted).
  // Do not let the bundler trace the entire repository for an arbitrary path.
  const dir = resolve(
    /* turbopackIgnore: true */ process.env.EXAM_DATA_DIR || "data/units",
  );
  let names: string[];
  try {
    names = await readdir(/* turbopackIgnore: true */ dir);
  } catch {
    throw new AppError(404, "Unit này chưa có đề.");
  }
  const name = names.includes(`unit-${unit}.json`)
    ? `unit-${unit}.json`
    : names.includes(`unit-${unit}.sample.json`)
      ? `unit-${unit}.sample.json`
      : null;
  if (!name) throw new AppError(404, "Unit này chưa có đề.");
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
export async function listUnits(): Promise<UnitSummary[]> {
  return Promise.all(
    Array.from({ length: 8 }, async (_, i) => {
      try {
        const e = await loadExam(i + 1);
        return {
          unit: i + 1,
          title: e.unitTitle,
          available: true,
          grammarFocus: e.grammarFocus,
        };
      } catch (error) {
        if (!(error instanceof AppError) || error.status !== 404) throw error;
        return {
          unit: i + 1,
          title: `Unit ${i + 1}`,
          available: false,
          grammarFocus: [],
        };
      }
    }),
  );
}
