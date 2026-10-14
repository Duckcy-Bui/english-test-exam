"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./ui";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="English for IT, trang chủ">
          <span className="brand-symbol">
            <Icon name="book" />
          </span>
          <span>
            English <b>for IT</b>
            <small>LEARN. PRACTISE. PROGRESS.</small>
          </span>
        </Link>
        <nav aria-label="Điều hướng chính">
          <Link
            href="/"
            className={
              pathname === "/" || pathname.startsWith("/unit") ? "active" : ""
            }
          >
            Các Unit
          </Link>
          <Link
            href="/history"
            className={pathname.startsWith("/history") ? "active" : ""}
          >
            <Icon name="chart" />
            Lịch sử
          </Link>
        </nav>
        <span className="course-badge">ENGLISH FOR IT 2</span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>English for IT 2</span>
      <p>
        Mỗi ngày một bước tiến. Luyện đủ 4 kỹ năng, tự tin hơn với tiếng Anh
        chuyên ngành.
      </p>
      <span>8 Unit · 4 kỹ năng</span>
    </footer>
  );
}
