import {
  test,
  expect,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ANSWER_FIELDS, type UnitExam } from "../../src/types/exam";
import {
  emptyAnswers,
  type ExamAnswers,
  type ExamSession,
  type Skill,
} from "../../src/types/app";

const dataDir = process.env.E2E_DATA_DIR || "data/units";
const examFile = join(
  dataDir,
  existsSync(join(dataDir, "unit-6-A.json"))
    ? "unit-6-A.json"
    : "unit-6.sample.json",
);
const exam = JSON.parse(readFileSync(examFile, "utf8")) as UnitExam;
const sourceLabel = exam.source === "teacher" ? "Đề cô" : "Đề AI";
function assertStripped(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(assertStripped);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    expect([...ANSWER_FIELDS, "script"]).not.toContain(key);
    assertStripped(child);
  }
}
async function start(
  request: APIRequestContext,
  mode = "exam",
  scope = "full",
): Promise<ExamSession> {
  expect(
    (
      await request.post("/api/access", { data: { code: "local-e2e-code" } })
    ).status(),
  ).toBe(200);
  const response = await request.post("/api/session", {
    data: { unit: 6, test: "A", mode, scope },
  });
  expect(response.status()).toBe(200);
  const session: ExamSession = (await response.json()).session;
  expect(session.exam.unitTitle).toBe(exam.unitTitle);
  expect(session.exam.testId).toBe("A");
  expect(session.exam.source).toBe(exam.source);
  return session;
}
function completedAnswers(): ExamAnswers {
  const answers = emptyAnswers();
  for (const part of exam.listening.parts)
    for (const q of part.questions)
      answers.listening[q.id] =
        "answerKey" in q ? q.answerKey : q.acceptedAnswers[0];
  const r = exam.reading;
  for (const q of [
    ...r.matching.items,
    ...r.grammar,
    ...r.vocabulary,
    ...r.passageMcq.questions,
    ...r.passageTrueFalse.questions,
  ])
    answers.reading[q.id] = q.answerKey;
  answers.writing = {
    translations: Object.fromEntries(
      exam.writing.translation.items.map((q) => [q.id, q.referenceTranslation]),
    ),
    email: exam.writing.email.modelAnswer,
  };
  for (const id of ["S1-1", "S1-2", "S1-3"])
    answers.speaking[id] = {
      text: "If our team used a reliable video system, we would communicate more clearly and travel less.",
    };
  answers.speaking.S2 = { text: exam.speaking.parts[1].sampleAnswer };
  answers.speaking.S3 = { text: exam.speaking.parts[2].sampleAnswer };
  return answers;
}

test("session creation rejects missing, null and malformed test IDs without defaulting to A", async ({ request }) => {
  expect((await request.post("/api/access", {
    data: { code: "local-e2e-code" },
  })).status()).toBe(200);
  const base = { unit: 6, mode: "practice", scope: "reading" };
  for (const body of [
    base,
    { ...base, test: null },
    { ...base, test: "a" },
    { ...base, test: "Z" },
    { ...base, test: "" },
  ]) {
    const response = await request.post("/api/session", { data: body });
    expect(response.status()).toBe(400);
    expect((await response.json()).session).toBeUndefined();
  }
});

test("API enforces access, staged content, immutable submissions and listening quota", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/grade", {
        data: { sessionId: "fake", answers: emptyAnswers() },
      })
    ).status(),
  ).toBe(401);
  expect(
    (await request.post("/api/access", { data: { code: "wrong" } })).status(),
  ).toBe(401);
  let session = await start(request);
  expect(session.activeSkill).toBe("listening");
  expect(session.exam.reading).toBeUndefined();
  expect(session.exam.writing).toBeUndefined();
  expect(session.exam.speaking).toBeUndefined();
  assertStripped(session);
  expect(
    (await request.get(`/api/grade?sessionId=${session.sessionId}`)).status(),
  ).toBe(409);
  expect(
    (
      await request.post("/api/grade", {
        data: { sessionId: session.sessionId, answers: emptyAnswers() },
      })
    ).status(),
  ).toBe(409);
  expect(
    (
      await request.post("/api/section", {
        data: {
          sessionId: session.sessionId,
          skill: "reading",
          answers: emptyAnswers(),
        },
      })
    ).status(),
  ).toBe(409);
  for (const partId of ["A", "B"]) {
    for (let i = 0; i < 2; i++) {
      const response = await request.post("/api/listen", {
        data: { sessionId: session.sessionId, partId },
      });
      expect(response.status()).toBe(200);
      expect((await response.json()).playback.remaining).toBe(1 - i);
    }
    expect(
      (
        await request.post("/api/listen", {
          data: { sessionId: session.sessionId, partId },
        })
      ).status(),
    ).toBe(429);
  }
  const answers = completedAnswers();
  for (const [i, skill] of (
    ["listening", "reading", "writing"] as Skill[]
  ).entries()) {
    const response = await request.post("/api/section", {
      data: { sessionId: session.sessionId, skill, answers },
    });
    expect(response.status()).toBe(200);
    session = (await response.json()).session;
    expect(session.activeSkill).toBe(["reading", "writing", "speaking"][i]);
    assertStripped(session);
    expect(session.exam[skill]).toBeUndefined();
    expect(
      (
        await request.post("/api/section", {
          data: { sessionId: session.sessionId, skill, answers },
        })
      ).status(),
    ).toBe(409);
    expect(
      (
        await request.post("/api/listen", {
          data: { sessionId: session.sessionId, partId: "A" },
        })
      ).status(),
    ).toBe(403);
    expect(
      (await request.get(`/api/grade?sessionId=${session.sessionId}`)).status(),
    ).toBe(409);
  }
  // Submitted answers cannot be replaced by a modified final request.
  answers.listening = {};
  answers.reading = {};
  answers.writing = { translations: {}, email: "" };
  const final = await request.post("/api/grade", {
    data: { sessionId: session.sessionId, answers },
  });
  expect(final.status()).toBe(200);
  const { result } = await final.json();
  expect(result.skills.listening.score).toBe(2.5);
  expect(result.skills.reading.score).toBe(2.5);
  expect(result.skills.writing.score).toBe(1.25);
  expect(result.total).toBe(7.5);
  expect(result.mock).toBe(true);
  expect(result.review.writing.email.modelAnswer).toBe(
    exam.writing.email.modelAnswer,
  );
  const repeat = await request.post("/api/grade", {
    data: { sessionId: session.sessionId, answers: emptyAnswers() },
  });
  expect((await repeat.json()).result).toEqual(result);
  expect(
    (
      await request.post("/api/grade", {
        data: { sessionId: session.sessionId, mode: "practice", answers },
      })
    ).status(),
  ).toBe(400);
});

test("browser completes a full sequential Unit 6, shows reviews and clears history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const received: unknown[] = [];
  page.on("response", async (response) => {
    if (
      /\/api\/(session|section)(?:\?|$)/.test(response.url()) &&
      response.ok()
    )
      received.push(await response.json());
  });
  await page.goto("/");
  await page.getByLabel("Mã truy cập", { exact: true }).fill("local-e2e-code");
  await page.getByRole("button", { name: "Vào luyện tập" }).click();
  await expect(page.locator(".unit-card")).toHaveCount(8);
  for (let unit = 1; unit <= 8; unit++) {
    const link = page.getByRole("link", { name: `Vào Unit ${unit}`, exact: true });
    await expect(link).toHaveText("Vào Unit");
    await expect(link).toHaveAccessibleName(`Vào Unit ${unit}`);
  }
  await page
    .getByRole("link", { name: "Vào Unit 6", exact: true })
    .click();
  await page.getByRole("button", { name: "Thi thử", exact: true }).click();
  const testCard = page.locator('.test-card[data-test-id="A"]');
  await expect(testCard.getByText(sourceLabel, { exact: true })).toBeVisible();
  await expect(testCard.getByRole("link", { name: "Tải PDF đề", exact: true })).toHaveAttribute("href", "/api/pdf?unit=6&test=A&kind=exam");
  await testCard.getByRole("button", { name: "Thi cả đề", exact: true }).click();
  await expect(page).toHaveURL(/\/exam\//);
  await expect(page.locator(".exam-title-row")).toContainText("Đề A");
  await expect(page.locator(".exam-title-row")).toContainText(sourceLabel);
  for (const q of exam.listening.parts[0].questions)
    await page.locator(`input[name="${q.id}"][value="${q.answerKey}"]`).check();
  for (const q of exam.listening.parts[1].questions)
    await page.locator(`#${q.id}`).fill(q.acceptedAnswers[0]);
  await nextSection(page, "Listening");
  await expect(page.locator("#W31")).toHaveCount(0);
  for (const q of exam.reading.matching.items)
    await page.locator(`#${q.id}`).selectOption(q.answerKey);
  for (const q of [...exam.reading.grammar, ...exam.reading.vocabulary])
    await page.locator(`input[name="${q.id}"][value="${q.answerKey}"]`).check();
  await page
    .getByRole("tab", { name: "Part 2: Đọc hiểu", exact: true })
    .click();
  for (const q of exam.reading.passageMcq.questions)
    await page.locator(`input[name="${q.id}"][value="${q.answerKey}"]`).check();
  await page
    .getByRole("tab", { name: "Part 2: True/False", exact: true })
    .click();
  for (const q of exam.reading.passageTrueFalse.questions)
    await page
      .locator(`fieldset`)
      .filter({ has: page.locator(`input[name="${q.id}"]`) })
      .getByLabel(q.answerKey === "T" ? "True" : "False", { exact: true })
      .check();
  await nextSection(page, "Reading");
  for (const q of exam.writing.translation.items)
    await page.locator(`#${q.id}`).fill(q.referenceTranslation);
  await page.locator("#email-answer").fill(exam.writing.email.modelAnswer);
  await nextSection(page, "Writing");
  const answers = completedAnswers();
  for (const [id, answer] of Object.entries(answers.speaking))
    await page.locator(`#speaking-text-${id}`).fill(answer.text);
  await page.getByRole("button", { name: /Nộp.*(đề|bài)/i }).click();
  await page
    .locator(".confirm-panel")
    .getByRole("button", { name: "Xác nhận nộp" })
    .click();
  await expect(page).toHaveURL(/\/results\//);
  await expect(page.locator(".page-heading")).toContainText("Đề A");
  await expect(page.locator(".page-heading")).toContainText(sourceLabel);
  await expect(page.locator(".total-score")).toContainText("7.50");
  await expect(
    page.getByText("Kết quả chấm mô phỏng", { exact: false }).first(),
  ).toBeVisible();
  expect(received.length).toBeGreaterThanOrEqual(4);
  received.forEach(assertStripped);
  expect(JSON.stringify(received)).not.toContain("e2e-never-expose-this-key");
  await page.screenshot({ path: "test-results/unit-6-results-desktop.png" });
  await page
    .getByRole("navigation", { name: "Chi tiết kết quả" })
    .getByRole("button", { name: "Writing", exact: true })
    .click();
  await expect(
    page.getByText("Tiêu chí chấm email", { exact: true }),
  ).toBeVisible();
  await page.getByText("Email mẫu tham khảo", { exact: true }).click();
  await expect(
    page.getByText(exam.writing.email.modelAnswer, { exact: true }).last(),
  ).toBeVisible();
  await page.getByRole("link", { name: "Lịch sử", exact: true }).click();
  await expect(page.locator(".history-row")).toHaveCount(1);
  await expect(page.locator(".history-row")).toContainText("Đề A");
  await expect(page.locator(".history-row")).toContainText(sourceLabel);
  await page.getByRole("button", { name: "Xoá tất cả", exact: true }).click();
  await page.getByRole("button", { name: "Xoá lịch sử", exact: true }).click();
  await expect(page.locator(".history-row")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".unit-card")).toHaveCount(8);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "test-results/unit-6-home-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
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

test("practice permits an individual skill and Chromium recording reaches the server as WAV mono 16 kHz", async ({
  page,
}) => {
  const session = await start(page.request, "practice", "speaking");
  await page.goto(`/exam/${session.sessionId}`);
  await page
    .getByRole("button", { name: "Bắt đầu ghi âm", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Dừng ghi âm", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".recording-time").first()).toContainText("00:01");
  await page.getByRole("button", { name: "Dừng ghi âm", exact: true }).click();
  await expect(page.getByText("Đã có bản ghi", { exact: true })).toBeVisible();
  const answers = completedAnswers();
  for (const [id, answer] of Object.entries(answers.speaking))
    await page.locator(`#speaking-text-${id}`).fill(answer.text);
  await page
    .getByRole("button", { name: "NỘP BÀI", exact: true })
    .click();
  const submitted = page.waitForRequest(
    (req) => req.url().endsWith("/api/grade") && req.method() === "POST",
  );
  await page
    .locator(".confirm-panel")
    .getByRole("button", { name: "Xác nhận nộp" })
    .click();
  const payload = (await submitted).postDataJSON();
  const audio = payload.answers.speaking["S1-1"].audio;
  expect(audio.mimeType).toBe("audio/wav");
  const wav = Buffer.from(audio.data, "base64");
  expect(wav.toString("latin1", 0, 4)).toBe("RIFF");
  expect(wav.readUInt16LE(22)).toBe(1);
  expect(wav.readUInt32LE(24)).toBe(16000);
  expect(wav.readUInt16LE(34)).toBe(16);
  expect(wav.length).toBeGreaterThan(44);
  await expect(page).toHaveURL(/\/results\//);
  await expect(page.locator(".total-score")).toContainText("1.25");
  const response = await page.request.get(
    `/api/grade?sessionId=${session.sessionId}`,
  );
  const { result } = await response.json();
  expect(Object.keys(result.skills)).toEqual(["speaking"]);
  expect(result.skills.speaking.speaking.pronunciationAssessed).toBe(false);
  expect(JSON.stringify(result)).not.toContain("audio/webm");
});

test("PDF downloads require the class access code and serve separate exam and answer files", async ({ request }) => {
  const examUrl = "/api/pdf?unit=6&test=A&kind=exam";
  expect((await request.get(examUrl)).status()).toBe(401);
  await start(request, "practice", "reading");
  for (const kind of ["exam", "answers"] as const) {
    const response = await request.get(`/api/pdf?unit=6&test=A&kind=${kind}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/pdf");
    expect(response.headers()["content-disposition"]).toContain(`Unit-6-Test-A-${kind === "exam" ? "Exam" : "Answers"}.pdf`);
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
  expect((await request.get("/api/pdf?unit=6&test=Z&kind=exam")).status()).toBe(400);
  expect((await request.get("/api/pdf?unit=6&test=A&kind=transcript")).status()).toBe(400);
});

test("sequential question navigation locks future and submitted skills", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  const session = await start(page.request);
  await page.goto(`/exam/${session.sessionId}`);
  await expect(
    page.getByRole("button", { name: "Tới câu L1", exact: true }),
  ).toBeEnabled();
  for (const id of ["R16", "W31", "Email", "S1", "S2", "S3"])
    await expect(
      page.getByRole("button", { name: `Tới câu ${id}`, exact: true }),
    ).toBeDisabled();
  await expect(page.locator('input[name="R16"]')).toHaveCount(0);
  await nextSection(page, "Listening");
  await expect(
    page.getByRole("button", { name: "Tới câu L1", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Tới câu R16", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Tới câu W31", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Tới câu R16", exact: true }).click();
  await expect(page.locator('input[name="R16"]').first()).toBeVisible();
  await expect(page.locator('input[name="R16"]').first()).toBeFocused();
  await expect(page.locator('input[name="L1"]')).toHaveCount(0);
});

test("practice question navigation opens the correct skill and Reading part without losing answers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  const session = await start(page.request, "practice", "full");
  await page.goto(`/exam/${session.sessionId}`);
  const firstReading = exam.reading.passageMcq.questions[0];
  const readingNavigation = page.getByRole("button", {
    name: `Tới câu ${firstReading.id}`,
    exact: true,
  });
  await readingNavigation.click();
  await expect(readingNavigation).toHaveAttribute("aria-current", "true");
  await expect(
    page.getByRole("tab", { name: "Part 2: Đọc hiểu", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const readingAnswer = page.locator(
    `input[name="${firstReading.id}"][value="${firstReading.answerKey}"]`,
  );
  await expect(page.locator(`input[name="${firstReading.id}"]`).first()).toBeFocused();
  await expect(page.locator(`#question-${firstReading.id} .question-id`)).toHaveText(firstReading.id);
  await readingAnswer.check();
  await expect(readingNavigation).toHaveClass(/\banswered\b/);
  await expect(page.locator("#R1")).toHaveCount(0);
  await expect(
    page.locator(`input[name="${exam.reading.passageTrueFalse.questions[0].id}"]`),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Tới câu L1", exact: true }).click();
  await expect(page.locator('input[name="L1"]').first()).toBeVisible();
  await expect(page.locator('input[name="L1"]').first()).toBeFocused();
  await expect(page.locator("#question-L1 .question-id")).toHaveText("L1");
  await expect(readingAnswer).toHaveCount(0);
  await expect(readingNavigation).toHaveClass(/\banswered\b/);
  await readingNavigation.click();
  await expect(readingAnswer).toBeChecked();
  await expect(page.locator(`input[name="${firstReading.id}"]`).first()).toBeFocused();
  const firstTrueFalse = exam.reading.passageTrueFalse.questions[0];
  await page
    .getByRole("button", { name: `Tới câu ${firstTrueFalse.id}`, exact: true })
    .click();
  await expect(
    page.getByRole("tab", { name: "Part 2: True/False", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.locator(`input[name="${firstTrueFalse.id}"]`).first(),
  ).toBeVisible();
  await expect(
    page.locator(`input[name="${firstTrueFalse.id}"]`).first(),
  ).toBeFocused();
  await expect(readingAnswer).toHaveCount(0);
  await page.getByRole("button", { name: "Tới câu R1", exact: true }).click();
  await expect(page.locator("#R1")).toBeVisible();
  await expect(page.locator("#R1")).toBeFocused();
  await page.getByRole("button", { name: "Tới câu W31", exact: true }).click();
  await expect(page.locator("#W31")).toBeVisible();
  await expect(page.locator("#W31")).toBeFocused();
  await page.getByRole("button", { name: "Tới câu Email", exact: true }).click();
  await expect(page.locator("#email-answer")).toBeInViewport();
  await expect(page.locator("#email-answer")).toBeFocused();
  await page.getByRole("button", { name: "Tới câu S2", exact: true }).click();
  await expect(page.locator("#question-S2")).toBeInViewport();
  await expect(page.locator("#speaking-text-S2")).toBeFocused();
});

test("exiting an unfinished practice asks for confirmation and keeps the draft", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  const session = await start(page.request, "practice", "listening");
  const url = `/exam/${session.sessionId}`;
  await page.goto(url);
  const question = exam.listening.parts[1].questions[0];
  const draft = "my saved draft";
  await page.locator(`#${question.id}`).fill(draft);
  await expect(
    page.getByRole("button", { name: `Tới câu ${question.id}`, exact: true }),
  ).toHaveClass(/\banswered\b/);
  const exit = page.getByRole("button", { name: "Thoát", exact: true });
  await exit.click();
  const confirmation = page.getByRole("alertdialog", {
    name: "Thoát bài chưa nộp?",
    exact: true,
  });
  await expect(confirmation).toBeVisible();
  await confirmation
    .getByRole("button", { name: "Tiếp tục làm bài", exact: true })
    .click();
  await expect(confirmation).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`/exam/${session.sessionId}$`));
  await expect(page.locator(`#${question.id}`)).toHaveValue(draft);
  await expect(exit).toBeFocused();
  await exit.click();
  await confirmation
    .getByRole("button", { name: "Xác nhận thoát", exact: true })
    .click();
  await expect(page).toHaveURL(/\/unit\/6$/);
  await page.goto(url);
  await expect(page.locator(`#${question.id}`)).toHaveValue(draft);
  await expect(
    page.getByRole("button", { name: `Tới câu ${question.id}`, exact: true }),
  ).toHaveClass(/\banswered\b/);
});

test("mobile question sheet navigates Reading and retains the selected theme on reload", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  const session = await start(page.request, "practice", "full");
  await page.goto(`/exam/${session.sessionId}`);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("button", { name: "Chuyển sang chế độ tối", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("timer")).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "NỘP BÀI", exact: true }),
  ).toBeInViewport();
  const list = page.getByRole("button", { name: "Danh sách câu", exact: true });
  const sheet = page.getByRole("dialog", { name: "Danh sách câu", exact: true });
  const questionId = exam.reading.passageMcq.questions[0].id;
  await list.click();
  await expect(sheet).toBeVisible();
  await sheet
    .getByRole("button", { name: `Tới câu ${questionId}`, exact: true })
    .click();
  await expect(sheet).toHaveCount(0);
  await expect(page.locator(`#question-${questionId}`)).toBeInViewport();
  await expect(page.locator(`input[name="${questionId}"]`).first()).toBeFocused();
  await expect(
    page.getByRole("tab", { name: "Part 2: Đọc hiểu", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(390);
  await list.click();
  await sheet.getByRole("button", { name: "Đóng", exact: true }).click();
  await expect(sheet).toHaveCount(0);
  await expect(list).toBeFocused();
  await list.click();
  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
  await expect(list).toBeFocused();
});

test("desktop Reading scrolls the passage and questions independently", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 600 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const session = await start(page.request, "practice", "reading");
  await page.goto(`/exam/${session.sessionId}`);
  await page.getByRole("tab", { name: "Part 2: Đọc hiểu", exact: true }).click();
  const passage = page.locator(".reading-passage-pane");
  const questions = page.locator(".reading-question-pane");
  await expect(passage).toBeVisible();
  await expect(questions).toBeVisible();
  const passageBox = await passage.boundingBox();
  const questionsBox = await questions.boundingBox();
  expect(passageBox).not.toBeNull();
  expect(questionsBox).not.toBeNull();
  expect(passageBox!.x + passageBox!.width).toBeLessThanOrEqual(questionsBox!.x);
  expect(Math.abs(passageBox!.y - questionsBox!.y)).toBeLessThan(2);
  for (const pane of [passage, questions]) {
    await expect
      .poll(() => pane.evaluate((element) => element.scrollHeight - element.clientHeight))
      .toBeGreaterThan(0);
    await expect(pane).toHaveCSS("overflow-y", "auto");
  }
  await questions.hover({ position: { x: 20, y: 20 } });
  const pageScroll = await page.evaluate(() => window.scrollY);
  const passageScroll = await passage.evaluate((element) => element.scrollTop);
  await page.mouse.wheel(0, 320);
  await expect
    .poll(() => questions.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await expect
    .poll(() => passage.evaluate((element) => element.scrollTop))
    .toBe(passageScroll);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(pageScroll);
  const questionsScroll = await questions.evaluate((element) => element.scrollTop);
  await passage.hover({ position: { x: 20, y: 20 } });
  await page.mouse.wheel(0, 220);
  await expect
    .poll(() => passage.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(passageScroll);
  await expect
    .poll(() => questions.evaluate((element) => element.scrollTop))
    .toBe(questionsScroll);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(pageScroll);
});
