import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { emptyAnswers } from "../src/types/app";
import { SCORING, type UnitExam } from "../src/types/exam";
import { autoGrade, gradeSession } from "../src/server/grading";
import { createSession } from "../src/server/sessions";

const exam = JSON.parse(
  readFileSync("fixtures/unit-6.sample.json", "utf8"),
) as UnitExam;

test("Listening normalises case, punctuation and spacing but rejects answers over three words", () => {
  const answers = Object.fromEntries(
    exam.listening.parts[1].questions.map((q) => [
      q.id,
      `  ${q.acceptedAnswers[0].toUpperCase()}!!!  `,
    ]),
  );
  const graded = autoGrade(exam, "listening", answers);
  assert.equal(graded.score, 1.25);
  assert.equal(graded.questions!.filter((q) => q.correct).length, 5);
  const longer = structuredClone(exam);
  longer.listening.parts[1].questions[0].acceptedAnswers = [
    "one two three four",
  ];
  assert.equal(
    autoGrade(longer, "listening", { L6: "one two three four" }).score,
    0,
  );
  assert.equal(autoGrade(exam, "listening", {}).score, 0);
});

test("Reading assigns fractional points and caps a perfect section at 2.5", () => {
  const r = exam.reading;
  const answers = Object.fromEntries(
    [
      ...r.matching.items,
      ...r.grammar,
      ...r.vocabulary,
      ...r.passageMcq.questions,
      ...r.passageTrueFalse.questions,
    ].map((q) => [q.id, q.answerKey]),
  );
  assert.equal(autoGrade(exam, "reading", answers).score, 2.5);
  assert.equal(
    autoGrade(exam, "reading", { R1: r.matching.items[0].answerKey }).score,
    SCORING.readingPerQuestion,
  );
});

test("a single-skill practice result preserves the skill's precision instead of rounding it as a four-skill total", async () => {
  process.env.EXAM_DATA_DIR = "fixtures";
  const session = await createSession(randomUUID(), 6, "practice", "reading");
  const answers = emptyAnswers();
  answers.reading.R1 = exam.reading.matching.items[0].answerKey;
  const result = await gradeSession(session, answers);
  assert.equal(result.total, SCORING.readingPerQuestion);
  assert.equal(result.testId, "A");
  assert.equal(result.source, exam.source);
  assert.equal(result.total, result.skills.reading!.score);
  assert.deepEqual(Object.keys(result.review), ["reading"]);
  assert.equal(result.mock, false);
});
