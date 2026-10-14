# Unit 8 — audit r2

et-auditor — gpt-6-astra · `audit/unit-8-r2` · 2026-10-14 16:19:56 +07 (+0700)

Nguồn: `audit/unit-8.stripped.json`, SHA-256 `646d7738551f6b82ec65d9c939a389bfa82303b49dc3fd7562eda8ed04ac2823`. Đáp án mù đã commit trước báo cáo: `6bcffe2`. Không đọc mục 2 của exam-format, data/units, nhánh content hay audit khác. Không có bản trước để phân biệt lỗi mới phát sinh với lỗi đã tồn tại.

## Bảy câu giải lại

| Câu | Chọn | Căn cứ |
|---|---|---|
| R7 | D | `haven't ... yet`; `already` không tự nhiên trong câu phủ định độc lập này, `just` sai vị trí, `ago` không phù hợp cấu trúc/thì. |
| R11 | D | `If + present simple, should + V` cho lời khuyên; `must to` sai, `ought` thiếu `to`, `would` không phù hợp lời khuyên trong ngữ cảnh này. |
| R21 | A | Thường crash khi tải ảnh lên. |
| R22 | C | Vẫn crash khi tắt wi-fi và dùng mobile data; mobile data vẫn là mạng nên B không đúng. |
| R23 | B | Bài khẳng định chỉ điện thoại cũ bị crash. |
| R24 | D | Chưa liên hệ nhà phát triển; ba việc còn lại đã làm. |
| R25 | A | Khuyên giảm kích thước ảnh; tắt wi-fi chỉ là phép thử của Kenji. |

**Không phát hiện đa đáp án ở cả bảy câu**, nên `notes` để trống.

## Phát hiện kỹ thuật

- **R22 / đoạn 2 R21–R25 — NÊN SỬA:** tắt wi-fi rồi tái hiện crash bằng mobile data là bằng chứng hữu ích, nhưng cùng biểu hiện chưa chứng minh cùng nguyên nhân. Phép thử cho thấy crash có thể xảy ra độc lập với wi-fi, chưa loại trừ mọi đóng góp của wi-fi trong các lần lỗi khác. `can't be the cause` và `Why is Kenji sure...` vẫn quá tuyệt đối. Đổi thành `so he thinks the hotel's wi-fi is unlikely to be the cause` và hỏi `Why does Kenji think the hotel's wi-fi is unlikely to be the cause?`; C vẫn là lựa chọn duy nhất.

Bài đủ rõ để đọc hiểu, nhưng lập luận loại trừ tuyệt đối chưa hoàn toàn chặt chẽ. Giả thuyết thiếu bộ nhớ ở đoạn 3 dùng `might`/`could`, đúng mức độ bằng chứng; không biến giả thuyết thành nguyên nhân đã xác nhận.

## Quét toàn đề, quy tắc 1–15

| Quy tắc | Kết quả |
|---|---|
| 1 | Rà toàn bộ MCQ: chưa thấy đa đáp án rõ ràng; file mù r2 chỉ chốt bảy câu được giao. |
| 2, 11 | Không thấy lộ thuật ngữ hoặc diễn đạt lại định nghĩa R1–R5 trong phần sau. |
| 3, 4 | Không thấy sao lại tình huống cụ thể; nhiễu từ vựng cùng từ loại, độ dài nhìn chung tương đương. |
| 5, 7 | Ngữ pháp/từ vựng và câu dịch phù hợp Unit 8. CHƯA KIỂM nguồn/trang từng từ và trùng câu giữa các Unit do giới hạn nguồn. |
| 6 | Bài đọc 259/177 từ: đạt. CHƯA KIỂM tính viết mới so với tài liệu gốc. |
| 8, 9, 13, 14 | Email có 6 gợi ý, 80–100 từ; email và từng câu S1/S2/S3 nêu cấu trúc/chức năng ngay trong đề; Speaking thực hiện được bằng lời nói. Câu dịch dùng ngữ pháp trọng tâm. |
| 10 | Chưa thấy lỗi Anh–Anh; `programs` dùng cho phần mềm là phù hợp. |
| 12 | T/F đối chiếu trực tiếp với năm tốt nghiệp, công việc help desk, hai buổi/tuần, December và dự định làm ở nước ngoài. |
| 15 | Stripped không có `sourceNotes`/trường đáp án. CHƯA KIỂM ghi chú nguồn gốc có chứa đáp án không. |

Không phát hiện thêm vi phạm xác định theo quy tắc 1–15 trong phạm vi được đọc; các mục CHƯA KIỂM không được coi là đạt.

Kiểm bằng Python 3: JSON hợp lệ; đúng bảy mã đáp án A–D; đủ số câu/phần; không có bảy trường nội bộ/đáp án; đếm từ theo khoảng trắng như `countWords`. Listening A/B: 161/162 từ, đạt. Không chạy compare/validator trên dữ liệu tác giả. Đề nghị **CẦN SỬA** cho lưu ý kỹ thuật R22; không tự cấp `AUDIT-OK`.
