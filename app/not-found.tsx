import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <p className="eyebrow">404</p>
      <h1>Không tìm thấy trang</h1>
      <p>Trở về danh sách Unit để tiếp tục luyện tập.</p>
      <Link href="/" className="button primary">
        Về trang chủ
      </Link>
    </div>
  );
}
