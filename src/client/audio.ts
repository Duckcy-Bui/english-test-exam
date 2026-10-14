import {
  MAX_AUDIO_BYTES,
  MAX_AUDIO_SECONDS,
  type AudioAnswer,
} from "../types/app";

export const WAV_SAMPLE_RATE = 16_000;

/** Encode mono samples as little-endian, 16-bit PCM in a RIFF/WAVE container. */
export function pcmToWav(
  samples: Float32Array,
  sampleRate = WAV_SAMPLE_RATE,
): ArrayBuffer {
  if (!Number.isInteger(sampleRate) || sampleRate < 1 || sampleRate > 192_000) {
    throw new Error("Tần số âm thanh không hợp lệ.");
  }
  if (samples.length === 0) throw new Error("Bản ghi âm trống.");
  if (samples.length / sampleRate > MAX_AUDIO_SECONDS) {
    throw new Error(`Bản ghi âm phải dài tối đa ${MAX_AUDIO_SECONDS} giây.`);
  }
  const dataBytes = samples.length * 2;
  if (dataBytes + 44 > MAX_AUDIO_BYTES) {
    throw new Error("Bản ghi âm phải nhỏ hơn hoặc bằng 6 MiB.");
  }

  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  const ascii = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++)
      view.setUint8(offset + i, value.charCodeAt(i));
  };
  ascii(0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, "data");
  view.setUint32(40, dataBytes, true);
  for (let i = 0; i < samples.length; i++) {
    const sample = Number.isFinite(samples[i])
      ? Math.max(-1, Math.min(1, samples[i]))
      : 0;
    view.setInt16(
      44 + i * 2,
      Math.round(sample * (sample < 0 ? 32_768 : 32_767)),
      true,
    );
  }
  return buffer;
}

/** Decode MediaRecorder output, downmix and resample to mono 16 kHz WAV. */
export async function recordToWav(blob: Blob): Promise<AudioAnswer> {
  if (blob.size === 0) throw new Error("Bản ghi âm trống.");
  if (blob.size > MAX_AUDIO_BYTES)
    throw new Error("Bản ghi âm phải nhỏ hơn hoặc bằng 6 MiB.");
  if (typeof window === "undefined")
    throw new Error("Chuyển âm thanh chỉ hoạt động trên trình duyệt.");
  const AudioContextClass =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass || !window.OfflineAudioContext) {
    throw new Error(
      "Trình duyệt chưa hỗ trợ chuyển âm thanh sang WAV. Bạn có thể gõ câu trả lời.",
    );
  }

  const context = new AudioContextClass();
  try {
    const decoded = await context.decodeAudioData(await blob.arrayBuffer());
    if (!Number.isFinite(decoded.duration) || decoded.duration <= 0)
      throw new Error("Bản ghi âm trống.");
    if (decoded.duration > MAX_AUDIO_SECONDS) {
      throw new Error(`Bản ghi âm phải dài tối đa ${MAX_AUDIO_SECONDS} giây.`);
    }
    const frameCount = Math.ceil(decoded.duration * WAV_SAMPLE_RATE);
    const offline = new window.OfflineAudioContext(
      1,
      frameCount,
      WAV_SAMPLE_RATE,
    );
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    const wav = pcmToWav(rendered.getChannelData(0));
    const bytes = new Uint8Array(wav);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 32_768) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 32_768));
    }
    return { mimeType: "audio/wav", data: btoa(binary) };
  } finally {
    await context.close().catch(() => undefined);
  }
}
