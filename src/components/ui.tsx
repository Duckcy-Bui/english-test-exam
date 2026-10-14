import type { ReactNode } from "react";
import type { Skill } from "../types/app";
import type { ExamSource } from "../types/exam";

export function SourceBadge({ source }: { source: ExamSource }) {
  return (
    <span className={`badge ${source === "teacher" ? "amber" : "teal"}`}>
      {source === "teacher" ? "Đề cô" : "Đề AI"}
    </span>
  );
}

export const skillNames: Record<Skill, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};
export const skillDescriptions: Record<Skill, string> = {
  listening: "Nghe và nắm bắt thông tin",
  reading: "Đọc hiểu, ngữ pháp và từ vựng",
  writing: "Dịch câu và viết email",
  speaking: "Trình bày, hướng dẫn và xử lý tình huống",
};
export const skillIcons: Record<Skill, "headphones" | "book" | "pen" | "mic"> =
  { listening: "headphones", reading: "book", writing: "pen", speaking: "mic" };

export function Icon({
  name,
  className = "",
  ...rest
}: { name: string; className?: string } & React.SVGProps<SVGSVGElement>) {
  const paths: Record<string, ReactNode> = {
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    moon: (
      <>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    book: (
      <>
        <path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z" />
        <path d="M12 6v14" />
      </>
    ),
    headphones: (
      <>
        <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
        <rect x="3" y="12" width="4" height="8" rx="2" />
        <rect x="17" y="12" width="4" height="8" rx="2" />
      </>
    ),
    pen: (
      <>
        <path d="m16 3 5 5-12 12-6 1 1-6L16 3Z" />
        <path d="m13 6 5 5" />
      </>
    ),
    mic: (
      <>
        <rect x="9" y="3" width="6" height="12" rx="3" />
        <path d="M5 11v2a7 7 0 0 0 14 0v-2M12 20v2M8 22h8" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" />
      </>
    ),
    play: <path d="m8 4 12 8-12 8V4Z" />,
    stop: <rect x="5" y="5" width="14" height="14" rx="2" />,
    chart: (
      <>
        <path d="M4 3v18h17M8 16v-4M13 16V7M18 16v-7" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {paths[name] ?? paths.book}
    </svg>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <div role="alert" className="error-notice">
      {message}
    </div>
  );
}
export function Loading({ label = "Đang tải…" }: { label?: string }) {
  return (
    <div className="loading-state" role="status">
      <span className="spinner" />
      {label}
    </div>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Icon name="book" />
      <h2>{title}</h2>
      {children}
    </div>
  );
}
export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
