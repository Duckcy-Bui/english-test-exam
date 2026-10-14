// Kiểm tra cấu trúc đề và quét lộ đáp án cơ bản (docs/exam-format.md mục 3–4).
//
// Cách dùng:
//   npm run validate                 kiểm mọi file data/units/unit-N.json
//   npm run validate -- 6            chỉ kiểm Unit 6
//   npm run validate -- path/x.json  kiểm một file bất kỳ
//
// Mã thoát: 0 nếu không có lỗi (cảnh báo không làm hỏng), 1 nếu có lỗi.
import { basename } from "node:path";
import { existsSync } from "node:fs";
import {
  COUNTS,
  SCHEMA_VERSION,
  SCORING,
  SKILL_MAX,
  TOTAL_MAX,
  WORD_LIMITS,
  countWords,
  normalizeAnswer,
  type McqQuestion,
  type Passage,
  type UnitExam,
} from "../src/types/exam";
import { listUnitFiles, readJson, unitPath } from "./lib";

interface Report {
  file: string;
  errors: string[];
  warnings: string[];
}

const CHOICES = ["A", "B", "C", "D"];
const DEF_IDS = ["A", "B", "C", "D", "E", "F"];

const STOPWORDS = new Set(
  "a an the of to in on for and or with by from that this which who is are be been as at it its into than then can used use using such other their your you they them some more most only one two when what where how about over also make made".split(
    " ",
  ),
);

// Chính tả Mỹ thường gặp; giáo trình dùng Anh–Anh.
const US_SPELLINGS: [RegExp, string][] = [
  [/\borganiz(e|es|ed|ing|ation|ations)\b/i, "organis…"],
  [/\banalyz(e|es|ed|ing)\b/i, "analys…"],
  [/\bcolor(s|ed|ful)?\b/i, "colour"],
  [/\bcenter(s)?\b/i, "centre"],
  [/\bfavorite(s)?\b/i, "favourite"],
  [/\bbehavior(s)?\b/i, "behaviour"],
  [/\bcustomiz(e|es|ed|ing|ation)\b/i, "customis…"],
  [/\bsynchroniz(e|es|ed|ing|ation)\b/i, "synchronis…"],
  [/\bminimiz(e|es|ed|ing)\b/i, "minimis…"],
  [/\bmaximiz(e|es|ed|ing)\b/i, "maximis…"],
  [/\bcatalog(s)?\b/i, "catalogue"],
];

function passageText(p: Passage | undefined): string {
  return [p?.title ?? "", ...(p?.paragraphs ?? [])].join(" ");
}

function contentWords(text: string): string[] {
  return normalizeAnswer(text)
    .split(" ")
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function checkIds(r: Report, label: string, items: { id?: string }[] | undefined, expected: string[]) {
  const ids = (items ?? []).map((q) => q?.id);
  if (ids.join(",") !== expected.join(",")) {
    r.errors.push(`${label}: id phải là ${expected.join(",")}, đang là ${ids.join(",") || "(trống)"}`);
  }
}

function range(prefix: string, from: number, to: number): string[] {
  return Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);
}

function checkMcq(r: Report, q: McqQuestion | undefined, label: string) {
  if (!q) return;
  if (q.kind !== "mcq") r.errors.push(`${label}: kind phải là "mcq"`);
  if (!q.stem?.trim()) r.errors.push(`${label}: thiếu stem`);
  const optIds = (q.options ?? []).map((o) => o?.id);
  if (optIds.join("") !== "ABCD") r.errors.push(`${label}: options phải đúng 4 phương án A,B,C,D`);
  const texts = (q.options ?? []).map((o) => normalizeAnswer(o?.text ?? ""));
  if (texts.some((t) => !t)) r.errors.push(`${label}: có phương án rỗng`);
  if (new Set(texts).size !== texts.length) r.errors.push(`${label}: có hai phương án trùng nhau`);
  if (!CHOICES.includes(q.answerKey)) r.errors.push(`${label}: answerKey "${q.answerKey}" không hợp lệ`);
  if (!q.explanation?.trim()) r.warnings.push(`${label}: thiếu explanation`);
}

function checkWordRange(r: Report, label: string, text: string, [min, max]: readonly [number, number]) {
  const n = countWords(text);
  if (n < min || n > max) r.warnings.push(`${label}: ${n} từ, yêu cầu ${min}–${max}`);
}

function validateExam(exam: UnitExam, file: string): Report {
  const r: Report = { file, errors: [], warnings: [] };

  // ---- Thông tin chung ----
  if (exam.schemaVersion !== SCHEMA_VERSION) r.errors.push(`schemaVersion phải là ${SCHEMA_VERSION}`);
  const m = basename(file).match(/^unit-(\d)\.json$/);
  if (m && Number(m[1]) !== exam.unit) r.errors.push(`unit = ${exam.unit} không khớp tên file`);
  if (!(exam.unit >= 1 && exam.unit <= 8)) r.errors.push(`unit phải từ 1 đến 8`);
  if (exam.testId !== "A") r.errors.push(`testId phải là "A"`);
  if (!exam.unitTitle?.trim()) r.errors.push(`thiếu unitTitle`);
  if (!exam.grammarFocus?.length) r.errors.push(`thiếu grammarFocus`);
  if (exam.functions?.length !== 4) r.warnings.push(`functions nên có 4 mục (4 bài của Unit)`);

  // ---- Listening ----
  const parts = exam.listening?.parts ?? [];
  if (parts.length !== 2 || parts[0]?.id !== "A" || parts[1]?.id !== "B") {
    r.errors.push(`listening.parts phải có đúng 2 phần A, B`);
  } else {
    const [a, b] = parts;
    for (const p of [a, b]) {
      if (!p.script?.length) r.errors.push(`Listening ${p.id}: thiếu script`);
      const names = new Set((p.speakers ?? []).map((s) => s.name));
      for (const line of p.script ?? []) {
        if (!names.has(line.speaker)) r.errors.push(`Listening ${p.id}: người nói "${line.speaker}" không có trong speakers`);
      }
      checkWordRange(r, `Listening ${p.id} script`, (p.script ?? []).map((l) => l.text).join(" "), WORD_LIMITS.listeningScript);
    }
    if (a.questions?.length !== COUNTS.listeningMcq) r.errors.push(`Listening A phải có ${COUNTS.listeningMcq} câu`);
    checkIds(r, "Listening A", a.questions, range("L", 1, 5));
    a.questions?.forEach((q) => checkMcq(r, q, q.id));
    if (b.questions?.length !== COUNTS.listeningShort) r.errors.push(`Listening B phải có ${COUNTS.listeningShort} câu`);
    checkIds(r, "Listening B", b.questions, range("L", 6, 10));
    for (const q of b.questions ?? []) {
      if (q.kind !== "short") r.errors.push(`${q.id}: kind phải là "short"`);
      if (q.maxWords !== 3) r.errors.push(`${q.id}: maxWords phải là 3`);
      if (!q.acceptedAnswers?.length) r.errors.push(`${q.id}: thiếu acceptedAnswers`);
      for (const ans of q.acceptedAnswers ?? []) {
        if (normalizeAnswer(ans) !== ans) r.errors.push(`${q.id}: đáp án "${ans}" chưa chuẩn hoá, phải là "${normalizeAnswer(ans)}"`);
        if (countWords(ans) > q.maxWords) r.errors.push(`${q.id}: đáp án "${ans}" quá ${q.maxWords} từ`);
      }
      // Đáp án phải nghe được: xuất hiện trong lời thoại.
      const script = normalizeAnswer(b.script.map((l) => l.text).join(" "));
      if (q.acceptedAnswers?.length && !q.acceptedAnswers.some((ans) => script.includes(ans))) {
        r.warnings.push(`${q.id}: không đáp án nào xuất hiện nguyên văn trong lời thoại Part B`);
      }
    }
  }

  // ---- Reading ----
  const rd = exam.reading;
  if (!rd) {
    r.errors.push(`thiếu reading`);
  } else {
    const mt = rd.matching;
    const defIds = (mt?.definitions ?? []).map((d) => d.id);
    if (defIds.join("") !== DEF_IDS.join("")) r.errors.push(`Matching: definitions phải đúng 6 mục A–F`);
    if (mt?.items?.length !== COUNTS.matchingItems) r.errors.push(`Matching phải có ${COUNTS.matchingItems} thuật ngữ`);
    checkIds(r, "Matching", mt?.items, range("R", 1, 5));
    const keys = (mt?.items ?? []).map((i) => i.answerKey);
    if (keys.some((k) => !DEF_IDS.includes(k))) r.errors.push(`Matching: answerKey phải thuộc A–F`);
    if (new Set(keys).size !== keys.length) r.errors.push(`Matching: hai thuật ngữ trùng một định nghĩa`);
    if (DEF_IDS.filter((d) => !keys.includes(d as never)).length !== 1) r.errors.push(`Matching: phải thừa đúng 1 định nghĩa`);

    if (rd.grammar?.length !== COUNTS.grammar) r.errors.push(`Grammar phải có ${COUNTS.grammar} câu`);
    checkIds(r, "Grammar", rd.grammar, range("R", 6, 12));
    rd.grammar?.forEach((q) => checkMcq(r, q, q.id));
    if (rd.vocabulary?.length !== COUNTS.vocabulary) r.errors.push(`Vocabulary phải có ${COUNTS.vocabulary} câu`);
    checkIds(r, "Vocabulary", rd.vocabulary, range("R", 13, 20));
    rd.vocabulary?.forEach((q) => checkMcq(r, q, q.id));

    const pm = rd.passageMcq;
    if (pm?.questions?.length !== COUNTS.passageMcq) r.errors.push(`Bài đọc MCQ phải có ${COUNTS.passageMcq} câu`);
    checkIds(r, "Bài đọc MCQ", pm?.questions, range("R", 21, 25));
    pm?.questions?.forEach((q) => checkMcq(r, q, q.id));
    checkWordRange(r, "Bài đọc MCQ (R21–R25)", (pm?.passage?.paragraphs ?? []).join(" "), WORD_LIMITS.passageMcq);

    const pt = rd.passageTrueFalse;
    if (pt?.questions?.length !== COUNTS.passageTrueFalse) r.errors.push(`Bài đọc T/F phải có ${COUNTS.passageTrueFalse} câu`);
    checkIds(r, "Bài đọc T/F", pt?.questions, range("R", 26, 30));
    for (const q of pt?.questions ?? []) {
      if (q.kind !== "tf") r.errors.push(`${q.id}: kind phải là "tf"`);
      if (q.answerKey !== "T" && q.answerKey !== "F") r.errors.push(`${q.id}: answerKey phải là T hoặc F`);
      if (!q.explanation?.trim()) r.warnings.push(`${q.id}: thiếu explanation`);
    }
    const tfKeys = (pt?.questions ?? []).map((q) => q.answerKey);
    if (tfKeys.length && (tfKeys.every((k) => k === "T") || tfKeys.every((k) => k === "F"))) {
      r.warnings.push(`Bài đọc T/F: cả 5 câu cùng một đáp án`);
    }
    checkWordRange(r, "Bài đọc T/F (R26–R30)", (pt?.passage?.paragraphs ?? []).join(" "), WORD_LIMITS.passageTrueFalse);

    // Phân bố đáp án MCQ R6–R25: cảnh báo nếu một chữ cái chiếm quá nửa.
    const mcqKeys = [...(rd.grammar ?? []), ...(rd.vocabulary ?? []), ...(pm?.questions ?? [])].map((q) => q.answerKey);
    for (const c of CHOICES) {
      const n = mcqKeys.filter((k) => k === c).length;
      if (n > mcqKeys.length / 2) r.warnings.push(`R6–R25: đáp án ${c} chiếm ${n}/${mcqKeys.length} câu`);
    }

    // ---- Quét lộ đáp án chéo (quy tắc 2) ----
    const laterMcq: McqQuestion[] = [...(rd.grammar ?? []), ...(rd.vocabulary ?? []), ...(pm?.questions ?? [])];
    const defById = new Map((mt?.definitions ?? []).map((d) => [d.id, d.text]));
    for (const item of mt?.items ?? []) {
      const term = normalizeAnswer(item.term ?? "");
      if (!term) continue;
      for (const q of laterMcq) {
        const correct = q.options?.find((o) => o.id === q.answerKey);
        if (correct && normalizeAnswer(correct.text).includes(term)) {
          r.errors.push(`Lộ đáp án: thuật ngữ nối ${item.id} "${item.term}" là đáp án đúng của ${q.id}`);
        } else if (normalizeAnswer([q.stem, ...(q.options ?? []).map((o) => o.text)].join(" ")).includes(term)) {
          r.warnings.push(`Có thể lộ: thuật ngữ nối ${item.id} "${item.term}" xuất hiện trong ${q.id}`);
        }
      }
      for (const q of pt?.questions ?? []) {
        if (normalizeAnswer(q.statement ?? "").includes(term)) {
          r.warnings.push(`Có thể lộ: thuật ngữ nối ${item.id} "${item.term}" xuất hiện trong ${q.id}`);
        }
      }
      for (const [label, p] of [["bài đọc MCQ", pm?.passage], ["bài đọc T/F", pt?.passage]] as const) {
        if (normalizeAnswer(passageText(p)).includes(term)) {
          r.warnings.push(`Có thể lộ: thuật ngữ nối ${item.id} "${item.term}" xuất hiện trong ${label}`);
        }
      }
      // Định nghĩa đúng của thuật ngữ bị diễn đạt lại trong câu hỏi khác.
      const defWords = new Set(contentWords(defById.get(item.answerKey) ?? ""));
      for (const q of [...laterMcq, ...(pt?.questions ?? [])]) {
        const text = "stem" in q ? q.stem : q.statement;
        const shared = contentWords(text ?? "").filter((w) => defWords.has(w));
        if (new Set(shared).size >= 3) {
          r.warnings.push(`Có thể lộ: ${q.id} dùng lại từ khoá định nghĩa của ${item.id} (${[...new Set(shared)].join(", ")})`);
        }
      }
    }
  }

  // ---- Writing ----
  const wr = exam.writing;
  if (!wr) {
    r.errors.push(`thiếu writing`);
  } else {
    if (wr.translation?.items?.length !== COUNTS.translations) r.errors.push(`Dịch phải có ${COUNTS.translations} câu`);
    checkIds(r, "Dịch", wr.translation?.items, range("W", 31, 35));
    for (const t of wr.translation?.items ?? []) {
      if (!t.source?.trim()) r.errors.push(`${t.id}: thiếu câu nguồn`);
      if (!t.referenceTranslation?.trim()) r.errors.push(`${t.id}: thiếu referenceTranslation`);
    }
    const em = wr.email;
    if (em?.id !== "W-EMAIL") r.errors.push(`email.id phải là "W-EMAIL"`);
    const nb = em?.bullets?.length ?? 0;
    if (nb < COUNTS.emailBulletsMin || nb > COUNTS.emailBulletsMax) r.errors.push(`Email phải có ${COUNTS.emailBulletsMin}–${COUNTS.emailBulletsMax} gợi ý, đang có ${nb}`);
    if (em?.wordRange?.[0] !== 80 || em?.wordRange?.[1] !== 100) r.errors.push(`email.wordRange phải là [80, 100]`);
    if (!em?.recipient?.trim() || !em?.task?.trim()) r.errors.push(`Email: thiếu recipient hoặc task`);
    if (!em?.targetGrammar?.length) r.errors.push(`Email: thiếu targetGrammar`);
    if (!em?.modelAnswer?.trim()) r.errors.push(`Email: thiếu modelAnswer`);
    else checkWordRange(r, "Email modelAnswer", em.modelAnswer, [80, 100]);
  }

  // ---- Speaking ----
  const sp = exam.speaking?.parts ?? [];
  if (sp.length !== 3) {
    r.errors.push(`speaking.parts phải có đúng 3 phần`);
  } else {
    const [s1, s2, s3] = sp;
    if (s1.id !== "S1" || s1.kind !== "questions") r.errors.push(`Speaking phần 1 phải là S1, kind "questions"`);
    if (s1.questions?.length !== COUNTS.speakingQuestions) r.errors.push(`S1 phải có ${COUNTS.speakingQuestions} câu hỏi`);
    if (s2.id !== "S2" || s2.kind !== "explain") r.errors.push(`Speaking phần 2 phải là S2, kind "explain"`);
    if (s3.id !== "S3" || s3.kind !== "situation") r.errors.push(`Speaking phần 3 phải là S3, kind "situation"`);
    for (const p of [s2, s3]) {
      if (!p.prompt?.trim()) r.errors.push(`${p.id}: thiếu prompt`);
      if (!p.requiredGrammar?.length) r.errors.push(`${p.id}: thiếu requiredGrammar`);
      if (!p.sampleAnswer?.trim()) r.warnings.push(`${p.id}: thiếu sampleAnswer`);
    }
  }

  // ---- Chính tả Anh–Anh ----
  const allText = JSON.stringify(exam);
  for (const [re, uk] of US_SPELLINGS) {
    const hit = allText.match(re);
    if (hit) r.warnings.push(`Chính tả Mỹ "${hit[0]}", dùng dạng Anh–Anh "${uk}"`);
  }

  return r;
}

/** Kiểm hằng số chấm điểm: mỗi kỹ năng 2,5, tổng 10. */
function checkScoringConstants(): string[] {
  const errs: string[] = [];
  const eq = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  const listening = (COUNTS.listeningMcq + COUNTS.listeningShort) * SCORING.listeningPerQuestion;
  const reading = COUNTS.readingTotal * SCORING.readingPerQuestion;
  const e = SCORING.writing.email;
  const writing = COUNTS.translations * SCORING.writing.translationPerItem + e.steps + e.layout + e.grammar + e.vocabulary;
  const s = SCORING.speaking;
  const speaking = s.task + s.unitGrammar + s.vocabulary + s.fluency;
  for (const [name, v] of [["Listening", listening], ["Reading", reading], ["Writing", writing], ["Speaking", speaking]] as const) {
    if (!eq(v, SKILL_MAX)) errs.push(`Hằng số chấm ${name} = ${v}, phải là ${SKILL_MAX}`);
  }
  if (!eq(listening + reading + writing + speaking, TOTAL_MAX)) errs.push(`Tổng điểm phải là ${TOTAL_MAX}`);
  const readingCount = COUNTS.matchingItems + COUNTS.grammar + COUNTS.vocabulary + COUNTS.passageMcq + COUNTS.passageTrueFalse;
  if (readingCount !== COUNTS.readingTotal) errs.push(`Số câu Reading cộng lại = ${readingCount}, phải là ${COUNTS.readingTotal}`);
  return errs;
}

function main() {
  const arg = process.argv[2];
  const files = !arg ? listUnitFiles() : /^\d$/.test(arg) ? [unitPath(Number(arg))] : [arg];

  const constErrors = checkScoringConstants();
  constErrors.forEach((e) => console.log(`LỖI  [hằng số] ${e}`));

  if (files.length === 0) {
    console.log("Chưa có file nào trong data/units/.");
    process.exit(constErrors.length ? 1 : 0);
  }

  const reports: Report[] = [];
  const translationSeen = new Map<string, string>();
  for (const file of files) {
    if (!existsSync(file)) {
      reports.push({ file, errors: ["không tìm thấy file"], warnings: [] });
      continue;
    }
    let exam: UnitExam;
    try {
      exam = readJson<UnitExam>(file);
    } catch (err) {
      reports.push({ file, errors: [`JSON không hợp lệ: ${(err as Error).message}`], warnings: [] });
      continue;
    }
    let report: Report;
    try {
      report = validateExam(exam, file);
    } catch (err) {
      report = { file, errors: [`sai cấu trúc, không đọc được: ${(err as Error).message}`], warnings: [] };
    }
    // Câu dịch không được trùng giữa các Unit (quy tắc 7).
    for (const t of exam.writing?.translation?.items ?? []) {
      const key = normalizeAnswer(t.source ?? "");
      const prev = translationSeen.get(key);
      if (key && prev) report.errors.push(`${t.id}: câu dịch trùng với ${prev}`);
      else if (key) translationSeen.set(key, `${basename(file)} ${t.id}`);
    }
    reports.push(report);
  }

  let errorCount = constErrors.length;
  for (const r of reports) {
    console.log(`\n== ${basename(r.file)}: ${r.errors.length} lỗi, ${r.warnings.length} cảnh báo`);
    r.errors.forEach((e) => console.log(`LỖI  ${e}`));
    r.warnings.forEach((w) => console.log(`CẢNH BÁO  ${w}`));
    errorCount += r.errors.length;
  }
  console.log(`\nKết quả: ${errorCount === 0 ? "QUA" : `KHÔNG QUA (${errorCount} lỗi)`}`);
  process.exit(errorCount === 0 ? 0 : 1);
}

main();
