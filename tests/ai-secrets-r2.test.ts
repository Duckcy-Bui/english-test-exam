import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, mock, test } from "node:test";
import {
  AiGradingError,
  gradeSpeaking,
  gradeWriting,
  validateSpeakingGrade,
  validateWritingGrade,
} from "../src/server/ai";
import type { ExamAnswers } from "../src/types/app";
import type { SpeakingGrade, UnitExam, WritingGrade } from "../src/types/exam";

// These values are synthetic and deliberately contain punctuation throughout.
const SECRETS = {
  AI_API_KEY: "SkX8.+Yp-24/Qv9&Nw=6Tz:_1Hc?73rB",
  SESSION_SECRET: "HsP5~Dq7/Qc9&Lz=2Vm:_8Xe?4Br+6Nf",
  ACCESS_CODE: "UcW2.Kn8/Hd5&Rt=9Vx:_3Jm?7Zq+1Lp",
} as const;
const ENV_KEYS = [
  "AI_MOCK",
  "AI_API_KEY",
  "AI_BASE_URL",
  "AI_MODEL",
  "AI_MODEL_FALLBACK",
  "SESSION_SECRET",
  "ACCESS_CODE",
] as const;
let previousEnvironment: Record<string, string | undefined>;

beforeEach(() => {
  previousEnvironment = Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, SECRETS, {
    AI_MOCK: "0",
    AI_BASE_URL: "https://grading.test",
    AI_MODEL: "secret-r2-model",
    AI_MODEL_FALLBACK: "secret-r2-fallback",
  });
});

afterEach(() => {
  mock.restoreAll();
  for (const key of ENV_KEYS) {
    const previous = previousEnvironment[key];
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
});

const exam: UnitExam = JSON.parse(
  readFileSync(
    new URL("../fixtures/unit-6.sample.json", import.meta.url),
    "utf8",
  ),
);
const writingAnswers: ExamAnswers["writing"] = {
  translations: Object.fromEntries(
    [31, 32, 33, 34, 35].map((id) => [`W${id}`, "Bản dịch đã hoàn thành."]),
  ),
  email: Array.from({ length: 80 }, () => "equipment").join(" "),
};
const speakingAnswers: ExamAnswers["speaking"] = Object.fromEntries(
  ["S1-1", "S1-2", "S1-3", "S2", "S3"].map((id) => [
    id,
    { text: "If we bought this system, we would save time." },
  ]),
);

type Candidate = WritingGrade | SpeakingGrade;
type GradingCase = {
  skill: string;
  candidate: () => Candidate;
  grade: () => Promise<Candidate>;
  validate: (candidate: Candidate) => unknown;
  setFeedback: (candidate: Candidate, text: string) => void;
  setTextFields: (candidate: Candidate, pieces: string[]) => void;
};

function writingCandidate(): WritingGrade {
  return {
    translations: [31, 32, 33, 34, 35].map((id) => ({
      id: `W${id}`,
      score: 0.25,
      feedback: "Bản dịch đúng ý.",
    })),
    email: {
      steps: 0.5,
      layout: 0.25,
      grammar: 0.25,
      vocabulary: 0.25,
      wordCount: 80,
      feedback: "Bài viết đáp ứng yêu cầu.",
      corrections: [
        {
          original: "would saves",
          corrected: "would save",
          note: "Dùng động từ nguyên thể sau would.",
        },
      ],
    },
  };
}

function speakingCandidate(): SpeakingGrade {
  return {
    task: 0.625,
    unitGrammar: 0.625,
    vocabulary: 0.625,
    fluency: 0.625,
    pronunciationAssessed: false,
    feedback: "Trả lời đủ ý; chưa đánh giá phát âm khi chỉ có bản chữ.",
    corrections: [
      {
        original: "would saves",
        corrected: "would save",
        note: "Dùng động từ nguyên thể sau would.",
      },
    ],
  };
}

const gradingCases: GradingCase[] = [
  {
    skill: "Writing",
    candidate: writingCandidate,
    grade: () => gradeWriting(exam, writingAnswers),
    validate: (candidate) => validateWritingGrade(candidate, writingAnswers),
    setFeedback: (candidate, text) => {
      (candidate as WritingGrade).email.feedback = text;
    },
    setTextFields: (candidate, pieces) => {
      const email = (candidate as WritingGrade).email;
      email.feedback = pieces[0];
      email.corrections = [];
      for (let i = 1; i < pieces.length; i += 3)
        email.corrections.push({
          original: pieces[i],
          corrected: pieces[i + 1] ?? "Sửa câu.",
          note: pieces[i + 2] ?? "Ghi chú.",
        });
    },
  },
  {
    skill: "Speaking",
    candidate: speakingCandidate,
    grade: () => gradeSpeaking(exam, speakingAnswers),
    validate: (candidate) => validateSpeakingGrade(candidate, speakingAnswers),
    setFeedback: (candidate, text) => {
      (candidate as SpeakingGrade).feedback = text;
    },
    setTextFields: (candidate, pieces) => {
      const speaking = candidate as SpeakingGrade;
      speaking.feedback = pieces[0];
      speaking.corrections = [];
      for (let i = 1; i < pieces.length; i += 3)
        speaking.corrections.push({
          original: pieces[i],
          corrected: pieces[i + 1] ?? "Sửa câu.",
          note: pieces[i + 2] ?? "Ghi chú.",
        });
    },
  },
];

function chunks(text: string, width: number): string[] {
  const result: string[] = [];
  for (let at = 0; at < text.length; at += width) {
    result.push(text.slice(at, at + width));
  }
  return result;
}

function percentBytes(text: string): string[] {
  return [...Buffer.from(text)].map(
    (byte) => `%${byte.toString(16).padStart(2, "0")}`,
  );
}

const representations: Array<{
  name: string;
  encode: (secret: string) => string;
}> = [
  {
    name: "spaces between characters",
    encode: (secret) => [...secret].join(" "),
  },
  {
    name: "newlines between characters",
    encode: (secret) => [...secret].join("\n"),
  },
  {
    name: "tabs between characters",
    encode: (secret) => [...secret].join("\t"),
  },
  {
    name: "line-wrapped base64 in four-character chunks",
    encode: (secret) =>
      chunks(Buffer.from(secret).toString("base64"), 4).join("\n"),
  },
  {
    name: "spaces between percent-encoded bytes",
    encode: (secret) => percentBytes(secret).join(" "),
  },
  {
    name: "newlines between literal Unicode escapes",
    encode: (secret) =>
      [...secret]
        .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`)
        .join("\n"),
  },
  {
    name: "removed punctuation",
    encode: (secret) => secret.replace(/[^A-Za-z0-9]/g, ""),
  },
  {
    name: "removed punctuation plus mixed whitespace",
    encode: (secret) => [...secret.replace(/[^A-Za-z0-9]/g, "")].join(" \n\t"),
  },
];

function mockReplies(output: (attempt: number) => Candidate) {
  let attempt = 0;
  return mock.method(
    globalThis,
    "fetch",
    async (_url: string | URL | Request, _init?: RequestInit) =>
      Response.json({
        candidates: [
          {
            finishReason: "STOP",
            content: { parts: [{ text: JSON.stringify(output(attempt++)) }] },
          },
        ],
      }),
  );
}

// Check outside mocked fetch, since grading deliberately catches upstream failures.
function assertSafeRetryRequests(fetchMock: ReturnType<typeof mockReplies>) {
  const bodies = fetchMock.mock.calls.map((call) => {
    const [url, init] = call.arguments;
    assert.equal(
      url,
      "https://grading.test/v1beta/models/secret-r2-model:generateContent",
    );
    const body = init?.body as string;
    for (const secret of Object.values(SECRETS)) {
      assert.equal(body.includes(secret), false);
      assert.equal(body.includes([...secret].join(" ")), false);
    }
    assert.equal(body.includes("REJECTED_MODEL_OUTPUT_R2"), false);
    return JSON.parse(body);
  });
  if (bodies.length === 2) {
    assert.deepEqual(bodies[1].contents, bodies[0].contents);
    assert.deepEqual(bodies[1].generationConfig, bodies[0].generationConfig);
    assert.match(
      bodies[1].systemInstruction.parts[0].text,
      /lần trước không hợp lệ/,
    );
  }
}

async function assertRejectedTwice(
  gradingCase: GradingCase,
  candidate: Candidate,
) {
  // The candidate is otherwise valid: field splitting/encoding must cause rejection.
  assert.doesNotThrow(() => gradingCase.validate(candidate));
  const fetchMock = mockReplies(() => candidate);
  await assert.rejects(gradingCase.grade, (error: unknown) => {
    assert.ok(error instanceof AiGradingError);
    assert.equal(error.cause, undefined);
    const publicError = `${error.message}\n${error.stack}\n${JSON.stringify(error)}`;
    for (const secret of Object.values(SECRETS)) {
      assert.equal(publicError.includes(secret), false);
      assert.equal(
        publicError.includes(secret.replace(/[^A-Za-z0-9]/g, "")),
        false,
      );
    }
    assert.equal(publicError.includes("REJECTED_MODEL_OUTPUT_R2"), false);
    return true;
  });
  assert.equal(
    fetchMock.mock.callCount(),
    2,
    "Reject the whole output after exactly one retry.",
  );
  assertSafeRetryRequests(fetchMock);
}

for (const gradingCase of gradingCases) {
  for (const [name, secret] of Object.entries(SECRETS)) {
    for (const representation of representations) {
      test(`${gradingCase.skill} rejects ${name}: ${representation.name}`, async () => {
        const candidate = gradingCase.candidate();
        gradingCase.setFeedback(
          candidate,
          `REJECTED_MODEL_OUTPUT_R2 ${representation.encode(secret)}`,
        );
        await assertRejectedTwice(gradingCase, candidate);
      });
    }

    for (const reverse of [false, true]) {
      test(`${gradingCase.skill} rejects ${name} in four-character pieces across text fields${reverse ? " in reverse order" : ""}`, async () => {
        const candidate = gradingCase.candidate();
        const pieces = chunks(secret.slice(0, 16), 4);
        assert.equal(pieces.length, 4);
        assert.ok(pieces.every((piece) => piece.length === 4));
        gradingCase.setTextFields(
          candidate,
          reverse ? pieces.reverse() : pieces,
        );
        await assertRejectedTwice(gradingCase, candidate);
      });
      for (const encoding of ["raw", "base64", "base64url"] as const) {
        test(`${gradingCase.skill} rejects full ${name} split into four-character ${encoding} fields${reverse ? " reversed" : ""}`, async () => {
          const candidate = gradingCase.candidate();
          const encoded =
            encoding === "raw"
              ? secret
              : Buffer.from(secret).toString(encoding);
          const pieces = chunks(encoded, 4);
          assert.ok(pieces.every((piece) => piece.length <= 4));
          gradingCase.setTextFields(
            candidate,
            reverse ? pieces.reverse() : pieces,
          );
          await assertRejectedTwice(gradingCase, candidate);
        });
      }
    }
  }

  test(`${gradingCase.skill} returns only a clean second candidate after a split-secret first candidate`, async () => {
    const tainted = gradingCase.candidate();
    gradingCase.setTextFields(
      tainted,
      chunks(SECRETS.SESSION_SECRET.slice(0, 16), 4),
    );
    const clean = gradingCase.candidate();
    assert.doesNotThrow(() => gradingCase.validate(tainted));
    const fetchMock = mockReplies((attempt) =>
      attempt === 0 ? tainted : clean,
    );
    assert.deepEqual(await gradingCase.grade(), clean);
    assert.equal(fetchMock.mock.callCount(), 2);
    assertSafeRetryRequests(fetchMock);
  });

  test(`${gradingCase.skill} accepts ordinary feedback containing whitespace and punctuation`, async () => {
    const clean = gradingCase.candidate();
    gradingCase.setFeedback(
      clean,
      "Kiểm tra camera.\nSau đó, bật micro:\ttrình bày rõ từng bước!",
    );
    const fetchMock = mockReplies(() => clean);
    assert.deepEqual(await gradingCase.grade(), clean);
    assert.equal(fetchMock.mock.callCount(), 1);
    assertSafeRetryRequests(fetchMock);
  });
}
