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

// Synthetic secrets only. Their punctuation makes URL/base64 cases distinct from plaintext.
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
  process.env.AI_MOCK = "0";
  process.env.AI_BASE_URL = "https://grading.test";
  process.env.AI_MODEL = "secret-test-model";
  process.env.AI_MODEL_FALLBACK = "secret-test-fallback";
  Object.assign(process.env, SECRETS);
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

type Candidate = WritingGrade | SpeakingGrade;
type TextField = {
  name: string;
  set: (candidate: Candidate, text: string) => void;
};
type GradingCase = {
  skill: string;
  candidate: () => Candidate;
  grade: () => Promise<Candidate>;
  validate: (candidate: Candidate) => unknown;
  fields: TextField[];
};

const gradingCases: GradingCase[] = [
  {
    skill: "Writing",
    candidate: writingCandidate,
    grade: () => gradeWriting(exam, writingAnswers),
    validate: (candidate) => validateWritingGrade(candidate, writingAnswers),
    fields: [
      ...[31, 32, 33, 34, 35].map((id, index) => ({
        name: `translations.W${id}.feedback`,
        set: (candidate: Candidate, text: string) => {
          (candidate as WritingGrade).translations[index].feedback = text;
        },
      })),
      {
        name: "email.feedback",
        set: (candidate, text) => {
          (candidate as WritingGrade).email.feedback = text;
        },
      },
      ...(["original", "corrected", "note"] as const).map((key) => ({
        name: `email.corrections.${key}`,
        set: (candidate: Candidate, text: string) => {
          (candidate as WritingGrade).email.corrections[0][key] = text;
        },
      })),
    ],
  },
  {
    skill: "Speaking",
    candidate: speakingCandidate,
    grade: () => gradeSpeaking(exam, speakingAnswers),
    validate: (candidate) => validateSpeakingGrade(candidate, speakingAnswers),
    fields: [
      {
        name: "feedback",
        set: (candidate, text) => {
          (candidate as SpeakingGrade).feedback = text;
        },
      },
      ...(["original", "corrected", "note"] as const).map((key) => ({
        name: `corrections.${key}`,
        set: (candidate: Candidate, text: string) => {
          (candidate as SpeakingGrade).corrections[0][key] = text;
        },
      })),
    ],
  },
];

function rawResponse(text: string): Response {
  return Response.json({
    candidates: [{ finishReason: "STOP", content: { parts: [{ text }] } }],
  });
}

function mockReplies(output: (attempt: number) => string) {
  let attempt = 0;
  return mock.method(
    globalThis,
    "fetch",
    async (_url: string | URL | Request, _init?: RequestInit) =>
      rawResponse(output(attempt++)),
  );
}

// Assert after grading: fetch assertion errors would otherwise be swallowed as API failures.
function assertRequests(
  fetchMock: ReturnType<typeof mockReplies>,
  forbiddenText: string,
) {
  for (const [attempt, call] of fetchMock.mock.calls.entries()) {
    const [url, init] = call.arguments;
    assert.equal(
      url,
      "https://grading.test/v1beta/models/secret-test-model:generateContent",
      "Invalid model output retries the same model, rather than switching to fallback.",
    );
    const body = init?.body as string;
    assert.equal(typeof body, "string");
    for (const secret of Object.values(SECRETS)) {
      assert.equal(
        body.includes(secret),
        false,
        "A secret must not enter the AI prompt.",
      );
    }
    assert.equal(
      body.includes("UNTRUSTED_MODEL_FEEDBACK"),
      false,
      "The retry prompt must not include rejected model output.",
    );
    assert.equal(body.includes(forbiddenText), false);
    if (attempt === 1) {
      assert.match(
        JSON.parse(body).systemInstruction.parts[0].text,
        /lần trước không hợp lệ/,
      );
    }
  }
}

async function assertRejectedTwice(
  gradingCase: GradingCase,
  field: TextField,
  secretText: string,
  serialize: (candidate: Candidate) => string = JSON.stringify,
) {
  const candidate = gradingCase.candidate();
  field.set(candidate, `UNTRUSTED_MODEL_FEEDBACK ${secretText} trailing text`);
  // These grades satisfy scoring/schema constraints: rejection must be due to the secret.
  assert.doesNotThrow(() => gradingCase.validate(candidate));
  const fetchMock = mockReplies(() => serialize(candidate));
  await assert.rejects(gradingCase.grade, (error: unknown) => {
    assert.ok(error instanceof AiGradingError);
    assert.equal(
      error.cause,
      undefined,
      "Do not attach a secret-bearing upstream cause.",
    );
    const publicError = `${error.message}\n${error.stack}\n${JSON.stringify(error)}`;
    for (const secret of [...Object.values(SECRETS), secretText]) {
      assert.equal(publicError.includes(secret), false);
    }
    return true;
  });
  assert.equal(fetchMock.mock.callCount(), 2, "Exactly one retry is allowed.");
  assertRequests(fetchMock, secretText);
}

for (const gradingCase of gradingCases) {
  for (const field of gradingCase.fields) {
    test(`${gradingCase.skill} rejects secret reflection in ${field.name}`, async () => {
      await assertRejectedTwice(gradingCase, field, SECRETS.AI_API_KEY);
    });
  }

  for (const [name, secret] of Object.entries(SECRETS)) {
    test(`${gradingCase.skill} rejects the server secret ${name}`, async () => {
      await assertRejectedTwice(gradingCase, gradingCase.fields[0], secret);
    });
  }

  const representations = [
    ["first 8 plaintext characters", SECRETS.AI_API_KEY.slice(0, 8)],
    ["middle 8 plaintext characters", SECRETS.AI_API_KEY.slice(13, 21)],
    ["last 8 plaintext characters", SECRETS.AI_API_KEY.slice(-8)],
    ["URL encoded full secret", encodeURIComponent(SECRETS.AI_API_KEY)],
    [
      "double URL encoded secret",
      encodeURIComponent(encodeURIComponent(SECRETS.AI_API_KEY)),
    ],
    [
      "fully URL encoded secret",
      [...Buffer.from(SECRETS.AI_API_KEY)]
        .map((byte) => `%${byte.toString(16).padStart(2, "0")}`)
        .join(""),
    ],
    [
      "URL encoded 8-character fragment",
      encodeURIComponent(SECRETS.AI_API_KEY.slice(13, 21)),
    ],
    ["base64 secret", Buffer.from(SECRETS.AI_API_KEY).toString("base64")],
    ["base64url secret", Buffer.from(SECRETS.AI_API_KEY).toString("base64url")],
    [
      "base64 8-character fragment",
      Buffer.from(SECRETS.AI_API_KEY.slice(13, 21)).toString("base64"),
    ],
    [
      "base64url 8-character fragment",
      Buffer.from(SECRETS.AI_API_KEY.slice(-8)).toString("base64url"),
    ],
    [
      "base64 session secret",
      Buffer.from(SECRETS.SESSION_SECRET).toString("base64"),
    ],
    ["URL encoded access code", encodeURIComponent(SECRETS.ACCESS_CODE)],
    [
      "truncated URL encoded prefix",
      encodeURIComponent(SECRETS.AI_API_KEY).slice(0, 18),
    ],
    [
      "truncated base64 prefix",
      Buffer.from(SECRETS.AI_API_KEY).toString("base64").slice(0, 16),
    ],
    [
      "truncated base64 suffix",
      Buffer.from(SECRETS.AI_API_KEY).toString("base64").slice(-16),
    ],
  ] as const;
  for (const [name, encoded] of representations) {
    test(`${gradingCase.skill} rejects ${name} in otherwise valid JSON`, async () => {
      await assertRejectedTwice(gradingCase, gradingCase.fields[0], encoded);
    });
  }

  test(`${gradingCase.skill} rejects JSON Unicode escapes after parsing`, async () => {
    const escaped = [...SECRETS.AI_API_KEY]
      .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`)
      .join("");
    await assertRejectedTwice(
      gradingCase,
      gradingCase.fields[0],
      SECRETS.AI_API_KEY,
      (candidate) =>
        JSON.stringify(candidate).replace(SECRETS.AI_API_KEY, escaped),
    );
  });

  test(`${gradingCase.skill} rejects a trimmed server secret`, async () => {
    process.env.AI_API_KEY = `  ${SECRETS.AI_API_KEY}  `;
    process.env.SESSION_SECRET = `\n${SECRETS.SESSION_SECRET}\n`;
    process.env.ACCESS_CODE = `\t${SECRETS.ACCESS_CODE}\t`;
    await assertRejectedTwice(
      gradingCase,
      gradingCase.fields[0],
      SECRETS.ACCESS_CODE,
    );
  });

  test(`${gradingCase.skill} rejects a JWT signature fragment`, async () => {
    const signature = "X8vC_7qB-6mN2rH9wZ5dS1pF4tJ0kL3a";
    process.env.AI_API_KEY = [
      Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url"),
      Buffer.from(
        '{"sub":"qx8Dk3Nm5Rv7Bw9","nonce":"c2Xr6Pj0Hs4Lf8Z"}',
      ).toString("base64url"),
      signature,
    ].join(".");
    await assertRejectedTwice(
      gradingCase,
      gradingCase.fields[0],
      signature.slice(10, 18),
    );
  });

  test(`${gradingCase.skill} can accept a clean retry without returning reflected secrets`, async () => {
    const first = gradingCase.candidate();
    gradingCase.fields
      .at(-1)!
      .set(first, `UNTRUSTED_MODEL_FEEDBACK ${SECRETS.SESSION_SECRET}`);
    const clean = gradingCase.candidate();
    assert.doesNotThrow(() => gradingCase.validate(first));
    const fetchMock = mockReplies((attempt) =>
      JSON.stringify(attempt === 0 ? first : clean),
    );
    const result = await gradingCase.grade();
    assert.deepEqual(result, clean);
    assert.equal(fetchMock.mock.callCount(), 2);
    assertRequests(fetchMock, SECRETS.SESSION_SECRET);
    assert.equal(
      JSON.stringify(result).includes("UNTRUSTED_MODEL_FEEDBACK"),
      false,
    );
  });

  test(`${gradingCase.skill} accepts clean feedback without retry`, async () => {
    const clean = gradingCase.candidate();
    gradingCase.fields[0].set(
      clean,
      "Có thể nhắc tên AI_API_KEY, SESSION_SECRET, ACCESS_CODE hoặc Bearer trong nhận xét.",
    );
    const fetchMock = mockReplies(() => JSON.stringify(clean));
    assert.deepEqual(await gradingCase.grade(), clean);
    assert.equal(fetchMock.mock.callCount(), 1);
    assertRequests(fetchMock, "not-present-in-prompt");
  });
}
