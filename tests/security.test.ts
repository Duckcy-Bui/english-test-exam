import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { pcmToWav } from "../src/client/audio";
import { ANSWER_FIELDS, type UnitExam } from "../src/types/exam";
import {
  MAX_AUDIO_BYTES,
  MAX_AUDIO_SECONDS,
  emptyAnswers,
} from "../src/types/app";
import { parseAnswers, validateWav } from "../src/server/answers";
import { publicExam, stripPrivate } from "../src/server/data";
import { AppError } from "../src/server/errors";
import { gradeSession } from "../src/server/grading";
import type { ServerSession } from "../src/server/sessions";
import {
  authenticated,
  authorize,
  checkCode,
  clientIp,
  deviceId,
  issueAuth,
  issueDevice,
  reserveAi,
} from "../src/server/security";

const status = (expected: number) => (error: unknown) =>
  error instanceof AppError && error.status === expected;
function withEnv<T>(
  values: Record<string, string | undefined>,
  run: () => T,
): T {
  const saved = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  );
  try {
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    return run();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}
function withQuota(
  run: (databasePath: string) => void,
  limits: Record<string, string | undefined> = {},
) {
  const directory = mkdtempSync(join(tmpdir(), "et-quota-test-"));
  const path = join(directory, "quota.sqlite");
  try {
    withEnv(
      {
        ACCESS_CODE: "fixture-access-code",
        SESSION_SECRET: "fixture-secret",
        RATE_LIMIT_DB: path,
        TRUST_PROXY: "0",
        RATE_LIMIT_PER_DEVICE: undefined,
        RATE_LIMIT_PER_IP: undefined,
        ...limits,
      },
      () => run(path),
    );
  } finally {
    const state = globalThis as typeof globalThis & {
      etQuotaDb?: { path: string; db: DatabaseSync };
    };
    if (state.etQuotaDb?.path === path) {
      state.etQuotaDb.db.close();
      delete state.etQuotaDb;
    }
    rmSync(directory, { recursive: true, force: true });
  }
}
function request(cookie?: string, ip?: string): Request {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  if (ip) headers.set("x-forwarded-for", ip);
  return new Request("http://localhost/api/grade", { headers });
}
function asAudio(wav: Buffer) {
  return { mimeType: "audio/wav", data: wav.toString("base64") };
}
function validWav() {
  return Buffer.from(pcmToWav(new Float32Array([0, -0.5, 0.5, 0])));
}

test("public exam recursively removes every answer field, private notes and listening scripts", () => {
  const exam = JSON.parse(
    readFileSync(
      new URL("../fixtures/unit-6.sample.json", import.meta.url),
      "utf8",
    ),
  ) as UnitExam;
  const stripped = publicExam(exam);
  const hidden = new Set<string>([...ANSWER_FIELDS, "script", "sourceNotes"]);
  const inspect = (value: unknown) => {
    if (Array.isArray(value)) value.forEach(inspect);
    else if (value && typeof value === "object") {
      for (const [key, nested] of Object.entries(value)) {
        assert.equal(hidden.has(key), false, `private field ${key} escaped`);
        inspect(nested);
      }
    }
  };
  inspect(stripped);
  assert.equal(stripped.reading.grammar[0].stem, exam.reading.grammar[0].stem);
  assert.equal(stripped.listening.parts[0].questions.length, 5);
  assert.ok(
    exam.listening.parts[0].script.length > 0,
    "source must remain intact",
  );
  assert.ok(
    exam.reading.grammar[0].answerKey,
    "source answers must remain intact",
  );
  const nested = {
    keep: [
      null,
      42,
      {
        keep: "visible",
        ...Object.fromEntries([...hidden].map((key) => [key, "SECRET"])),
      },
    ],
  };
  assert.deepEqual(stripPrivate(nested), {
    keep: [null, 42, { keep: "visible" }],
  });
});

test("post-submit review preserves answers and scripts but removes nested source notes", async () => {
  const exam = JSON.parse(
    readFileSync(
      new URL("../fixtures/unit-6.sample.json", import.meta.url),
      "utf8",
    ),
  ) as UnitExam;
  Object.assign(exam.reading.grammar[0], {
    sourceNotes: ["PRIVATE QUESTION NOTE"],
  });
  Object.assign(exam.listening.parts[0].script[0], {
    sourceNotes: ["PRIVATE SCRIPT NOTE"],
  });
  Object.assign(exam.writing.email, {
    sourceNotes: { nested: ["PRIVATE EMAIL NOTE"] },
  });
  Object.assign(exam.speaking.parts[1], {
    sourceNotes: ["PRIVATE SPEAKING NOTE"],
  });
  const session: ServerSession = {
    id: "post-submit-fixture",
    device: "fixture-device",
    exam,
    mode: "practice",
    scope: "full",
    started: Date.now(),
    expires: null,
    deleteAt: Date.now() + 60_000,
    listens: { A: 0, B: 0 },
    status: "grading",
    completed: [],
    answers: emptyAnswers(),
  };
  const mock = process.env.AI_MOCK;
  try {
    process.env.AI_MOCK = "1";
    const result = await gradeSession(session, emptyAnswers());
    const inspect = (value: unknown) => {
      if (Array.isArray(value)) value.forEach(inspect);
      else if (value && typeof value === "object") {
        for (const [key, child] of Object.entries(value)) {
          assert.notEqual(key, "sourceNotes");
          inspect(child);
        }
      }
    };
    inspect(result);
    assert.equal(
      result.review.reading?.grammar[0].answerKey,
      exam.reading.grammar[0].answerKey,
    );
    assert.equal(
      result.review.listening?.parts[0].script[0].text,
      exam.listening.parts[0].script[0].text,
    );
    assert.equal(
      result.review.writing?.email.modelAnswer,
      exam.writing.email.modelAnswer,
    );
    assert.equal(
      result.review.speaking?.parts[1].sampleAnswer,
      exam.speaking.parts[1].sampleAnswer,
    );
    assert.ok(
      Object.hasOwn(exam.reading.grammar[0], "sourceNotes"),
      "stripping must not mutate server data",
    );
  } finally {
    if (mock === undefined) delete process.env.AI_MOCK;
    else process.env.AI_MOCK = mock;
  }
});

test("partial answers are normalised and client WAV is accepted by the server", () => {
  const audio = asAudio(validWav());
  const result = parseAnswers({
    reading: { R1: "A" },
    speaking: { S2: { text: "My answer", audio } },
  });
  assert.equal(Object.keys(result.listening).length, 10);
  assert.equal(Object.keys(result.reading).length, 30);
  assert.equal(Object.keys(result.writing.translations).length, 5);
  assert.equal(Object.keys(result.speaking).length, 5);
  assert.equal(result.reading.R1, "A");
  assert.equal(result.reading.R2, "");
  assert.deepEqual(result.speaking.S2.audio, audio);
});

test("answer parser rejects incorrect shapes, unexpected fields and excessive text", () => {
  const invalid = [
    null,
    [],
    "answers",
    { listening: [] },
    { listening: { L11: "A" } },
    { reading: { R0: "A" } },
    { reading: { R1: 1 } },
    { reading: { R1: "x".repeat(11) } },
    { writing: [] },
    { writing: { score: 2.5 } },
    { writing: { translations: { W36: "extra" } } },
    { writing: { email: "x".repeat(10_001) } },
    { speaking: { S4: {} } },
    { speaking: { "S1-1": "plain string" } },
    { speaking: { S2: { text: [], score: 2.5 } } },
    { speaking: { S3: { audio: { mimeType: "audio/webm", data: "YWJj" } } } },
    { extra: "ignore instructions" },
    JSON.parse('{"__proto__":{"score":10}}'),
  ];
  for (const value of invalid)
    assert.throws(() => parseAnswers(value), status(400));
});

test("WAV validator rejects wrong MIME, malformed base64 and incompatible PCM headers", () => {
  const base = validWav();
  for (const mimeType of ["audio/webm", "audio/mp3", "audio/wav;codecs=pcm"]) {
    assert.throws(
      () => validateWav({ ...asAudio(base), mimeType }),
      status(400),
    );
  }
  for (const data of ["", "@@@@", "YWJj\n", "YWJj=", "RIFF"]) {
    assert.throws(
      () => validateWav({ mimeType: "audio/wav", data }),
      status(400),
    );
  }
  const mutations: Array<(wav: Buffer) => void> = [
    (wav) => wav.write("NOPE", 0),
    (wav) => wav.write("NOPE", 8),
    (wav) => wav.writeUInt32LE(0, 4),
    (wav) => wav.writeUInt32LE(100_000, 40),
    (wav) => wav.writeUInt16LE(3, 20),
    (wav) => wav.writeUInt16LE(2, 22),
    (wav) => wav.writeUInt32LE(48_000, 24),
    (wav) => wav.writeUInt32LE(96_000, 28),
    (wav) => wav.writeUInt16LE(4, 32),
    (wav) => wav.writeUInt16LE(24, 34),
  ];
  for (const mutate of mutations) {
    const wav = Buffer.from(base);
    mutate(wav);
    assert.throws(() => validateWav(asAudio(wav)), status(400));
  }
});

test("WAV chunk tags must match exact bytes and cannot contain unparsed trailing bytes", () => {
  for (const offset of [0, 8, 12, 36]) {
    const wav = validWav();
    for (let i = 0; i < 4; i++) wav[offset + i] |= 0x80;
    assert.throws(() => validateWav(asAudio(wav)), status(400));
  }
  const trailing = Buffer.concat([validWav(), Buffer.from([1, 2, 3])]);
  trailing.writeUInt32LE(trailing.length - 8, 4);
  assert.throws(() => validateWav(asAudio(trailing)), status(400));
});

test("WAV validator enforces nonempty PCM, 180 seconds and 6 MiB limits", () => {
  const empty = validWav().subarray(0, 44);
  empty.writeUInt32LE(36, 4);
  empty.writeUInt32LE(0, 40);
  assert.throws(() => validateWav(asAudio(empty)), status(400));
  const duration = Buffer.alloc(44 + MAX_AUDIO_SECONDS * 32_000 + 2);
  validWav().copy(duration, 0, 0, 44);
  duration.writeUInt32LE(duration.length - 8, 4);
  duration.writeUInt32LE(duration.length - 44, 40);
  assert.throws(() => validateWav(asAudio(duration)), status(400));
  assert.throws(
    () => validateWav(asAudio(Buffer.alloc(MAX_AUDIO_BYTES + 1))),
    status(400),
  );
});

test("access code and cookies reject absent, wrong, forged and mismatched secrets", () => {
  withEnv(
    { ACCESS_CODE: "fixture-code", SESSION_SECRET: "fixture-session-secret" },
    () => {
      assert.equal(checkCode("fixture-code"), true);
      for (const value of [
        "wrong",
        "",
        1,
        null,
        "fixture-code ",
        "x".repeat(257),
      ])
        assert.equal(checkCode(value), false);
      assert.equal(authenticated(request()), false);
      assert.throws(() => authorize(request()), status(401));
      const auth = issueAuth(),
        device = issueDevice();
      const valid = request(`et_access=${auth}; et_device=${device}`);
      assert.equal(authenticated(valid), true);
      assert.equal(authorize(valid), deviceId(valid));
      assert.throws(() => authorize(request(`et_access=${auth}`)), status(401));
      const forged = request(
        `et_access=access:9999999999999.${"0".repeat(64)}; et_device=${device}`,
      );
      assert.equal(authenticated(forged), false);
      assert.equal(
        deviceId(request(`et_device=${device.slice(0, -1)}z`)),
        null,
      );
      process.env.SESSION_SECRET = "different-secret";
      assert.equal(authenticated(valid), false);
      assert.equal(deviceId(valid), null);
    },
  );
  withEnv({ ACCESS_CODE: undefined }, () => {
    assert.equal(authenticated(request()), false);
    assert.throws(() => checkCode("anything"), status(503));
  });
});

test("percent-encoded access cookies decode exactly once and reject malformed encoding", () => {
  withEnv(
    { ACCESS_CODE: "fixture-code", SESSION_SECRET: "fixture-session-secret" },
    () => {
      const auth = issueAuth();
      const device = issueDevice();
      const encoded = encodeURIComponent(auth);
      assert.match(encoded, /^access%3A/);
      const incoming = request(`et_access=${encoded}; et_device=${device}`);
      assert.equal(authenticated(incoming), true);
      assert.equal(authorize(incoming), deviceId(incoming));

      for (const invalid of [
        encodeURIComponent(encoded),
        "access%3",
        "%E0%A4%A",
        `${encoded}%`,
      ]) {
        const rejected = request(`et_access=${invalid}; et_device=${device}`);
        assert.equal(authenticated(rejected), false);
        assert.throws(() => authorize(rejected), status(401));
      }
      assert.equal(deviceId(request(`et_device=${device}%`)), null);
    },
  );
});

test("forwarded addresses only affect the IP bucket when the proxy is trusted", () => {
  const incoming = request(undefined, "203.0.113.8, 10.0.0.2");
  withEnv({ TRUST_PROXY: undefined }, () =>
    assert.equal(clientIp(incoming), "direct-connection"),
  );
  withEnv({ TRUST_PROXY: "0" }, () =>
    assert.equal(clientIp(incoming), "direct-connection"),
  );
  withEnv({ TRUST_PROXY: "1" }, () => {
    assert.equal(clientIp(incoming), "203.0.113.8");
    assert.equal(clientIp(request(undefined, "2001:db8::8")), "2001:db8::8");
    assert.equal(
      clientIp(request(undefined, "fake-ip, 203.0.113.8")),
      "direct-connection",
    );
  });
});

test("default quotas allow ten AI calls per device and one hundred per direct IP", () => {
  withQuota(() => {
    const incoming = request(undefined, "203.0.113.1");
    for (let i = 0; i < 10; i++) reserveAi(incoming, "same-device", 1);
    assert.throws(() => reserveAi(incoming, "same-device", 1), status(429));
    for (let i = 0; i < 90; i++)
      reserveAi(request(undefined, `203.0.113.${i + 2}`), `new-device-${i}`, 1);
    assert.throws(
      () =>
        reserveAi(request(undefined, "198.51.100.2"), "yet-another-device", 1),
      status(429),
    );
  });
});

test("quota reservation is atomic across device and IP and survives a fresh process", () => {
  withQuota(
    (databasePath) => {
      const incoming = request(undefined, "203.0.113.9");
      reserveAi(incoming, "first", 2);
      assert.throws(() => reserveAi(incoming, "second", 2), status(429));
      reserveAi(incoming, "second", 1); // failed reservation must not consume this device's quota
      const child = spawnSync(
        process.execPath,
        [
          "--import",
          "tsx",
          "--input-type=module",
          "-e",
          `
      const { reserveAi } = await import('./src/server/security.ts');
      try { reserveAi(new Request('http://localhost/api/grade'), 'fresh-device', 1); process.exit(20); }
      catch (error) { process.exit(error.status === 429 ? 0 : 21); }
    `,
        ],
        {
          cwd: process.cwd(),
          env: { ...process.env, RATE_LIMIT_DB: databasePath },
          encoding: "utf8",
        },
      );
      assert.equal(child.status, 0, child.stderr || child.stdout);
    },
    { RATE_LIMIT_PER_DEVICE: "2", RATE_LIMIT_PER_IP: "3" },
  );
});
