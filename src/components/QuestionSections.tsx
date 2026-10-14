"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "../client/api";
import { countEmailWords, countWords, type Speaker } from "../types/exam";
import type {
  ExamAnswers,
  ExamSession,
  ListeningPlayback,
  PublicData,
  SpeakingAnswer,
} from "../types/app";
import type { McqQuestion, Passage } from "../types/exam";
import { SpeakingRecorder } from "./SpeakingRecorder";
import { Icon } from "./ui";

type SessionExam = ExamSession["exam"];
function Mcq({
  question,
  value,
  onChange,
  disabled,
}: {
  question: PublicData<McqQuestion>;
  value?: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="question-card" disabled={disabled}>
      <legend>
        <span className="question-id">{question.id}</span>
        {question.stem}
      </legend>
      <div className="options-grid">
        {question.options.map((option) => (
          <label
            key={option.id}
            className={`option ${value === option.id ? "chosen" : ""}`}
          >
            <input
              type="radio"
              name={question.id}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className="option-letter">{option.id}</span>
            <span>{option.text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ReadingPassage({ passage }: { passage: Passage }) {
  return (
    <article className="reading-passage">
      {passage.title && <h3>{passage.title}</h3>}
      {passage.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </article>
  );
}

function chooseVoice(voices: SpeechSynthesisVoice[], speaker: Speaker) {
  const british = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("en-gb"),
  );
  const english = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("en"),
  );
  const candidates = british.length ? british : english;
  const names =
    speaker.voice === "female"
      ? /female|susan|hazel|sonia|serena|kate|martha|samantha|victoria/i
      : /male|daniel|george|ryan|arthur|james|david|alex/i;
  // Avoid matching "male" inside "female" when a voice advertises its gender.
  return (
    candidates.find(
      (voice) =>
        names.test(voice.name) &&
        (speaker.voice !== "male" || !/female/i.test(voice.name)),
    ) ?? candidates[speaker.voice === "female" && candidates.length > 1 ? 1 : 0]
  );
}

function ListenButton({
  sessionId,
  partId,
  examMode,
  disabled,
}: {
  sessionId: string;
  partId: "A" | "B";
  examMode: boolean;
  disabled: boolean;
}) {
  const key = `english-it-listen-${sessionId}-${partId}`;
  const [remaining, setRemaining] = useState<number | null>(
    examMode ? 2 : null,
  );
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState("");
  const live = useRef(true);
  const playbackToken = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
  };
  useEffect(() => {
    live.current = true;
    setSupported(
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
    );
    const otherPlayback = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== key) {
        playbackToken.current++;
        stopAudio();
        setPlaying(false);
      }
    };
    window.addEventListener("english-it-tts-start", otherPlayback);
    if (examMode) {
      try {
        const saved = sessionStorage.getItem(key);
        if (saved !== null)
          setRemaining(Math.max(0, Math.min(2, Number(saved))));
      } catch {
        /* Server enforces the limit. */
      }
    }
    return () => {
      live.current = false;
      playbackToken.current++;
      stopAudio();
      window.removeEventListener("english-it-tts-start", otherPlayback);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [key, examMode]);
  useEffect(() => {
    if (disabled && playing) {
      playbackToken.current++;
      stopAudio();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setPlaying(false);
    }
  }, [disabled, playing]);

  async function play() {
    if (loading || playing || disabled || (examMode && remaining === 0)) return;
    setLoading(true);
    setError("");
    try {
      const { playback } = await api.listen(sessionId, partId);
      if (!live.current) return;
      setRemaining(playback.remaining);
      if (playback.remaining !== null) {
        try {
          sessionStorage.setItem(key, String(playback.remaining));
        } catch {
          /* No dialogue is persisted. */
        }
      }
      window.dispatchEvent(
        new CustomEvent("english-it-tts-start", { detail: key }),
      );
      // Ưu tiên file thu sẵn; giọng trình duyệt chỉ là phương án dự phòng.
      if (playback.audioUrl && (await playRecorded(playback))) return;
      if (!("speechSynthesis" in window)) {
        setError("Không phát được bài nghe. Hãy thử trình duyệt khác.");
        return;
      }
      const synth = window.speechSynthesis;
      synth.cancel();
      let voices = synth.getVoices();
      if (!voices.length)
        voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const timeout = setTimeout(() => {
            synth.removeEventListener("voiceschanged", changed);
            resolve(synth.getVoices());
          }, 700);
          const changed = () => {
            clearTimeout(timeout);
            synth.removeEventListener("voiceschanged", changed);
            resolve(synth.getVoices());
          };
          synth.addEventListener("voiceschanged", changed);
        });
      if (!live.current) return;
      const token = ++playbackToken.current;
      setPlaying(true);
      // Keep the script transient; only the remaining-play count is stored.
      speakLine(playback, 0, voices, token);
    } catch (error) {
      if (error instanceof ApiError && error.status === 429 && examMode) {
        setRemaining(0);
        try {
          sessionStorage.setItem(key, "0");
        } catch {
          /* Server remains authoritative. */
        }
      }
      if (live.current)
        setError(
          error instanceof Error ? error.message : "Không phát được bài nghe.",
        );
    } finally {
      if (live.current) setLoading(false);
    }
  }
  async function playRecorded(playback: ListeningPlayback): Promise<boolean> {
    stopAudio();
    const token = ++playbackToken.current;
    const audio = new Audio(playback.audioUrl);
    audioRef.current = audio;
    audio.onended = () => {
      if (live.current && token === playbackToken.current) setPlaying(false);
    };
    audio.onerror = () => {
      if (live.current && token === playbackToken.current) {
        setPlaying(false);
        setError("Không tải được file âm thanh. Hãy bấm nghe lại.");
      }
    };
    try {
      await audio.play();
      if (live.current && token === playbackToken.current) setPlaying(true);
      return true;
    } catch {
      if (audioRef.current === audio) audioRef.current = null;
      return false;
    }
  }
  function speakLine(
    playback: ListeningPlayback,
    index: number,
    voices: SpeechSynthesisVoice[],
    token: number,
  ) {
    if (!live.current || token !== playbackToken.current) return;
    if (index >= playback.script.length) {
      setPlaying(false);
      return;
    }
    const line = playback.script[index];
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    const speaker =
      playback.speakers.find((speaker) => speaker.name === line.speaker) ??
      playback.speakers[0];
    if (speaker) {
      const voice = chooseVoice(voices, speaker);
      if (voice) utterance.voice = voice;
      utterance.pitch = speaker.voice === "female" ? 1.08 : 0.95;
    }
    utterance.onend = () => speakLine(playback, index + 1, voices, token);
    utterance.onerror = (event) => {
      if (
        live.current &&
        token === playbackToken.current &&
        event.error !== "canceled" &&
        event.error !== "interrupted"
      ) {
        setPlaying(false);
        setError(
          "Giọng đọc chưa hoạt động. Hãy kiểm tra âm thanh và giọng tiếng Anh của trình duyệt.",
        );
      }
    };
    window.speechSynthesis.speak(utterance);
  }
  return (
    <div className="listening-control">
      <div>
        <button
          className="button primary"
          onClick={play}
          disabled={
            disabled ||
            loading ||
            playing ||
            (examMode && remaining === 0)
          }
        >
          <Icon name="play" />
          {loading
            ? "Đang chuẩn bị…"
            : playing
              ? "Đang phát bài nghe…"
              : examMode && remaining === 0
                ? "Đã hết lượt nghe"
                : "Nghe Part " + partId}
        </button>
        {playing && (
          <button
            className="button ghost"
            onClick={() => {
              playbackToken.current++;
              stopAudio();
              if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              setPlaying(false);
            }}
          >
            <Icon name="stop" />
            Dừng
          </button>
        )}
      </div>
      <p>
        {examMode
          ? `Còn ${remaining ?? 0}/2 lượt nghe. Mỗi lần bấm phát tính một lượt.`
          : "Nghe không giới hạn. Lời thoại hiển thị sau khi nộp bài."}
      </p>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ListeningQuestions({
  section,
  sessionId,
  examMode,
  values,
  onChange,
  disabled,
}: {
  section: NonNullable<SessionExam["listening"]>;
  sessionId: string;
  examMode: boolean;
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled: boolean;
}) {
  return (
    <>
      {section.parts.map((part) => (
        <section className="exam-section" key={part.id}>
          <div className="section-title">
            <span className="part-tag">PART {part.id}</span>
            <h2>
              {part.id === "A" ? "Nghe và chọn đáp án" : "Nghe và trả lời ngắn"}
            </h2>
            <p>{part.instructions}</p>
          </div>
          <div className="listening-context">
            <Icon name="headphones" />
            <p>{part.context}</p>
          </div>
          <ListenButton
            sessionId={sessionId}
            partId={part.id}
            examMode={examMode}
            disabled={disabled}
          />
          {part.questions.map((question) =>
            question.kind === "mcq" ? (
              <Mcq
                key={question.id}
                question={question}
                value={values[question.id]}
                onChange={(value) => onChange(question.id, value)}
                disabled={disabled}
              />
            ) : (
              <div className="question-card short-question" key={question.id}>
                <label htmlFor={question.id}>
                  <span className="question-id">{question.id}</span>
                  {question.stem}
                </label>
                <input
                  id={question.id}
                  maxLength={200}
                  value={values[question.id] ?? ""}
                  onChange={(event) =>
                    onChange(question.id, event.target.value)
                  }
                  disabled={disabled}
                  placeholder={`Không quá ${question.maxWords} từ`}
                />
                <span
                  className={`word-counter ${countWords(values[question.id] ?? "") > question.maxWords ? "over-limit" : ""}`}
                >
                  {countWords(values[question.id] ?? "")} / {question.maxWords}{" "}
                  từ
                </span>
              </div>
            ),
          )}
        </section>
      ))}
    </>
  );
}

export function ReadingQuestions({
  section,
  values,
  onChange,
  disabled,
}: {
  section: NonNullable<SessionExam["reading"]>;
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled: boolean;
}) {
  return (
    <>
      <section className="exam-section">
        <div className="section-title">
          <span className="part-tag">PHẦN 1</span>
          <h2>Nối thuật ngữ và định nghĩa</h2>
          <p>{section.matching.instructions}</p>
        </div>
        <div className="definitions-list">
          {section.matching.definitions.map((definition) => (
            <div key={definition.id}>
              <strong>{definition.id}</strong>
              <p>{definition.text}</p>
            </div>
          ))}
        </div>
        <div className="matching-grid">
          {section.matching.items.map((item) => (
            <div className="matching-item" key={item.id}>
              <label htmlFor={item.id}>
                <span className="question-id">{item.id}</span>
                {item.term}
              </label>
              <select
                id={item.id}
                value={values[item.id] ?? ""}
                onChange={(event) => onChange(item.id, event.target.value)}
                disabled={disabled}
              >
                <option value="">Chọn…</option>
                {section.matching.definitions.map((definition) => (
                  <option key={definition.id} value={definition.id}>
                    {definition.id}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>
      {[
        { title: "Ngữ pháp", questions: section.grammar },
        { title: "Từ vựng trong ngữ cảnh", questions: section.vocabulary },
      ].map((part, index) => (
        <section className="exam-section" key={part.title}>
          <div className="section-title">
            <span className="part-tag">PHẦN {index + 2}</span>
            <h2>{part.title}</h2>
            <p>Chọn một đáp án đúng cho mỗi câu.</p>
          </div>
          {part.questions.map((question) => (
            <Mcq
              key={question.id}
              question={question}
              value={values[question.id]}
              onChange={(value) => onChange(question.id, value)}
              disabled={disabled}
            />
          ))}
        </section>
      ))}
      <section className="exam-section">
        <div className="section-title">
          <span className="part-tag">PHẦN 4</span>
          <h2>Đọc hiểu</h2>
          <p>{section.passageMcq.instructions}</p>
        </div>
        <ReadingPassage passage={section.passageMcq.passage} />
        {section.passageMcq.questions.map((question) => (
          <Mcq
            key={question.id}
            question={question}
            value={values[question.id]}
            onChange={(value) => onChange(question.id, value)}
            disabled={disabled}
          />
        ))}
      </section>
      <section className="exam-section">
        <div className="section-title">
          <span className="part-tag">PHẦN 5</span>
          <h2>True / False</h2>
          <p>{section.passageTrueFalse.instructions}</p>
        </div>
        <ReadingPassage passage={section.passageTrueFalse.passage} />
        {section.passageTrueFalse.questions.map((question) => (
          <fieldset
            className="question-card"
            key={question.id}
            disabled={disabled}
          >
            <legend>
              <span className="question-id">{question.id}</span>
              {question.statement}
            </legend>
            <div className="tf-options">
              {[
                { value: "T", label: "True" },
                { value: "F", label: "False" },
              ].map((option) => (
                <label
                  className={`option ${values[question.id] === option.value ? "chosen" : ""}`}
                  key={option.value}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={values[question.id] === option.value}
                    onChange={() => onChange(question.id, option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </section>
    </>
  );
}

export function WritingQuestions({
  section,
  values,
  onChange,
  disabled,
}: {
  section: NonNullable<SessionExam["writing"]>;
  values: ExamAnswers["writing"];
  onChange: (value: ExamAnswers["writing"]) => void;
  disabled: boolean;
}) {
  const words = countEmailWords(values.email);
  return (
    <>
      <section className="exam-section">
        <div className="section-title">
          <span className="part-tag">PHẦN 1 · 1,25 ĐIỂM</span>
          <h2>Dịch Anh → Việt</h2>
          <p>{section.translation.instructions}</p>
        </div>
        {section.translation.items.map((item) => (
          <div className="question-card translation-question" key={item.id}>
            <label htmlFor={item.id}>
              <span className="question-id">{item.id}</span>
              {item.source}
            </label>
            <textarea
              id={item.id}
              maxLength={2000}
              rows={3}
              placeholder="Bản dịch tiếng Việt của bạn…"
              value={values.translations[item.id] ?? ""}
              onChange={(event) =>
                onChange({
                  ...values,
                  translations: {
                    ...values.translations,
                    [item.id]: event.target.value,
                  },
                })
              }
              disabled={disabled}
            />
          </div>
        ))}
      </section>
      <section className="exam-section">
        <div className="section-title">
          <span className="part-tag">PHẦN 2 · 1,25 ĐIỂM</span>
          <h2>Viết email hướng dẫn</h2>
          <p>{section.email.task}</p>
        </div>
        <div className="email-task">
          <span className="badge teal">To: {section.email.recipient}</span>
          <h3>Nội dung cần có</h3>
          <ul>
            {section.email.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="grammar-chips">
            {section.email.targetGrammar.map((grammar) => (
              <span key={grammar}>{grammar}</span>
            ))}
          </div>
        </div>
        <div className="email-editor-head">
          <label className="field-label" htmlFor="email-answer">
            Email của bạn
          </label>
          <button
            type="button"
            className="button ghost"
            disabled={disabled || values.email.trim() !== ""}
            title={
              values.email.trim()
                ? "Chỉ chèn được khi ô email còn trống"
                : "Điền sẵn khung email của giáo viên"
            }
            onClick={() =>
              onChange({
                ...values,
                email: emailTemplate(section.email.recipient),
              })
            }
          >
            <Icon name="pen" />
            Chèn khung email
          </button>
        </div>
        <textarea
          id="email-answer"
          maxLength={10000}
          className="email-editor"
          rows={13}
          placeholder={`From: …\nTo: ${section.email.recipient}\nDate: …\nSubject: …\n\nHi ${section.email.recipient},\n\nIt should be quite easy to …\nFirst, … Then, … Next, … After that, … Finally, …\nDon't forget to … when you've finished.\n\nBest wishes,\n…`}
          value={values.email}
          onChange={(event) =>
            onChange({ ...values, email: event.target.value })
          }
          disabled={disabled}
        />
        <div className="editor-footer">
          <span>
            Viết bằng tiếng Anh, phần thân {section.email.wordRange[0]}–
            {section.email.wordRange[1]} từ (không tính 4 dòng From/To/Date/Subject).
          </span>
          <strong
            className={words > section.email.wordRange[1] ? "over-limit" : ""}
          >
            {words} từ
          </strong>
        </div>
      </section>
    </>
  );
}

/** Khung email hướng dẫn theo mẫu của giáo viên. */
function emailTemplate(recipient: string): string {
  const now = new Date();
  const day = now.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = now.toLocaleString("en-GB", { month: "long" });
  return [
    "From: [Your name]",
    `To: ${recipient}`,
    `Date: ${day}${suffix} ${month}`,
    "Subject: [Short, clear subject]",
    "",
    `Hi ${recipient},`,
    "",
    "It should be quite easy to [main task].",
    "First, [step 1].",
    "Then, [step 2].",
    "Next, [step 3].",
    "After that, [step 4].",
    "Finally, [step 5].",
    "Don't forget to [reminder] when you've finished.",
    "",
    "Best wishes,",
    "[Your name]",
    "[Your position, e.g. Support Technician]",
    "[Your department, e.g. Help Desk Department]",
  ].join("\n");
}

export function SpeakingQuestions({
  section,
  values,
  onChange,
  disabled,
  activeRecording,
  onRecordingChange,
}: {
  section: NonNullable<SessionExam["speaking"]>;
  values: ExamAnswers["speaking"];
  onChange: (id: string, value: SpeakingAnswer) => void;
  disabled: boolean;
  activeRecording: string | null;
  onRecordingChange: (id: string, recording: boolean) => void;
}) {
  return (
    <>
      {section.parts.map((part) => (
        <section className="exam-section" key={part.id}>
          <div className="section-title">
            <span className="part-tag">PART {part.id.substring(1)}</span>
            <h2>
              {part.kind === "questions"
                ? "Trả lời câu hỏi"
                : part.kind === "explain"
                  ? "Giải thích và hướng dẫn"
                  : "Xử lý tình huống"}
            </h2>
            <p>{part.instructions}</p>
          </div>
          {part.kind === "questions" ? (
            part.questions.map((question, index) => {
              const id = `S1-${index + 1}`;
              return (
                <article className="speaking-question" key={id}>
                  <h3>
                    <span className="question-id">{id}</span>
                    {question}
                  </h3>
                  <p className="suggested-time">
                    <Icon name="clock" />
                    Gợi ý: {part.secondsPerQuestion} giây
                  </p>
                  <SpeakingRecorder
                    id={id}
                    value={values[id] ?? { text: "" }}
                    onChange={(value) => onChange(id, value)}
                    disabled={
                      disabled || (!!activeRecording && activeRecording !== id)
                    }
                    onRecordingChange={(recording) =>
                      onRecordingChange(id, recording)
                    }
                  />
                </article>
              );
            })
          ) : (
            <article className="speaking-question">
              <h3>{part.prompt}</h3>
              <ul className="speaking-cues">
                {part.cues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ul>
              <div className="grammar-chips">
                {part.requiredGrammar.map((grammar) => (
                  <span key={grammar}>{grammar}</span>
                ))}
              </div>
              <p className="suggested-time">
                <Icon name="clock" />
                Gợi ý: {part.seconds} giây
              </p>
              <SpeakingRecorder
                id={part.id}
                value={values[part.id] ?? { text: "" }}
                onChange={(value) => onChange(part.id, value)}
                disabled={
                  disabled || (!!activeRecording && activeRecording !== part.id)
                }
                onRecordingChange={(recording) =>
                  onRecordingChange(part.id, recording)
                }
              />
            </article>
          )}
        </section>
      ))}
    </>
  );
}
