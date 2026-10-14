"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../client/api";
import { saveAttempt } from "../client/history";
import {
  emptyAnswers,
  SKILLS,
  type ExamAnswers,
  type ExamSession,
  type Skill,
} from "../types/app";
import {
  ListeningQuestions,
  ReadingQuestions,
  SpeakingQuestions,
  WritingQuestions,
} from "./QuestionSections";
import {
  ErrorNotice,
  Icon,
  Loading,
  skillDescriptions,
  skillIcons,
  skillNames,
} from "./ui";

function idsFor(session: ExamSession, skill: Skill): string[] {
  const exam = session.exam;
  if (skill === "listening")
    return (
      exam.listening?.parts.flatMap((part) =>
        part.questions.map((question) => question.id),
      ) ?? []
    );
  if (skill === "reading" && exam.reading)
    return [
      ...exam.reading.matching.items,
      ...exam.reading.grammar,
      ...exam.reading.vocabulary,
      ...exam.reading.passageMcq.questions,
      ...exam.reading.passageTrueFalse.questions,
    ].map((question) => question.id);
  if (skill === "writing")
    return [
      ...(exam.writing?.translation.items.map((item) => item.id) ?? []),
      "W-EMAIL",
    ];
  if (skill === "speaking") return ["S1-1", "S1-2", "S1-3", "S2", "S3"];
  return [];
}
function answered(
  session: ExamSession,
  skill: Skill,
  answers: ExamAnswers,
): number {
  return idsFor(session, skill).filter((id) =>
    skill === "writing"
      ? (id === "W-EMAIL"
          ? answers.writing.email
          : answers.writing.translations[id]
        )?.trim()
      : skill === "speaking"
        ? answers.speaking[id]?.audio || answers.speaking[id]?.text.trim()
        : answers[skill][id]?.trim(),
  ).length;
}
const expected: Record<Skill, number> = {
  listening: 10,
  reading: 30,
  writing: 6,
  speaking: 5,
};

export function ExamPage({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [skill, setSkill] = useState<Skill>("listening");
  const [answers, setAnswers] = useState<ExamAnswers>(emptyAnswers);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<"advance" | "final" | null>(null);
  const [activeRecording, setActiveRecording] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  const answersRef = useRef(answers);
  const sessionRef = useRef(session);
  const submitting = useRef(false);
  const autoSubmitted = useRef(false);
  answersRef.current = answers;
  sessionRef.current = session;
  const draftKey = `english-it-draft-${sessionId}`;
  const hasDraft =
    Object.keys(answers.listening).length > 0 ||
    Object.keys(answers.reading).length > 0 ||
    Object.values(answers.writing.translations).some((text) => text.trim()) ||
    !!answers.writing.email.trim() ||
    Object.values(answers.speaking).some(
      (answer) => answer.audio || answer.text.trim(),
    );

  useEffect(() => {
    let live = true;
    api
      .session(sessionId)
      .then(({ session }) => {
        if (!live) return;
        setSession(session);
        setSkill(
          session.mode === "exam"
            ? (session.activeSkill ?? "speaking")
            : session.scope === "full"
              ? "listening"
              : session.scope,
        );
      })
      .catch((error) => {
        if (live) setError(error.message);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    try {
      const stored = sessionStorage.getItem(draftKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ExamAnswers;
        if (
          parsed?.listening &&
          parsed.reading &&
          parsed.writing?.translations &&
          typeof parsed.writing.email === "string" &&
          parsed.speaking
        )
          setAnswers(parsed);
      }
    } catch {
      /* An unavailable draft does not prevent taking the exam. */
    }
    return () => {
      live = false;
    };
  }, [sessionId, draftKey]);

  useEffect(() => {
    if (loading || busy) return;
    try {
      sessionStorage.setItem(
        draftKey,
        JSON.stringify({
          ...answers,
          speaking: Object.fromEntries(
            Object.entries(answers.speaking).map(([id, answer]) => [
              id,
              { text: answer.text },
            ]),
          ),
        }),
      );
    } catch {
      /* Keep the current draft in memory. */
    }
  }, [answers, busy, draftKey, loading]);

  useEffect(() => {
    if (!session?.expiresAt) return;
    const deadline = new Date(session.expiresAt).getTime();
    function update() {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) setExpired(true);
    }
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [session?.expiresAt]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    if (hasDraft || activeRecording || busy)
      window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasDraft, activeRecording, busy]);

  const submit = useCallback(
    async (action: "advance" | "final") => {
      const current = sessionRef.current;
      if (!current || submitting.current) return;
      submitting.current = true;
      setBusy(true);
      setError("");
      setConfirm(null);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      try {
        if (action === "advance") {
          const { session: nextSession } = await api.section(
            sessionId,
            current.activeSkill ?? skill,
            answersRef.current,
          );
          setSession(nextSession);
          setSkill(nextSession.activeSkill ?? "speaking");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const { result } = await api.grade(sessionId, answersRef.current);
          const saved = saveAttempt(result, answersRef.current);
          try {
            sessionStorage.removeItem(draftKey);
          } catch {
            /* No retained draft is needed. */
          }
          router.push(`/results/${result.id}${saved ? "" : "?unsaved=1"}`);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Chưa nộp được bài. Bài làm của bạn vẫn đang ở đây.",
        );
      } finally {
        submitting.current = false;
        setBusy(false);
      }
    },
    [draftKey, router, sessionId, skill],
  );

  useEffect(() => {
    if (
      !expired ||
      activeRecording ||
      busy ||
      autoSubmitted.current ||
      !session
    )
      return;
    autoSubmitted.current = true;
    void submit("final");
  }, [expired, activeRecording, busy, session, submit]);

  if (loading) return <Loading label="Đang mở bài làm…" />;
  if (!session)
    return (
      <>
        <ErrorNotice
          message={
            error || "Phiên làm bài đã hết hạn. Hãy bắt đầu một bài mới."
          }
        />
        <Link href="/" className="button primary">
          Về danh sách Unit
        </Link>
      </>
    );
  const scopeSkills = session.scope === "full" ? SKILLS : [session.scope];
  const sequential = session.mode === "exam";
  const activeSkill = sequential ? (session.activeSkill ?? "speaking") : skill;
  const complete = answered(session, activeSkill, answers);
  const total = expected[activeSkill];
  const sectionDisabled = busy || expired;
  const advance = sequential && activeSkill !== "speaking" && !expired;
  const nextSkill = scopeSkills[scopeSkills.indexOf(activeSkill) + 1];
  const canNavigate = !busy && !activeRecording && !expired;
  const currentSection = session.exam[activeSkill];
  const scopeComplete = scopeSkills.reduce(
    (sum, item) =>
      sum +
      (session.completedSkills.includes(item)
        ? expected[item]
        : answered(session, item, answers)),
    0,
  );
  const scopeTotal = scopeSkills.reduce((sum, item) => sum + expected[item], 0);

  return (
    <>
      <div className="exam-topline">
        <span className="back-link">
          UNIT {session.exam.unit} · {session.exam.unitTitle}
        </span>
        <span className={`badge ${sequential ? "amber" : "teal"}`}>
          {sequential ? "Thi thử" : "Luyện tập"}
        </span>
      </div>
      <div className="exam-title-row">
        <div>
          <p className="eyebrow">
            {scopeSkills.length === 4
              ? "ĐỀ ĐẦY ĐỦ · 4 KỸ NĂNG"
              : "LUYỆN MỘT KỸ NĂNG"}
          </p>
          <h1>{session.exam.unitTitle}</h1>
        </div>
        {remaining !== null ? (
          <div
            className={`timer ${remaining <= 300 ? "urgent" : ""}`}
            role="timer"
            aria-label={`Thời gian còn lại ${Math.floor(remaining / 60)} phút ${remaining % 60} giây`}
          >
            <Icon name="clock" />
            <div>
              <small>THỜI GIAN CÒN LẠI</small>
              <strong>
                {Math.floor(remaining / 3600)
                  .toString()
                  .padStart(2, "0")}
                :
                {Math.floor((remaining % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(remaining % 60).toString().padStart(2, "0")}
              </strong>
            </div>
          </div>
        ) : (
          <div className="untimed-note">
            <Icon name="book" />
            Học theo nhịp của bạn
          </div>
        )}
      </div>
      <nav className="skill-tabs" aria-label="Các phần của bài làm">
        {scopeSkills.map((item, index) => {
          const locked = session.completedSkills.includes(item);
          const tabDisabled = sequential
            ? item !== activeSkill || busy
            : !canNavigate;
          return (
            <button
              key={item}
              className={`${item === activeSkill ? "active" : ""} ${locked ? "completed" : ""}`}
              disabled={tabDisabled}
              aria-current={item === activeSkill ? "step" : undefined}
              onClick={() => {
                setSkill(item);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="tab-step">
                {locked ? <Icon name="check" /> : index + 1}
              </span>
              <span>
                {skillNames[item]}
                <small>
                  {locked
                    ? "Đã nộp · Đã khoá"
                    : sequential && item !== activeSkill
                      ? "Chưa mở"
                      : `${answered(session, item, answers)}/${expected[item]} hoàn thành`}
                </small>
              </span>
              {sequential && item !== activeSkill && (
                <Icon name="lock" className="tab-lock" />
              )}
            </button>
          );
        })}
      </nav>
      {sequential && (
        <p className="exam-rule">
          <Icon name="lock" />
          Nộp từng phần để mở phần tiếp theo. Phần đã nộp không thể sửa; đáp án
          chỉ hiện sau khi nộp cả đề.
        </p>
      )}
      {expired && (
        <div role="status" className="warning-notice">
          Đã hết thời gian. Bài làm đang được nộp tự động
          {activeRecording ? " sau khi hoàn tất bản ghi hiện tại" : ""}. Các câu
          chưa làm được tính là bỏ trống.
        </div>
      )}
      {error && <ErrorNotice message={error} />}
      <div className="exam-workspace">
        <aside className="exam-sidebar">
          <span className={`skill-icon skill-${activeSkill}`}>
            <Icon name={skillIcons[activeSkill]} />
          </span>
          <h2>{skillNames[activeSkill]}</h2>
          <p>{skillDescriptions[activeSkill]}</p>
          <div className="progress-label">
            <span>Đã trả lời</span>
            <strong>
              {complete}/{total}
            </strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${(complete / total) * 100}%` }} />
          </div>
          <div className="sidebar-score">
            <strong>2,50</strong>
            <span>điểm tối đa</span>
          </div>
          <p className="sidebar-tip">
            {activeSkill === "listening"
              ? "Đọc câu hỏi trước khi nghe. Part B trả lời không quá 3 từ."
              : activeSkill === "reading"
                ? "Đọc kỹ ngữ cảnh, rồi chọn đáp án phù hợp nhất."
                : activeSkill === "writing"
                  ? "Kiểm tra đủ các bước hướng dẫn và cấu trúc email trước khi nộp."
                  : "Nói rõ ràng, dùng ngữ pháp của Unit và hỗ trợ ý chính bằng ví dụ."}
          </p>
        </aside>
        <div className="exam-content" aria-busy={busy}>
          {activeSkill === "listening" && session.exam.listening && (
            <ListeningQuestions
              section={session.exam.listening}
              sessionId={sessionId}
              examMode={sequential}
              values={answers.listening}
              onChange={(id, value) =>
                setAnswers((current) => ({
                  ...current,
                  listening: { ...current.listening, [id]: value },
                }))
              }
              disabled={sectionDisabled}
            />
          )}
          {activeSkill === "reading" && session.exam.reading && (
            <ReadingQuestions
              section={session.exam.reading}
              values={answers.reading}
              onChange={(id, value) =>
                setAnswers((current) => ({
                  ...current,
                  reading: { ...current.reading, [id]: value },
                }))
              }
              disabled={sectionDisabled}
            />
          )}
          {activeSkill === "writing" && session.exam.writing && (
            <WritingQuestions
              section={session.exam.writing}
              values={answers.writing}
              onChange={(writing) =>
                setAnswers((current) => ({ ...current, writing }))
              }
              disabled={sectionDisabled}
            />
          )}
          {activeSkill === "speaking" && session.exam.speaking && (
            <SpeakingQuestions
              section={session.exam.speaking}
              values={answers.speaking}
              onChange={(id, value) =>
                setAnswers((current) => ({
                  ...current,
                  speaking: { ...current.speaking, [id]: value },
                }))
              }
              disabled={sectionDisabled}
              activeRecording={activeRecording}
              onRecordingChange={(id, recording) =>
                setActiveRecording((current) =>
                  recording ? id : current === id ? null : current,
                )
              }
            />
          )}
          {!currentSection && (
            <ErrorNotice message="Nội dung phần này chưa mở. Hãy tải lại phiên làm bài." />
          )}
          {confirm && (
            <div className="confirm-panel" role="alert">
              <div>
                <h3>
                  {confirm === "advance"
                    ? `Nộp phần ${skillNames[activeSkill]}?`
                    : "Sẵn sàng nộp bài?"}
                </h3>
                <p>
                  {confirm === "advance"
                    ? `Phần này sẽ được khoá. ${total - complete > 0 ? `Còn ${total - complete} câu chưa trả lời và sẽ tính là bỏ trống.` : "Bạn đã trả lời tất cả câu hỏi."}`
                    : `${scopeTotal - scopeComplete > 0 ? `Còn ${scopeTotal - scopeComplete} mục chưa trả lời. ` : ""}Sau khi nộp, bạn sẽ xem điểm và giải thích.`}
                </p>
              </div>
              <div>
                <button
                  className="button secondary"
                  onClick={() => setConfirm(null)}
                >
                  Kiểm tra lại
                </button>
                <button
                  className="button primary"
                  onClick={() => void submit(confirm)}
                  disabled={!!activeRecording || busy}
                >
                  Xác nhận nộp
                  <Icon name="check" />
                </button>
              </div>
            </div>
          )}
          <div className="exam-actions">
            <span>
              {busy ? (
                <>
                  <span className="spinner" />
                  {advance
                    ? "Đang nộp phần…"
                    : "Đang chấm bài. Vui lòng giữ trang này mở…"}
                </>
              ) : activeRecording ? (
                "Hãy dừng ghi âm và đợi xử lý trước khi chuyển phần hoặc nộp bài."
              ) : (
                `${complete}/${total} mục đã trả lời`
              )}
            </span>
            <div>
              {!sequential && nextSkill && (
                <button
                  className="button secondary"
                  onClick={() => {
                    setSkill(nextSkill);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={!canNavigate}
                >
                  Tiếp: {skillNames[nextSkill]}
                  <Icon name="arrow" />
                </button>
              )}
              <button
                className="button primary"
                disabled={busy || !!activeRecording}
                onClick={() =>
                  expired
                    ? void submit("final")
                    : setConfirm(advance ? "advance" : "final")
                }
              >
                {busy
                  ? "Đang xử lý…"
                  : expired
                    ? "Nộp lại bài"
                    : advance
                      ? `Nộp ${skillNames[activeSkill]} & tiếp tục`
                      : "Nộp bài & xem kết quả"}
                <Icon name={advance ? "arrow" : "check"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
