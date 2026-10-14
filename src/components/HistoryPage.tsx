"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearHistory,
  deleteAttempt,
  readHistory,
  type SavedAttempt,
} from "../client/history";
import {
  EmptyState,
  ErrorNotice,
  formatDate,
  Icon,
  skillNames,
  SourceBadge,
} from "./ui";

export function HistoryPage() {
  const [attempts, setAttempts] = useState<SavedAttempt[]>([]);
  const [ready, setReady] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setAttempts(readHistory());
    setReady(true);
  }, []);
  function remove(id: string) {
    try {
      if (id === "all") clearHistory();
      else deleteAttempt(id);
      setAttempts(readHistory());
      setConfirm(null);
    } catch {
      setError(
        "Trình duyệt chưa cho phép xoá lịch sử. Vui lòng kiểm tra quyền lưu trữ.",
      );
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Lịch sử làm bài</h1>
          <p>Xem kết quả các lần làm bài đã lưu trên trình duyệt này.</p>
        </div>
        {attempts.length > 0 && (
          <button
            className="button ghost danger"
            onClick={() => setConfirm("all")}
          >
            <Icon name="trash" />
            Xoá tất cả
          </button>
        )}
      </div>
      {error && <ErrorNotice message={error} />}
      {confirm && (
        <div className="confirm-panel" role="alert">
          <p>
            {confirm === "all"
              ? "Xoá toàn bộ lịch sử trên trình duyệt này?"
              : "Xoá lần làm bài này khỏi lịch sử?"}{" "}
            Bạn sẽ không thể khôi phục.
          </p>
          <div>
            <button
              className="button secondary"
              onClick={() => setConfirm(null)}
            >
              Giữ lại
            </button>
            <button
              className="button danger-button"
              onClick={() => remove(confirm)}
            >
              Xoá lịch sử
            </button>
          </div>
        </div>
      )}
      {ready && !attempts.length ? (
        <EmptyState title="Chưa có lịch sử làm bài">
          <p>Kết quả sẽ xuất hiện ở đây sau khi bạn nộp bài.</p>
          <Link href="/" className="button primary">
            Chọn Unit
            <Icon name="arrow" />
          </Link>
        </EmptyState>
      ) : (
        <div className="history-list">
          {attempts.map(({ result }) => (
            <article className="history-row" key={result.id}>
              <div className="history-info">
                <h2>
                  Unit {result.unit}: {result.unitTitle} · Đề {result.testId}
                </h2>
                <SourceBadge source={result.source} />
                <p>
                  {formatDate(result.submittedAt)} <span>·</span>{" "}
                  {result.mode === "practice" ? "Luyện tập" : "Thi thử"}{" "}
                  <span>·</span>{" "}
                  {result.scope === "full"
                    ? "Đủ 4 kỹ năng"
                    : skillNames[result.scope]}
                </p>
                {result.mock && (
                  <span className="quiet-note">Kết quả chấm mô phỏng</span>
                )}
              </div>
              <div className="history-score">
                <strong>{result.total.toFixed(2)}</strong>
                <span>/ {result.scope === "full" ? "10" : "2,50"}</span>
              </div>
              <Link href={`/results/${result.id}`} className="button secondary">
                Xem kết quả
                <Icon name="arrow" />
              </Link>
              <button
                className="icon-button danger"
                aria-label={`Xoá kết quả Unit ${result.unit} đề ${result.testId} ngày ${formatDate(result.submittedAt)}`}
                onClick={() => setConfirm(result.id)}
              >
                <Icon name="trash" />
              </button>
            </article>
          ))}
        </div>
      )}
      <p className="quiet-note">
        Lịch sử lưu trên trình duyệt này, tối đa 40 lần làm bài gần nhất. Xoá dữ
        liệu trình duyệt sẽ xoá lịch sử.
      </p>
    </>
  );
}
