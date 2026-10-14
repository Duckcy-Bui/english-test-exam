"use client";

import { useEffect, useRef, useState } from "react";
import { recordToWav } from "../client/audio";
import { MAX_AUDIO_SECONDS, type SpeakingAnswer } from "../types/app";
import { Icon } from "./ui";

interface RecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SpeechWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

export function SpeakingRecorder({
  id,
  value,
  onChange,
  disabled = false,
  onRecordingChange,
}: {
  id: string;
  value: SpeakingAnswer;
  onChange: (answer: SpeakingAnswer) => void;
  disabled?: boolean;
  onRecordingChange?: (recording: boolean) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const [supportsRecording, setSupportsRecording] = useState(true);
  const [transcribe, setTranscribe] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const recognition = useRef<Recognition | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingFlag = useRef(false);
  const mounted = useRef(true);
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  const answerRef = useRef(value);
  const changeRef = useRef(onChange);
  const recordingChangeRef = useRef(onRecordingChange);
  answerRef.current = value;
  changeRef.current = onChange;
  recordingChangeRef.current = onRecordingChange;

  function release() {
    recordingFlag.current = false;
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    recognition.current?.abort();
    recognition.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }
  function stop() {
    if (!recordingFlag.current) return;
    recordingFlag.current = false;
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    recognition.current?.stop();
    if (recorder.current?.state === "recording") recorder.current.stop();
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setRecording(false);
    setProcessing(true);
  }

  useEffect(() => {
    mounted.current = true;
    const speechWindow = window as SpeechWindow;
    setSupportsSpeech(
      !!(
        speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
      ),
    );
    setSupportsRecording(
      !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== "undefined" &&
        window.isSecureContext,
    );
    return () => {
      mounted.current = false;
      if (recorder.current) {
        recorder.current.onstop = null;
        recorder.current.ondataavailable = null;
        if (recorder.current.state === "recording") recorder.current.stop();
      }
      release();
      recordingChangeRef.current?.(false);
    };
  }, []);
  useEffect(
    () => () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    [audioUrl],
  );
  useEffect(() => {
    if (disabled && recordingFlag.current) stop();
  }, [disabled]);

  async function start() {
    if (disabled || processing || recordingFlag.current) return;
    setError("");
    setSeconds(0);
    setProcessing(true);
    // Reserve the active recorder while the microphone permission prompt is open.
    recordingChangeRef.current?.(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      if (!mounted.current || disabledRef.current) {
        media.getTracks().forEach((track) => track.stop());
        if (mounted.current) setProcessing(false);
        recordingChangeRef.current?.(false);
        return;
      }
      stream.current = media;
      const chunks: Blob[] = [];
      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      const mediaRecorder = new MediaRecorder(
        media,
        mimeType ? { mimeType } : undefined,
      );
      recorder.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      mediaRecorder.onerror = () => {
        if (mounted.current)
          setError(
            "Không thể hoàn tất bản ghi. Hãy thử lại hoặc gõ câu trả lời.",
          );
        stop();
      };
      mediaRecorder.onstop = async () => {
        release();
        try {
          const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
          if (!blob.size)
            throw new Error("Bản ghi chưa có âm thanh. Vui lòng thử lại.");
          const audio = await recordToWav(blob);
          if (mounted.current) {
            changeRef.current({ ...answerRef.current, audio });
            setAudioUrl(URL.createObjectURL(blob));
          }
        } catch (error) {
          if (mounted.current)
            setError(
              error instanceof Error
                ? error.message
                : "Không thể xử lý bản ghi. Bạn vẫn có thể gõ câu trả lời.",
            );
        } finally {
          if (mounted.current) {
            setProcessing(false);
            setRecording(false);
          }
          recordingChangeRef.current?.(false);
        }
      };
      recordingFlag.current = true;
      setRecording(true);
      setProcessing(false);
      mediaRecorder.start(1000);
      const startedAt = Date.now();
      timer.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        setSeconds(elapsed);
        if (elapsed >= MAX_AUDIO_SECONDS) stop();
      }, 250);
      if (transcribe) {
        const Speech =
          (window as SpeechWindow).SpeechRecognition ??
          (window as SpeechWindow).webkitSpeechRecognition;
        if (Speech) {
          const speech = new Speech();
          recognition.current = speech;
          speech.lang = "en-GB";
          speech.continuous = true;
          speech.interimResults = true;
          let completed = "";
          changeRef.current({ text: "" });
          speech.onresult = (event) => {
            let transcript = "";
            for (let i = 0; i < event.results.length; i++)
              transcript += `${event.results[i][0].transcript} `;
            if (mounted.current)
              changeRef.current({
                ...answerRef.current,
                text: `${completed}${transcript}`.trim(),
              });
            if (!recordingFlag.current) completed += transcript;
          };
          speech.onerror = (event) => {
            if (
              mounted.current &&
              !["no-speech", "aborted"].includes(event.error)
            )
              setError(
                "Nhận dạng giọng nói tạm thời không hoạt động. Bản ghi âm vẫn được giữ; bạn có thể bổ sung bản chữ.",
              );
          };
          speech.onend = () => {
            if (recordingFlag.current) {
              completed = `${answerRef.current.text} `;
              try {
                speech.start();
              } catch {
                /* Audio recording continues if recognition stops. */
              }
            }
          };
          try {
            speech.start();
          } catch {
            setError(
              "Không mở được nhận dạng giọng nói. Bản ghi âm vẫn hoạt động.",
            );
          }
        }
      }
    } catch (error) {
      release();
      setRecording(false);
      setProcessing(false);
      recordingChangeRef.current?.(false);
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Bạn chưa cho phép sử dụng micro. Có thể cho phép rồi thử lại, hoặc gõ câu trả lời bên dưới."
          : "Không mở được micro. Hãy kiểm tra thiết bị, hoặc gõ câu trả lời bên dưới.";
      if (mounted.current) setError(message);
    }
  }

  return (
    <div className="recorder">
      <div className="recorder-controls">
        {supportsRecording ? (
          <button
            type="button"
            className={`button ${recording ? "danger-button" : "secondary"}`}
            onClick={recording ? stop : start}
            disabled={disabled || processing}
          >
            <Icon name={recording ? "stop" : "mic"} />
            {processing
              ? "Đang xử lý…"
              : recording
                ? "Dừng ghi âm"
                : value.audio
                  ? "Ghi âm lại"
                  : "Bắt đầu ghi âm"}
          </button>
        ) : (
          <span className="quiet-note">
            Trình duyệt chưa hỗ trợ thu âm hoặc cần kết nối HTTPS. Bạn có thể gõ
            câu trả lời.
          </span>
        )}
        <span className={`recording-time ${recording ? "live" : ""}`}>
          {recording && <i />}
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
          :{(seconds % 60).toString().padStart(2, "0")} <small>/ 03:00</small>
        </span>
        {value.audio && !recording && (
          <span className="badge teal">
            <Icon name="check" />
            Đã có bản ghi
          </span>
        )}
      </div>
      {supportsSpeech && (
        <label className="transcription-consent">
          <input
            type="checkbox"
            checked={transcribe}
            onChange={(event) => setTranscribe(event.target.checked)}
            disabled={recording || processing || disabled}
          />
          <span>
            Hiện bản chữ khi nói. Âm thanh được gửi đến dịch vụ nhận dạng của
            trình duyệt (Google trên Chrome/Edge).
          </span>
        </label>
      )}
      <p className="recorder-note">
        Bản ghi dùng để chấm bài. Mỗi bản tối đa 3 phút, 6 MB. Bạn có thể nghe
        lại và ghi lại trước khi nộp.
      </p>
      {(audioUrl || value.audio) && (
        <audio
          controls
          src={audioUrl || `data:audio/wav;base64,${value.audio?.data}`}
          aria-label={`Nghe lại bản ghi ${id}`}
          className="recording-preview"
        />
      )}
      <label className="field-label" htmlFor={`speaking-text-${id}`}>
        {supportsSpeech
          ? "Bản chữ hoặc câu trả lời của bạn"
          : "Gõ câu trả lời (có thể gửi cùng bản ghi âm)"}
      </label>
      <textarea
        id={`speaking-text-${id}`}
        maxLength={10000}
        rows={5}
        placeholder="Trả lời bằng tiếng Anh…"
        value={value.text}
        onChange={(event) => onChange({ ...value, text: event.target.value })}
        disabled={disabled || recording || processing}
      />
      <p className="quiet-note">
        Nếu chỉ gửi bản chữ, kết quả không đánh giá phát âm.
      </p>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
