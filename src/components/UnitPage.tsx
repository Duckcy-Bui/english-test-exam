"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../client/api";
import { bestScores, readHistory, scoreKey } from "../client/history";
import { SKILLS, type Mode, type Scope, type UnitSummary } from "../types/app";
import type { TestId } from "../types/exam";
import {
  EmptyState,
  ErrorNotice,
  Icon,
  Loading,
  skillDescriptions,
  skillIcons,
  skillNames,
  SourceBadge,
} from "./ui";

export function UnitPage({ unit }: { unit: number }) {
  const router = useRouter();
  const [summary, setSummary] = useState<UnitSummary | null>(null);
  const [mode, setMode] = useState<Mode>("practice");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<{ testId: TestId; scope: Scope } | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    setScores(bestScores(readHistory()));
    api
      .units()
      .then((data) => {
        if (live)
          setSummary(data.units.find((item) => item.unit === unit) ?? null);
      })
      .catch((error) => {
        if (live) setError(error.message);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [unit]);
  async function start(testId: TestId, scope: Scope) {
    setBusy({ testId, scope });
    setError("");
    try {
      const { session } = await api.start(unit, testId, mode, scope);
      router.push(`/exam/${session.sessionId}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Không thể bắt đầu bài làm.",
      );
      setBusy(null);
    }
  }
  if (loading) return <Loading />;
  if (!summary?.available)
    return (
      <>
        <Link href="/" className="back-link">
          ← Danh sách Unit
        </Link>
        {error && <ErrorNotice message={error} />}
        <EmptyState
          title={
            summary ? "Unit này đang được chuẩn bị" : "Không tìm thấy Unit"
          }
        >
          <p>Hãy quay lại danh sách để chọn một Unit đã sẵn sàng.</p>
        </EmptyState>
      </>
    );
  return (
    <>
      <Link href="/" className="back-link">
        ← Danh sách Unit
      </Link>
      <section className="unit-heading">
        <div>
          <p className="eyebrow">UNIT {unit.toString().padStart(2, "0")}</p>
          <h1>{summary.title}</h1>
          <p>
            {summary.testCount} đề · Chọn một đề để luyện kỹ năng hoặc làm cả đề.
          </p>
          <div className="grammar-chips">
            {summary.grammarFocus.map((grammar) => (
              <span key={grammar}>{grammar}</span>
            ))}
          </div>
        </div>
        <div className="unit-mark" aria-hidden="true">
          {unit.toString().padStart(2, "0")}
        </div>
      </section>
      <section className="mode-panel">
        <div>
          <h2>Hôm nay bạn muốn học thế nào?</h2>
          <p>
            {mode === "practice"
              ? "Không tính giờ. Xem đáp án và giải thích ngay sau khi nộp."
              : "90 phút cho cả đề, làm lần lượt Nghe → Đọc → Viết → Nói. Phần đã nộp sẽ được khoá."}
          </p>
        </div>
        <div className="mode-switch" role="group" aria-label="Chế độ làm bài">
          <button
            className={mode === "practice" ? "selected" : ""}
            aria-pressed={mode === "practice"}
            onClick={() => setMode("practice")}
            disabled={!!busy}
          >
            <Icon name="book" />
            Luyện tập
          </button>
          <button
            className={mode === "exam" ? "selected" : ""}
            aria-pressed={mode === "exam"}
            onClick={() => setMode("exam")}
            disabled={!!busy}
          >
            <Icon name="clock" />
            Thi thử
          </button>
        </div>
      </section>
      {error && <ErrorNotice message={error} />}
      <div className="test-list">
        {summary.tests.map((test) => {
          const score = scores[scoreKey(unit, test.testId)];
          return (
            <section
              className="test-card"
              key={test.testId}
              data-test-id={test.testId}
              aria-label={`Đề ${test.testId}`}
            >
              <div className="test-card-heading">
                <div>
                  <h2>Đề {test.testId}</h2>
                  <div className="test-card-meta">
                    <SourceBadge source={test.source} />
                    <span className="best-score">
                      Điểm cao nhất{" "}
                      <strong>
                        {score === undefined ? "—" : `${score.toFixed(2)} / 10`}
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="pdf-actions">
                  <a
                    className="button secondary"
                    href={`/api/pdf?unit=${unit}&test=${test.testId}&kind=exam`}
                    download
                  >
                    Tải PDF đề
                  </a>
                  <a
                    className="button secondary"
                    href={`/api/pdf?unit=${unit}&test=${test.testId}&kind=answers`}
                    download
                  >
                    Tải PDF đáp án
                  </a>
                </div>
              </div>
              <div className="skill-grid">
                {SKILLS.map((skill, index) => (
                  <article className={`skill-card skill-${skill}`} key={skill}>
                    <div className="skill-card-top">
                      <span className="skill-icon">
                        <Icon name={skillIcons[skill]} />
                      </span>
                      <span className="subtle-number">0{index + 1}</span>
                    </div>
                    <h2>{skillNames[skill]}</h2>
                    <p>{skillDescriptions[skill]}</p>
                    <div className="skill-details">
                      <span>
                        {skill === "listening"
                          ? "10 câu · 2 phần"
                          : skill === "reading"
                            ? "30 câu · 5 phần"
                            : skill === "writing"
                              ? "5 câu dịch · 1 email"
                              : "3 phần · 5 bài nói"}
                      </span>
                      <strong>2,50 điểm</strong>
                    </div>
                    {mode === "practice" ? (
                      <button
                        className="button secondary"
                        onClick={() => start(test.testId, skill)}
                        disabled={!!busy}
                      >
                        {busy?.testId === test.testId && busy.scope === skill
                          ? "Đang mở đề…"
                          : "Luyện kỹ năng này"}
                        <Icon name="arrow" />
                      </button>
                    ) : (
                      <p className="quiet-note">Phần {index + 1} trong đề thi thử</p>
                    )}
                  </article>
                ))}
              </div>
              <section className="full-exam-panel">
                <span className="full-exam-icon">
                  <Icon name="spark" />
                </span>
                <div>
                  <p className="eyebrow">THỬ THÁCH TOÀN DIỆN</p>
                  <h2>4 kỹ năng. Một bước tiến lớn.</h2>
                  <p>
                    {mode === "exam"
                      ? "90 phút cho cả đề · Listening tối đa 2 lần mỗi phần · Thang điểm 10"
                      : "Làm đủ 4 kỹ năng theo nhịp của bạn · Thang điểm 10"}
                  </p>
                </div>
                <button
                  className="button light"
                  onClick={() => start(test.testId, "full")}
                  disabled={!!busy}
                >
                  {busy?.testId === test.testId && busy.scope === "full"
                    ? "Đang mở đề…"
                    : "Thi cả đề"}
                  <Icon name="arrow" />
                </button>
              </section>
            </section>
          );
        })}
      </div>
    </>
  );
}
