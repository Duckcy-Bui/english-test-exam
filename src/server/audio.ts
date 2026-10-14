import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Thư mục chứa file thu sẵn: unit-<N>-<A|B>.mp3. */
function audioDir(): string {
  return process.env.AUDIO_DIR || join(process.cwd(), "data", "audio");
}

export function listeningAudioPath(unit: number, partId: "A" | "B"): string | null {
  if (!Number.isInteger(unit) || unit < 1 || unit > 8) return null;
  const file = join(audioDir(), `unit-${unit}-${partId}.mp3`);
  return existsSync(file) ? file : null;
}
