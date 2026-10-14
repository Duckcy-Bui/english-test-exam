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

// Đặt chế độ sáng/tối trước khi trang hiển thị để không bị nháy màu.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
