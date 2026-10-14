# Unit 5 — Báo cáo giải mù và kiểm đặc tả

- Agent/solver: `et-auditor — gpt-6-astra`; nhánh `audit/unit-5`.
- Thời gian kiểm: `2026-10-14T15:39:51+07:00` (đầu ra `date --iso-8601=seconds`).
- Bước 1 đã commit riêng: `124efe70d824706ffbd385e0af49ddab552a432e`, chỉ thêm `audit/unit-5.blind.json`, trước khi thực hiện Bước 2.
- Kết quả: giải đủ 40 câu; không phát hiện câu có hai đáp án hợp lý khi giải độc lập; `notes` rỗng. Có **0 lỗi CHẶN, 3 điểm NÊN SỬA** trong phạm vi bản stripped. Nhãn đề nghị: **CẦN SỬA**. Đây không phải kết quả so với đáp án tác giả và không phải `AUDIT-OK`.

## Phạm vi và tính độc lập

Đã đọc brief et-auditor, `docs/PROTOCOL.md`, `docs/exam-format.md` mục 1, 3, 4 (đủ quy tắc 1–15), `docs/source-materials.md`, `src/types/exam.ts`, và hai file packet Unit 5 được giao. Mục 2 của `exam-format.md` đã bị loại khỏi đầu ra khi đọc. Không đọc `data/units`, nhánh `content/*`, audit của Unit khác trên main hoặc nhánh `audit/*` khác; không đọc đáp án tác giả kể cả sau commit mù. Chỉ ghi trong `audit/`, không merge/push.

Sau commit mù, đối chiếu thêm Workbook trang 47–50 bằng `pdftotext` (từ vựng Unit 5 ở trang 47–49; trang 50 là bài tập không có đáp án) và ảnh trang sách 40, trang PDF 42, của giáo trình Pearson để xác nhận từ `subscription`. Ảnh trích xuất tạm trong `audit/` đã được xoá. Không sử dụng các nguồn đó để sửa đáp án đã commit.

Áp dụng đúng bổ sung của người giao việc: thi tuần tự; nội dung W31–W35 trùng Reading không tính là lộ; quy tắc 13 không áp dụng cho dịch Anh → Việt. Các điểm không thể xác nhận từ bản stripped được ghi CHƯA KIỂM, không mặc định đạt.

SHA-256 của các đầu vào/đáp án:

```text
unit-5.stripped.json        955e13fcc87411632e65aca1a509b8fe9be49b57d4c57cbcbf7030f3b5f3d7ee
unit-5.blind.template.json  7d2cb750288aaa0c232b319be94efeb50a70e839dac351f4965e03d9c9a532de
unit-5.blind.json           09a6de844c284ce7b5dcc20f8fa41d7e3206525006b7311e8b391f8b115fb206
```

## Các điểm cần sửa

Mỗi dòng dưới đây là một phát hiện. Đây là vấn đề thiết kế phương án nhiễu theo quy tắc 4, không phải câu nhiều đáp án; khác biệt giữa các dạng so sánh hoặc trật tự từ cần kiểm tra ngữ pháp không tự động bị coi là lỗi.

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| R7 | NÊN SỬA | Quy tắc 4: `speed` là danh từ, trong khi `fast/faster/fastest` là các dạng tính từ ở vị trí này; phương án A khác từ loại, dễ loại bỏ. | Thêm dữ kiện tốc độ, ví dụ máy cũ 10 trang/phút và máy mới 20 trang/phút, rồi dùng `slow/faster/fastest/fast`; dữ kiện giữ duy nhất `fast` hợp lý, không thay đơn thuần `speed` bằng `slow` trên stem hiện tại vì sẽ tạo hai đáp án. |
| R10 | NÊN SỬA | Quy tắc 4: `that` dẫn mệnh đề, còn `to/for/about` là nhóm phương án khác chức năng/từ loại. Đáp án B vẫn duy nhất. | Dùng bốn liên từ, chẳng hạn `although/that/because/unless`, giữ câu `I recommend ______ we choose the low-cost option for now.`; giải mù lại bản sửa theo protocol. |
| R12 | NÊN SỬA | Quy tắc 4: đáp án `to` là dấu hiệu động từ nguyên mẫu, còn `for/than/with` không phải các dạng động từ tương đương; bộ nhiễu chưa đồng nhất về loại cấu trúc. | Đổi thành `I think it is best ______ the user reviews before buying.` và dùng các dạng của cùng động từ: `to read/reading/read/reads`, vẫn kiểm tra `it's best + to-infinitive`. |

## Kiểm đủ quy tắc 1–15

| Quy tắc | Kết quả | Bằng chứng và giới hạn |
|---|---|---|
| 1 — Một đáp án trắc nghiệm | ĐẠT khi giải độc lập | Đã giải 25 câu MCQ (L1–L5, R6–R25), mỗi câu chọn được một đáp án tốt nhất từ ngữ cảnh/văn bản. R6 có hai giá cụ thể nên loại được `more`; R8 có `of the three` nên chọn so sánh nhất. Năm câu nối cũng có ánh xạ duy nhất, thừa định nghĩa C. Chưa so đáp án tác giả. |
| 2 — Không lộ từ câu nối sang R6–R30 | ĐẠT trong packet | Không thấy `extended warranty`, `card reader`, `total cost of ownership/TCO`, `freemium pricing`, `compatibility` được đưa sang R6–R30 thành đáp án/gợi ý định nghĩa. R14 mô tả tiered pricing, không nói tầng miễn phí; không cung cấp đặc điểm phân biệt của freemium. W31/W33/W34 có nội dung liên quan câu nối nhưng được miễn theo chế độ thi tuần tự. |
| 3 — Không lặp tình huống | ĐẠT trong Unit 5 | L-A: hỏi mua phần mềm quản lý dự án; L-B: chọn laptop cho hãng du lịch; R21–25: CAD cho công ty thiết kế; R26–30: hosting cửa hàng xe đạp; email: backup cho 20 nhân viên; S2: dung lượng lưu trữ của người thiết kế tự do; S3: báo cáo hoá đơn thiết bị. Email/S2 cùng có bảng giá–dung lượng–hỗ trợ nhưng khác mục đích, người dùng và ràng buộc; chưa coi cùng chức năng so sánh của Unit là lặp một tình huống. Các câu ngắn không chép lại nguyên tình huống có tên/số liệu. Không dùng sự tương đồng của câu dịch với Reading làm lỗi. |
| 4 — Nhiễu cùng từ loại, độ dài tương đương | NÊN SỬA | Ba điểm R7/R10/R12 ở bảng lỗi. Các câu nghe/đọc hiểu dùng lựa chọn có cấu trúc tương ứng; không thấy đáp án đúng nổi bật chỉ vì dài bất thường. Các lựa chọn còn lại có độ dài tương đương ở mức từ/cụm từ/câu. |
| 5 — Ngữ pháp và từ vựng đúng Unit | ĐẠT về nội dung; CHƯA KIỂM ghi chú nguồn | R6–8 kiểm tra so sánh; R9 câu hỏi gián tiếp; R10/R12 khuyến nghị; R11 `spend on`. R13 accessory: WB 47; R14 tiered: WB 49; R15 come out: WB 48; R16 IP address: WB 49; R17 fee: WB 49; R18 3-D: WB 47; R19 uptime: WB 49; R20 subscription: Pearson trang sách 40/PDF 42. Không thấy `subscription` trong WB Part 1 Unit 5; đã xác nhận trong bài Product research của giáo trình. `sourceNotes` bị strip nên CHƯA KIỂM tác giả có ghi trang 40 cho R20 hay chưa; et-lead cần xác nhận. |
| 6 — Độ dài và bài đọc viết mới | ĐẠT độ dài; CHƯA KIỂM toàn bộ nguồn gốc | R21–25: 247 từ, trong 230–270; R26–30: 168 từ, trong 160–200. Có bối cảnh BlueLine/Kim và nội dung nhất quán. Chưa đối chiếu toàn bộ giáo trình/đề mẫu nên không xác nhận tuyệt đối yêu cầu viết mới; đặc biệt không mở mục đáp án mẫu bị cấm. |
| 7 — Câu dịch bám Unit, không trùng giữa Unit | ĐẠT nội dung; CHƯA KIỂM liên Unit | W31: phụ kiện/TCO; W32: so sánh hosting; W33: câu hỏi gián tiếp/compatibility; W34: freemium; W35: khuyến nghị. Đủ năm câu khác nhau trong packet. Không được đọc các Unit khác nên chưa xác minh trùng câu giữa Unit; et-lead cần kiểm ở phạm vi có thẩm quyền. |
| 8 — Email 5–7 gợi ý, đúng chủ đề | ĐẠT | Có 7 bullets; so sánh ba giải pháp backup, tính chi phí 20 người, khuyến nghị và hỏi ý kiến quản lý; yêu cầu 80–100 từ. Giá DataVault: 6 × 20 = 120 USD/tháng. |
| 9 — Writing/Speaking buộc dùng ngữ pháp Unit | ĐẠT | Email yêu cầu ít nhất hai cấu trúc so sánh, một khuyến nghị, một câu hỏi gián tiếp và `cost/come to`. S1.1 buộc so sánh; S1.2 dùng động từ chi phí; S1.3 đặt ít nhất hai câu hỏi gián tiếp. S2 so sánh và khuyến nghị; S3 nói chi phí và so sánh ít nhất hai món. Câu dịch dùng từ/cấu trúc của Unit, không yêu cầu tự viết cấu trúc tiếng Anh khi dịch sang tiếng Việt. |
| 10 — Chính tả Anh–Anh | ĐẠT trong văn bản hiển thị | Có `licence`, `centre`, `modelling`; không phát hiện biến thể chính tả Mỹ cần sửa trong lời thoại, bài đọc, câu hỏi, lựa chọn hoặc đề Writing/Speaking. Dùng USD không phải lỗi chính tả. Chưa kiểm giọng TTS thực tế. |
| 11 — Không diễn đạt lại định nghĩa câu nối trong bài đọc/lời thoại | ĐẠT trong packet | Đã đọc cả hai scripts và hai passages. Không có mô tả gia hạn bảo hành, đọc thẻ nhớ, khả năng tương thích hoặc tổng giá mua cộng chi phí sử dụng về sau. Không có free tier vĩnh viễn đi kèm paid tier của cùng sản phẩm: TaskPoint cho dùng thử 30 ngày, còn DrawLite/CADWorks là hai gói phần mềm khác nhau. Các mô tả này không định nghĩa freemium. Bài hosting không định nghĩa data centre (định nghĩa nhiễu C) và không diễn giải lại năm thuật ngữ nối. |
| 12 — T/F được khẳng định/phủ định rõ | ĐẠT | Cả năm câu có chứng cứ trực tiếp, xem bảng T/F bên dưới. Không có câu cần gán False chỉ vì thiếu thông tin. |
| 13 — Nêu ngữ pháp/chức năng trong đề hiển thị | ĐẠT | Đã kiểm `email.task`, từng chuỗi câu hỏi S1.1/S1.2/S1.3, `S2.prompt`, `S3.prompt`; tất cả nêu cấu trúc/chức năng cần dùng trực tiếp. Không lấy `targetGrammar`/`requiredGrammar` làm bằng chứng duy nhất. Không áp dụng quy tắc này cho W31–W35. |
| 14 — Speaking làm được bằng lời nói | ĐẠT | So sánh, hỏi gián tiếp, khuyến nghị, đọc giá và giải thích hoá đơn đều nói được. Các gạch chéo, số tiền trong cues chỉ là dữ liệu cho người thi, không yêu cầu phát âm dấu câu hay tạo cấu trúc chỉ tồn tại ở văn viết. |
| 15 — sourceNotes nội bộ, không chép đáp án | ĐẠT việc strip; CHƯA KIỂM nội dung gốc | Quét đệ quy xác nhận không có `sourceNotes` hay sáu trường đáp án/lời giải còn lại trong packet. Không thể kết luận ghi chú gốc có chép đáp án hay không vì không đọc bản gốc. Et-lead kiểm phần đó. |

### Bằng chứng T/F

| Câu | Kết luận độc lập | Căn cứ ngay trong bài |
|---|---|---|
| R26 | T | `Kim is building a small website for a local bike shop.` |
| R27 | F | `The website will not receive thousands of visitors each day.`; trong bối cảnh bài, khách truy cập website của shop. |
| R28 | F | Shared hosting đặt website `on a server with several other websites`. |
| R29 | T | Đoạn dedicated hosting nêu `the monthly fee is normally higher`. |
| R30 | T | `First, Kim checks the support service and the expected uptime` rồi `After that, she recommends`. |

## Kiểm tra đã chạy và việc còn lại

- `python3` đọc riêng JSON Unit 5, dùng assertions: **PASS** cho 40 ID/giá trị đáp án mù; 25 MCQ đủ A–D; matching 5 câu/6 định nghĩa; 5 câu short có `maxWords=3` và đáp án không quá ba từ; T/F đúng miền giá trị; thứ tự ID; số câu mọi phần; tên người nói; wordRange email; số bullets; số phần và thời lượng Speaking; không chứa bảy trường bị strip.
- Đếm từ bằng `len(text.split())`, tương đương cách tách khoảng trắng trong `countWords` của schema: Listening A **230**, B **173**, Reading MCQ **247**, T/F **168** — **PASS** toàn bộ giới hạn.
- Kiểm số liệu bằng assertions: 15 × 12 = 180 (L-A), 35 × 3 = 105 (R24), 6 × 20 = 120 (email), 899 + 45 + 25 + 120 = 1089, dưới ngân sách 1200 (S3) — **PASS**.
- `pdftotext -f 47 -l 50 -layout '/home/duckcy/Downloads/Workbook for Students.pdf' -` và xem ảnh trích `pdftoppm -f 42 -l 42 -singlefile -scale-to 1800 -png ...` — đã xác minh nguồn từ vựng nêu ở quy tắc 5.
- Không chạy `scripts/compare-blind.ts` hoặc `scripts/validate-exams.ts` vì đó là các bước cần bản có đáp án thuộc phạm vi et-lead; các assertions ở đây không thay thế hai gate này. Chưa kiểm danh sách `acceptedAnswers` có bao phủ biến thể như chữ/số của L6/L8 hay không.
- Et-lead cần xử lý ba điểm NÊN SỬA, so blind với tác giả, kiểm schema bản đầy đủ, ghi chú nguồn, nguồn gốc bài đọc/lời thoại và trùng câu dịch liên Unit. Nếu viết lại câu, áp dụng protocol về nhánh sửa và phiên auditor mới. Không suy ra `AUDIT-OK` từ báo cáo này.
