import {
  MAX_AUDIO_BYTES,
  MAX_AUDIO_SECONDS,
  type AudioAnswer,
  type ExamAnswers,
} from "@/types/app";
import { AppError } from "./errors";

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new AppError(400, "Bài làm sai cấu trúc.");
  return value as Record<string, unknown>;
}
function onlyKeys(value: Record<string, unknown>, keys: string[]): void {
  if (Object.keys(value).some((k) => !keys.includes(k)))
    throw new AppError(400, "Bài làm có trường không hợp lệ.");
}
function text(value: unknown, max = 10_000): string {
  if (value === undefined) return "";
  if (typeof value !== "string" || value.length > max)
    throw new AppError(400, "Câu trả lời quá dài hoặc sai định dạng.");
  return value;
}
function answersMap(
  value: unknown,
  ids: string[],
  max: number,
): Record<string, string> {
  const input = object(value ?? {});
  onlyKeys(input, ids);
  return Object.fromEntries(ids.map((id) => [id, text(input[id], max)]));
}
export function validateWav(data: unknown): AudioAnswer {
  const input = object(data);
  onlyKeys(input, ["data", "mimeType"]);
  if (
    input.mimeType !== "audio/wav" ||
    typeof input.data !== "string" ||
    input.data.length > Math.ceil(MAX_AUDIO_BYTES / 3) * 4 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(input.data) ||
    input.data.length % 4 !== 0
  )
    throw new AppError(400, "Audio phải là WAV mono 16 kHz hợp lệ.");
  const wav = Buffer.from(input.data, "base64");
  if (
    wav.length > MAX_AUDIO_BYTES ||
    wav.length < 44 ||
    wav.toString("latin1", 0, 4) !== "RIFF" ||
    wav.toString("latin1", 8, 12) !== "WAVE" ||
    wav.readUInt32LE(4) + 8 !== wav.length
  )
    throw new AppError(400, "Audio WAV không hợp lệ hoặc quá lớn.");
  let format = false,
    bytes = 0,
    dataFound = false;
  let at = 12;
  for (; at + 8 <= wav.length;) {
    const kind = wav.toString("latin1", at, at + 4),
      length = wav.readUInt32LE(at + 4),
      start = at + 8;
    if (start + length > wav.length)
      throw new AppError(400, "Audio WAV bị thiếu dữ liệu.");
    if (kind === "fmt ") {
      if (
        format ||
        length < 16 ||
        wav.readUInt16LE(start) !== 1 ||
        wav.readUInt16LE(start + 2) !== 1 ||
        wav.readUInt32LE(start + 4) !== 16000 ||
        wav.readUInt32LE(start + 8) !== 32000 ||
        wav.readUInt16LE(start + 12) !== 2 ||
        wav.readUInt16LE(start + 14) !== 16
      )
        throw new AppError(400, "Audio phải là PCM 16 bit, mono, 16 kHz.");
      format = true;
    }
    if (kind === "data") {
      if (dataFound || length % 2)
        throw new AppError(400, "Audio WAV sai định dạng.");
      dataFound = true;
      bytes = length;
    }
    at = start + length + (length % 2);
  }
  if (
    at !== wav.length ||
    !format ||
    !bytes ||
    bytes > MAX_AUDIO_SECONDS * 32000
  )
    throw new AppError(
      400,
      "Mỗi bản ghi phải dài hơn 0 và không quá 180 giây, có cấu trúc WAV hợp lệ.",
    );
  return { mimeType: "audio/wav", data: input.data };
}
export function parseAnswers(value: unknown): ExamAnswers {
  const input = object(value);
  onlyKeys(input, ["listening", "reading", "writing", "speaking"]);
  const writing = object(input.writing ?? {});
  onlyKeys(writing, ["translations", "email"]);
  const speaking = object(input.speaking ?? {});
  onlyKeys(speaking, ["S1-1", "S1-2", "S1-3", "S2", "S3"]);
  return {
    listening: answersMap(
      input.listening,
      Array.from({ length: 10 }, (_, i) => `L${i + 1}`),
      200,
    ),
    reading: answersMap(
      input.reading,
      Array.from({ length: 30 }, (_, i) => `R${i + 1}`),
      10,
    ),
    writing: {
      translations: answersMap(
        writing.translations,
        ["W31", "W32", "W33", "W34", "W35"],
        2000,
      ),
      email: text(writing.email),
    },
    speaking: Object.fromEntries(
      ["S1-1", "S1-2", "S1-3", "S2", "S3"].map((id) => {
        const item = object(speaking[id] ?? {});
        onlyKeys(item, ["text", "audio"]);
        return [
          id,
          {
            text: text(item.text),
            ...(item.audio === undefined
              ? {}
              : { audio: validateWav(item.audio) }),
          },
        ];
      }),
    ),
  };
}
