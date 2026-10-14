# Báo cáo giải mù lại một phần — bc5

Thời gian: 2026-10-14T22:32:42+07:00
Agent: et-auditor — GPT-6 (Codex).
Nhánh: `audit/reblind-bc5`.
Commit giải mù trước kiểm định: `6aaf9ff0eafe1ae443f31219a949fb445e68165a`.

## Phạm vi và giới hạn

- 2C: R5, R10, R11, R15, R26, R27, R28, R29, R30.
- 7B: R9.
- Chỉ điền 10 câu trên; mọi đáp án khác giữ trống theo template. Phần còn lại của hai bản stripped chỉ được đọc làm ngữ cảnh đối chiếu lộ đáp án và lặp tình huống, không giải hoặc tái cấp kết luận cho các câu ngoài phạm vi.
- Đã đọc brief, exam-format mục 3–4 và PROTOCOL mục 5, 8. Không đọc nội dung exam-format mục 2, không mở `data/units/*.json`, không truy cập nhánh khác, không đọc đáp án tác giả.
- Chưa so đáp án bằng `scripts/compare-blind.ts`; chưa chạy `scripts/validate-exams.ts` trên đề gốc. Không tự cấp AUDIT-OK.
- Brief ghi solver gpt-6-astra, nhưng thông tin phiên hiện tại chỉ xác nhận GPT-6 (Codex); dùng định danh đó, không tự nhận một biến thể model chưa được xác nhận.

## Kết quả giải mù đã commit

| Đề | Câu | Chọn | Căn cứ |
|---|---|---|---|
| 2C | R5 | E | Định nghĩa cáp nối máy tính với mạng. |
| 2C | R10 | C | Trật tự tự nhiên: Plug + the headphones + into the audio socket. Có ghi chú về A trong bản blind. |
| 2C | R11 | D | because + mệnh đề chỉ nguyên nhân; các lựa chọn khác không phù hợp cấu trúc hoặc ý nghĩa. |
| 2C | R15 | D | Chọn Print từ File menu. |
| 2C | R26 | T | Đoạn 1: “They are usually cheaper than wireless ones”. |
| 2C | R27 | F | Đoạn 1: “many new phones do not have a headphone socket”, trực tiếp bác bỏ “All new phones have”. |
| 2C | R28 | T | Đoạn 2: “Most models play music for 20 to 30 hours before you need to charge them.” |
| 2C | R29 | F | Đoạn 2: “professional sound engineers still prefer wired headphones”, trái với wireless. |
| 2C | R30 | F | Đoạn 3: “the noise-cancelling function uses extra battery power”, trái với does not use any extra. |
| 7B | R9 | A | can be downloaded là bị động với tác nhân by users; B chủ động, C thiếu be, D sai dạng phân từ. |

## Phát hiện và đề xuất

Mỗi dòng dưới đây là một phát hiện, chỉ quy trách nhiệm sửa cho câu trong phạm vi.

- **2C:R10 — CHẶN — Quy tắc 3:** câu đúng “Plug the headphones into the audio socket.” lặp đúng thao tác và thiết bị trong câu mở đầu bài đọc R26–R30: “Wired headphones plug into the headphone socket of your phone or computer.” Đây là trùng thao tác cắm tai nghe vào ổ âm thanh, không chỉ trùng chủ đề multimedia. Đề xuất: đổi R10 sang tình huống khác, vẫn kiểm động từ + tân ngữ + giới từ + đích; tránh cả tình huống cắm loa của W33, chuyển ảnh của S1 và lắp linh kiện của S3. Có thể dùng thao tác lấy tờ giấy mắc kẹt ra khỏi máy in, với ba phương án sai cấu trúc rõ ràng, rồi giải mù lại câu mới.
- **2C:R10 — NÊN SỬA — Quy tắc 1:** A “Plug into the audio socket the headphones.” kém tự nhiên khi tân ngữ ngắn, nhưng có cách đọc nhấn mạnh tân ngữ cuối câu; yêu cầu “Which sentence is correct?” không giới hạn vào trật tự chuẩn đang học. Đây là nghi vấn độ chắc của nhiễu, chưa kết luận A ngang mức hợp lý với C trong ngữ cảnh thông thường. Đề xuất: khi viết lại R10, dùng nhiễu sai cấu trúc rõ ràng hoặc nêu rõ cấu trúc cần chọn; không dùng riêng độ thiếu tự nhiên để loại A.

Không phát hiện lỗi khác trong các câu được giao. Nhãn đề nghị: **CẦN SỬA** do 2C:R10. Không dùng AMBIGUOUS để khẳng định bất đồng với tác giả khi chưa có đối chiếu đáp án.

## Đối chiếu đủ 15 quy tắc trong phạm vi

| Quy tắc | Kết quả và căn cứ |
|---|---|
| 1. Một đáp án | R5 chỉ E khớp; R11 chỉ D hợp nghĩa và cấu trúc; R15 chỉ D; 7B:R9 chỉ A. R10 chọn C, có nghi vấn nhiễu A như trên. Năm câu T/F có bằng chứng trực tiếp. |
| 2. Không lộ thuật ngữ/định nghĩa đúng | Không thấy thuật ngữ nối R1–R5 xuất hiện nguyên cụm trong các câu đích R6–R30 và bài đọc T/F 2C. Kiểm nghĩa thủ công không thấy các câu đích diễn đạt lại định nghĩa đúng. Riêng R5 mới của 2C: Ethernet cable và nội dung cáp nối mạng không được gợi lại ở R6–R30. “socket/plug” thuộc định nghĩa B dư của 2C, không tính là lộ theo phạm vi người giao việc; không coi mọi từ phổ thông trùng nhau là từ khoá lộ đáp án. |
| 3. Không lặp tình huống | CHẶN R10: lặp tình huống mở đầu bài đọc tai nghe. Hai bài đọc 2C khác nhau: trường đổi hệ điều hành và hướng dẫn chọn tai nghe. Các câu đích còn lại không thấy lặp tình huống bài đọc; 7B:R9 nói tải ứng dụng, khác bài đọc CityBikes và SmartBell. Các câu hỏi cùng một bài đọc không bị coi là những tình huống độc lập bị lặp. |
| 4. Nhiễu từ vựng cùng từ loại/độ dài | 2C:R15: speaker, socket, filename, menu đều là danh từ đơn, lần lượt 7/6/8/4 chữ cái; cùng một từ, độ dài tương đương, không có nhiễu là động từ/tính từ. Không áp điều kiện cùng từ loại cho câu ngữ pháp. |
| 5. Bám ngữ pháp/từ vựng Unit | R10 bám trật tự tân ngữ/giới từ; R11 bám reason/purpose của grammarFocus Unit 2. 7B:R9 bám passive của Unit 7. R15 là từ vựng GUI, phù hợp functions Unit 2. Nguồn Workbook/trang giáo trình: CHƯA KIỂM vì không nằm trong đầu vào được giao và sourceNotes bị loại khỏi stripped. |
| 6. Độ dài và viết mới | Bài T/F 2C có 172 từ theo khoảng trắng, không tính tiêu đề, đạt 160–200; bài MCQ 2C dùng làm ngữ cảnh có 239 từ. Tính viết mới so với nguồn ngoài: CHƯA KIỂM; không có căn cứ từ stripped để chứng nhận. |
| 7. Câu dịch | Không áp dụng: không có W31–W35 được giao kiểm lại. |
| 8. Email 5–7 gợi ý | Không áp dụng: không có email được giao kiểm lại. |
| 9. Writing/Speaking buộc dùng ngữ pháp | Không áp dụng cho 10 câu Reading; không tái kiểm định Writing/Speaking. |
| 10. Chính tả Anh–Anh | Không thấy lỗi trong các câu đích và bài T/F 2C; các từ headphones, adapter, noise-cancelling, open-plan, downloaded không tạo lỗi chính tả Anh–Anh. |
| 11. Không diễn đạt lại định nghĩa trong bài đọc/lời thoại | Bài T/F 2C không mô tả icon, ổ lưu trữ bán dẫn, xác thực tài khoản, kéo bằng chuột hay cáp mạng. Định nghĩa đúng của R5 mới không được diễn đạt lại trong hai bài đọc hoặc lời thoại 2C. Cắm tai nghe vào socket không phải định nghĩa đúng của một thuật ngữ nối 2C hiện tại. 7B:R9 không diễn đạt định nghĩa đúng của nhóm nối; không tái kiểm cả bài đọc/lời thoại 7B. |
| 12. T/F khẳng định/phủ định rõ | R26–R30 đều đạt theo trích đoạn ở bảng đáp án; không dùng suy luận từ việc văn bản không nói tới. |
| 13. Yêu cầu ngữ pháp hiện trên đề Writing/Speaking | Không áp dụng: ngoài phạm vi kiểm lại. |
| 14. Speaking làm được bằng lời nói | Không áp dụng: ngoài phạm vi kiểm lại. |
| 15. sourceNotes không chứa đáp án | Xác nhận không có sourceNotes trong hai stripped. Nội dung ghi chú gốc: CHƯA KIỂM, không được mở đề gốc để xác nhận. |

## Kiểm tra kỹ thuật và dấu vết

- `python3` kiểm JSON và cấu trúc template: PASS; mỗi file giữ nguyên tập khoá cấp cao, unit/test và 40 khoá answers; đúng 9 + 1 giá trị không rỗng, notes chỉ chứa câu được giao.
- `python3` kiểm các khoá `answerKey`, `acceptedAnswers`, `explanation`, `sourceNotes` trong hai stripped: không xuất hiện.
- `python3` dò nguyên cụm thuật ngữ nối ở nội dung đích: không có hit; kết luận về diễn đạt lại dựa trên đọc thủ công, không chỉ dựa trên phép dò chữ.
- `python3` đếm từ bằng `split()`: T/F 2C = 172; MCQ 2C = 239.
- Các kiểm tra trên là kiểm phạm vi/nguồn stripped; không thay thế đối chiếu đáp án hoặc validator của et-lead.

SHA-256 đầu vào:

```text
unit-2-C.stripped.json d9cbedeed304ef559c840dce5a4561a72ec3a277cdc241864c88eaaec5133cc1
unit-7-B.stripped.json 75974044065dcad7b8b6e5499b7b55545d9bc3edf6605af69c80439f47c2487e
unit-2-C.blind.template.json ad483a6c4d812b3e3c255c41df61ad058ff3340d109bc0987070ba52b52e5447
unit-7-B.blind.template.json b83d0a315da23cf80a3a974fa564d3d6c018897f936464a25095db956d9c441f
```

Bàn giao et-lead đối chiếu 10 câu với đáp án tác giả. Giữ nguyên commit blind trước báo cáo. Chưa merge hoặc push; bốn file đầu vào untracked được giữ nguyên, không đưa vào commit.
