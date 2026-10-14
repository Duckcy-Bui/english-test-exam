import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { TEST_IDS, type TestId } from "@/types/exam";

/** Thư mục chứa file thu sẵn: unit-<N>-<Test>-<Part>.mp3. */
function audioDir(): string {
  return process.env.AUDIO_DIR || join(process.cwd(), "data", "audio");
}

export function listeningAudioPath(
  unit: number,
  testId: TestId,
  partId: "A" | "B",
): string | null {
  if (
    !Number.isInteger(unit) ||
    unit < 1 ||
    unit > 8 ||
    !TEST_IDS.includes(testId) ||
    (partId !== "A" && partId !== "B")
  )
    return null;
  const file = join(audioDir(), `unit-${unit}-${testId}-${partId}.mp3`);
  return existsSync(file) ? file : null;
}
