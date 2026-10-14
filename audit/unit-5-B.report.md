# Báo cáo audit mã 5B — Unit 5, Test B

- Agent/model: et-auditor — gpt-6-astra.
- Nhánh: `audit/unit-5-B`.
- Thời gian: 2026-10-14 21:37:25 +07 (+0700) (lấy từ `date`).
- Commit lời giải trước bước 2: `77d8d49aef7e54dac5df3e5a4f0b1811828b7b25`.
- Nhãn đề nghị: **CẦN SỬA** do sự cố tính mù và thiếu mục đặc tả được yêu cầu. Không tự cấp `AUDIT-OK`.

## Phạm vi và tính độc lập

Đã giải đủ L1–L10, R1–R30 từ `audit/unit-5-B.stripped.json`, điền bản sao template, commit trước khi kiểm đặc tả. Chưa phát hiện câu có hai lựa chọn hợp lý trong lần giải này; điều đó không thay thế việc et-lead đối chiếu đáp án.

**Sự cố bắt buộc công bố:** lệnh đọc đầu tiên đã mở toàn bộ `docs/exam-format.md`, gồm mục 2 “Đáp án” đề mẫu cũ 5A (và 4, 6), trước khi giải 5B. Đây là vi phạm quy tắc giải mù trong brief, dù không mở đáp án tác giả của 5B. Sự cố đã được ghi trong `notes.PROCEDURE` của file lời giải ngay ở commit bước 1. Không được dùng commit này để chứng minh đã đạt cổng giải mù. Cần một phiên auditor mới không nhận file lời giải hoặc các đáp án trong báo cáo này.

Không đọc `data/units/*.json`, không truy cập/checkout nhánh `content/*`, không đọc file cũ `audit/unit-8.stripped.json`, không merge hoặc push. Chỉ tạo hai file đầu ra trong `audit/`. Đã đọc brief, PROTOCOL mục 5/8, đặc tả, bản đồ nguồn, schema được chỉ định; sau commit lời giải đã đối chiếu Workbook Part 1 Unit 5, trang 47–49. Đã kiểm tra chỉ tài liệu `docs/exam-format.md` trên `main` và tại worktree chính để tìm mục 5b; không có mục này trong cả bản commit lẫn bản file hiện tại.

## Lỗi và điều kiện còn chặn

Mỗi dòng dưới đây là một vấn đề độc lập; hai vấn đề thuộc quy trình/đặc tả, không phải lỗi câu hỏi của tác giả.

| Mã câu/phạm vi | Mức độ | Mô tả có bằng chứng | Đề xuất sửa |
|---|---|---|---|
| L1–L10, R1–R30 / BLIND-PROCEDURE | CHẶN | Đã thấy đáp án đề mẫu 5A trước commit giải 5B, trái brief; chưa thấy đáp án 5B nhưng không thể xác nhận phiên giải mù hợp lệ. | Giữ nguyên hồ sơ sự cố; et-lead giao stripped/template cho phiên auditor mới, không truyền đáp án phiên này; commit lời giải mới trước đối chiếu. |
| TOÀN ĐỀ / SPEC-5b | CHẶN | Yêu cầu giao việc viện dẫn `docs/exam-format.md` mục 5b về nhiều đề, nhưng tài liệu tại nhánh audit, `main` và worktree chính chỉ có mục 1–4; không có nội dung để kiểm mục 5b. | et-lead cung cấp bản đặc tả có mục 5b và các bản stripped cần cho so sánh nhiều đề; bổ sung audit theo đúng tiêu chí đó. Không suy đoán ngưỡng khác biệt A/B/C/D. |

Không phát hiện lỗi nội dung đủ căn cứ để yêu cầu sửa riêng câu nào trong bản 5B đã nhận. Kết luận này chỉ có phạm vi một bản stripped và các quy tắc thực sự có trong tài liệu.

## Kiểm đủ 15 quy tắc

| Quy tắc | Kết quả và bằng chứng |
|---|---|
| 1. Một đáp án trắc nghiệm | Chưa thấy đa đáp án ở L1–L5, R6–R25. R6 có tốc độ 300/600 Mbps; R7 có hai giá cùng £180; R8 có “Of all”; R10 cần trật tự câu trần thuật. Không đối chiếu answerKey. |
| 2. Không lộ đáp án nối sang R6–R30 | Không thấy năm thuật ngữ nối xuất hiện nguyên cụm trong R6–R30 hoặc có cặp thuật ngữ–định nghĩa bị bật mí. R14 có “display settings”, nhưng không nêu chức năng xem/đổi cấu hình của control panel; riêng cụm chung này chưa đủ kết luận lộ. R12 nói thử phần mềm trên một máy trước triển khai, không định nghĩa một khoảng dùng thử. |
| 3. Không lặp tình huống | Các tình huống chính khác nhau: máy chiếu trường ngoại ngữ; ngân sách phòng khám; POS quán cà phê; máy tính thư viện; đặt hộp mực; hỏi mua máy in 3-D; hợp đồng điện thoại. Cùng chủ đề mua sắm/so sánh là trọng tâm Unit, không tự động coi là lặp tình huống. |
| 4. Nhiễu cùng từ loại/độ dài | Chỉ áp R13–R20: R13/16/17/19/20 dùng danh từ, R14/18 dùng tính từ, R15 dùng động từ; mỗi lựa chọn một từ. Không áp cho R6–R12. |
| 5. Bám Unit | R6–R8 so sánh; R9 chi phí; R10–R11 câu hỏi gián tiếp; R12 khuyến nghị. Tám từ vựng đích charger, minor, analyse, forum, conclusion, unlimited, set, service đều có ở Workbook Unit 5 Part 1, tr. 47–49. Năm thuật ngữ nối cũng có trong các trang này. |
| 6. Độ dài và tính mới bài đọc | Bài MCQ 240 từ, T/F 171 từ: đạt 230–270 / 160–200, không tính tiêu đề. Chưa có bằng chứng độc lập xác nhận tính mới so với toàn bộ tài liệu nguồn/các đề khác; không suy từ nhãn source=ai. |
| 7. Dịch | Đủ W31–W35. Có so sánh, câu hỏi gián tiếp, cost/come to/spend, trial period, khuyến nghị và bandwidth. Chưa kiểm trùng câu giữa các Unit do không có các stripped tương ứng; không đọc dữ liệu đáp án để kiểm. |
| 8. Email | W-EMAIL có 7 gợi ý; hướng dẫn đặt hộp mực và so sánh/chi phí thuộc Unit; ghi 80–100 từ, loại trừ From/To/Date/Subject. |
| 9. Writing/Speaking buộc ngữ pháp | Email yêu cầu so sánh, chi phí, khuyến nghị, câu hỏi gián tiếp. S1 từng câu lần lượt yêu cầu so sánh, diễn đạt tiền, khuyến nghị; S2 yêu cầu ít nhất 4 câu hỏi gián tiếp; S3 yêu cầu so sánh, chi phí, ít nhất 2 cấu trúc khuyến nghị. |
| 10. Anh–Anh | Các dạng centre, catalogue, analyse, summarises, Harbour phù hợp; không thấy lỗi chính tả Anh–Mỹ trong phần đề đã đọc. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa nối | Đã đọc cả hai bài đọc và hai script; không thấy định nghĩa lại data centre, trial period, control panel, capability hoặc traditional pricing. Việc mô tả tính năng cụ thể của sản phẩm không tự động là định nghĩa capability. |
| 12. T/F rõ bằng chứng | R26: “six years old”; R27: £120 nâng cấp so với £480 mua mới; R28: “would not be as fast as new ones”; R29: “use less electricity”; R30: hội đồng đồng ý trả nửa chi phí. Không có câu cần đoán thông tin vắng mặt. |
| 13. Ngữ pháp hiển thị cho sinh viên | Đạt ở task email, cả 3 câu hỏi S1 và prompt S2/S3, không chỉ ở targetGrammar/requiredGrammar. Không áp quy tắc này cho dịch Anh→Việt W31–W35. |
| 14. Speaking làm được bằng lời nói | Các phần đều yêu cầu so sánh, hỏi thông tin, diễn đạt tiền và khuyến nghị bằng lời; không yêu cầu dấu câu hoặc thao tác chỉ thực hiện được bằng chữ viết. |
| 15. sourceNotes | Bản stripped không có sourceNotes hay sáu trường đáp án/lời giải khác. Nội dung sourceNotes ở bản tác giả CHƯA KIỂM vì bị loại khỏi đầu vào; không kết luận bản gốc không chứa đáp án. |

W34 nhắc trial period và W35 nhắc unlimited bandwidth không bị gắn lỗi lộ đáp án sang Reading: kỹ năng thi tuần tự. Tương tự, câu dịch cùng chủ đề với bài đọc không bị coi là lộ.

## Kiểm cấu trúc và tính nhất quán đã chạy

Lệnh `python3` inline, chỉ mở hai đầu vào 5B và file lời giải, dùng `json`, assertions và SHA-256: **PASS** cho các kiểm tra dưới đây. Đây là kiểm cục bộ bản stripped, không phải `validate-exams.ts` trên đề tác giả.

- Metadata `schemaVersion=1`, `unit=5`, `testId=B`, `source=ai`; đúng 40 ID duy nhất và 40 đáp án, khớp template.
- Số lượng: nghe 5 MCQ + 5 trả lời ngắn; đọc 5 nối/6 định nghĩa + 7 ngữ pháp + 8 từ vựng + 5 đọc MCQ + 5 T/F; đúng A–D, A–F, T/F; L6–L10 không quá 3 từ.
- Đệ quy toàn bộ stripped: không có `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer`.
- Đếm từ bằng tách khoảng trắng, cùng quy ước `countWords` trong schema: Listening A 220; Listening B 165; Reading MCQ 240; Reading T/F 171. Cả bốn đạt khoảng quy định.
- Đủ 5 câu dịch, email 7 gợi ý, wordRange [80,100], Speaking S1/S2/S3; S1 có 3 câu, 45 giây/câu; S2/S3 90 giây.
- Kiểm phép tính nghe/đọc/email: 4×560=2.240; 2×(420+560)=1.960; 650+25×12=950; 480+40×12=960; 6×45=270.
- Kiểm thủ công phần tiền còn lại trong Listening B: 24.000−6.500−8.000−1.800−1.200=6.500, không mâu thuẫn. Speaking S3: phí cố định 8×18=144 và 8×25=200; chưa định lượng cước gọi châu Âu, nên không suy tổng cước thực tế chắc chắn trong ngân sách £220.
- SHA-256 đầu vào sau kiểm tra trùng lúc bắt đầu bước 2: stripped `a9ceeaab950cda560366715003271664549eea1551bd1f8d71d7e74d69d37b38`; template `c349d82d54e691f1a8f871aa21d360f351272d9c0fcc4e1cfa94a576c31032e8`.

## Các cổng chưa đóng và bàn giao et-lead

`compare-blind.ts` CHƯA CHẠY: thuộc bước đối chiếu của et-lead, và phiên hiện tại không đủ điều kiện giải mù. `validate-exams.ts` CHƯA CHẠY: cần bản đề tác giả, ngoài phạm vi cho phép. AcceptedAnswers (kể cả biến thể “150 pounds”), lời giải, bản dịch tham khảo, email mẫu và bài nói mẫu CHƯA KIỂM. Không khẳng định điểm/barem ở ứng dụng hay TTS chạy đúng từ kiểm tra nguồn này.

Cần hoàn thành phiên giải mù mới, cung cấp và kiểm mục 5b, kiểm trùng các đề/Unit khi có đủ đầu vào, đối chiếu đáp án và chạy validator trước khi et-lead quyết định nhãn. Không tự cấp AUDIT-OK, không tự mở phiên mới hoặc liên lạc agent khác trong gói này.
