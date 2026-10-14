# Unit 7 — kiểm mù lại R19/R27, vòng r2

- Auditor: et-auditor — gpt-6-astra; nhánh `audit/unit-7-r2`.
- Thời gian: 2026-10-14 16:15:07 +0700 (lệnh `date`).
- Nguồn duy nhất của đề: `audit/unit-7.stripped.json`, SHA-256 `06d0453840523df4632f8c84ec247b0f2cf1c85221f8c75c3986fa4f77b56688`.
- Đáp án mù đã commit trước báo cáo: `b00befce5ed1008b002dc7278819a708da3581a4`.

## Hai câu giải lại

| Câu | Đáp án | Còn đa đáp án? | Căn cứ |
|---|---|---|---|
| R19 | C — Alpha | Không | Đề mô tả giai đoạn kiểm thử đầu tiên do công ty viết phần mềm thực hiện trước khi người ngoài sử dụng. Wireless không chỉ giai đoạn này; Final trái với “first stage”; Public trái với phạm vi nội bộ. |
| R27 | T | Không | Bài đọc nói rõ “During the day, if the temperature goes above 28 degrees, the program makes the roof windows open.” Phát biểu đã giới hạn ban ngày, nên ngoại lệ ban đêm không gây mơ hồ. |

## Rà toàn đề theo quy tắc 1–15

Không phát hiện vi phạm bổ sung trong bản stripped hiện tại; không có mục CHẶN hoặc NÊN SỬA cần ghi. Không so với báo cáo cũ hoặc nhánh khác.

- Quy tắc 1–4, 10–12: không thấy thêm phương án đúng hợp lý ở các câu trắc nghiệm, lộ đáp án nối qua thuật ngữ/diễn giải, lặp tình huống, nhiễu sai từ loại/độ dài bất tương xứng, lỗi chính tả Anh–Anh hoặc T/F thiếu căn cứ rõ ràng. R19 mô tả kiểm thử nội bộ, không diễn đạt lại định nghĩa kiểm thử bởi khách hàng ở phần nối.
- Quy tắc 5–9: ngữ pháp và chủ đề phù hợp bản đồ Unit 7; lời thoại A/B có 191/161 từ; bài đọc MCQ/T/F có 237/172 từ (đếm theo khoảng trắng như `countWords`); đủ cơ cấu câu hỏi; email có 6 gợi ý, yêu cầu 80–100 từ. Câu dịch dùng cấu trúc Unit 7.
- Quy tắc 9, 13–14: email, từng câu S1 và đề S2/S3 đều nêu cấu trúc bắt buộc trong nội dung sinh viên nhìn thấy; yêu cầu Speaking thực hiện được bằng lời nói.
- Giới hạn: CHƯA KIỂM xuất xứ từng từ theo Workbook/trang giáo trình (quy tắc 5), tính viết mới so với nguồn (6), trùng câu dịch giữa các Unit (7), và nội dung `sourceNotes` bản gốc (15). Bản stripped không chứa `sourceNotes` hay các trường đáp án/lời giải; không đọc dữ liệu gốc, các nhánh hoặc thư mục audit bị cấm.

Không tự cấp `AUDIT-OK`. Et-lead cần đối chiếu riêng R19/R27 với đáp án tác giả và xác nhận validator trên bản gốc; báo cáo này không thay thế hai bước đó.
