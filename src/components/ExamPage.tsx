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
  Modal,
  skillNames,
  SourceBadge,
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
  const [elapsed, setElapsed] = useState(0);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [questionSheet, setQuestionSheet] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState("");
  const [requestedQuestion, setRequestedQuestion] = useState<{ id: string; token: number }>();
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
          window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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

  useEffect(() => {
    if (!session || session.expiresAt) return;
    const started = new Date(session.startedAt).getTime();
    const update = () => setElapsed(Math.max(0, Math.floor((Date.now() - started) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [session]);

  useEffect(() => {
    if (!requestedQuestion || skill === "reading") return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`question-${requestedQuestion.id}`)?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [skill, requestedQuestion]);

  useEffect(() => {
    if (!session) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveQuestion(visible[0].target.id.replace("question-", ""));
    }, { rootMargin: "-150px 0px -45% 0px", threshold: 0 });
    const observe = () => {
      observer.disconnect();
      document.querySelectorAll('.exam-content [id^="question-"]').forEach((node) => observer.observe(node));
    };
    observe();
    const mutations = new MutationObserver(observe);
    const content = document.querySelector(".exam-content");
    if (content) mutations.observe(content, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [session, skill, loading]);

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

  function navigate(item: Skill, id?: string) {
    if (!canNavigate || (sequential && item !== activeSkill)) return;
    setSkill(item);
    setQuestionSheet(false);
    const target = id ?? navIds(item)[0];
    setActiveQuestion(target ?? "");
    if (target) setRequestedQuestion({ id: target, token: Date.now() });
  }
  function navIds(item: Skill): string[] {
    if (item === "speaking") return ["S1", "S2", "S3"];
    if (item === "writing") return ["W31", "W32", "W33", "W34", "W35", "email"];
    const ids = idsFor(session!, item);
    return ids.length ? ids : Array.from({ length: expected[item] }, (_, i) => `${item === "reading" ? "R" : "L"}${i + 1}`);
  }
  function isAnswered(item: Skill, id: string): boolean {
    if (session!.completedSkills.includes(item)) return true;
    if (item === "writing") return !!(id === "email" ? answers.writing.email : answers.writing.translations[id])?.trim();
    if (item === "speaking") {
      const ids = id === "S1" ? ["S1-1", "S1-2", "S1-3"] : [id];
      return ids.every((key) => answers.speaking[key]?.audio || answers.speaking[key]?.text.trim());
    }
    return !!answers[item][id]?.trim();
  }
  const time = remaining ?? elapsed;
  const formattedTime = `${time >= 3600 ? `${Math.floor(time / 3600)}:` : ""}${Math.floor((time % 3600) / 60).toString().padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;
  const questionGrid = (
    <nav className="question-nav" aria-label="Danh sách câu hỏi">
      {scopeSkills.map((item) => {
        const locked = sequential && item !== activeSkill;
        return (
          <div className={`question-nav-group ${locked ? "locked" : ""}`} key={item}>
            <h3>{skillNames[item]} {locked && <Icon name="lock" />}</h3>
            <div className="question-grid">
              {navIds(item).map((id) => {
                const viewed = item === activeSkill && (activeQuestion === id || (id === "S1" && activeQuestion.startsWith("S1-")));
                const done = isAnswered(item, id);
                const label = id === "email" ? "Email" : id;
                return (
                  <button type="button" key={id}
                    aria-label={`Tới câu ${label}`}
                    aria-current={viewed ? "true" : undefined}
                    title={`${label}${locked ? " · Đã khoá" : done ? " · Đã trả lời" : " · Chưa trả lời"}`}
                    disabled={locked || !canNavigate}
                    className={`${done ? "answered" : ""} ${viewed ? "current" : ""}`}
                    onClick={() => navigate(item, id)}>
                    {item === "listening" || item === "reading" ? id.substring(1) : label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
  return (
    <div className="exam-page">
      <div className="exam-title-row">
        <h1>Unit {session.exam.unit}: {session.exam.unitTitle}</h1>
        <span className="exam-test-label">Đề {session.exam.testId}</span>
        <SourceBadge source={session.exam.source} />
        <span className="exam-mode">{sequential ? "Thi thử" : "Luyện tập"}</span>
        <button className="button secondary small-button" disabled={busy || !!activeRecording}
          onClick={() => hasDraft ? setExitConfirm(true) : router.push(`/unit/${session.exam.unit}`)}>Thoát</button>
      </div>
      {expired && (
        <div role="status" className="warning-notice">
          Đã hết thời gian. Bài làm đang được nộp tự động
          {activeRecording ? " sau khi hoàn tất bản ghi hiện tại" : ""}. Các câu chưa làm được tính là bỏ trống.
        </div>
      )}
      {error && <ErrorNotice message={error} />}
      <div className="exam-workspace">
        <div className="exam-content" aria-busy={busy} onFocusCapture={(event) => {
          const target = (event.target as HTMLElement).closest('[id^="question-"]');
          if (target) setActiveQuestion(target.id.replace("question-", ""));
        }}>
          <nav className="skill-tabs" aria-label="Các phần của bài làm">
            {scopeSkills.map((item) => (
              <button type="button" key={item}
                className={item === activeSkill ? "active" : ""}
                aria-current={item === activeSkill ? "page" : undefined}
                disabled={sequential ? item !== activeSkill || busy : !canNavigate}
                onClick={() => navigate(item)}>
                {skillNames[item]}
                {sequential && item !== activeSkill && <Icon name="lock" />}
              </button>
            ))}
          </nav>
          {sequential && <p className="exam-rule">Nộp từng phần để mở phần tiếp theo. Phần đã nộp được khoá; đáp án hiện sau khi nộp cả đề.</p>}
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
              requestedQuestion={requestedQuestion}
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
          <div className="exam-actions">
            <span role="status">{busy ? "Đang xử lý bài làm…" : activeRecording ? "Dừng ghi âm và đợi xử lý trước khi nộp." : `${complete}/${total} mục đã trả lời`}</span>
            {!sequential && nextSkill && <button className="button secondary" disabled={!canNavigate} onClick={() => navigate(nextSkill)}>Tiếp: {skillNames[nextSkill]} <Icon name="arrow" /></button>}
          </div>
        </div>
        <aside className="exam-sidebar" aria-label="Thời gian và nộp bài">
          <div className={`timer ${remaining !== null && remaining <= 300 ? "urgent" : ""}`} role="timer" aria-label={`${remaining !== null ? "Thời gian còn lại" : "Thời gian đã làm"} ${formattedTime}`}>
            <small>{remaining !== null ? "Thời gian còn lại:" : "Thời gian đã làm:"}</small>
            <strong>{formattedTime}</strong>
          </div>
          <button className="button submit-button" disabled={busy || !!activeRecording}
            onClick={() => { setQuestionSheet(false); expired ? void submit("final") : setConfirm(advance ? "advance" : "final"); }}>
            {busy ? "Đang xử lý…" : expired ? "Nộp lại bài" : advance ? `Nộp ${skillNames[activeSkill]}` : "NỘP BÀI"}
          </button>
          <button className="button secondary question-list-button" aria-haspopup="dialog" aria-expanded={questionSheet} onClick={() => setQuestionSheet(true)}>Danh sách câu</button>
          <div className="desktop-question-nav">
            <p className="navigation-hint">Bấm số câu để tới câu đó</p>
            {questionGrid}
          </div>
        </aside>
      </div>
      {questionSheet && <Modal titleId="question-list-title" onClose={() => setQuestionSheet(false)} className="question-sheet">
        <div className="sheet-heading"><h2 id="question-list-title">Danh sách câu</h2><button className="button secondary small-button" onClick={() => setQuestionSheet(false)}>Đóng</button></div>
        <p className="navigation-hint">Bấm số câu để tới câu đó</p>
        {questionGrid}
      </Modal>}
      {confirm && <Modal alert titleId="submit-title" onClose={() => setConfirm(null)} className="confirm-panel">
        <h2 id="submit-title">{confirm === "advance" ? `Nộp phần ${skillNames[activeSkill]}?` : "Sẵn sàng nộp bài?"}</h2>
        <p>{confirm === "advance" ? `Phần này sẽ được khoá. ${total - complete > 0 ? `Còn ${total - complete} câu chưa trả lời và sẽ tính là bỏ trống.` : "Bạn đã trả lời tất cả câu hỏi."}` : `${scopeTotal - scopeComplete > 0 ? `Còn ${scopeTotal - scopeComplete} mục chưa trả lời. ` : ""}Sau khi nộp, bạn sẽ xem điểm và giải thích.`}</p>
        <div className="modal-actions">
          <button className="button secondary" onClick={() => setConfirm(null)}>Kiểm tra lại</button>
          <button className="button primary" onClick={() => void submit(confirm)} disabled={!!activeRecording || busy}>Xác nhận nộp <Icon name="check" /></button>
        </div>
      </Modal>}
      {exitConfirm && <Modal alert titleId="exit-title" onClose={() => setExitConfirm(false)} className="confirm-panel exit-confirm">
        <h2 id="exit-title">Thoát bài chưa nộp?</h2>
        <p>Bài làm chưa được nộp. Bản nháp được giữ trên trình duyệt này; bản ghi âm cần làm lại nếu rời trang.</p>
        <div className="modal-actions">
          <button className="button secondary" onClick={() => setExitConfirm(false)}>Tiếp tục làm bài</button>
          <button className="button primary" onClick={() => router.push(`/unit/${session.exam.unit}`)}>Xác nhận thoát</button>
        </div>
      </Modal>}
    </div>
  );
}
