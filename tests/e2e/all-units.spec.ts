import {
  test,
  expect,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { ANSWER_FIELDS, TEST_IDS, type TestId, type UnitExam } from "../../src/types/exam";
import {
  emptyAnswers,
  SKILLS,
  type ExamAnswers,
  type ExamResult,
  type ExamSession,
  type UnitSummary,
} from "../../src/types/app";

// Deployment must serve the audited data, even when a fixture-only run is also used.
const exams: UnitExam[] = Array.from({ length: 8 }, (_, index) =>
  JSON.parse(
    readFileSync(join("data", "units", `unit-${index + 1}-A.json`), "utf8"),
  ),
);
const canonicalTests = readdirSync(join("data", "units"))
  .flatMap((file) => {
    const match = /^unit-([1-8])-([A-D])\.json$/.exec(file);
    if (!match) return [];
    const exam: UnitExam = JSON.parse(
      readFileSync(join("data", "units", file), "utf8"),
    );
    return [{
      unit: Number(match[1]),
      testId: match[2] as TestId,
      source: exam.source,
    }];
  })
  .sort((left, right) =>
    left.unit - right.unit || TEST_IDS.indexOf(left.testId) - TEST_IDS.indexOf(right.testId),
  );
const expectedUnits: UnitSummary[] = exams.map((exam) => {
  const tests = canonicalTests
    .filter((test) => test.unit === exam.unit)
    .map(({ testId, source }) => ({ testId, source }));
  return {
    unit: exam.unit,
    title: exam.unitTitle,
    available: true,
    grammarFocus: exam.grammarFocus,
    tests,
    testCount: tests.length,
  };
});
const usesFixtures =
  process.env.E2E_DATA_DIR !== undefined &&
  basename(resolve(process.env.E2E_DATA_DIR)) === "fixtures";

function assertPrivateFieldsAbsent(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(assertPrivateFieldsAbsent);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    expect([...ANSWER_FIELDS, "script"]).not.toContain(key);
    assertPrivateFieldsAbsent(child);
  }
}

function assertSourceNotesAbsent(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(assertSourceNotesAbsent);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    expect(key).not.toBe("sourceNotes");
    assertSourceNotesAbsent(child);
  }
}

function completedAnswers(exam: UnitExam): ExamAnswers {
  const answers = emptyAnswers();
  for (const part of exam.listening.parts)
    for (const question of part.questions)
      answers.listening[question.id] =
        "answerKey" in question
          ? question.answerKey
          : question.acceptedAnswers[0];
  for (const question of [
    ...exam.reading.matching.items,
    ...exam.reading.grammar,
    ...exam.reading.vocabulary,
    ...exam.reading.passageMcq.questions,
    ...exam.reading.passageTrueFalse.questions,
  ])
    answers.reading[question.id] = question.answerKey;
  answers.writing = {
    translations: Object.fromEntries(
      exam.writing.translation.items.map((question) => [
        question.id,
        question.referenceTranslation,
      ]),
    ),
    email: exam.writing.email.modelAnswer,
  };
  // AI_MOCK verifies a complete submission; it does not assess these answers.
  for (const id of ["S1-1", "S1-2", "S1-3"])
    answers.speaking[id] = {
      text: "Our IT team communicates clearly and checks each system carefully to help users work safely.",
    };
  answers.speaking.S2 = { text: exam.speaking.parts[1].sampleAnswer };
  answers.speaking.S3 = { text: exam.speaking.parts[2].sampleAnswer };
  return answers;
}

async function authenticate(request: APIRequestContext): Promise<void> {
  const response = await request.post("/api/access", {
    data: { code: "local-e2e-code" },
  });
  expect(response.status()).toBe(200);
}

function assertMockResult(result: ExamResult, exam: UnitExam): void {
  expect(result.unit).toBe(exam.unit);
  expect(result.unitTitle).toBe(exam.unitTitle);
  expect(result.testId).toBe(exam.testId);
  expect(result.source).toBe(exam.source);
  expect(result.mode).toBe("exam");
  expect(result.scope).toBe("full");
  expect(result.mock).toBe(true);
  expect(Object.keys(result.skills)).toEqual(SKILLS);
  expect(result.skills.listening?.score).toBe(2.5);
  expect(result.skills.reading?.score).toBe(2.5);
  expect(result.skills.writing?.score).toBe(1.25);
  expect(result.skills.speaking?.score).toBe(1.25);
  expect(result.skills.speaking?.speaking?.pronunciationAssessed).toBe(false);
  expect(result.total).toBe(7.5);
  expect(Object.keys(result.review)).toEqual(SKILLS);
  expect(result.review.writing?.email.modelAnswer).toBe(
    exam.writing.email.modelAnswer,
  );
  expect(result.review.speaking?.parts[1].sampleAnswer).toBe(
    exam.speaking.parts[1].sampleAnswer,
  );
  assertSourceNotesAbsent(result);
}

test.describe("all eight audited Units with AI_MOCK", () => {
  test.skip(
    usesFixtures,
    "The eight-Unit deployment checks require data/units.",
  );

  for (const exam of exams) {
    test(`API completes Unit ${exam.unit}: ${exam.unitTitle}, keeps skills sequential and locks submissions`, async ({
      request,
    }) => {
      await authenticate(request);
      const listResponse = await request.get("/api/units");
      expect(listResponse.status()).toBe(200);
      const { units } = await listResponse.json();
      expect(units).toEqual(expectedUnits);
      assertPrivateFieldsAbsent(units);

      const startResponse = await request.post("/api/session", {
        data: { unit: exam.unit, test: exam.testId, mode: "exam", scope: "full" },
      });
      expect(startResponse.status()).toBe(200);
      let session: ExamSession = (await startResponse.json()).session;
      const sessionId = session.sessionId;
      const answers = completedAnswers(exam);
      expect(session.exam.unit).toBe(exam.unit);
      expect(session.exam.unitTitle).toBe(exam.unitTitle);
      expect(session.exam.testId).toBe(exam.testId);
      expect(session.exam.source).toBe(exam.source);

      for (const [index, skill] of SKILLS.entries()) {
        expect(session.activeSkill).toBe(skill);
        expect(session.completedSkills).toEqual(SKILLS.slice(0, index));
        expect(
          Object.keys(session.exam).filter((key) =>
            SKILLS.includes(key as (typeof SKILLS)[number]),
          ),
        ).toEqual([skill]);
        assertPrivateFieldsAbsent(session);
        expect(
          (await request.get(`/api/grade?sessionId=${sessionId}`)).status(),
        ).toBe(409);

        if (skill === "speaking") break;
        // A future skill cannot be submitted before the current one.
        expect(
          (
            await request.post("/api/section", {
              data: { sessionId, skill: SKILLS[index + 1], answers },
            })
          ).status(),
        ).toBe(409);
        const response = await request.post("/api/section", {
          data: { sessionId, skill, answers },
        });
        expect(response.status()).toBe(200);
        session = (await response.json()).session;
        expect(session.sessionId).toBe(sessionId);
        expect(session.exam.unit).toBe(exam.unit);
        expect(session.exam.unitTitle).toBe(exam.unitTitle);
        expect(session.exam[skill]).toBeUndefined();
        for (const completedSkill of SKILLS.slice(0, index + 1))
          expect(
            (
              await request.post("/api/section", {
                data: { sessionId, skill: completedSkill, answers },
              })
            ).status(),
          ).toBe(409);
      }

      // The final request cannot overwrite the three already locked sections.
      const finalAnswers = emptyAnswers();
      finalAnswers.speaking = answers.speaking;
      const finalResponse = await request.post("/api/grade", {
        data: { sessionId, answers: finalAnswers },
      });
      expect(finalResponse.status()).toBe(200);
      const { result } = await finalResponse.json();
      assertMockResult(result, exam);
      const cachedResponse = await request.get(
        `/api/grade?sessionId=${sessionId}`,
      );
      expect(cachedResponse.status()).toBe(200);
      expect((await cachedResponse.json()).result).toEqual(result);
    });
  }

  for (const exam of [exams[0], exams[7]]) {
    test(`browser completes audited Unit ${exam.unit} and records the result in history`, async ({
      page,
    }) => {
      const errors: string[] = [];
      const received: unknown[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", async (response) => {
        if (
          /\/api\/(session|section)(?:\?|$)/.test(response.url()) &&
          response.ok()
        )
          received.push(await response.json());
      });
      await page.goto("/");
      await page
        .getByLabel("Mã truy cập", { exact: true })
        .fill("local-e2e-code");
      await page.getByRole("button", { name: "Vào luyện tập" }).click();
      await expect(page.locator(".unit-card.available")).toHaveCount(8);
      await expect(page.locator(".unit-card.unavailable")).toHaveCount(0);
      for (const unit of exams) {
        const card = page.locator(".unit-card").filter({
          has: page.getByRole("link", {
            name: `Luyện tập Unit ${unit.unit}`,
            exact: true,
          }),
        });
        await expect(
          card.getByRole("heading", { name: unit.unitTitle, exact: true }),
        ).toBeVisible();
        await expect(
          card.getByText("Sẵn sàng luyện tập", { exact: true }),
        ).toBeVisible();
      }
      await page
        .getByRole("link", {
          name: `Luyện tập Unit ${exam.unit}`,
          exact: true,
        })
        .click();
      await page.getByRole("button", { name: "Thi thử", exact: true }).click();
      await page
        .locator(`.test-card[data-test-id="${exam.testId}"]`)
        .getByRole("button", { name: "Thi cả đề", exact: true })
        .click();
      await expect(page).toHaveURL(/\/exam\//);
      await expect(
        page.getByRole("heading", { name: exam.unitTitle, exact: true }),
      ).toBeVisible();
      await expect(page.locator("#R1")).toHaveCount(0);
      await expect(page.locator("#W31")).toHaveCount(0);
      await expect(page.locator("#speaking-text-S1-1")).toHaveCount(0);
      for (const question of exam.listening.parts[0].questions)
        await page
          .locator(
            `input[name="${question.id}"][value="${question.answerKey}"]`,
          )
          .check();
      for (const question of exam.listening.parts[1].questions)
        await page.locator(`#${question.id}`).fill(question.acceptedAnswers[0]);
      await nextSection(page, "Listening");
      await expect(page.locator('input[name="L1"]')).toHaveCount(0);
      await expect(page.locator("#W31")).toHaveCount(0);
      for (const question of exam.reading.matching.items)
        await page.locator(`#${question.id}`).selectOption(question.answerKey);
      for (const question of [
        ...exam.reading.grammar,
        ...exam.reading.vocabulary,
        ...exam.reading.passageMcq.questions,
      ])
        await page
          .locator(
            `input[name="${question.id}"][value="${question.answerKey}"]`,
          )
          .check();
      for (const question of exam.reading.passageTrueFalse.questions)
        await page
          .locator("fieldset")
          .filter({ has: page.locator(`input[name="${question.id}"]`) })
          .getByLabel(question.answerKey === "T" ? "True" : "False", {
            exact: true,
          })
          .check();
      await nextSection(page, "Reading");
      await expect(page.locator("#R1")).toHaveCount(0);
      await expect(page.locator("#speaking-text-S1-1")).toHaveCount(0);
      for (const question of exam.writing.translation.items)
        await page
          .locator(`#${question.id}`)
          .fill(question.referenceTranslation);
      await page.locator("#email-answer").fill(exam.writing.email.modelAnswer);
      await nextSection(page, "Writing");
      await expect(page.locator("#W31")).toHaveCount(0);
      const answers = completedAnswers(exam);
      for (const [id, answer] of Object.entries(answers.speaking))
        await page.locator(`#speaking-text-${id}`).fill(answer.text);
      await page.getByRole("button", { name: /Nộp.*(đề|bài)/i }).click();
      await page
        .locator(".confirm-panel")
        .getByRole("button", { name: "Xác nhận nộp" })
        .click();
      await expect(page).toHaveURL(/\/results\//);
      await expect(page.locator(".total-score")).toContainText("7.50");
      await expect(
        page.getByText("Kết quả chấm mô phỏng", { exact: false }).first(),
      ).toBeVisible();
      await expect.poll(() => received.length).toBeGreaterThanOrEqual(4);
      received.forEach(assertPrivateFieldsAbsent);
      await page.screenshot({
        path: `test-results/unit-${exam.unit}-results-desktop.png`,
      });
      await page.getByRole("link", { name: "Lịch sử", exact: true }).click();
      await expect(page.locator(".history-row")).toHaveCount(1);
      await expect(page.locator(".history-row")).toContainText(exam.unitTitle);
      await expect(page.locator(".history-row")).toContainText("7.50");
      expect(errors).toEqual([]);
    });
  }
});

async function nextSection(page: Page, skill: string): Promise<void> {
  await page
    .getByRole("button", { name: new RegExp(`Nộp ${skill}`, "i") })
    .click();
  await page
    .locator(".confirm-panel")
    .getByRole("button", { name: "Xác nhận nộp" })
    .click();
  await expect(
    page.getByRole("button", { name: new RegExp(`Nộp ${skill}`, "i") }),
  ).toHaveCount(0);
}
