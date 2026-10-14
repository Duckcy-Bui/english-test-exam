# Báo cáo audit đề 6C — Unit 6, Test C

- Auditor: et-auditor2; nhánh `audit/unit-6-C`.
- Thời gian: 2026-10-14 22:19:47 +07 (+0700).
- Đầu vào: `audit/unit-6-C.stripped.json`; SHA-256 `fb4cd44efef994f2aa0c377fdbac2c23d912defbab4bd5f8f3685dac23b245bb`.
- Commit giải mù đã hoàn tất trước bước kiểm đặc tả: `5b9f11907c14124da9792368483c12f0be7f5b60`.
- Đã ghi đủ 40 đáp án vào `audit/unit-6-C.blind.json`; chưa thấy hai đáp án hợp lý cạnh tranh trong ngữ cảnh đề. `notes` rỗng. Trường `solver` giữ đúng chuỗi mà brief yêu cầu.
- Nhãn đề nghị: **CẦN SỬA** — 1 lỗi CHẶN, 1 góp ý NÊN SỬA. Không tự cấp AUDIT-OK; chưa so với đáp án tác giả.

## Các lỗi và đề xuất

Mỗi dòng dưới đây là một phát hiện; nhóm mã câu cùng dòng có cùng nguyên nhân.

| Mã câu | Mức độ | Mô tả, căn cứ | Đề xuất sửa |
|---|---|---|---|
| R8 | CHẶN | Quy tắc 5: câu thuộc nhóm ngữ pháp R6–R12 nhưng “Last year, the price of the webcam ______ from £80 to £50” với `decreased / increased / went up / grew` chỉ phân biệt nghĩa giảm/tăng. Cả bốn phương án đều có hình thức quá khứ phù hợp với `Last year`; dấu hiệu £80 → £50 chọn từ theo nghĩa, không kiểm tra cấu trúc ngữ pháp Unit 6. Đây là lỗi mục tiêu kiểm tra, không phải câu đa đáp án. | Viết lại để kiểm tra cấu trúc mô tả thay đổi hiện tại, ví dụ “At the moment, webcam prices ______.” với các dạng `are decreasing / is decreasing / decreases / decreasing`; hoặc chọn cấu trúc Unit 6 khác. Giải mù lại câu được viết lại trong phiên auditor mới theo PROTOCOL. |
| R13, R14, R17, R18, R19, R20 | NÊN SỬA | Quy tắc 4: các phương án đúng từ loại nhưng độ dài hình thức chưa cân bằng. R20 nổi bật nhất: `high-definition` 15 ký tự so với `remote / overseas / local` 6/8/5; R18 có `announcement` 12 so với `code` 4. R13 có 5–12 ký tự, R14 4–8, R17 4–9, R19 5–12. Đặc tả không đặt ngưỡng ký tự, nên đây là góp ý biên tập về “độ dài tương đương”, không kết luận độ dài tự nó làm lộ đáp án. | Ưu tiên cân bằng R20 bằng các tính từ/cụm tính từ có cấu tạo tương tự; cân bằng thêm các câu còn lại khi biên tập. Giữ từ loại, từ vựng Unit và chỉ một phương án hợp ngữ cảnh; tránh tạo thêm đáp án đúng khi thay nhiễu. |

## Đối chiếu đủ 15 quy tắc

| Quy tắc | Kết quả và bằng chứng |
|---|---|
| 1 — Một đáp án đúng | Chưa phát hiện câu trắc nghiệm có hai đáp án hợp lý. Đã giải 5 Listening MCQ, 7 câu ngữ pháp, 8 câu từ vựng và 5 Reading MCQ; năm cặp nối cũng phân biệt được. R12 chọn yêu cầu lịch sự phù hợp với `please`; R8 chọn được duy nhất theo nghĩa nhưng có lỗi mục tiêu nêu trên. |
| 2 — Không lộ cặp nối | Không thấy thuật ngữ DRM, Tagging, File sharing service, B2C, Voice recognition trong R6–R30. R14 nói lỗi mã chương trình, không giải nghĩa gắn nhãn/đính mã để tổ chức dữ liệu; R6/R15/R17 nói bán hàng/khách mua hàng, không cung cấp cách phân biệt giao dịch doanh nghiệp–người dùng cuối với doanh nghiệp–doanh nghiệp. Từ phổ thông như `online`, `computer`, `code` tự nó không đủ để nối cặp. W31/W33/W34/W35 dùng lại các khái niệm được phép vì kỹ năng mở tuần tự. |
| 3 — Không lặp tình huống | Chưa thấy cùng tình huống cụ thể bị dùng lại. Nghe A đào tạo ứng dụng chi phí; nghe B đặt phòng hội nghị đại học; đọc MCQ làm việc tại nhà; đọc T/F quảng bá khách sạn; email cài TeamTalk; S2 giải nghĩa cho ông bà; S3 đề xuất máy tự thanh toán. Các câu ngắn về yêu cầu đào tạo, hàng đợi hoặc mua sắm cùng chức năng Unit nhưng khác nhiệm vụ/bối cảnh, không coi là lặp chỉ vì chung chủ đề. |
| 4 — Nhiễu từ vựng | R13–R19 dùng danh từ hoặc danh từ bổ nghĩa phù hợp vị trí; R20 dùng tính từ. R15/R16 cân đối độ dài. Góp ý độ dài cho các mã còn lại ở bảng lỗi; không áp quy tắc này cho R6–R12. |
| 5 — Đúng ngữ pháp/từ vựng Unit | R6/R7 kiểm tra mô tả thay đổi; R9/R10 điều kiện loại 2; R11 mệnh đề quan hệ giải thích; R12 yêu cầu lịch sự. R8 cần sửa như trên. Đã đối chiếu trực tiếp Workbook Part 1 Unit 6: `component`, `code`, `delivery`, `accounting` trang 56; `trend` trang 57; `announcement`, `procedure` trang 58; `high-definition` trang 59. |
| 6 — Hai bài đọc | 238 từ cho R21–R25, 166 từ cho R26–R30, đều đúng khoảng 230–270/160–200. Đếm phần paragraphs, không tính tiêu đề. Tính viết mới so với toàn bộ nguồn ngoài và trùng giữa các đề chưa xác minh; không đọc đề khác, việc trùng bài giữa các đề cùng Unit do et-lead validate. |
| 7 — Dịch | Đủ W31–W35; lần lượt có DRM/mệnh đề quan hệ, điều kiện loại 2, xu hướng hiện tại, giải nghĩa B2C, yêu cầu lịch sự về tagging. Đúng chủ đề Unit. CHƯA KIỂM trùng câu dịch giữa các Unit vì không đọc `data/units/*.json`. |
| 8 — Email | W-EMAIL có 6 gợi ý, đúng khoảng 5–7; chủ đề hướng dẫn cài ứng dụng nhắn tin của công ty; yêu cầu 80–100 từ và loại trừ bốn dòng đầu thư. |
| 9 — Ngữ pháp trong Writing/Speaking | Email buộc dùng mệnh lệnh/từ nối, xu hướng, điều kiện loại 2 và yêu cầu lịch sự. Các câu dịch chứa từ vựng/cấu trúc Unit. S1 có xu hướng, điều kiện loại 2, yêu cầu lịch sự; S2 giải nghĩa; S3 xu hướng và ít nhất hai câu điều kiện loại 2. |
| 10 — Anh–Anh | Không thấy lỗi chính tả Anh–Mỹ trong phần hiển thị/lời thoại; có `recognise`, `travelling`, `café`. Không coi ký hiệu tiền USD trong ví dụ tiết kiệm chi phí là lỗi chính tả. |
| 11 — Không diễn đạt lại định nghĩa đúng | Đã đọc cả hai lời thoại và hai bài đọc. Không thấy mô tả hạn chế quyền dùng nội dung sau bán, gắn nhãn tổ chức dữ liệu, dịch vụ phân phối/truy cập tệp, quan hệ B2C đặc trưng hay nhận dạng giọng nói. Nghe B có hội nghị nhiều địa điểm nhưng không mô tả thiết bị nối địa điểm; định nghĩa MCU là nhiễu B, không thuộc năm cặp đúng. |
| 12 — T/F rõ căn cứ | R26: “Until last year, most guests booked their rooms by phone” → T; R27: “number of phone bookings is going down” → F; R28: “three times a week” → F cho “every day”; R29: “replies to every comment within one day” → T; R30: “in the winter, when the hotel is closed and there are no guests” → T. Không phải suy ra từ việc thiếu thông tin. |
| 13 — Chỉ dẫn ngữ pháp hiển thị | Đọc trực tiếp `task`, từng câu hỏi S1 và `prompt` của S2/S3: đều nêu cấu trúc/chức năng cần dùng, không chỉ nằm trong metadata. Không áp cho dịch Anh → Việt W31–W35 theo thống nhất. |
| 14 — Speaking làm được bằng lời nói | S2 yêu cầu ít nhất hai cách giải nghĩa bằng `called / which means / is`, không yêu cầu đọc/viết dấu ngoặc; S1/S3 đều là nhiệm vụ nói. |
| 15 — sourceNotes | Bản stripped không có `sourceNotes` ở bất kỳ cấp nào; cũng không có sáu trường đáp án/lời giải/bài mẫu khác trong ANSWER_FIELDS. CHƯA KIỂM nội dung sourceNotes của tác giả vì trường đã bị xoá và không mở dữ liệu gốc. |

## Kiểm tra bổ sung và giới hạn

- Metadata đúng `schemaVersion: 1`, `unit: 6`, `testId: C`, `source: ai`, phù hợp mục 5b cho đề C.
- Nghe A: 182 từ; nghe B: 153 từ. Mỗi phần đúng 5 câu; cả hai trong khoảng 150–250. Đã dùng lời thoại được phép để giải; chưa kiểm âm thanh/TTS.
- Python 3 kiểm JSON: đúng 40 mã câu tự động duy nhất, bộ mã đáp án trùng bộ mã câu, đúng dạng A–D/A–F/T–F; L6–L10 tối đa 3 từ. Các câu MCQ đủ A–D, nối đủ A–F, có 5 câu dịch và 3 phần Speaking với 3 câu S1.
- L8 ghi `four thousand pounds` (3 từ), L9 `the online form` (3 từ). Danh sách `acceptedAnswers` đã bị xoá, nên chưa thể xác nhận bộ chấm chấp nhận các cách viết số, có/không mạo từ hoặc tên phòng tương đương.
- Công cụ: Python 3 qua heredoc đọc JSON/đếm từ/kiểm mã câu và trường bị loại; `pdftotext` đọc nguồn Workbook (nội dung Part 1 ở trang 56–59); đọc thủ công cho tính đơn nghĩa, lộ nghĩa và yêu cầu ngữ pháp. Đếm từ theo khoảng trắng, cùng cách `countWords` trong `src/types/exam.ts`.
- Chỉ mở mục 3–4 của `docs/exam-format.md`, mục 5/8 của PROTOCOL, mục 5b của plan và các tài liệu được brief yêu cầu. Không mở nội dung mục 2 của exam-format; không đọc `data/units/*.json`, không chạm nhánh `content/*`, không merge/push. Chỉ ghi hai đầu ra được giao trong `audit/`.
- Không chạy compare-blind hoặc validate-exams trên dữ liệu tác giả. et-lead thực hiện hai bước đó và quyết định nhãn cuối. Nếu sửa câu hỏi, cần giải mù lại trong phiên auditor mới theo PROTOCOL mục 5.
