// Tạo bản đề không có đáp án để et-auditor giải mù (docs/PROTOCOL.md mục 5).
//
// Cách dùng:
//   npm run strip -- 6            tạo audit/unit-6.stripped.json và audit/unit-6.blind.template.json
//   npm run strip -- 6 --force    ghi đè nếu file đã có
//
// Bản stripped bỏ mọi trường trong ANSWER_FIELDS nhưng giữ lời thoại Listening,
// vì auditor không nghe được TTS.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ANSWER_FIELDS, type UnitExam } from "../src/types/exam";
import { AUDIT_DIR, autoGradedQuestions, parseUnitArg, readJson, unitPath } from "./lib";

const STRIP = new Set<string>(ANSWER_FIELDS);

export function stripAnswers<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => stripAnswers(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (!STRIP.has(k)) out[k] = stripAnswers(v);
    }
    return out as T;
  }
  return value;
}

function findLeftover(value: unknown, path = "$"): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => findLeftover(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => (STRIP.has(k) ? [`${path}.${k}`] : findLeftover(v, `${path}.${k}`)));
  }
  return [];
}

function writeOnce(path: string, data: unknown, force: boolean) {
  if (existsSync(path) && !force) {
    console.error(`Đã có ${path}. Thêm --force nếu chắc chắn muốn ghi đè.`);
    process.exit(1);
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", { mode: 0o644 });
  console.log(`Đã ghi ${path}`);
}

function main() {
  const unit = parseUnitArg(process.argv[2]);
  const force = process.argv.includes("--force");
  const exam = readJson<UnitExam>(unitPath(unit));

  const stripped = stripAnswers(exam);
  const leftover = findLeftover(stripped);
  if (leftover.length) {
    console.error(`Còn sót trường đáp án: ${leftover.join(", ")}`);
    process.exit(1);
  }

  mkdirSync(AUDIT_DIR, { recursive: true });
  writeOnce(join(AUDIT_DIR, `unit-${unit}.stripped.json`), stripped, force);

  // Mẫu file đáp án cho auditor điền: MCQ và nối ghi chữ cái, T/F ghi T hoặc F,
  // Listening Part B ghi tối đa 3 từ.
  const template = {
    unit,
    solver: "<tên agent> — <model>",
    answers: Object.fromEntries(autoGradedQuestions(exam).map((q) => [q.id, ""])),
    notes: {} as Record<string, string>,
  };
  writeOnce(join(AUDIT_DIR, `unit-${unit}.blind.template.json`), template, force);
}

main();
