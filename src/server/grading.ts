import {
  countWords,
  normalizeAnswer,
  roundTotal,
  SCORING,
  type UnitExam,
} from "@/types/exam";
import {
  SKILLS,
  type ExamAnswers,
  type ExamResult,
  type QuestionReview,
  type SkillResult,
  type Skill,
} from "@/types/app";
import type { ServerSession } from "./sessions";
import { gradeWriting, gradeSpeaking, writingScore, speakingScore } from "./ai";
import { stripSourceNotes } from "./data";

function autoGrade(
  exam: UnitExam,
  skill: "listening" | "reading",
  answers: Record<string, string>,
): SkillResult {
  const r = exam.reading;
  const questions =
    skill === "listening"
      ? [
          ...exam.listening.parts[0].questions,
          ...exam.listening.parts[1].questions,
        ]
      : [
          ...r.matching.items,
          ...r.grammar,
          ...r.vocabulary,
          ...r.passageMcq.questions,
          ...r.passageTrueFalse.questions,
        ];
  const per =
    skill === "listening"
      ? SCORING.listeningPerQuestion
      : SCORING.readingPerQuestion;
  const reviews: QuestionReview[] = questions.map((q) => {
    const answer = answers[q.id] || "";
    const correct =
      "acceptedAnswers" in q
        ? countWords(normalizeAnswer(answer)) <= q.maxWords &&
          q.acceptedAnswers.includes(normalizeAnswer(answer))
        : answer.trim().toUpperCase() === q.answerKey;
    return {
      id: q.id,
      answer,
      correct,
      correctAnswer:
        "acceptedAnswers" in q ? q.acceptedAnswers.join(" / ") : q.answerKey,
      score: correct ? per : 0,
      explanation: q.explanation,
    };
  });
  // Multiplication avoids summation drift at the 2.5 skill maximum.
  return {
    score: reviews.filter((q) => q.correct).length * per,
    questions: reviews,
  };
}
export async function gradeSession(
  session: ServerSession,
  answers: ExamAnswers,
): Promise<ExamResult> {
  const skills: ExamResult["skills"] = {},
    review: ExamResult["review"] = {};
  const selected = session.scope === "full" ? SKILLS : [session.scope];
  // Chấm Writing và Speaking song song để cả đề không chờ gấp đôi.
  const [writing, speaking] = await Promise.all([
    selected.includes("writing")
      ? gradeWriting(session.exam, answers.writing)
      : undefined,
    selected.includes("speaking")
      ? gradeSpeaking(session.exam, answers.speaking)
      : undefined,
  ]);
  for (const skill of selected) {
    if (skill === "listening" || skill === "reading")
      skills[skill] = autoGrade(session.exam, skill, answers[skill]);
    if (skill === "writing" && writing)
      skills.writing = { writing, score: writingScore(writing) };
    if (skill === "speaking" && speaking)
      skills.speaking = { speaking, score: speakingScore(speaking) };
    Object.assign(review, {
      [skill]: stripSourceNotes(session.exam[skill as Skill]),
    });
  }
  return {
    id: session.id,
    unit: session.exam.unit,
    unitTitle: session.exam.unitTitle,
    mode: session.mode,
    scope: session.scope,
    submittedAt: new Date().toISOString(),
    total:
      session.scope === "full"
        ? roundTotal(Object.values(skills).reduce((sum, s) => sum + s.score, 0))
        : skills[session.scope]!.score,
    mock:
      process.env.AI_MOCK === "1" &&
      selected.some((s) => s === "writing" || s === "speaking"),
    skills,
    review,
  };
}
export { autoGrade };
