import { createHash, randomUUID } from "node:crypto";
import type { UnitExam } from "@/types/exam";
import {
  SKILLS,
  emptyAnswers,
  type ExamAnswers,
  type ExamResult,
  type ExamSession,
  type Mode,
  type Scope,
  type Skill,
  type SessionExam,
} from "@/types/app";
import { loadExam, publicExam } from "./data";
import { AppError } from "./errors";

export interface ServerSession {
  id: string;
  device: string;
  exam: UnitExam;
  mode: Mode;
  scope: Scope;
  started: number;
  expires: number | null;
  deleteAt: number;
  listens: { A: number; B: number };
  status: "idle" | "grading" | "submitted";
  result?: ExamResult;
  completed: Skill[];
  answers: ExamAnswers;
  audioHashes?: Record<string, string>;
}
const state = globalThis as typeof globalThis & {
  etSessions?: Map<string, ServerSession>;
};
const sessions = (state.etSessions ??= new Map<string, ServerSession>());
export function sessionView(s: ServerSession): ExamSession {
  const activeSkill =
    s.mode === "exam"
      ? (SKILLS.find((skill) => !s.completed.includes(skill)) ?? null)
      : s.scope === "full"
        ? null
        : s.scope;
  const stripped = publicExam(s.exam);
  const { listening, reading, writing, speaking, ...metadata } = stripped;
  const sections = { listening, reading, writing, speaking };
  const exam: SessionExam =
    s.mode === "practice" && s.scope === "full"
      ? stripped
      : {
          ...metadata,
          ...(activeSkill ? { [activeSkill]: sections[activeSkill] } : {}),
        };
  return {
    sessionId: s.id,
    exam,
    mode: s.mode,
    scope: s.scope,
    startedAt: new Date(s.started).toISOString(),
    expiresAt: s.expires ? new Date(s.expires).toISOString() : null,
    activeSkill,
    completedSkills: [...s.completed],
  };
}
export async function createSession(
  device: string,
  unit: unknown,
  mode: unknown,
  scope: unknown,
): Promise<ServerSession> {
  if (
    typeof unit !== "number" ||
    (mode !== "practice" && mode !== "exam") ||
    (scope !== "full" && !SKILLS.includes(scope as never))
  )
    throw new AppError(400, "Chế độ hoặc phạm vi bài thi không hợp lệ.");
  if (mode === "exam" && scope !== "full")
    throw new AppError(400, "Thi thử phải làm tuần tự cả bốn kỹ năng.");
  const exam = await loadExam(unit);
  // No await between counting and inserting: parallel requests cannot reserve
  // more sessions than the per-device/global caps.
  const now = Date.now();
  for (const [id, s] of sessions) if (s.deleteAt < now) sessions.delete(id);
  if (
    sessions.size >= 1000 ||
    [...sessions.values()].filter(
      (s) => s.device === device && s.status !== "submitted",
    ).length >= 20
  )
    throw new AppError(
      429,
      "Bạn đang mở quá nhiều đề. Vui lòng hoàn thành hoặc quay lại sau.",
    );
  const duration =
    scope === "full"
      ? 90
      : scope === "reading" || scope === "writing"
        ? 30
        : 15;
  const s: ServerSession = {
    id: randomUUID(),
    device,
    exam,
    mode,
    scope: scope as Scope,
    started: now,
    expires: mode === "exam" ? now + duration * 60_000 : null,
    deleteAt: now + 4 * 3600_000,
    listens: { A: 0, B: 0 },
    status: "idle",
    completed: [],
    answers: emptyAnswers(),
  };
  sessions.set(s.id, s);
  return s;
}
export function submitSection(
  s: ServerSession,
  skill: unknown,
  answers: ExamAnswers,
): void {
  if (s.mode !== "exam" || s.status !== "idle")
    throw new AppError(409, "Không thể nộp kỹ năng trong phiên này.");
  if (s.expires && s.expires <= Date.now())
    throw new AppError(409, "Đã hết giờ. Vui lòng nộp cả đề.");
  const active = SKILLS.find((item) => !s.completed.includes(item));
  if (skill !== active || skill === "speaking")
    throw new AppError(409, "Hãy nộp kỹ năng hiện tại theo đúng thứ tự.");
  // Copy only the current section. Submitted answers never come from the client again.
  if (skill === "listening")
    s.answers.listening = structuredClone(answers.listening);
  if (skill === "reading") s.answers.reading = structuredClone(answers.reading);
  if (skill === "writing") s.answers.writing = structuredClone(answers.writing);
  s.completed.push(skill as Skill);
}
export function finalAnswers(
  s: ServerSession,
  answers: ExamAnswers,
): ExamAnswers {
  if (s.mode === "practice") return answers;
  if (s.completed.length === 4) {
    const locked = structuredClone(s.answers);
    for (const [id, hash] of Object.entries(s.audioHashes ?? {})) {
      const audio = answers.speaking[id]?.audio;
      if (!audio || audioDigest(audio.data) !== hash)
        throw new AppError(
          409,
          "Bài nói đã khoá. Hãy gửi lại đúng bản ghi ban đầu để thử chấm lại.",
        );
      locked.speaking[id].audio = structuredClone(audio);
    }
    return locked;
  }
  const active = SKILLS.find((skill) => !s.completed.includes(skill))!;
  const expired = !!s.expires && s.expires <= Date.now();
  if (!expired && active !== "speaking")
    throw new AppError(
      409,
      "Cần nộp Listening, Reading và Writing trước khi nộp cả đề.",
    );
  // Allow a brief delivery grace for the browser's automatic submit at zero.
  // Later submissions keep unopened/current sections blank instead of allowing
  // arbitrary extra working time after the clock has expired.
  if (!expired || Date.now() - s.expires! <= 15_000)
    Object.assign(s.answers, { [active]: structuredClone(answers[active]) });
  // At timeout, unopened skills stay blank; their content is never released.
  s.completed = [...SKILLS];
  return structuredClone(s.answers);
}
function audioDigest(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}
export function discardSessionAudio(s: ServerSession): void {
  for (const [id, answer] of Object.entries(s.answers.speaking)) {
    if (!answer.audio) continue;
    // A digest permits an immutable retry without retaining the audio itself.
    s.audioHashes ??= {};
    s.audioHashes[id] = audioDigest(answer.audio.data);
    delete answer.audio;
  }
}
export function getSession(id: unknown, device: string): ServerSession {
  if (typeof id !== "string" || id.length > 100)
    throw new AppError(400, "Thiếu mã phiên làm bài.");
  const s = sessions.get(id);
  if (!s || s.device !== device || s.deleteAt < Date.now())
    throw new AppError(
      404,
      "Phiên làm bài đã hết hạn. Hãy bắt đầu một đề mới.",
    );
  return s;
}
