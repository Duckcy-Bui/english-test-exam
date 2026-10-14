"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api } from "../client/api";
import type { TestId } from "../types/exam";
import type { ExamSession } from "../types/app";
import { ListenButton } from "./QuestionSections";

export function ListenPage({ unit, testId }: { unit: number; testId: TestId }) {
  const [session, setSession] = useState<ExamSession | null>(null);
  const [code, setCode] = useState("");
  const [locked, setLocked] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const initialized = useRef<{ key: string; promise: Promise<ExamSession | null> } | null>(null);
  useEffect(() => {
    let live = true;
    const key = `${unit}:${testId}`;
    setSession(null); setBusy(true); setError(""); setLocked(false);
    if (initialized.current?.key !== key) {
      initialized.current = { key, promise: (async () => {
        if (!(await api.access()).authenticated) return null;
        return (await api.paperSession(unit, testId)).session;
      })() };
    }
    void initialized.current.promise.then((value) => {
      if (live) { setSession(value); setLocked(value === null); }
    }).catch((error: unknown) => {
      if (live) setError(error instanceof Error ? error.message : "Không mở được bài nghe.");
    }).finally(() => { if (live) setBusy(false); });
    return () => { live = false; };
  }, [unit, testId]);
  return <div>
    <div className="page-heading"><div><p className="eyebrow">BÀI NGHE CHO ĐỀ GIẤY</p>
      <h1>Unit {unit} · Đề {testId}</h1>
      {session && <p>{session.exam.unitTitle} · {session.exam.source === "teacher" ? "Đề cô" : "Đề AI"}</p>}
      <p>Nghe Part A và Part B để làm phần Listening trong PDF.</p>
    </div></div>
    {locked && <form className="question-card" onSubmit={async (event) => {
      event.preventDefault(); setBusy(true); setError("");
      try {
        await api.unlock(code);
        setLocked(false);
        setSession((await api.paperSession(unit, testId)).session);
      } catch (error) { setError(error instanceof Error ? error.message : "Không mở được bài nghe."); }
      finally { setBusy(false); }
    }}>
      <label htmlFor="listen-access">Mã truy cập</label>
      <input id="listen-access" type="password" value={code} maxLength={256}
        onChange={(event) => setCode(event.target.value)} autoComplete="off" required />
      <button className="button primary" disabled={busy}>Mở bài nghe</button>
    </form>}
    {busy && <p role="status">Đang mở bài nghe…</p>}
    {error && <p className="field-error" role="alert">{error}</p>}
    {session?.exam.listening?.parts.map((part) => <section className="exam-section" key={part.id}>
      <div className="section-title"><h2>Listening · Part {part.id}</h2><p>{part.context}</p></div>
      <ListenButton sessionId={session.sessionId} partId={part.id} examMode={false} disabled={false} listeningOnly />
    </section>)}
    <Link className="button ghost" href={`/unit/${unit}`}>Xem các đề Unit {unit}</Link>
  </div>;
}
