# Kiểm định giải mù — Unit 8, Test B (8B)

- Auditor: et-auditor2 — GPT-6 (Codex). Trường `solver` ghi danh tính phiên hiện tại; không dùng tên model gpt-6-astra được ghi sẵn trong brief cũ.
- Thời gian từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`: **2026-10-14 22:42:12 +07 (+0700)**.
- Nhánh: `audit/unit-8-B`.
- Commit đáp án mù, hoàn tất trước bước kiểm đặc tả: `afb464333a6725caf7729f62a14b52e0471c9d94`.
- Đề nghị: **CẦN SỬA** — 1 lỗi CHẶN, 1 điểm NÊN SỬA. Chưa phát hiện hai đáp án hợp lý ngang nhau khi giải độc lập; chưa so với đáp án tác giả và không tự cấp AUDIT-OK.

## Phạm vi và nguồn

Giải 40 câu chỉ từ `audit/unit-8-B.stripped.json`, điền bản sao `audit/unit-8-B.blind.template.json`, rồi commit. Sau đó kiểm toàn bộ Listening, Reading, Writing, Speaking trên cùng bản stripped. Không đọc `data/units/*.json`, không xem hoặc thao tác nhánh `content/*`, không đọc mục 2 của `docs/exam-format.md`, không xem đề khác.

Đọc brief được giao; `docs/exam-format.md` chỉ mục 3–4 (định vị bằng tiêu đề, đọc từ dòng 90); `docs/PROTOCOL.md` chỉ mục 5 và 8; `docs/plan.md` chỉ mục 5b; `docs/source-materials.md`; `src/types/exam.ts`. Sau commit mù, đối chiếu Workbook Unit 8 Part 1, trang 75–78 bằng `pdftotext -layout`. Không đối chiếu đáp án trong tài liệu nguồn. Công cụ graph không có trong phiên; đọc trực tiếp file kiểu dữ liệu đã được brief chỉ định.

SHA-256 đầu vào:

```text
unit-8-B.stripped.json       ba3abf375eda672ee3f083360b32e124767f9f655c6d6c12a91d2907d90d1131
unit-8-B.blind.template.json da671e9bc06b0c92d72532c6d4e9b6a750b68972a820d31166c410f244b9f2b0
```

## Lỗi và đề xuất

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| R19 | CHẶN | Vi phạm quy tắc 4: đáp án tự giải `responsibilities` có 16 ký tự, trong khi `subjects`, `bills`, `faults` chỉ có 8, 5, 6 ký tự. Các lựa chọn đều là danh từ số nhiều nhưng độ dài không tương đương; đáp án nổi bật rõ rệt. | Giữ mục tiêu từ vựng, thay nhiễu bằng danh từ số nhiều dài tương đương, chẳng hạn `qualifications`, `certificates`, `applications`; kiểm lại tính duy nhất và giải mù lại câu được sửa theo PROTOCOL. Không chỉ đổi đáp án cho khớp. |
| L3 | NÊN SỬA | Câu hỏi “What hasn't Max checked yet?” thiếu mốc thời gian. A đúng ở lượt Max nói “Not yet. I haven't had time.”, nhưng ngay sau đó Sophie cùng Max đã xem hạn tên miền. Đây là điểm mơ hồ về thời điểm, chưa xác định hai lựa chọn đúng ngang nhau. | Đổi thành “Before Sophie looked up the domain details, what hadn't Max checked?” hoặc nêu rõ thời điểm tương đương. Đã ghi chú trong đáp án mù trước commit. |

## Kiểm đủ 15 quy tắc

| Quy tắc | Kết quả và chứng cứ |
|---|---|
| 1. Một đáp án đúng | Đã giải 25 câu MCQ (L1–L5, R6–R25); chưa phát hiện hai phương án hợp lý ngang nhau. Nối R1–R5 có năm cặp riêng biệt, dư định nghĩa B. L3 có ghi chú thời điểm như trên. So sánh với tác giả: CHƯA KIỂM, thuộc et-lead. |
| 2. Lộ chéo từ câu nối | Không phát hiện thuật ngữ R1–R5 trong R6–R30, cả câu hỏi, lựa chọn và bài đọc. Đọc ngữ nghĩa không thấy nội dung đặc trưng của năm định nghĩa đúng được dùng để nối cặp. R18 nói lỗi bộ nguồn nhưng không nêu cơ chế dây hỏng/chập mạch; không đủ làm gợi ý cho R2. `online`, `data`, `computer`, `staff` và từ chung của Unit không bị coi là lộ. Định nghĩa B là phương án dư, không dùng làm căn cứ báo lộ. |
| 3. Lặp tình huống | Không phát hiện lặp cùng tình huống cụ thể: website hết hạn tên miền; kế hoạch nghề nghiệp của Khoa; sao lưu gây chậm mạng; tiết kiệm điện ở trường; Wi-Fi phòng họp; tư thế làm việc; máy in tầng hai. Các câu ngắn và S1 có cùng chủ đề Unit nhưng khác nhiệm vụ/ngữ cảnh. Các câu hỏi cùng khai thác một bài đọc/lời thoại không bị tính là tình huống lặp độc lập. |
| 4. Nhiễu từ vựng | R19 CHẶN như trên. R13–R18 và R20 cùng từ loại trong từng câu, độ dài không có chênh lệch nổi bật tương tự R19; R15 đều là cụm động từ hai từ. Chỉ áp dụng cho từ vựng R13–R20. |
| 5. Đúng Unit và nguồn từ vựng | R6–R7: hiện tại hoàn thành/already; R8–R9: suy đoán nguyên nhân; R10–R11: should/try + V-ing; R12: expect + to V. Workbook Unit 8: spill, wrist, cool down ở tr.77; usage, bill ở tr.76; fault ở tr.76; responsibility ở tr.77; subject ở tr.78. Cả tám từ đích có trong Workbook. |
| 6. Bài đọc đúng độ dài, viết mới | R21–R25: 238 từ, đạt 230–270. R26–R30: 164 từ, đạt 160–200. Đếm phần đoạn văn, bỏ tiêu đề. Không xác nhận tính nguyên gốc chỉ từ bản stripped; không xem đề khác. Kiểm trùng bài đọc giữa các đề cùng Unit thuộc validate của et-lead. |
| 7. Câu dịch | W31: short circuit/should; W32: hiện tại hoàn thành, already/yet; W33: can't suy đoán và quá khứ đơn; W34: If…should, try + V-ing; W35: plan to, further qualification. Phù hợp Unit. Không kiểm trùng liên Unit do không đọc các đề khác. |
| 8. Email | Có 7 gạch đầu dòng, chủ đề xử lý Wi-Fi đúng Unit, giới hạn 80–100 từ, yêu cầu đầy đủ khung email hướng dẫn và nêu không tính bốn dòng đầu thư. |
| 9. Writing/Speaking buộc dùng ngữ pháp | Email buộc hiện tại hoàn thành với already/yet, may/might/could, should hoặc try + -ing. S1.1 buộc hiện tại hoàn thành, S1.2 buộc suy đoán, S1.3 buộc động từ kế hoạch + to. S2 buộc lời khuyên và ít nhất hai câu điều kiện với should. S3 buộc hiện tại hoàn thành và quá khứ đơn ở mốc giờ đã kết thúc. Các câu dịch chứa cấu trúc Unit như quy tắc 7. |
| 10. Anh–Anh | Không phát hiện lỗi chính tả Mỹ trong nội dung đã đọc; có `organised`, `organisation`, `customised`. `program` dùng trong ngữ cảnh phần mềm phù hợp; các dạng `car park`, `autumn`, `favourite` cũng phù hợp. |
| 11. Không diễn đạt lại định nghĩa nối | Không thấy hai bài đọc hoặc hai lời thoại diễn đạt lại năm định nghĩa đúng. Lời thoại chẩn đoán website là trao đổi giữa người với người, không mô tả phần mềm/sách hỏi chuỗi câu hỏi của troubleshooting guide. Sao lưu chiếm băng thông không mô tả phần mềm có tính năng thừa ít lợi ích của bloatware. |
| 12. T/F có căn cứ trực tiếp | R26: “gone up by 30% this year” → T; R27 đối lập “most…never switched off at night” → F; R28 khớp đề xuất 15 phút không dùng thì sleep → T; R29 trái “has not bought any new laptops yet” → F; R30 khớp “started last week” → T. Không cần suy luận từ sự vắng mặt của thông tin. |
| 13. Yêu cầu ngữ pháp hiện trong đề | Đạt ở `email.task`, cả ba chuỗi câu hỏi S1, `S2.prompt`, `S3.prompt`; không chỉ dựa vào metadata. Không áp quy tắc này cho dịch Anh→Việt W31–W35. |
| 14. Speaking làm được bằng lời nói | Đạt: không đòi dấu câu hoặc bố cục chữ viết. Các cấu trúc trong ngoặc ở prompt chỉ minh hoạ cách nói; không yêu cầu đọc hoặc viết dấu ngoặc. |
| 15. sourceNotes | Kiểm đệ quy: không còn `sourceNotes` hoặc sáu trường đáp án/bài mẫu trong stripped. Nội dung sourceNotes của tác giả: CHƯA KIỂM vì đã bị loại khỏi đầu vào; không kết luận sạch đáp án cho phần không được cung cấp. |

Không báo lộ giữa các kỹ năng vì thi tuần tự, bao gồm W31 dùng lại thuật ngữ `short circuit` sau Reading. Câu dịch cùng chủ đề Reading cũng không bị tính là lộ.

## Kiểm tra thực hiện và giới hạn bàn giao

- `python3` đọc JSON, đối chiếu template và assert: đúng Unit 8/Test B/source ai, đủ đúng 40 ID, giá trị đáp án đúng loại, L6–L10 không quá 3 từ; PASS.
- `python3` kiểm số lượng: Listening 5+5; Reading 5 nối/6 định nghĩa, 7 ngữ pháp, 8 từ vựng, 5 đọc MCQ, 5 T/F; 25 MCQ đều đủ A–D; 5 câu dịch, 7 gợi ý email, 3 phần Speaking và 3 câu S1; PASS.
- `python3` đếm từ bằng tách khoảng trắng, cùng cách `countWords` trong `src/types/exam.ts`: Listening A/B = 164/166 (đạt 150–250), Reading = 238/164; PASS.
- `python3` duyệt đệ quy trường ẩn: không có `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer`; PASS. Tìm thuật ngữ nối nguyên văn và đọc lại ngữ nghĩa để kiểm quy tắc 2/11.
- `pdftotext -layout '/home/duckcy/Downloads/Workbook for Students.pdf' -` qua Python, chỉ in và đọc Unit 8 Part 1 tr.75–78: xác nhận nguồn tám từ đích R13–R20.
- Chưa chạy `compare-blind.ts` hoặc `validate-exams.ts` trên đề tác giả; chưa kiểm danh sách biến thể `acceptedAnswers`, bản dịch tham khảo, email/bài nói mẫu, TTS hay luồng web. Các kết quả trên là kiểm nội dung bản stripped, không phải chứng nhận runtime.

et-lead cần xử lý R19, cân nhắc sửa L3, tổ chức giải mù mới cho câu đã viết lại, so đáp án và chạy validate trước khi quyết định nhãn cuối. Không merge, không push.
