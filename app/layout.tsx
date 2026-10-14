import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer, Header } from "../src/components/Shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "English for IT · Luyện thi",
    template: "%s · English for IT",
  },
  description:
    "Luyện 4 kỹ năng tiếng Anh chuyên ngành CNTT theo 8 Unit. Làm bài, xem giải thích và theo dõi tiến bộ.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <a href="#main" className="skip-link">
          Đến nội dung chính
        </a>
        <Header />
        <main id="main" className="main-container">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
