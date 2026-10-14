# Kiểm định mù lại một phần — bc4

- Agent: et-auditor — gpt-6-astra.
- Nhánh: `audit/reblind-bc4`.
- Thời gian từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`: `2026-10-14 22:22:21 +07 (+0700)`.
- Phạm vi kết luận: **6B–R10 và 1B–R6**. Các phần khác của bản stripped chỉ dùng làm ngữ cảnh đối chiếu; không giải, không cấp kết luận kiểm định cho các câu ngoài phạm vi.
- Căn cứ: brief et-auditor; `docs/exam-format.md` mục 3, 4; `docs/PROTOCOL.md` mục 5, 8; hai bản stripped và template được giao. Không mở mục 2, không đọc `data/units/*.json`, không truy cập nhánh content hoặc nhánh audit khác.
- Đáp án mù đã commit **trước bước kiểm định** tại `2c4ccbe2f8aae7d8d55ec58fbfc04cc4d38ac20a`: `audit/unit-6-B.blind-bc4.json` và `audit/unit-1-B.blind-bc4.json`. Mỗi file chỉ điền một câu; 39 câu còn lại để trống.

## Kết quả hai câu

| Câu | Đáp án mù | Kết luận trong phạm vi |
|---|---|---|
| 6B–R10 | A — wouldn't need | Một đáp án phù hợp; không phát hiện lỗi cần sửa. |
| 1B–R6 | D — hardly ever | Một đáp án phù hợp; không phát hiện lỗi cần sửa. |

**6B–R10:** “Our team doesn't have a shared online calendar at the moment” xác lập tình huống không có thật ở hiện tại. “If we had one” cần kết quả giả định “we wouldn't need to send…”. B “don't need”, C “won't need”, D “didn't need” không phù hợp cấu trúc điều kiện loại 2 trong ngữ cảnh này.

**1B–R6:** “hardly ever work at weekends” phù hợp “They usually only work from Monday to Friday”. A “don't hardly ever” là phủ định kép không chuẩn trong tiếng Anh chuẩn dùng cho đề; C “aren't hardly ever work” sai cấu trúc với động từ thường. B “hardly ever don't work” có thể mang nghĩa hầu như không bao giờ nghỉ làm cuối tuần, nhưng trái với câu ngữ cảnh nên không phải đáp án thứ hai hợp lý.

## Đối chiếu đủ 15 quy tắc

“Không áp dụng” dưới đây chỉ nói về hai câu được giao, không phải xác nhận toàn đề đạt.

| Quy tắc | 6B–R10 | 1B–R6 |
|---|---|---|
| 1. Đúng một đáp án | Đạt; A, với lý do loại từng nhiễu ở trên. | Đạt; D, với lý do loại từng nhiễu ở trên. |
| 2. Không lộ thuật ngữ hoặc định nghĩa đúng R1–R5 | Đạt; không có thuật ngữ nối, cũng không diễn đạt đặc trưng của định nghĩa đúng. | Đạt; không có thuật ngữ nối, cũng không diễn đạt đặc trưng của định nghĩa đúng. |
| 3. Không lặp tình huống | Đạt; giả định có lịch dùng chung để giảm email sắp xếp họp, khác đào tạo hệ thống đặt lịch bệnh viện và xu hướng thanh toán tại quán café. | Đạt; tần suất kỹ thuật viên làm cuối tuần, khác dịch vụ hỗ trợ khách sạn và quy tắc làm tại nhà của công ty bảo hiểm. |
| 4. Nhiễu cùng từ loại, độ dài tương đương ở câu từ vựng | Không áp dụng yêu cầu từ vựng; R10 thuộc ngữ pháp R6–R12, được trộn dạng. | Không áp dụng yêu cầu từ vựng; R6 thuộc ngữ pháp R6–R12, được trộn dạng. |
| 5. Đúng trọng tâm Unit | Đạt; điều kiện loại 2, khớp `grammarFocus` Unit 6 trong stripped. | Đạt; trạng từ tần suất trước động từ thường, khớp `grammarFocus` Unit 1 trong stripped. |
| 6. Độ dài và tính mới bài đọc | Không áp dụng; không phải bài đọc. | Không áp dụng; không phải bài đọc. |
| 7. Câu dịch đúng Unit, không trùng liên Unit | Không áp dụng; không phải câu dịch. | Không áp dụng; không phải câu dịch. |
| 8. Email có 5–7 gợi ý, đúng chủ đề | Không áp dụng; không phải email. | Không áp dụng; không phải email. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | Không áp dụng; câu Reading. | Không áp dụng; câu Reading. |
| 10. Chính tả Anh–Anh | Đạt; không phát hiện dạng chính tả trái Anh–Anh. | Đạt; không phát hiện dạng chính tả trái Anh–Anh; “at weekends” phù hợp. |
| 11. Bài đọc/lời thoại không diễn đạt định nghĩa nối | Không áp dụng trực tiếp cho câu ngữ pháp; đã kiểm nguy cơ diễn đạt định nghĩa trong chính R10 theo quy tắc 2. | Không áp dụng trực tiếp cho câu ngữ pháp; đã kiểm nguy cơ diễn đạt định nghĩa trong chính R6 theo quy tắc 2. |
| 12. True/False có bằng chứng rõ | Không áp dụng; câu trắc nghiệm ngữ pháp. | Không áp dụng; câu trắc nghiệm ngữ pháp. |
| 13. Đề Writing/Speaking nêu cấu trúc cho người học | Không áp dụng; câu Reading. | Không áp dụng; câu Reading. |
| 14. Speaking làm được bằng lời nói | Không áp dụng; câu Reading. | Không áp dụng; câu Reading. |
| 15. `sourceNotes` nội bộ không chép đáp án | CHƯA KIỂM nội dung gốc: trường đã bị loại khỏi stripped. | CHƯA KIỂM nội dung gốc: trường đã bị loại khỏi stripped. |

### Bằng chứng về lộ đáp án và tình huống

- **6B–R10:** đối chiếu các thuật ngữ Bricks and clicks, Threaded view, Archiving, Speech-to-text, Privacy với các định nghĩa đúng B/F/E/A/D. Lịch trực tuyến dùng chung không mô tả kinh doanh cả offline lẫn online, nhóm tin nhắn theo chủ đề, lưu trữ tệp tiết kiệm chỗ, chuyển lời nói thành chữ hay trạng thái tránh sự chú ý của công chúng. “online”, “need” và “emails” riêng lẻ không tái tạo các đặc trưng ấy. Định nghĩa C là định nghĩa dư, không dùng từ phổ thông trong đó làm căn cứ gắn lỗi.
- **1B–R6:** đối chiếu Database administrator, Supplier, Launch, Videoconference, Maintain với các định nghĩa đúng C/F/B/D/A. Nói kỹ thuật viên làm vào ngày nào không định nghĩa quản trị cơ sở dữ liệu, cung ứng, ra mắt sản phẩm, hội nghị video hoặc bảo trì máy. Định nghĩa E là định nghĩa dư.
- **6B–R10 so với bài đọc:** cùng nhắc việc sắp lịch ở mức chủ đề rộng, nhưng R10 nói lịch nhóm và số email họp; Northgate nói đào tạo nhân viên trước khi đổi hệ thống hẹn bệnh nhân. Không lặp cùng sự kiện, vấn đề hay giải pháp. Các ngữ cảnh còn lại cũng không nhắc lại tình huống lịch nhóm này.
- **1B–R6 so với bài đọc:** bài Kestrel nói dịch vụ khách sạn, mùa cao điểm và đào tạo; bài Fenwick nói quy tắc làm tại nhà. Chi tiết helpdesk mở cửa Monday to Friday trong Fenwick là khung giờ phục vụ, không khẳng định tần suất các kỹ thuật viên làm cuối tuần. Trùng cụm ngày trong tuần không đủ kết luận trùng tình huống. Listening B nói hiếm khi làm muộn, khác làm cuối tuần; chỉ trùng chức năng diễn đạt tần suất của Unit.

## Lỗi và giới hạn bàn giao

Không phát hiện lỗi **CHẶN** hoặc **NÊN SỬA** ở hai câu được giao; không có dòng lỗi cần đề xuất sửa. Không tự cấp `AUDIT-OK`. Chờ et-lead so đáp án và thực hiện các điều kiện cấp nhãn theo Protocol mục 5.

Đã chạy kiểm tra bằng `python3` (đoạn lệnh tại phiên): parse JSON; so cấu trúc và danh sách khóa với template; xác nhận chỉ một đáp án và một ghi chú được điền mỗi file; đối chiếu byte với blob đã commit bằng `git cat-file blob`; tìm thuật ngữ R1–R5 nguyên văn trong stem và mọi phương án; kiểm tra đệ quy các trường bị loại. Kết quả: PASS cả hai file, 0 thuật ngữ nguyên văn, không có `answerKey`, `acceptedAnswers`, `explanation`, `sourceNotes` trong hai stripped. Kiểm tra diễn đạt tương đương, tính duy nhất và lặp tình huống được làm bằng đọc ngữ nghĩa, không suy ra chỉ từ phép tìm chuỗi.

Không chạy `scripts/compare-blind.ts` hoặc `scripts/validate-exams.ts`, không đối chiếu đáp án tác giả và không kiểm runtime. Không mở nguồn ngoài hai stripped để xác nhận giáo trình; quy tắc 5 được đối chiếu với `grammarFocus` có trong đầu vào.

## Dấu vân tay đầu vào (SHA-256)

| File | SHA-256 |
|---|---|
| `audit/unit-6-B.stripped.json` | `d0f8767558cdff5825a23f27dd7e61692263f07286c0aebae14eba67c851d2d0` |
| `audit/unit-1-B.stripped.json` | `d84c25d376c98c7a2d26bf6eef7ac86df7831188eebd3e2d0fd6caa2a9ebbef7` |
| `audit/unit-6-B.blind.template.json` | `2f30043c36a5cad9baf4680247abcee04966ae139120c2d693c238f1c3146d7f` |
| `audit/unit-1-B.blind.template.json` | `dbba7cdc26de3d826091e6d4e1e82260a82704719516e4aa511ef371e13a9b79` |
