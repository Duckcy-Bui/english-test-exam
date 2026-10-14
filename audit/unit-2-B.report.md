# Báo cáo kiểm định đề 2B — Unit 2, Test B

- Agent/solver: et-auditor — gpt-6-astra.
- Nhánh: `audit/unit-2-B`.
- Thời gian từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`: `2026-10-14 22:06:36 +07 (+0700)`.
- Đầu vào: `audit/unit-2-B.stripped.json`, SHA-256 `c57483b64ef8b218015d2a17be8c8cc6ad1e27f57d1d9ac6a21e19e8c85edb7d`.
- Đáp án mù: `audit/unit-2-B.blind.json`, đã commit riêng tại `8fa539f` trước bước kiểm đặc tả.
- Kết quả giải mù: đủ 40 câu; chưa phát hiện câu có hai đáp án hợp lý; `notes` rỗng. Chưa đối chiếu đáp án tác giả.
- Nhãn đề nghị: **CẦN SỬA** — 3 điểm NÊN SỬA dưới đây; chưa phát hiện lỗi CHẶN trong phạm vi đã kiểm. Không tự cấp `AUDIT-OK`.

## Các điểm cần sửa

Mỗi dòng là một phát hiện; hai dòng về số ít/số nhiều là khuyến nghị chất lượng phương án nhiễu, không kết luận khác từ loại hay đa đáp án.

- R15 | NÊN SỬA | Phương án D `headphones` là danh từ số nhiều, không khớp `The … shows`; người làm có thể loại bằng hoà hợp chủ–vị thay vì hiểu từ vựng. | Thay bằng danh từ số ít có độ dài tương đương, chẳng hạn `keyboard`; giữ một đáp án đúng theo nghĩa.
- R20 | NÊN SỬA | Phương án A `graphics` chỉ hình ảnh ở dạng số nhiều, không khớp `The … is very poor`; phương án nhiễu yếu dù vẫn cùng nhóm danh từ. | Thay bằng danh từ số ít như `lighting`, rồi kiểm lại rằng chỉ một phương án giải thích được `hard to hear`.
- R13 / S1 câu 3 | NÊN SỬA | Quy tắc 3: cùng thao tác mở tab mới trong trình duyệt được dùng lại ở câu từ vựng và câu nói. Đây là lặp nhiệm vụ nhỏ, không kết luận lộ đáp án chéo giữa kỹ năng. | Đổi S1 câu 3 sang hướng dẫn đổi tên thư mục, vẫn yêu cầu mệnh lệnh và từ nối trình tự.

## Đối chiếu đủ 15 quy tắc

| Quy tắc | Kết quả và bằng chứng |
|---|---|
| 1. Một đáp án trắc nghiệm | Chưa thấy đa đáp án ở L1–L5, R6–R25. Đã chọn độc lập đủ 40 câu. R1–R5 cũng có các định nghĩa phân biệt được. Việc khớp đáp án tác giả chờ et-lead. |
| 2. Lộ từ câu nối sang R6–R30 | Chưa phát hiện lộ: không có các thuật ngữ `pane`, `boot drive`, `licence terms`, `trainee`, `microphone` trong R6–R30; đọc thủ công ngữ cảnh không thấy gợi ý đủ để xác định định nghĩa của chúng. Các từ chung như `window`, `program`, `files` không tự tạo thành định nghĩa. `trainee` ở email thuộc kỹ năng sau, không gắn cờ lộ chéo. |
| 3. Không lặp tình huống | Có điểm nên sửa R13 / S1 câu 3 nêu trên. Các nhiệm vụ dài khác phân biệt được: thêm máy in ở tầng mới, giới thiệu Media Lab, đánh giá Nimbus, chia đôi màn hình, sao lưu cho Sophie, đổi hình nền cho bà, kết nối thiết bị cho quán café. Không coi cùng chủ đề Unit là tự động trùng tình huống. |
| 4. Nhiễu từ vựng cùng từ loại, độ dài tương đương | Chỉ áp R13–R20. Các lựa chọn là danh từ/cụm danh từ hoặc động từ/cụm động từ tương ứng, đều ngắn và độ dài nhìn chung tương đương. Có khuyến nghị về số ít/số nhiều ở R15 và R20. Không áp yêu cầu này cho R6–R12. |
| 5. Ngữ pháp và nguồn từ vựng Unit | R6–R7 kiểm đơn vị/số thập phân; R8 trình tự; R9–R10 động từ với tân ngữ và giới từ; R11–R12 lý do/mục đích. Từ đích R13–R20 đều có trong Workbook Unit 2 Part 1: tab tr.15, tick box tr.16, projector và unplug tr.17, CPU và DIMM slot tr.19, back up tr.18, audio tr.19. Không cần viện dẫn từ ngoài Workbook cho các câu này. |
| 6. Hai bài đọc và tính mới | Bài R21–R25: 239 từ, đạt 230–270; bài R26–R30: 167 từ, đạt 160–200. Không xác nhận được tính mới tuyệt đối từ riêng bản stripped; không đọc các đề khác. Trùng bài đọc giữa các đề cùng Unit thuộc validate của et-lead. |
| 7. Năm câu dịch | W31 thông số/số; W32 lời nhờ nhẹ và trình tự; W33 kết nối và mục đích; W34 phần mềm nguồn mở và because; W35 phân vùng và so that: đều bám Unit 2. Không kiểm trùng câu giữa Unit vì không đọc đề khác. Không coi câu dịch cùng chủ đề Reading là lộ đáp án. |
| 8. Email 5–7 gợi ý | Đạt: 6 gạch đầu dòng, nhiệm vụ hướng dẫn sao lưu, giới hạn 80–100 từ; đề nêu rõ bỏ bốn dòng đầu thư khỏi số từ và yêu cầu khung email chuẩn. |
| 9. Writing/Speaking buộc dùng trọng tâm | Đạt trên đề bài: email bắt buộc mệnh lệnh, trình tự, softener, hai tân ngữ và lý do/mục đích. S1 lần lượt buộc nói số/đơn vị, mục đích, mệnh lệnh/trình tự. S2 buộc mệnh lệnh/trình tự/softener. S3 buộc câu hai tân ngữ và lý do/mục đích. Câu dịch chứa cấu trúc Unit trong câu nguồn. |
| 10. Chính tả Anh–Anh | Chưa thấy lỗi; có `Colour`, `centimetres`, `licence(s)`, `maximise`, `Personalise`. `program` dùng cho chương trình máy tính phù hợp ngữ cảnh. |
| 11. Không diễn đạt lại định nghĩa câu nối | Chưa thấy lời thoại/bài đọc diễn đạt lại năm định nghĩa cần nối. Bài split screen nói hai cửa sổ độc lập cạnh nhau, không định nghĩa pane là vùng bên trong một cửa sổ. Video cameras ở bài nghe liên quan định nghĩa dư C, không phải thuật ngữ R1–R5; lời thoại cũng không chép lại định nghĩa đó. |
| 12. T/F có bằng chứng rõ | Đạt: cả năm câu có câu khẳng định hoặc phủ định trực tiếp trong bài; chi tiết bên dưới. |
| 13. Cấu trúc hiện trong đề bài | Đạt: `email.task`, từng câu trong `S1.questions`, `S2.prompt`, `S3.prompt` đều nêu cấu trúc/chức năng cần dùng, không chỉ nằm trong metadata. Không áp cho W31–W35 Anh→Việt theo thống nhất. |
| 14. Speaking làm được bằng lời nói | Đạt: nói số, giải thích mục đích và hướng dẫn thao tác; không yêu cầu dấu câu hoặc thao tác viết để hoàn thành câu trả lời. |
| 15. sourceNotes không chép đáp án | CHƯA KIỂM nội dung gốc vì trường bị strip. Quét đệ quy xác nhận bản nhận không có `sourceNotes` và các trường đáp án/lời giải bị cấm. Việc trường vắng mặt không chứng minh nội dung nội bộ đạt quy tắc 15. |

## Bằng chứng True/False

| Câu | Chọn mù | Bằng chứng trong bài |
|---|---|---|
| R26 | T | `Split screen lets you see two windows side by side`. |
| R27 | F | Hướng dẫn kéo cửa sổ đầu tiên tới `the left edge of the screen`, trái với `right edge` trong câu hỏi. |
| R28 | F | Cửa sổ đầu tiên lấp `the left half of the screen`, không phải toàn màn hình. |
| R29 | F | Bài hướng dẫn `To make one window bigger than the other, slide the line ...`, phủ định việc luôn phải bằng nhau. |
| R30 | T | `hold down the Windows key and press the left or right arrow key`. |

## Kiểm tra và giới hạn

- `python3` (kiểm JSON trực tiếp, chỉ hai file stripped/blind): PASS nhận diện Unit 2 / B / ai; đủ ID L1–L10, R1–R30; đáp án đúng định dạng; L6–L10 không quá 3 từ; mỗi MCQ có A–D; 6 định nghĩa; 7 câu ngữ pháp và 8 câu từ vựng; 5 câu dịch; 6 gợi ý email; 3 phần Speaking và 3 câu S1.
- `python3` đếm từ bằng tách khoảng trắng, cùng cách `countWords` trong schema, không tính nhan đề/người nói: Listening A 162, Listening B 156, Reading MCQ 239, Reading T/F 167; tất cả đạt giới hạn.
- `python3` quét đệ quy: không có `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer` trong stripped.
- `pdftotext -f 15 -l 20 -layout '/home/duckcy/Downloads/Workbook for Students.pdf' -`: đối chiếu từ đích với Part 1 tr.15–19; trang 20 là phần bài tập kế tiếp, không dùng làm đáp án đề 2B.
- Đã đọc `docs/exam-format.md` chỉ mục 3–4 bằng dòng tiêu đề; `docs/PROTOCOL.md` mục 5 và 8; `docs/plan.md` mục 5b; tài liệu nguồn và schema theo brief. Không mở nội dung mục 2 của exam-format.
- Không đọc `data/units/*.json`, không truy cập nhánh `content/*`, không đọc đề khác, không chạy `compare-blind.ts` hay `validate-exams.ts`. Không kiểm acceptedAnswers, lời giải, bài mẫu, barem ẩn hoặc vận hành web/TTS từ bản stripped.
- Et-lead đối chiếu đáp án và chạy validate trên đầu vào tác giả; kết quả kiểm ở đây không thay thế hai bước đó. Nếu có chênh lệch đáp án, xử lý AMBIGUOUS và giải mù lại bằng phiên mới theo PROTOCOL.
