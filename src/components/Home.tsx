"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../client/api";
import { bestScores, readHistory, scoreKey } from "../client/history";
import type { UnitSummary } from "../types/app";
import { ErrorNotice, Icon, Loading } from "./ui";

export function Home() {
  const [units, setUnits] = useState<UnitSummary[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  async function loadUnits() {
    const response = await api.units();
    setUnits(response.units);
  }
  useEffect(() => {
    let live = true;
    setScores(bestScores(readHistory()));
    api
      .access()
      .then(async (data) => {
        if (!live) return;
        setAuthenticated(data.authenticated);
        if (data.authenticated) await loadUnits();
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
  }, []);
  async function unlock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api.unlock(code);
      if (!data.authenticated)
        throw new Error("Mã truy cập chưa đúng. Vui lòng kiểm tra lại.");
      setAuthenticated(true);
      setCode("");
      await loadUnits();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Không thể mở khoá.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-dot" />
            KHÔNG GIAN LUYỆN THI CỦA BẠN
          </p>
          <h1>
            Tiếng Anh chuyên ngành.
            <br />
            <em>Tự tin từng kỹ năng.</em>
          </h1>
          <p className="hero-description">
            Luyện nghe, đọc, viết và nói theo từng Unit. Hiểu vì sao bạn đúng,
            học từ mỗi lỗi sai và thấy mình tiến bộ.
          </p>
          <div className="hero-features">
            <span>
              <Icon name="check" />8 Unit theo giáo trình
            </span>
            <span>
              <Icon name="check" />
              Giải thích bằng tiếng Việt
            </span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-card card-listening">
            <Icon name="headphones" />
            <span>
              Listen<small>Nắm bắt thông tin</small>
            </span>
            <div className="waveform">
              {[10, 19, 28, 14, 24, 34, 17, 26, 12].map((h, i) => (
                <i key={i} style={{ height: h }} />
              ))}
            </div>
          </div>
          <div className="art-card card-reading">
            <Icon name="book" />
            <span>
              Read<small>Mở rộng hiểu biết</small>
            </span>
            <Icon name="check" />
          </div>
          <div className="art-card card-speaking">
            <Icon name="mic" />
            <span>
              Speak<small>Tự tin diễn đạt</small>
            </span>
            <Icon name="spark" />
          </div>
          <span className="floating-label">A LITTLE PRACTICE, EVERY DAY.</span>
        </div>
      </section>
      {loading ? (
        <Loading label="Đang mở không gian học tập…" />
      ) : !authenticated ? (
        <section className="access-panel">
          <div className="access-icon">
            <Icon name="lock" />
          </div>
          <div>
            <p className="eyebrow">BẮT ĐẦU HỌC</p>
            <h2>Nhập mã truy cập của lớp</h2>
            <p>Bạn chỉ cần nhập mã một lần trên trình duyệt này.</p>
          </div>
          <form onSubmit={unlock}>
            <label className="sr-only" htmlFor="access-code">
              Mã truy cập
            </label>
            <input
              id="access-code"
              autoComplete="off"
              type="password"
              placeholder="Mã truy cập"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
            <button className="button primary" disabled={busy || !code.trim()}>
              {busy ? "Đang kiểm tra…" : "Vào luyện tập"}
              <Icon name="arrow" />
            </button>
          </form>
        </section>
      ) : (
        <section className="units-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LỘ TRÌNH CỦA BẠN</p>
              <h2>Chọn một Unit để bắt đầu</h2>
            </div>
            <p>Đi từng bước nhỏ. Giữ nhịp học mỗi ngày.</p>
          </div>
          <div className="units-grid">
            {units.map((unit) => (
              <article
                key={unit.unit}
                className={`unit-card ${unit.available ? "available" : "unavailable"}`}
              >
                <div className="unit-card-top">
                  <span className="unit-number">
                    {String(unit.unit).padStart(2, "0")}
                  </span>
                  <span
                    className={`badge ${unit.available ? "teal" : "muted"}`}
                  >
                    {unit.available ? "Sẵn sàng luyện tập" : "Sắp có"}
                  </span>
                </div>
                <p className="unit-label">UNIT {unit.unit}</p>
                <h3>{unit.title}</h3>
                <p className="test-count">{unit.testCount} đề</p>
                <p className="unit-grammar">
                  {unit.grammarFocus.length
                    ? unit.grammarFocus.join(" · ")
                    : "4 kỹ năng tiếng Anh chuyên ngành"}
                </p>
                <div className="unit-card-bottom">
                  <div className="test-best-scores">
                    <span>Điểm cao nhất từng đề</span>
                    {unit.tests.map((test) => {
                      const score = scores[scoreKey(unit.unit, test.testId)];
                      return (
                        <span className="test-best-score" key={test.testId}>
                          Đề {test.testId}{" "}
                          <strong>
                            {score !== undefined ? `${score.toFixed(2)} / 10` : "—"}
                          </strong>
                        </span>
                      );
                    })}
                  </div>
                  {unit.available ? (
                    <Link
                      href={`/unit/${unit.unit}`}
                      className="round-link"
                      aria-label={`Luyện tập Unit ${unit.unit}`}
                    >
                      <Icon name="arrow" />
                    </Link>
                  ) : (
                    <span className="round-link disabled">
                      <Icon name="lock" />
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="quiet-note">
            Điểm cao nhất tính từ các lần làm đủ 4 kỹ năng. Lịch sử được lưu
            trên trình duyệt bạn đang dùng.
          </p>
        </section>
      )}
      {error && <ErrorNotice message={error} />}
      <section className="how-it-works">
        <div>
          <span>01</span>
          <h3>Chọn cách học</h3>
          <p>Luyện từng kỹ năng hoặc thử sức với một đề đầy đủ.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Tập trung làm bài</h3>
          <p>Luyện tập theo nhịp của bạn. Thi thử để quen áp lực thời gian.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Hiểu và tiến bộ</h3>
          <p>
            Xem đáp án, giải thích và nhận xét cụ thể cho bài viết, bài nói.
          </p>
        </div>
      </section>
    </>
  );
}
