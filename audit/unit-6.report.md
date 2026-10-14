# Unit 6 — báo cáo giải mù và kiểm định nội dung

- Agent / solver: et-auditor — gpt-6-astra; nhánh `audit/unit-6-r1`.
- Thời gian: 2026-10-14 15:26:32 +07 (+0700) (lấy bằng `date`).
- Packet: `audit/unit-6.stripped.json`; SHA-256 `8e5769881957f8e4ac73a9e9ac5a2d3f44af5aa3232c0cee22a66c5965593229`.
- Bước 1 đã commit riêng: `b39d3c286c938d8799135d1f5a2f9e988a5f9f0b`, file `audit/unit-6.blind.json`, đủ L1–L10 và R1–R30. R12 có ghi chú mơ hồ ngay trong bản giải mù.
- Căn cứ: brief et-auditor, chỉ dẫn bổ sung của et-lead, `docs/PROTOCOL.md` (đặc biệt mục 5, 8), `docs/exam-format.md` mục 1, 3, 4 (đủ 15 quy tắc), `docs/source-materials.md`, `src/types/exam.ts`.
- Không đọc mục 2 của `exam-format.md`, `data/units`, nhánh `content/*`, nhánh `audit/unit-6` hay commit của nhánh cũ. Toàn bộ nhận định nội dung dựa trên packet sạch; không đối chiếu đáp án tác giả.

## Kết luận và lỗi cần xử lý

**Đề nghị AMBIGUOUS: 1 lỗi CHẶN và 3 điểm NÊN SỬA. Không tự cấp AUDIT-OK.** Et-lead quyết định sau so đáp án và kiểm validator. R12 cần viết lại và giải mù lại bằng phiên mới theo PROTOCOL mục 5; không chỉ đổi đáp án.

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| R12 | CHẶN | Quy tắc 1: chọn C `to know` theo mẫu yêu cầu đào tạo, nhưng A `knowing` vẫn tạo cách đọc hợp ngữ pháp: “It would be great knowing how to create a new group in the company forum.” V-ing mô tả việc biết cách làm là điều tốt; stem không buộc duy nhất mẫu infinitive. | Viết lại stem, ví dụ “I'd like ______ how to create a new group in the company forum.” với bộ lựa chọn hiện có, rồi giao phiên mới giải mù. |
| R14 | NÊN SỬA | Cụm tính từ đứng trước `shops` đang viết `bricks and mortar` không có gạch nối; nên thống nhất cách viết từ ghép. | Viết `bricks-and-mortar shops`; đây là biên tập hình thức, không phải lỗi nhiều đáp án. |
| W-EMAIL | NÊN SỬA | `targetGrammar` yêu cầu mệnh lệnh kèm từ nối trình tự, nhưng `task` chỉ nói dùng các bước; chưa nêu rõ yêu cầu từ nối. Hai cấu trúc trọng tâm Unit 6 (yêu cầu lịch sự, điều kiện loại 2) đã được nêu rõ và đạt quy tắc 13. | Thêm vào task “Use imperatives and sequence words such as first, then and finally” để yêu cầu hiển thị thống nhất với tiêu chí chấm. |
| S2 | NÊN SỬA | Prompt cho phép dùng ít nhất hai trong ba cách giải nghĩa (`called`, `which means`, `is`), trong khi `requiredGrammar` liệt kê riêng cả ba cách. Có nguy cơ tiêu chí chấm đòi nhiều hơn đề hiển thị; chưa kiểm hành vi chấm thực tế. | Ghi rõ trong `requiredGrammar` rằng chỉ bắt buộc ít nhất hai trong ba cách, hoặc đổi prompt thành yêu cầu cả ba. |

## Kiểm đủ 15 quy tắc

| Quy tắc | Kết quả trên packet sạch | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án đúng | CHẶN ở R12 | 25 câu MCQ đều đủ A–D; R12 có hai cách điền hợp lý như dòng lỗi. Các câu còn lại chưa phát hiện phương án đúng thứ hai ở cách đọc thông thường. |
| 2. Không lộ đáp án nối ở R6–R30 | ĐẠT trên packet | Không thấy R6–R30 cung cấp thuật ngữ kèm dấu hiệu đủ để giải lại R1–R5. R7 nhắc `online document collaboration` nhưng không định nghĩa hệ quản lý tài liệu; bài Linden nói tin nhắn, diễn đàn, hồ sơ nhân viên, không định nghĩa lưu/chia sẻ tài liệu. W31–W35 trùng ngữ pháp/thuật ngữ Reading không bị tính lỗi: thi tuần tự, Writing chỉ mở sau khi nộp Reading. |
| 3. Không lặp tình huống | Chưa phát hiện vi phạm | L-A xây shop đồ làm vườn; L-B thông báo lịch đào tạo; bài đọc MCQ triển khai mạng xã hội ở Linden; bài T/F chọn thiết bị cho hãng thiết kế; email hướng dẫn Hana tham gia họp; S1 trải nghiệm cá nhân/trường học; S2 giải nghĩa cho đồng nghiệp bán hàng; S3 báo cáo xu hướng ở công ty du lịch. Cùng chủ đề/ngữ pháp của Unit không tự nó là cùng tình huống. |
| 4. Phương án nhiễu tương đương | ĐẠT về cơ bản | Các nhóm từ vựng có chức năng cú pháp tương đương; MCQ bài nghe/bài đọc dùng cụm/câu cùng kiểu. R6–R12 dùng biến thể hình thái của cấu trúc đang kiểm tra. Không thấy độ dài đáp án nổi bật có tính hệ thống. |
| 5. Bám Unit ở R6–R20 | ĐẠT về chủ điểm; nguồn từng từ CHƯA KIỂM | R6–R7 xu hướng; R8–R9 điều kiện loại 2; R10 giải nghĩa bằng `called`; R11–R12 yêu cầu đào tạo. R13–R20 thuộc e-commerce, conferencing, enterprise tools. Chưa xác minh từng từ với Workbook/giáo trình và số trang trong `sourceNotes`, vì packet không chứa trường này. |
| 6. Độ dài và tính mới bài đọc | ĐẠT độ dài; tính mới CHƯA KIỂM | Bài R21–R25: 242 từ (230–270); bài R26–R30: 182 từ (160–200), không tính tiêu đề. Chưa đối chiếu toàn văn nguồn để chứng minh viết mới. |
| 7. Câu dịch | ĐẠT bám Unit; trùng liên Unit CHƯA KIỂM | W31 xu hướng, W32 điều kiện loại 2, W33 data compression/bandwidth, W34 giải nghĩa chức năng document management, W35 yêu cầu lịch sự. Chỉ nhận Unit 6, không đọc đề Unit khác nên không chứng nhận không trùng liên Unit. |
| 8. Email 5–7 ý, chủ đề Unit | ĐẠT | 7 gạch đầu dòng, hướng dẫn dùng hội nghị truyền hình, 80–100 từ, yêu cầu lời nhắc cuối email. |
| 9. Writing/Speaking buộc ngữ pháp Unit | ĐẠT | Email bắt buộc yêu cầu lịch sự và điều kiện loại 2. S1 lần lượt xu hướng/yêu cầu đào tạo/điều kiện loại 2; S2 giải nghĩa thuật ngữ; S3 mô tả xu hướng. S3 không dùng đúng ví dụ mua thiết bị trong docs nhưng vẫn thuộc ngữ pháp trọng tâm Unit 6; ví dụ không phải mẫu bắt buộc. |
| 10. Anh–Anh | ĐẠT biến thể; có góp ý R14 | Có `organising`, `practise`, `recognises`, `travelling`, `organise`; không thấy lỗi Mỹ/Anh rõ ràng. R14 là góp ý gạch nối, không phải nhầm biến thể ngôn ngữ. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa nối | ĐẠT trên packet | Đã kiểm riêng cả hai lời thoại và hai bài đọc với đủ sáu định nghĩa A–F. Không có mô tả tương đương microblogging, nén file, giỏ hàng, quản lý tài liệu, NFC hoặc định nghĩa nhiễu DRM. L-A giải nghĩa user interface/payment/order tracking; L-B giải nghĩa threaded view/tagging/syncing: các khái niệm khác. W33–W34 có định nghĩa nhưng là câu dịch ở kỹ năng sau, không phải bài đọc/lời thoại và không bị quy thành lộ đáp án. |
| 12. T/F có chứng cứ rõ | ĐẠT cả R26–R30 | Chi tiết từng câu trong bảng dưới; đặc biệt R28 có phủ định trực tiếp `cannot be kept in a shared office`. |
| 13. Yêu cầu ngữ pháp/chức năng hiển thị | ĐẠT yêu cầu Unit; góp ý W-EMAIL/S2 | Đã đọc `task`, từng câu S1, `prompt` và `cues`, không chỉ metadata. Mỗi câu S1 có yêu cầu cấu trúc cụ thể. W31–W35 là dịch Anh→Việt: chức năng dịch được nêu ngay trong instructions, cấu trúc cần hiểu nằm trong câu nguồn; không yêu cầu sinh viên tự viết cấu trúc tiếng Anh cho bài dịch Việt. |
| 14. Speaking thực hiện được bằng lời nói | ĐẠT | S2 yêu cầu `called`, `which means`, `is`, không yêu cầu nói dấu ngoặc. Dấu ngoặc diễn giải công thức điều kiện ở S1 chỉ là ký hiệu hướng dẫn, không phải thao tác bắt buộc khi nói. Các cues S1–S3 có thể trả lời bằng lời nói. |
| 15. sourceNotes nội bộ và không chứa đáp án | ĐẠT loại trường khỏi packet; nội dung gốc CHƯA KIỂM | Quét đệ quy xác nhận packet không có `sourceNotes` và sáu trường đáp án/lời giải khác trong `ANSWER_FIELDS`. Không thể xác nhận `sourceNotes` gốc không chép đáp án, hoặc trình duyệt thực sự loại trường, từ stripped JSON. Et-lead/et-qa kiểm tiếp; không coi thiếu bằng chứng là PASS toàn quy tắc. |

## Bằng chứng True/False — quy tắc 12

| Câu | Giải mù | Căn cứ trực tiếp trong bài |
|---|---|---|
| R26 | T | “A videophone is cheaper”; đoạn 2 cũng nói giá hệ thống cao hơn giá videophones. |
| R27 | F | Nhóm thường cần họp với “several people at different locations”, phủ định “always ... exactly two people”. |
| R28 | F | “The equipment cannot be kept in a shared office” đối lập trực tiếp với phát biểu “can be kept”. Không chỉ suy từ `dedicated room`. |
| R29 | T | Quản lý kỳ vọng ít chuyến công tác hơn “to reduce costs in the long term”. |
| R30 | F | Quản lý muốn thêm thông tin “about maintenance costs and training” và biết nhân viên cần học vận hành. |

## Kiểm tra đã chạy và giới hạn bàn giao

- `python3` kiểm JSON bằng assertions: PASS — đủ 40 ID và định dạng đáp án; L6–L10 không quá 3 từ; 25 MCQ mỗi câu đủ A–D; 5 câu nối/6 định nghĩa; Reading liên tục R1–R30; đủ 5 câu dịch, email 7 ý và wordRange [80,100], Speaking S1–S3 với 3 câu hỏi S1.
- `python3` đếm từ bằng `split()` trên phần text, cùng quy ước whitespace của `countWords` trong `src/types/exam.ts`: PASS — Listening A 227, B 197 (150–250 mỗi phần); Reading MCQ 242, T/F 182. Không đếm speaker, title hay instructions.
- `python3` quét mọi dict/list trong packet: PASS — không còn `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer`.
- Kiểm thủ công 15 quy tắc và chứng cứ T/F: kết quả như trên, có 1 CHẶN và 3 NÊN SỬA. Kiểm cấu trúc packet không thay thế validator của đề đầy đủ.
- CHƯA CHẠY `scripts/compare-blind.ts` và `scripts/validate-exams.ts` trên đề tác giả; giao et-lead thực hiện trong quyền hạn của lead. CHƯA KIỂM acceptedAnswers (bao gồm biến thể `twelve`/`12`, tên phòng), bản dịch mẫu, bài mẫu, sourceNotes gốc, chấm AI, TTS và giao diện thi tuần tự.
- Không sửa packet đầu vào, không merge, không push. Hai file bàn giao là `audit/unit-6.blind.json` và `audit/unit-6.report.md`; hai file đầu vào do lead đặt vẫn giữ nguyên, không đưa vào commit.
