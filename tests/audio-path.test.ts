import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("recorded listening audio is isolated by Unit, test and part; missing audio keeps TTS fallback", () => {
  const directory = mkdtempSync(join(tmpdir(), "et-multi-test-audio-"));
  const a = join(directory, "unit-6-A-A.mp3");
  const b = join(directory, "unit-6-B-A.mp3");
  const bPart = join(directory, "unit-6-B-B.mp3");
  try {
    writeFileSync(a, "distinct A audio");
    writeFileSync(b, "distinct B audio");
    writeFileSync(bPart, "distinct B second part audio");
    // server-only resolves to its empty marker under the React server condition.
    // Keep that condition local to this process so browser audio tests stay unchanged.
    const result = spawnSync(process.execPath, [
      "--conditions=react-server",
      "--import", "tsx",
      "--input-type=module",
      "-e",
      `import { listeningAudioPath } from ${JSON.stringify(new URL("../src/server/audio.ts", import.meta.url).href)};
       console.log(JSON.stringify([
         listeningAudioPath(6, "A", "A"),
         listeningAudioPath(6, "B", "A"),
         listeningAudioPath(6, "B", "B"),
         listeningAudioPath(6, "C", "A"),
         listeningAudioPath(5, "A", "A"),
         listeningAudioPath(6, "../A", "A"),
         listeningAudioPath(6, "A", "../A"),
         listeningAudioPath(9, "A", "A")
       ]));`,
    ], {
      env: { ...process.env, AUDIO_DIR: directory },
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), [a, b, bPart, null, null, null, null, null]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
