# Báo cáo giải mù và kiểm đặc tả — Unit 4, Test C

- Agent: et-auditor2 — GPT-6 (Codex). Ghi danh tính phiên đang chạy; không dùng nhãn gpt-6-astra có sẵn trong brief để khẳng định một model khác.
- Nhánh: `audit/unit-4-C`.
- Thời gian từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`: `2026-10-14 22:46:33 +07 (+0700)`.
- Đầu vào: `audit/unit-4-C.stripped.json`, `audit/unit-4-C.blind.template.json`.
- SHA-256 bản stripped: `31fa9dddf8026244817f3a56b6f5cf30e2f80bb2acab305d87c24fceb1497152`.
- Đáp án độc lập: `audit/unit-4-C.blind.json`, đã commit tại `53b0a4a` trước bước kiểm đặc tả.
- Chỉ ghi trong `audit/`; không đọc `data/units/*.json`, không truy cập nhánh `content/*`, không mở mục 2 của `docs/exam-format.md`, không merge/push.

## Kết quả và đề nghị

Đã giải 40/40 câu. Chưa phát hiện câu trắc nghiệm có nhiều đáp án hợp lý hoặc lỗi mức CHẶN trên bản stripped. Có hai điểm NÊN SỬA dưới đây. Nhãn đề nghị: **CẦN SỬA** ở mức làm rõ hướng dẫn, không phải kết luận có lỗi chặn. Chưa so với đáp án tác giả, chưa chạy validator trên đề đầy đủ và không tự cấp AUDIT-OK.

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| L6 | NÊN SỬA | “What time did Nora start the update?” chưa phân biệt rõ bắt đầu cả đợt công việc với bắt đầu cài bản cập nhật. Lời thoại nói bắt đầu lúc 10 giờ tối, sao lưu khoảng 40 phút rồi mới cài. Đáp án mù chọn `10 pm` theo câu giờ bắt đầu trực tiếp; chưa coi đây là AMBIGUOUS vì văn cảnh đang kể toàn bộ đợt cập nhật. | Đổi câu hỏi thành “What time did Nora start working that evening?” để hỏi đúng mốc được nói trực tiếp, tránh người học suy tính giờ bắt đầu cài. |
| W-EMAIL | NÊN SỬA | Gợi ý đầu yêu cầu “switch off the printer / unplug it”, nhưng gợi ý cuối chỉ có “plug the printer in / print a test page”; thiếu thao tác bật lại nguồn sau khi đã tắt máy. Người học làm đủ các gạch đầu dòng vẫn có thể đưa ra chuỗi thao tác chưa hoàn chỉnh. | Sửa gạch cuối về thao tác thành “plug the printer in / switch it on / print a test page”; giữ tổng 7 gạch đầu dòng và giới hạn 80–100 từ. |

## Đối chiếu 15 quy tắc

| Quy tắc | Kết quả trên phạm vi được phép đọc | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án trắc nghiệm đúng | Đạt qua giải độc lập | L1–L5, R6–R25 đều có một phương án phù hợp; R1–R5 nối được duy nhất. L6 có khuyến nghị làm rõ cách hỏi, không kết luận có hai đáp án trắc nghiệm đúng. Độ bao phủ `acceptedAnswers` chưa kiểm vì trường bị loại khỏi đầu vào. |
| 2. Không lộ cặp nối ở R6–R30 | Không phát hiện vi phạm | Năm thuật ngữ Deploy, Caps Lock, Touch screen, Primary key, Jam không xuất hiện nguyên cụm ở R6–R30. Đọc ngữ nghĩa cũng không thấy mô tả đặc trưng của năm định nghĩa đúng giúp nối cặp. “Column” và mô tả cột thuộc định nghĩa A dư, không phải định nghĩa đúng cần bảo vệ. Từ phổ thông như database, computer, records và thao tác cài máy in không tự tạo gợi ý nối cặp. |
| 3. Không lặp tình huống | Không phát hiện lặp nguyên tình huống | Các nhiệm vụ chính lần lượt là lọc danh sách marketing, cập nhật máy chủ ca đêm, sự cố thanh toán rạp phim, sửa báo cáo doanh số, gỡ giấy kẹt, bảng điểm và sự cố đăng nhập. Việc cùng nhắc sao lưu, cơ sở dữ liệu hoặc thiết bị là chủ đề của Unit, chưa phải lặp lại cùng sự việc. |
| 4. Nhiễu từ vựng cùng từ loại, độ dài tương đương | Đạt về chức năng từ trong chỗ trống | Chỉ xét R13–R20. R13/R15–R18 là động từ hoặc cụm động từ; R14 là danh từ; R19 là từ bổ nghĩa trước “devices”; R20 là tính từ/phân từ trong vị trí vị ngữ. Các phương án đều là từ/cụm ngắn, không có đáp án dài thành câu nổi bật. Không áp quy tắc này cho R6–R12. |
| 5. Ngữ pháp và từ vựng Unit 4 | Đạt trong nguồn đã đối chiếu | R6–R12 kiểm quá khứ đơn, by + V-ing, after/while và quá khứ tiếp diễn. Workbook Part 1 tr. 37: query, form, walk through; tr. 38: input device, attached; tr. 38–39: divide; tr. 39–40: check out, reset. Các từ đáp án R13–R20 đều có trong Workbook, không cần suy đoán trang Pearson từ `sourceNotes`. |
| 6. Độ dài / bài đọc viết mới | Độ dài đạt; tính mới chưa xác minh đầy đủ | R21–R25: 231 từ, trong 230–270; R26–R30: 172 từ, trong 160–200. Đếm các đoạn bằng tách khoảng trắng, không tính tiêu đề. Không đọc đề khác; kiểm trùng bài đọc giữa các đề cùng Unit thuộc validator của et-lead. Không khẳng định đã kiểm toàn bộ nguồn để chứng minh tính mới. |
| 7. Câu dịch thuộc Unit, không trùng giữa Unit | Nội dung phù hợp; kiểm trùng liên Unit CHƯA KIỂM | W31: quá khứ đơn/keyboard; W32: by + V-ing/tables; W33: before + V-ing/graphics card; W34: while + quá khứ tiếp diễn và quá khứ đơn; W35: worksheet/sales. Không mở đề Unit khác. |
| 8. Email 5–7 gạch, đúng chủ đề | Đạt | W-EMAIL có 7 gạch, hướng dẫn xử lý máy in thuộc Peripherals; wordRange = [80, 100], đề loại bốn dòng đầu thư khỏi cách đếm. Có khuyến nghị bổ sung thao tác bật nguồn trong gạch sẵn có. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | Đạt | Email bắt buộc before/after + V-ing ít nhất hai lần và by + V-ing ít nhất một lần. S1 lần lượt yêu cầu quá khứ đơn; before/after + V-ing; quá khứ tiếp diễn và quá khứ đơn. S2 yêu cầu quá khứ đơn; S3 yêu cầu hai thì quá khứ với when/while. Các câu dịch chứa cấu trúc hoặc từ vựng phù hợp; W35 tập trung từ vựng worksheet. |
| 10. Chính tả Anh–Anh | Không phát hiện vi phạm | Định nghĩa E dùng “organise”; bài đọc T/F và S2 dùng “formulae”; email dùng “torch”. Đọc toàn bộ văn bản chưa thấy cách viết Mỹ cần sửa. |
| 11. Không diễn đạt lại định nghĩa nối trong bài đọc/lời thoại | Không phát hiện vi phạm | Lời thoại thao tác query và cập nhật server không định nghĩa primary key hay deploy; bài đọc về lỗi phần mềm thanh toán không phải tắc cơ học của jam; bài spreadsheet không định nghĩa touch screen/Caps Lock. Định nghĩa cột A là phương án dư. |
| 12. T/F được văn bản xác nhận/phủ định trực tiếp | Đạt | R26 đối lập “looked too high”; R27 có “on Monday”; R28 có “added the tax twice”; R29 bị phủ định bởi “did not change the total”; R30 đối lập “don't copy … by hand any more” và chuyển sang lấy số từ database tháng tới. Không cần suy luận ngoài văn bản. |
| 13. Yêu cầu ngữ pháp hiện trong đề bài | Đạt | Đã kiểm task của email, cả ba chuỗi câu hỏi S1 và prompt S2/S3, không chỉ targetGrammar/requiredGrammar. Không áp cho W31–W35 theo thống nhất. |
| 14. Speaking thực hiện được bằng lời | Đạt | S2 có gợi ý công thức và brackets nhưng có thể nói “add B, C and D, then divide by three”; không yêu cầu viết hoặc thể hiện dấu ngoặc bằng chữ. S1/S3 là lời kể hoặc giải thích bằng lời. |
| 15. sourceNotes nội bộ, không chứa đáp án | Xác nhận đã loại; nội dung gốc CHƯA KIỂM | Không có `sourceNotes` ở bất kỳ cấp nào của stripped. Nội dung trường gốc không thể kiểm từ bản này; không đọc đề đầy đủ để bù dữ liệu. |

Các ngoại lệ đã áp dụng: trùng chủ đề/cấu trúc giữa kỹ năng, gồm câu dịch và bài đọc, không bị gắn lộ đáp án vì thi tuần tự; `touch screen` ở W34, `jam` ở email và `Caps Lock` ở S3 không bị báo là lộ R1–R5. Không lấy từ phổ thông của Unit làm bằng chứng lộ cặp nối.

## Kiểm tra đã chạy

- `python3` qua stdin: nạp hai JSON đầu vào và JSON đáp án; xác nhận đủ 40 ID duy nhất, khớp template và câu hỏi, đáp án trắc nghiệm/nối/T-F thuộc tập cho phép, L6–L10 tối đa 3 từ — PASS.
- `python3` qua stdin: đếm từ theo khoảng trắng — Listening A 185, Listening B 169 (đều trong 150–250); Reading MCQ 231, Reading T/F 172 — PASS.
- `python3` qua stdin: duyệt đệ quy bản stripped, xác nhận không có bảy trường `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer`, `sourceNotes` — PASS.
- `python3` qua stdin: tìm nguyên cụm năm thuật ngữ nối trong toàn bộ R6–R30 — không có hit; sau đó đọc ngữ nghĩa thủ công cho quy tắc 2 và 11.
- `python3` qua stdin: xác nhận 5 câu dịch, 7 gạch email, 3 phần Speaking và 3 câu hỏi S1 — PASS.
- `pdftotext -layout -f 37 -l 40 '/home/duckcy/Downloads/Workbook for Students.pdf' -`: đối chiếu từ vựng với Unit 4 Part 1 tr. 37–40; chỉ đọc nguồn từ vựng.
- Đọc đúng `docs/exam-format.md` mục 3–4, `docs/PROTOCOL.md` mục 5 và 8, `docs/plan.md` mục 5b; đọc thêm brief, `docs/source-materials.md` và `src/types/exam.ts` theo brief.
- Không chạy `scripts/compare-blind.ts` hoặc `scripts/validate-exams.ts`: phần đối chiếu đáp án, kiểm đề đầy đủ và quyết định AUDIT-OK do et-lead thực hiện. Không kiểm TTS/audio runtime, barem/mẫu trả lời bị stripped hoặc độ trùng giữa các đề.

Nếu có câu phải viết lại, giao bản sửa cho phiên auditor mới theo PROTOCOL mục 5. Không sửa đề hoặc thay đáp án của tác giả trong phiên này.
