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
          <h1>English for IT 2</h1>
          <p className="hero-description">Luyện nghe, đọc, viết và nói theo từng Unit.</p>
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
              <h2>Chọn một Unit để bắt đầu</h2>
            </div>
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
                <p className="unit-label">Unit {unit.unit}</p>
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
                      Vào Unit <Icon name="arrow" />
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

    </>
  );
}
