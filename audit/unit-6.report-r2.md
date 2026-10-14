# Unit 6 — kiểm lại r2

Thời gian: 2026-10-14 15:35:42 +07 (+0700), lấy từ `date`.
Người giải: et-auditor — gpt-6-astra. Nhánh: `audit/unit-6-r2`.
Packet: `audit/unit-6.stripped.json`; SHA-256: `f1bd78c19a76b19812ca7108d07b2a0aef0cf61ba2176c0ad91b3b991f4ffdcd`.
Đáp án mù đã commit trước báo cáo tại `8c8c200`; chỉ giải R12 và R14, đọc toàn đề để kiểm ngữ cảnh.

- **R12: C — to know. Không còn đa đáp án.** Cấu trúc yêu cầu lịch sự `I'd like to know how to…` phù hợp; ba dạng còn lại không phù hợp cấu trúc này.
- **R14: B — bricks-and-mortar. Không còn đa đáp án.** Câu nói đến bốn cửa hàng có địa điểm thực để khách xem sản phẩm trực tiếp; ba lựa chọn còn lại không diễn đạt loại cửa hàng đó.

Rà quy tắc 1–15 trên toàn packet: **chưa phát hiện vi phạm mới trong phạm vi kiểm được**. Đây là nhận định độc lập trên bản hiện tại; không so với báo cáo hoặc nhánh audit trước.

| Quy tắc | Kết quả |
| --- | --- |
| 1 | Hai câu được giao đều có một phương án phù hợp; không thấy dấu hiệu đa đáp án mới khi đọc phần còn lại. Không lập lại đáp án mù cho các câu khác. |
| 2, 11 | Không thấy thuật ngữ/định nghĩa R1–R5 bị lộ qua R6–R30 hoặc được diễn đạt lại trong bài đọc/lời thoại. W33–W34 lặp kiến thức câu nối thuộc ngoại lệ giữa kỹ năng ở quy tắc 2. |
| 3, 4, 10 | Không thấy tình huống trùng nguyên nhiệm vụ, bất cân xứng phương án gây lộ đáp án, hoặc lỗi chính tả Anh–Anh mới. Các tình huống cùng chủ đề có mục đích khác nhau. |
| 5, 7 | Ngữ pháp, từ vựng và câu dịch phù hợp Unit 6 theo bảng nguồn. CHƯA KIỂM vị trí từng từ trong giáo trình/Workbook và câu dịch trùng giữa các Unit, vì chỉ dùng packet được giao. |
| 6 | Hai bài đọc 242 và 182 từ, đúng giới hạn. CHƯA KIỂM tính viết mới bằng đối chiếu nguồn gốc. |
| 8, 9, 13, 14 | Email có 7 gợi ý, 80–100 từ; đề hiển thị buộc yêu cầu lịch sự và điều kiện loại 2. Từng câu S1, S2 và S3 đều nêu chức năng/cấu trúc Unit; S2 cho cách giải nghĩa bằng lời nói, không yêu cầu dấu ngoặc. |
| 12 | R26–R30 có căn cứ khẳng định/phủ định trực tiếp; riêng R28 được câu “The equipment cannot be kept in a shared office” xác định rõ. |
| 15 | PASS việc loại `sourceNotes` và các trường đáp án khỏi packet; CHƯA KIỂM nội dung `sourceNotes` gốc vì không được đọc. |

Kiểm bằng Python 3 trên packet: JSON hợp lệ; số câu/phần đúng khung; Listening A/B dài 227/197 từ, đúng giới hạn; không còn bảy trường nội bộ/đáp án được liệt kê trong `ANSWER_FIELDS`. File blind hợp lệ, chỉ chứa R12 và R14, `notes` rỗng.

Không đọc `data/units`, nhánh `content/*`, các nhánh `audit/*` khác hoặc mục 2 của `exam-format.md`. Không chạy đối chiếu đáp án hay validator trên đề gốc. Chờ et-lead đối chiếu và quyết định; không tự cấp `AUDIT-OK`.
