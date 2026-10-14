# Unit 4 — kiểm lại r1

- Auditor: et-auditor — gpt-6-astra; nhánh `audit/unit-4-r1`.
- Thời gian: 2026-10-14 15:45:11 +0700.
- Nguồn duy nhất để giải: `audit/unit-4.stripped.json`; SHA-256 `e82744c607b69ff6751450b891ccfa11ffe46c10b6b37c7045a09e965db7a17c`.
- Đáp án mù 6 câu đã commit trước báo cáo: `4b25cda`.

## Sáu câu được giao

| Câu | Chọn | Còn đa đáp án? |
|---|---|---|
| R7 | D | Còn vướng tính duy nhất về ngữ pháp: A/B cũng ghép đúng cấu trúc; D hợp lý nhất theo an toàn. |
| R9 | A | Không; chỉ “By running” tạo cấu trúc đúng. |
| R14 | B | Không; các phương án còn lại không phù hợp mô tả trường định danh. |
| R15 | C | Không; “Form” phù hợp giao diện nhập liệu, các phương án còn lại không phù hợp. |
| R23 | B | Không; đoạn 3 nêu trực tiếp Maria chưa tin bảng tính. |
| R25 | D | Không; đoạn cuối nêu ngừng làm bánh mì nâu cho cửa hàng thứ hai. |

R7 — **CHẶN** — Quy tắc 4 (và tính duy nhất của quy tắc 1): “while cleaning” và “after cleaning” vẫn đúng ngữ pháp; chọn “before” dựa vào giả định trình tự an toàn. Chưa đạt yêu cầu câu ngữ pháp chỉ có một phương án đúng ngữ pháp. Đề xuất viết lại thành “Before ______ the keyboard, always switch off and unplug the computer”, với các lựa chọn clean / cleaning / cleaned / to clean; giải mù lại ở phiên mới.

## Rà quy tắc 1–15 trên toàn packet

Ngoài R7, chưa phát hiện vi phạm bổ sung rõ ràng. Không đọc báo cáo cũ nên không xác nhận được lỗi nào là “mới” so với vòng trước.

| Quy tắc | Kết quả và giới hạn |
|---|---|
| 1, 4 | R7 như trên; rà các MCQ còn lại không thấy thêm đa đáp án rõ ràng. Nhiễu R13–R20 cùng từ loại, độ dài tương đối tương đương. Không xuất thêm đáp án ngoài 6 câu được giao. |
| 2, 11 | Không thấy thuật ngữ/định nghĩa đặc trưng R1–R5 bị tiết lộ ở R6–R30 hoặc diễn đạt lại trong các bài đọc/lời thoại. Từ chung như “mouse”, “screen” không tự xác định được đáp án nối. |
| 3 | Có chung chủ đề quản trị/sự cố nhưng không thấy lặp nguyên tình huống; các sự cố có thiết bị, nguyên nhân và nhiệm vụ khác nhau. |
| 5 | Ngữ pháp/từ vựng phù hợp bản đồ Unit 4 trong `source-materials.md`; CHƯA KIỂM xuất xứ từng từ/trang sách vì không có `sourceNotes`. |
| 6 | Đọc MCQ 241 từ, T/F 175 từ: đạt. CHƯA KIỂM tính viết mới với tài liệu gốc. |
| 7 | Các câu dịch phù hợp chủ đề/ngữ pháp Unit 4; CHƯA KIỂM trùng giữa các Unit do giới hạn nguồn. |
| 8 | Email có 5 gợi ý, yêu cầu 80–100 từ, đúng chủ đề. |
| 9, 13 | Email nêu rõ before/after + -ing và by + -ing; từng câu S1, S2 và S3 đều nêu chức năng/cấu trúc cần dùng ngay trong đề hiển thị. |
| 10 | Không phát hiện sai chính tả Anh–Anh. |
| 12 | Cả 5 phát biểu T/F đều có bằng chứng khẳng định/phủ định trực tiếp trong bài. |
| 14 | Các yêu cầu Speaking làm được bằng lời nói. |
| 15 | Packet không còn `sourceNotes` hoặc trường đáp án/lời giải; CHƯA KIỂM nội dung ghi chú ở bản gốc. |

Kiểm bằng Python: JSON đáp án đúng 6 mã câu và chữ A–D; packet đủ nhóm câu, không chứa 7 trường nội bộ/đáp án; đếm từ theo khoảng trắng như `countWords`. Listening A/B dài 193/174 từ, đều đạt 150–250. Chưa chạy đối chiếu đáp án hay validator trên bản tác giả. Không đọc `exam-format.md` mục 2, `data/units`, nhánh content, audit trên main hoặc nhánh audit khác.

Đề nghị **AMBIGUOUS** cho R7; et-lead quyết định sau đối chiếu. Không tự cấp AUDIT-OK.
