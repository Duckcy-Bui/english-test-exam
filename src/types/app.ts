import type {
  UnitExam,
  WritingGrade,
  SpeakingGrade,
  ScriptLine,
  Speaker,
  ANSWER_FIELDS,
} from "./exam";

export type Skill = "listening" | "reading" | "writing" | "speaking";
export const SKILLS: Skill[] = ["listening", "reading", "writing", "speaking"];
export type Mode = "practice" | "exam";
export type Scope = "full" | Skill;
type Hidden = (typeof ANSWER_FIELDS)[number] | "script";
export type PublicData<T> = T extends readonly unknown[]
  ? { [K in keyof T]: PublicData<T[K]> }
  : T extends object
    ? { [K in keyof T as K extends Hidden ? never : K]: PublicData<T[K]> }
    : T;
export type PublicExam = PublicData<UnitExam>;
export type SessionExam = Omit<PublicExam, Skill> &
  Partial<Pick<PublicExam, Skill>>;
export interface UnitSummary {
  unit: number;
  title: string;
  available: boolean;
  grammarFocus: string[];
}
export interface AudioAnswer {
  mimeType: "audio/wav";
  data: string;
}
export interface SpeakingAnswer {
  text: string;
  audio?: AudioAnswer;
}
export interface ExamAnswers {
  listening: Record<string, string>;
  reading: Record<string, string>;
  writing: { translations: Record<string, string>; email: string };
  speaking: Record<string, SpeakingAnswer>;
}
export interface ExamSession {
  sessionId: string;
  exam: SessionExam;
  mode: Mode;
  scope: Scope;
  startedAt: string;
  expiresAt: string | null;
  activeSkill: Skill | null;
  completedSkills: Skill[];
}
export interface QuestionReview {
  id: string;
  answer: string;
  correctAnswer: string;
  correct: boolean;
  score: number;
  explanation: string;
}
export interface SkillResult {
  score: number;
  questions?: QuestionReview[];
  writing?: WritingGrade;
  speaking?: SpeakingGrade;
}
export interface ExamResult {
  id: string;
  unit: number;
  unitTitle: string;
  mode: Mode;
  scope: Scope;
  submittedAt: string;
  total: number;
  mock: boolean;
  skills: Partial<Record<Skill, SkillResult>>;
  review: Partial<Pick<UnitExam, Skill>>;
}
export interface ListeningPlayback {
  partId: "A" | "B";
  script: ScriptLine[];
  speakers: Speaker[];
  remaining: number | null;
  /** Có khi Unit có file âm thanh thu sẵn; không có thì dùng giọng trình duyệt. */
  audioUrl?: string;
}
export const MAX_AUDIO_BYTES = 6 * 1024 * 1024;
export const MAX_AUDIO_SECONDS = 180;
export function emptyAnswers(): ExamAnswers {
  return {
    listening: {},
    reading: {},
    writing: { translations: {}, email: "" },
    speaking: {},
  };
}
