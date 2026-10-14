# Unit 7 — kiểm định mù và đặc tả

- Agent: et-auditor — gpt-6-astra; nhánh `audit/unit-7-8`.
- Thời gian: 2026-10-14 16:09:37 +0700.
- Bước 1 đã commit trước Bước 2: `aabca0d` (`audit/unit-7.blind.json`, đủ L1–L10 và R1–R30).
- Kết luận: **CẦN SỬA; 2 lỗi CHẶN**, có nghi vấn AMBIGUOUS tại R19, R27. Không tự cấp AUDIT-OK. Chưa đối chiếu đáp án tác giả.

## Phạm vi và bằng chứng

Chỉ đọc packet Unit 7, brief, `docs/PROTOCOL.md`, `docs/exam-format.md` mục 3–4, `docs/source-materials.md`, `src/types/exam.ts`. Sau commit giải mù, đối chiếu Workbook Unit 7 (PDF trang 67–72) để kiểm nguồn từ vựng. Không đọc mục 2 “Đáp án”, `data/units`, các nhánh content/* hoặc audit/* khác, hay các hồ sơ audit cũ. Không merge/push; chỉ ghi trong audit/.

SHA-256 packet: `66659d462468759556a3c5fcbbd29067441e3d431b53613758e3d53214a43d51`.
SHA-256 template: `399a15cf3febec2c40721ad9cba9b6bf29ce925de7e2fffb4863072da16b55c2`.

## Lỗi cần xử lý

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| R19 | CHẶN | QT1: “______ testing is done by the company that is writing the software.” C (Alpha) khớp định nghĩa Workbook nhưng B (Dynamic) cũng có thể do chính công ty phát triển thực hiện. Câu không nói giai đoạn/đối tượng kiểm thử để loại B; chọn C trong giải mù và đã ghi nghi vấn. | Viết lại để xác định kiểm thử chấp nhận nội bộ trước khi phát hành cho người dùng ngoài công ty; thay Dynamic bằng nhiễu không cùng đúng trong tình huống đó. Không chỉ đổi đáp án. Không dùng định nghĩa beta testing làm nhiễu vì sẽ gợi R2. Giải mù lại bằng phiên mới. |
| R27 | CHẶN | QT12: “A temperature above 28 degrees makes the roof windows open.” Đoạn 2 hỗ trợ T nhưng đoạn 3 nêu không mở cửa sổ ban đêm dù nóng. Câu không giới hạn ban ngày nên T theo quy tắc thông thường và F theo khẳng định vô điều kiện đều có lý; giải mù chọn T và ghi chú. | Thêm “During the day” vào statement và làm rõ quy tắc ban ngày trong bài nếu cần; giữ ngoại lệ ban đêm cho R28. Giải mù lại bằng phiên mới. |

Đối chiếu kỹ thuật R19 chỉ thực hiện **sau** commit giải mù: dynamic testing là kiểm thử có thực thi phần mềm; không phải một nhóm được định nghĩa bằng việc ai thực hiện. Đây là cơ sở cho nhận định B chưa được loại trừ, không phải đáp án tác giả. Nguồn sơ cấp: [ASTQB, What is Testing?](https://astqb.org/1-1-what-is-testing/).

## Kiểm đủ quy tắc 1–15

| QT | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1 | CHẶN | Đã giải và xét mọi phương án của L1–L5, R6–R25; R19 có vấn đề như trên. Các câu còn lại có một lựa chọn phù hợp rõ ràng trong văn cảnh. R1–R5 có ánh xạ riêng C/F/A/E/D, dư B. |
| 2 | ĐẠT trong packet | Không thấy Gantt chart, beta testing, debug, variable, SEO hoặc một định nghĩa đủ đặc trưng của chúng được cho làm đáp án/gợi ý ở R6–R30. R13 nói schedule nhưng không cung cấp đặc trưng biểu đồ thanh; R19 nói công ty kiểm thử, không cho đặc trưng khách hàng kiểm thử của R2. Không coi việc cùng chủ đề dự án là tự động lộ đáp án. |
| 3 | ĐẠT | Các tình huống chính khác nhau: đặt lớp gym, website bảo tàng, vé phà, nhà kính, kiểm thử giao đồ ăn, trò đua xe, chuyển phòng máy chủ. Các ví dụ ngắn cùng ngữ pháp không tái kể cùng một sự kiện. |
| 4 | ĐẠT về hình thức | Chỉ xét R13–R20: các phương án là danh từ/cụm danh từ, động từ ở R15, hoặc thành phần bổ nghĩa cho testing ở R19; độ dài 1 từ, riêng R16 là 2–3 từ. Không áp điều kiện này cho R6–R12. Tính phù hợp nghĩa của nhiễu R19 đã chặn ở QT1. |
| 5 | ĐẠT | R6 want + O + to V; R7 need to; R8–R9 bị động; R10 make + O + V; R11 cause + O + to V; R12 be due to. Từ đích R13–R20: schedule, feedback, approve, home page, FAQs, line(s) of code, alpha testing, specification đều có ở Workbook Part 1 Unit 7, trang 67–68; không cần suy đoán sourceNotes. |
| 6 | ĐẠT độ dài; CHƯA KIỂM trọn tính viết mới | MCQ 237 từ (230–270), T/F 169 từ (160–200), tính bằng tách khoảng trắng như countWords. Hai bài khác bài compiler của Workbook Unit 7 trang 71–72. Không có bằng chứng toàn diện để chứng nhận chưa từng chép từ Pearson/nguồn khác. |
| 7 | ĐẠT nội dung; CHƯA KIỂM trùng liên Unit | W31 want + O + to V; W32 bị động; W33 make + O + V; W34 due to; W35 should/be able to, đều về IT. Năm câu khác nhau. Không đọc Unit 1–6 theo giới hạn của người giao; đối chiếu 7–8 sẽ ghi tại báo cáo Unit 8 sau khi hoàn tất Unit 7. |
| 8 | ĐẠT | Email hướng dẫn kiểm thử ứng dụng, 6 gạch đầu dòng, 80–100 từ, đúng chủ đề phát triển phần mềm. |
| 9 | ĐẠT | Email bắt buộc ít nhất hai dạng should/have to/need to, một câu bị động, một dạng lịch trình; S1 từng câu yêu cầu cấu trúc cụ thể; S2 buộc make và cause; S3 buộc các cấu trúc kế hoạch/lịch trình. Câu dịch chứa ngữ pháp Unit, không cần yêu cầu người thi tự viết tiếng Anh. |
| 10 | ĐẠT trong packet | programmers, programme máy tính viết program đúng quy ước Anh–Anh, centre không có biến thể sai; log in là động từ hai từ; không thấy chính tả Mỹ cần sửa. |
| 11 | ĐẠT trong packet | Đã đọc cả hai lời thoại và hai bài đọc: không có diễn giải đặc trưng biểu đồ thanh Gantt, khách hàng dùng thử để tìm lỗi, loại bỏ lỗi chương trình, đại lượng thay nhiều giá trị, hay tăng vị trí kết quả tìm kiếm. Các mốc dự án chung không đủ để thành định nghĩa Gantt. |
| 12 | CHẶN | R26 được xác nhận bởi “written by a local student”; R28 bị phủ định trực tiếp bởi quy tắc ban đêm; R29 bị phủ định bởi “many plants were damaged”; R30 được xác nhận bởi “never allowed ... more than ten times”. R27 thiếu phạm vi thời gian như bảng lỗi. |
| 13 | ĐẠT | Yêu cầu cấu trúc nằm trong task email, từng câu S1 và prompt S2/S3, không chỉ ở targetGrammar/requiredGrammar. Không áp QT13 cho W31–W35. |
| 14 | ĐẠT | S1 mô tả/đề xuất/lập kế hoạch, S2 giải thích nhân quả, S3 trình bày lịch; đều nói được thành lời. Ngoặc và dấu mũi tên chỉ minh hoạ/gợi ý, không buộc đọc dấu câu hay viết. |
| 15 | ĐẠT stripping; CHƯA KIỂM nội dung gốc | Quét đệ quy không có sourceNotes, answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer, sampleAnswer. Không thể xác nhận sourceNotes gốc có chép đáp án hay không vì trường đã bị xoá và không được mở bản gốc. Et-lead kiểm phần này. |

## Kiểm khung đề và giới hạn chấm tự động

- Listening A/B lần lượt 191/161 từ, trong 150–250; 5 MCQ A–D và 5 short-answer maxWords=3. Đáp án mù Part B dài 1/1/1/3/1 từ. Các dạng tương đương như five/5, Visit/the Visit section, September/in September cần et-lead kiểm trong acceptedAnswers; packet sạch không cho phép xác nhận.
- Reading: 5 nối/6 định nghĩa; 7 ngữ pháp; 8 từ vựng; 5 đọc MCQ; 5 T/F. Mỗi MCQ có A–D. Writing: 5 câu dịch và 1 email/6 gợi ý. Speaking: 3 câu S1, mỗi câu 45 giây; S2/S3 mỗi phần 90 giây.
- Đếm từ và kiểm trường bằng Python3 chỉ trên packet Unit 7; trích nguồn bằng `pdftotext -f 67 -l 72 '/home/duckcy/Downloads/Workbook for Students.pdf' -`; giải mù và rà thủ công mọi câu/phương án, Writing/Speaking.
- Chưa chạy compare-blind hoặc validate-exams vì cần bản đáp án bị cấm đọc trong phiên này. Kiểm packet không thay thế schema validation của bản gốc, đối chiếu đáp án tác giả, hay kiểm TTS/UI/chấm AI khi chạy thật. Et-lead thực hiện các cổng còn lại; các câu sửa phải đưa cho phiên giải mù mới.
