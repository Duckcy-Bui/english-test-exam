# Báo cáo audit mù — Unit 7, Test C (7C)

- Agent: et-auditor2 — GPT-6 (Codex; không tự nhận biến thể gpt-6-astra ghi trong brief).
- Nhánh: `audit/unit-7-C`.
- Thời gian kiểm tra: `2026-10-14 22:33:26 +07 (+0700)` — lấy từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`.
- Commit đáp án mù, hoàn thành trước bước kiểm đặc tả: `496ff0e97e581c6bd1e2d7f512a2d5b2538ef4b5`.
- Kết luận trên bản stripped: **0 lỗi CHẶN; 3 mục NÊN SỬA**. Nhãn đề nghị: **CẦN SỬA** cho các điểm chất lượng dưới đây. Chưa phát hiện câu trắc nghiệm có hai đáp án hợp lý ngang nhau; chưa so đáp án tác giả nên chưa kết luận về sai khác `AMBIGUOUS` theo PROTOCOL.
- Không tự cấp `AUDIT-OK`. et-lead quyết định sau khi so đáp án và chạy validate trên dữ liệu đầy đủ.

## Phạm vi và tính độc lập

Giải đủ L1–L10 và R1–R30 chỉ từ `audit/unit-7-C.stripped.json`, điền bản sao template rồi commit. Sau commit mới kiểm đặc tả và đối chiếu danh sách từ Workbook. Không đọc `data/units/*.json`, không đọc đề khác, không truy cập nhánh `content/*`, không mở mục 2 của `docs/exam-format.md`, không merge/push.

Tài liệu đã dùng: brief `et-auditor.md`; `docs/exam-format.md` chỉ mục 3–4; `docs/PROTOCOL.md` mục 5 và 8; `docs/plan.md` mục 5b; `docs/source-materials.md`; `src/types/exam.ts`. Đối chiếu bổ sung sau commit mù: Workbook Part 1 Unit 7, trang 67–69, qua `pdftotext`.

Áp dụng các thống nhất của người giao việc: quy tắc 4 chỉ cho R13–R20; quy tắc 13 không cho dịch Anh→Việt; trùng chủ đề Reading–Writing không phải lộ đáp án khi thi tuần tự; quy tắc 2 xét thuật ngữ và nội dung đặc trưng của định nghĩa đúng, không gắn cờ chỉ vì trùng từ phổ thông; kiểm trùng bài đọc giữa các đề cùng Unit dành cho et-lead.

## Các điểm cần sửa

Mỗi dòng dưới đây là một mục riêng; không có lỗi CHẶN.

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| R19 | NÊN SỬA | Quy tắc 4: đáp án mù `bug` chỉ 3 ký tự, trong khi cả ba nhiễu `schedule / feedback / purchase` đều 8 ký tự; độ dài từ nổi bật hơn hẳn các lựa chọn khác, dù tất cả đều là một từ và là danh từ. | Thay bằng các nhiễu danh từ có độ dài gần nhau, vẫn chỉ có một lựa chọn phù hợp nghĩa; kiểm lại toàn bộ câu sau khi đổi. |
| R18, R19, R20 | NÊN SỬA | Nhiễu `feedback` ở cả ba câu bị loại bằng mạo từ `a / an`: trong nghĩa phản hồi của Unit, đây là danh từ không đếm được. Cùng từ loại nên không coi riêng điểm này là vi phạm cứng quy tắc 4, nhưng làm giảm chất lượng phép kiểm từ vựng. | Dùng nhiễu danh từ đếm được số ít, tương đương độ dài; tránh để hình thức ngữ pháp loại ngay một phương án. |
| S3 | NÊN SỬA | Prompt nói shop ngừng hoạt động “for an hour”, nhưng cues cho sale bắt đầu 8 a.m. và server khởi động lại 9.15 a.m.; chưa nêu thời điểm bắt đầu ngừng hoạt động. Không phải mâu thuẫn chắc chắn, nhưng người học dễ hiểu thời gian gián đoạn là 75 phút hoặc phải tự thêm mốc. | Nêu rõ bắt đầu gián đoạn lúc 8.15 a.m. và khôi phục 9.15 a.m., hoặc đổi thời lượng thành “for over an hour” nếu sự cố bắt đầu lúc 8 a.m. |

## Kiểm đủ 15 quy tắc

| Quy tắc | Kết quả và bằng chứng |
|---|---|
| 1. Một đáp án đúng | Chưa phát hiện đa đáp án trong L1–L5, R6–R25. R1–R5 nối được duy nhất lần lượt B/D/E/F/A, dư C. R14 chọn `dynamic` vì “full of energy … new ideas”; `versatile` không diễn đạt đủ nghĩa này. R17 chọn `viewable` phù hợp đối lập xem được nhưng không sửa/tải được. Đây là kết luận giải độc lập, chưa phải kết quả compare-blind. |
| 2. Không lộ nối cặp qua R6–R30 | Không thấy các thuật ngữ `alpha testing`, `line of code`, `specification`, `premium content`, `value` được đưa ra làm đáp án/gợi ý nối cặp ở R6–R30. Các ý chương trình, website, yêu cầu hệ thống hoặc số lượng chung không đủ giúp xác định riêng cặp. |
| 3. Không lặp tình huống | Chưa thấy lặp tình huống cụ thể: quiz của học sinh; lịch dự án shop; website trung tâm thể thao; màn hình gọi món; thiết lập BookIt; lịch app du lịch; sự cố shop đang sale. Cùng mô-típ lập trình/website/lịch trình của Unit không tự được tính là cùng tình huống. |
| 4. Nhiễu từ vựng | R13–R20 có các lựa chọn cùng từ loại theo ngữ cảnh. R19 cần cân đối độ dài; xem dòng lỗi. Không áp tiêu chí này cho R6–R12. |
| 5. Ngữ pháp/từ vựng của Unit | R6–R7 kiểm yêu cầu và `want + O + to`; R8–R9 bị động; R10 `make + O + V`; R11 `cause + O + to V`; R12 `be due to`. Các từ đích R13–R18 có trong Workbook tr. 67–69; `bug` R19 xuất hiện trong giải nghĩa `debug` tr. 67. `milestone` R20 không có trong danh sách Part 1 này: **CHƯA KIỂM** trang giáo trình và dẫn nguồn nội bộ vì stripped đã bỏ `sourceNotes`; et-lead cần kiểm trang nguồn, chưa đủ căn cứ kết luận sai phạm. |
| 6. Bài đọc | R21–R25: 237 từ, đạt 230–270. R26–R30: 164 từ, đạt 160–200. Đếm phần paragraphs, bỏ tiêu đề. **CHƯA KIỂM** tính viết mới bằng đối chiếu toàn bộ nguồn; không mở đề khác. |
| 7. Dịch | W31/W35 bị động; W32 `want + O + to`; W33 `make + O + V`; W34 `be due to`. Nội dung thuộc Development. **CHƯA KIỂM** trùng câu giữa các Unit vì không đọc dữ liệu các Unit; dành et-lead kiểm toàn kho. |
| 8. Email | Có 7 gợi ý, chủ đề hướng dẫn developer thiết lập dự án; đúng khoảng 5–7. `wordRange` là 80–100, prompt loại 4 dòng đầu thư khỏi số từ; có hướng dẫn bố cục email. |
| 9. Writing/Speaking buộc ngữ pháp | W-EMAIL buộc ít nhất hai dạng yêu cầu, một câu bị động và một dạng lịch trình. S1 từng câu lần lượt yêu cầu cấu trúc về yêu cầu, nguyên nhân–kết quả, kế hoạch. S2 yêu cầu lịch trình; S3 yêu cầu cả make/cause và ít nhất hai câu bị động. Các câu dịch cũng chứa cấu trúc Unit. |
| 10. Anh–Anh | Chưa thấy lỗi chính tả Anh–Mỹ trong bản stripped. Có `centre`, `colours`; `program` trong ngữ cảnh phần mềm phù hợp. Không kiểm được chính tả ở đáp án/bài mẫu đã bị loại. |
| 11. Không diễn đạt lại định nghĩa nối | Không thấy lời thoại/bài đọc tái hiện nội dung phân biệt của năm định nghĩa đúng. Đoạn hai mươi thành viên thử website là người dùng thử, không phải định nghĩa alpha testing do chính công ty viết phần mềm thực hiện. Bài Pho House nêu yêu cầu cụ thể, không giải nghĩa thuật ngữ specification. W31 diễn đạt alpha testing ở kỹ năng sau không tính lộ theo thống nhất thi tuần tự. |
| 12. T/F rõ ràng | Cả năm câu đều có khẳng định/phủ định trực tiếp; dẫn chứng bên dưới. Không dùng suy diễn về khả năng kỹ thuật thay cho yêu cầu trong văn bản. |
| 13. Ngữ pháp hiển thị cho người học | Đạt trên nội dung stripped: W-EMAIL.task, từng câu S1, S2.prompt và S3.prompt đều nêu rõ cấu trúc cần dùng; không chỉ nằm trong metadata. Không áp cho W31–W35. Chưa chạy UI để xác minh render thực tế. |
| 14. Speaking thực hiện bằng lời | Đạt: mô tả yêu cầu, thao tác, lịch trình và giải thích sự cố đều nói được; dấu ngoặc/mũi tên trong gợi ý không trở thành yêu cầu phải tạo ký hiệu bằng lời nói. |
| 15. sourceNotes | Bản stripped không còn `sourceNotes` hoặc các trường đáp án/bài mẫu/giải thích trong `ANSWER_FIELDS`. **CHƯA KIỂM** ghi chú nội bộ có chép đáp án hay không vì không mở bản gốc; et-lead kiểm. |

### Bằng chứng T/F

| Câu | Đáp án mù | Bằng chứng trực tiếp trong bài |
|---|---|---|
| R26 | T | “customers often wait ten minutes just to order their food” |
| R27 | F | “it does not need to accept cash” đối lập trực tiếp với “needs to accept cash”; không đánh đồng với không thể nhận tiền mặt. |
| R28 | T | “Each order has to be sent to the kitchen immediately.” |
| R29 | T | “The kitchen staff also want the system to show how long each order has been waiting.” |
| R30 | F | “work in Vietnamese and English” phủ định “only in Vietnamese”. |

## Kiểm tra tự động và giới hạn

- Chạy Python 3 đọc đúng stripped/template/blind để kiểm 40 ID theo thứ tự, định dạng chữ cái/T-F, L6–L10 tối đa 3 từ: PASS. L9 ghi `the twenty-fifth`; chưa biết danh sách acceptedAnswers có nhận dạng này hay không.
- Chạy Python 3 kiểm số từ lời thoại và bài đọc: Listening A/B **174/154** (150–250), Reading MCQ/T-F **237/164** (230–270 và 160–200): PASS.
- Chạy Python 3 kiểm 5 câu dịch, 7 gợi ý email, khoảng từ 80–100, ba phần Speaking, ba câu S1, metadata Unit 7 / Test C / source ai và không còn trường nội bộ trong stripped: PASS.
- Chạy `pdftotext -f 67 -l 69 -layout '/home/duckcy/Downloads/Workbook for Students.pdf' -` sau commit mù. R5/định nghĩa A khớp mục `value` tr. 68; ghi chú băn khoăn ban đầu trong blind được giữ nguyên để bảo toàn lịch sử giải, không tính là lỗi tác giả.
- Không chạy `scripts/compare-blind.ts` hoặc `scripts/validate-exams.ts` vì chúng cần dữ liệu đầy đủ; không đưa kết quả kiểm cục bộ thành bằng chứng validate hay AUDIT-OK. Không nghe TTS, kiểm audio/UI hoặc chấm thử AI.

SHA-256 dùng xác định đúng gói:

| File | SHA-256 |
|---|---|
| `audit/unit-7-C.stripped.json` | `4a7eefcd1197c88b8d965a0f362e4cbcaf5421f91e33978849b582c5aa08ce19` |
| `audit/unit-7-C.blind.template.json` | `a1692f8cc4d28c225f860f36e56ce80eb1c4020027d23f99b22190c71c14d9bb` |
| `audit/unit-7-C.blind.json` | `1415edff774aea132fc5267ee0ccd083aef6b0abb1e23920637b66a65213b265` |

et-lead cần so đáp án, xác minh các phần CHƯA KIỂM, xử lý các khuyến nghị và quyết định nhãn cuối. Nếu sửa câu tự động, tuân thủ yêu cầu phiên auditor mới của PROTOCOL mục 5.
