/**
 * Kiểu dữ liệu đề thi và hằng số chấm điểm.
 *
 * File này do et-lead khoá (docs/PROTOCOL.md mục 4). Agent khác cần đổi
 * schema thì gửi đề xuất cho et-lead, không tự sửa.
 *
 * Barem: docs/exam-format.md mục 3. Thang 10, mỗi kỹ năng 2,5.
 */

export const SCHEMA_VERSION = 1 as const;

export type UnitNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ChoiceId = "A" | "B" | "C" | "D";
export type DefinitionId = "A" | "B" | "C" | "D" | "E" | "F";
export type TrueFalse = "T" | "F";

/**
 * Các trường chứa đáp án, lời giải hoặc ghi chú nội bộ (sourceNotes thường
 * nhắc tới đáp án). scripts/strip-answers.ts xoá hết các trường này khỏi bản
 * đề gửi cho et-auditor và cho trình duyệt.
 */
export const ANSWER_FIELDS = [
  "sourceNotes",
  "answerKey",
  "acceptedAnswers",
  "explanation",
  "referenceTranslation",
  "modelAnswer",
  "sampleAnswer",
] as const;

// ---------- Câu hỏi dùng chung ----------

export interface Option {
  id: ChoiceId;
  text: string;
}

export interface McqQuestion {
  /** "L1".."L5" (Listening Part A) hoặc "R6".."R25" (Reading). */
  id: string;
  kind: "mcq";
  /** Câu hỏi hoặc câu có chỗ trống, chỗ trống viết "______". */
  stem: string;
  /** Đúng 4 phương án A–D. */
  options: Option[];
  answerKey: ChoiceId;
  /** Giải thích bằng tiếng Việt, hiện sau khi nộp bài. */
  explanation: string;
}

// ---------- Listening (2,5 điểm, 10 câu × 0,25) ----------

export interface ScriptLine {
  /** Tên người nói, ví dụ "Anna". Bài độc thoại dùng một tên duy nhất. */
  speaker: string;
  text: string;
}

export interface Speaker {
  name: string;
  /** Gợi ý chọn giọng TTS. */
  voice: "female" | "male";
}

export interface ShortAnswerQuestion {
  /** "L6".."L10". */
  id: string;
  kind: "short";
  stem: string;
  /** Số từ tối đa sinh viên được viết. */
  maxWords: 3;
  /**
   * Các đáp án được chấp nhận, viết sẵn ở dạng đã chuẩn hoá
   * (xem normalizeAnswer). Mỗi đáp án không quá maxWords từ.
   */
  acceptedAnswers: string[];
  explanation: string;
}

export interface ListeningPartA {
  id: "A";
  /** Hướng dẫn hiện cho sinh viên. */
  instructions: string;
  /** Mô tả tình huống, ví dụ "Two technicians talk about video conferencing." */
  context: string;
  speakers: Speaker[];
  /** Lời thoại viết mới, 150–250 từ. */
  script: ScriptLine[];
  questions: McqQuestion[];
}

export interface ListeningPartB {
  id: "B";
  instructions: string;
  context: string;
  speakers: Speaker[];
  script: ScriptLine[];
  questions: ShortAnswerQuestion[];
}

export interface ListeningSection {
  parts: [ListeningPartA, ListeningPartB];
}

// ---------- Reading (2,5 điểm, 30 câu) ----------

export interface Definition {
  id: DefinitionId;
  text: string;
}

export interface MatchItem {
  /** "R1".."R5". */
  id: string;
  term: string;
  answerKey: DefinitionId;
  explanation: string;
}

export interface MatchingSection {
  instructions: string;
  /** Đúng 6 định nghĩa A–F, thừa 1 định nghĩa gây nhiễu. */
  definitions: Definition[];
  items: MatchItem[];
}

export interface Passage {
  title?: string;
  /** Các đoạn văn, mỗi phần tử một đoạn. */
  paragraphs: string[];
}

export interface TrueFalseQuestion {
  /** "R26".."R30". */
  id: string;
  kind: "tf";
  statement: string;
  answerKey: TrueFalse;
  explanation: string;
}

export interface ReadingSection {
  /** R1–R5. */
  matching: MatchingSection;
  /** R6–R12: ngữ pháp của Unit. */
  grammar: McqQuestion[];
  /** R13–R20: từ vựng trong ngữ cảnh. */
  vocabulary: McqQuestion[];
  /** R21–R25: bài đọc 230–270 từ, trắc nghiệm. */
  passageMcq: { instructions: string; passage: Passage; questions: McqQuestion[] };
  /** R26–R30: bài đọc 160–200 từ, True/False. */
  passageTrueFalse: { instructions: string; passage: Passage; questions: TrueFalseQuestion[] };
}

// ---------- Writing (2,5 điểm, AI chấm) ----------

export interface TranslationItem {
  /** "W31".."W35". */
  id: string;
  /** Câu tiếng Anh cần dịch sang tiếng Việt. */
  source: string;
  /** Bản dịch tham khảo, dùng cho AI chấm và hiện sau khi nộp. */
  referenceTranslation: string;
}

export interface EmailTask {
  id: "W-EMAIL";
  /** Tên người nhận, ví dụ "Hana". */
  recipient: string;
  /** Đề bài đầy đủ hiện cho sinh viên. */
  task: string;
  /** 5–7 gạch đầu dòng gợi ý. */
  bullets: string[];
  wordRange: [80, 100];
  /** Cấu trúc ngữ pháp của Unit mà bài nên dùng. */
  targetGrammar: string[];
  modelAnswer: string;
}

export interface WritingSection {
  translation: { instructions: string; items: TranslationItem[] };
  email: EmailTask;
}

// ---------- Speaking (2,5 điểm, AI chấm) ----------

export interface SpeakingQuestionsPart {
  id: "S1";
  kind: "questions";
  instructions: string;
  /** Đúng 3 câu hỏi. */
  questions: string[];
  /** Thời gian gợi ý cho mỗi câu, giây. */
  secondsPerQuestion: number;
}

export interface SpeakingTaskPart {
  id: "S2" | "S3";
  kind: "explain" | "situation";
  instructions: string;
  /** Đề bài hoặc tình huống. */
  prompt: string;
  /** Gợi ý ý cần nói. */
  cues: string[];
  /** Ngữ pháp bắt buộc dùng trong phần này. */
  requiredGrammar: string[];
  /** Thời gian gợi ý, giây. */
  seconds: number;
  sampleAnswer: string;
}

export interface SpeakingSection {
  parts: [SpeakingQuestionsPart, SpeakingTaskPart, SpeakingTaskPart];
}

// ---------- Đề của một Unit ----------

export interface UnitExam {
  schemaVersion: typeof SCHEMA_VERSION;
  unit: UnitNumber;
  /** Tên Unit theo giáo trình, ví dụ "Interactions". */
  unitTitle: string;
  testId: "A";
  /** Chức năng của 4 bài trong Unit (docs/source-materials.md mục 1). */
  functions: string[];
  /** Ngữ pháp trọng tâm của Unit, dùng cho đề và cho AI chấm. */
  grammarFocus: string[];
  /** Ghi chú nguồn: lấy từ đề mẫu nào, sửa gì. Không hiện cho sinh viên. */
  sourceNotes: string[];
  listening: ListeningSection;
  reading: ReadingSection;
  writing: WritingSection;
  speaking: SpeakingSection;
}

// ---------- Số câu và điểm ----------

export const COUNTS = {
  listeningMcq: 5,
  listeningShort: 5,
  matchingItems: 5,
  matchingDefinitions: 6,
  grammar: 7,
  vocabulary: 8,
  passageMcq: 5,
  passageTrueFalse: 5,
  readingTotal: 30,
  translations: 5,
  emailBulletsMin: 5,
  emailBulletsMax: 7,
  speakingQuestions: 3,
} as const;

export const WORD_LIMITS = {
  listeningScript: [150, 250],
  passageMcq: [230, 270],
  passageTrueFalse: [160, 200],
} as const;

export const SKILL_MAX = 2.5;
export const TOTAL_MAX = 10;

export const SCORING = {
  listeningPerQuestion: 0.25,
  readingPerQuestion: SKILL_MAX / COUNTS.readingTotal,
  writing: {
    translationPerItem: 0.25,
    email: { steps: 0.5, layout: 0.25, grammar: 0.25, vocabulary: 0.25 },
  },
  speaking: { task: 0.625, unitGrammar: 0.625, vocabulary: 0.625, fluency: 0.625 },
} as const;

// ---------- Kết quả AI chấm (server phải kiểm lại trước khi dùng) ----------

export interface TranslationGrade {
  id: string;
  /** 0, 0.125 hoặc 0.25. */
  score: 0 | 0.125 | 0.25;
  feedback: string;
}

export interface WritingGrade {
  translations: TranslationGrade[];
  email: {
    steps: number;
    layout: number;
    grammar: number;
    vocabulary: number;
    wordCount: number;
    feedback: string;
    corrections: { original: string; corrected: string; note: string }[];
  };
}

export interface SpeakingGrade {
  task: number;
  unitGrammar: number;
  vocabulary: number;
  fluency: number;
  /** false nếu chỉ chấm bản chữ, không có audio. */
  pronunciationAssessed: boolean;
  feedback: string;
  corrections: { original: string; corrected: string; note: string }[];
}

// ---------- Hàm dùng chung ----------

/** Chuẩn hoá đáp án ngắn Listening Part B: chữ thường, bỏ dấu câu, gộp khoảng trắng. */
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{N}'\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

/** Các dòng đầu thư theo khung email của giáo viên; không tính vào 80–100 từ. */
const EMAIL_HEADER = /^\s*(from|to|date|subject)\s*:/i;

/** Phần thân email: bỏ các dòng From/To/Date/Subject, giữ từ lời chào đến chữ ký. */
export function emailBody(text: string): string {
  return text
    .split(/\r?\n/)
    .filter((line) => !EMAIL_HEADER.test(line))
    .join("\n");
}

/** Số từ tính cho giới hạn 80–100 của email: chỉ phần thân. */
export function countEmailWords(text: string): number {
  return countWords(emailBody(text));
}

/** Làm tròn tổng điểm đến 0,25 gần nhất, từ 0,125 trở lên làm tròn lên. Tối đa 10. */
export function roundTotal(score: number): number {
  const rounded = Math.round(score * 4 + 1e-9) / 4;
  return Math.min(TOTAL_MAX, Math.max(0, rounded));
}
