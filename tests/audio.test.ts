import assert from "node:assert/strict";
import test from "node:test";
import { pcmToWav, recordToWav, WAV_SAMPLE_RATE } from "../src/client/audio";
import { MAX_AUDIO_BYTES, MAX_AUDIO_SECONDS } from "../src/types/app";

test("WAV header describes mono 16 kHz PCM16 and exact payload lengths", () => {
  const samples = new Float32Array([0, -1, 1, 0.5]);
  const buffer = pcmToWav(samples);
  const view = new DataView(buffer);
  const tag = (start: number) =>
    String.fromCharCode(...new Uint8Array(buffer, start, 4));
  assert.equal(tag(0), "RIFF");
  assert.equal(tag(8), "WAVE");
  assert.equal(tag(12), "fmt ");
  assert.equal(tag(36), "data");
  assert.equal(buffer.byteLength, 44 + samples.length * 2);
  assert.equal(view.getUint32(4, true), buffer.byteLength - 8);
  assert.equal(view.getUint32(16, true), 16);
  assert.equal(view.getUint16(20, true), 1);
  assert.equal(view.getUint16(22, true), 1);
  assert.equal(view.getUint32(24, true), 16_000);
  assert.equal(view.getUint32(28, true), 32_000);
  assert.equal(view.getUint16(32, true), 2);
  assert.equal(view.getUint16(34, true), 16);
  assert.equal(view.getUint32(40, true), samples.length * 2);
  assert.deepEqual(
    Array.from({ length: 4 }, (_, i) => view.getInt16(44 + 2 * i, true)),
    [0, -32_768, 32_767, 16_384],
  );
});

test("PCM clamps out-of-range samples and replaces non-finite samples with silence", () => {
  const view = new DataView(
    pcmToWav(new Float32Array([-5, 5, Number.NaN, Infinity, -Infinity])),
  );
  assert.deepEqual(
    Array.from({ length: 5 }, (_, i) => view.getInt16(44 + 2 * i, true)),
    [-32_768, 32_767, 0, 0, 0],
  );
});

test("PCM rejects an empty recording, invalid rate, excessive duration and size", () => {
  assert.throws(() => pcmToWav(new Float32Array()), /trống/);
  for (const rate of [0, -1, 1.5, NaN, Infinity, 192_001]) {
    assert.throws(() => pcmToWav(new Float32Array([0]), rate), /không hợp lệ/);
  }
  assert.throws(
    () => pcmToWav(new Float32Array(WAV_SAMPLE_RATE * MAX_AUDIO_SECONDS + 1)),
    /180 giây/,
  );
  assert.throws(
    () => pcmToWav(new Float32Array(MAX_AUDIO_BYTES / 2), 48_000),
    /6 MiB/,
  );
});

test("MediaRecorder conversion rejects empty or excessive input before creating a browser context", async () => {
  await assert.rejects(recordToWav(new Blob()), /trống/);
  await assert.rejects(
    recordToWav(new Blob([new Uint8Array(MAX_AUDIO_BYTES + 1)])),
    /6 MiB/,
  );
});
