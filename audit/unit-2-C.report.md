# Báo cáo giải mù và đặc tả — Unit 2, Test C (2C)

- Auditor: et-auditor2 — GPT-6 (Codex). Ghi theo thông tin model của phiên; không tự nhận nhãn gpt-6-astra trong brief mẫu.
- Nhánh: `audit/unit-2-C`.
- Thời gian: 2026-10-14T22:25:23+07:00 (lấy từ `date -Is`).
- Commit bước 1: `65e501b8d2d3d18bac93d159a36490b13a42ee6d`; 40 đáp án đã đóng băng trước bước 2.
- Kết luận đề nghị: **CẦN SỬA** — 3 lỗi CHẶN, 1 điểm NÊN SỬA. Có nghi vấn nhiều đáp án hợp lý tại R11 và R15; chưa đối chiếu đáp án tác giả. Không tự cấp AUDIT-OK.

## Phạm vi và bảo toàn giải mù

Chỉ giải từ `audit/unit-2-C.stripped.json`, điền bản sao template. Đã đọc brief được giao, `docs/exam-format.md` đúng mục 3–4 (xác định ranh giới bằng tiêu đề), `docs/PROTOCOL.md` mục 5 và 8, `docs/plan.md` mục 5b, `docs/source-materials.md`, `src/types/exam.ts`. Không đọc nội dung mục 2 của exam-format, không đọc `data/units/*.json`, không đọc đề khác và không thao tác nhánh `content/*`. Chỉ tạo hai đầu ra trong `audit/`; giữ nguyên hai đầu vào chưa được theo dõi. Không merge/push.

SHA-256 của đầu vào và bản giải mù:

```text
2f0753530b6e6bf27d22403a98b05bb72d602a4a10ada1d67a8a4a24678f69a5  audit/unit-2-C.stripped.json
ad483a6c4d812b3e3c255c41df61ad058ff3340d109bc0987070ba52b52e5447  audit/unit-2-C.blind.template.json
d6c4499cd8fae08dc842158c972b6723eb6f472532457a2809e3c94446da7bcf  audit/unit-2-C.blind.json
```

## Các lỗi và đề xuất

Mỗi dòng là một phát hiện riêng. Các chữ cái bên dưới là lựa chọn của auditor, chưa được so với đáp án tác giả.

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| R5 | CHẶN | Thuật ngữ `Ethernet connector` chỉ đầu nối, nhưng định nghĩa E là `A type of cable used when a computer is connected to other computer networks.` E định nghĩa cáp, không định nghĩa đầu nối; năm định nghĩa còn lại cũng không khớp đầu nối Ethernet. Auditor chọn E theo ý định và phép loại trừ, không xem đó là cặp chính xác. | Viết lại E để định nghĩa đầu nối ở đầu cáp Ethernet, hoặc đổi thuật ngữ sang `Ethernet cable` nếu phù hợp nguồn Unit; kiểm lại tính duy nhất và lộ chéo. |
| R11 | CHẶN | `The video won't play ______ the file is damaged.` D (`because`) tự nhiên, nhưng B (`for`) cũng có chức năng liên từ chỉ lý do. Cách dùng `for` trang trọng thường có dấu phẩy trước liên từ; không nên dùng khác biệt dấu câu/văn phong không nêu trong yêu cầu để loại phương án có nghĩa và cấu trúc phù hợp. Vi phạm yêu cầu không có hai phương án hợp lý ở QT1. | Thay `for` bằng phương án không thể nối mệnh đề chỉ nguyên nhân ở đây, ví dụ `because of`; để auditor mới giải lại. |
| R15 | CHẶN | `choose 'Print' from the File ______`: D (`menu`) đúng với giao diện menu; A (`tab`) cũng hợp lý với giao diện có File tab chứa lệnh Print. Không nêu ứng dụng/giao diện nên không bảo đảm một đáp án theo QT1. | Thay phương án `tab` bằng danh từ khác không thể tạo giao diện hợp lý ở vị trí này, hoặc mô tả rõ menu đang dùng; giải mù lại câu sửa. |
| R10 | NÊN SỬA | C là trật tự trung tính đúng. B (`Into the audio socket plug the headphones.`) có thể được đọc như đưa cụm chỉ nơi chốn lên đầu để nhấn mạnh; dù kém tự nhiên và thường thêm dấu phẩy, stem `Which sentence is correct?` chưa phân biệt tính đúng với cách nói thông dụng. | Thay B bằng một trật tự sai rõ ràng hoặc yêu cầu chọn trật tự hướng dẫn thông dụng; tránh đánh đố bằng đảo vị trí cụm giới từ. |

## Đối chiếu đủ 15 quy tắc

| QT | Kết quả trong phạm vi kiểm | Bằng chứng / giới hạn |
|---|---|---|
| 1 | CẦN SỬA | R11, R15 mơ hồ như bảng lỗi; R10 cần làm rõ. R5 là lỗi tính đúng của cặp nối. Các câu tự động còn lại có một lựa chọn tự nhiên theo văn bản. |
| 2 | Không thấy lộ cặp nối đúng | R1–R5 ghép độc lập F/A/C/D/E. R6–R30 không đưa lại đặc trưng icon, ổ không có bộ phận chuyển động, username/password để cấp quyền, kéo vật bằng chuột, hay cáp nối mạng để suy ra các cặp này. R20 nói email account nhưng không tiết lộ cơ chế username/password của C. `socket` ở R10 và bài T/F chỉ liên quan định nghĩa B thừa, không phải định nghĩa đúng; không gắn cờ theo phạm vi đã thống nhất. |
| 3 | Không thấy lặp cùng tình huống | Đặt máy dựng phim; hướng dẫn chụp màn hình; trường chuyển hệ điều hành; chọn tai nghe; cài phần mềm bán hàng; chia sẻ file; nâng cấp máy văn phòng là các nhiệm vụ riêng. Cùng chủ đề phần cứng hoặc cài đặt không tự động là lặp tình huống. |
| 4 | Đạt ở R13–R20 | Phương án trong từng câu đều cùng từ loại: động từ R13/R16/R17, danh từ các câu còn lại; đều là từ/cụm ngắn, không có đáp án dài nổi bật. Không áp quy tắc này cho R6–R12. |
| 5 | Phù hợp chủ đề; CHƯA KIỂM nguồn từng từ | R6–R7 số/tiền tố; R8 yêu cầu mềm; R9–R10 động từ + tân ngữ + giới từ + tân ngữ; R11–R12 lý do/mục đích. R13–R20 thuộc thao tác GUI/đa phương tiện/hệ thống. Không có sourceNotes để xác nhận trang giáo trình hoặc từng mục Workbook. |
| 6 | Đạt độ dài; CHƯA KIỂM tính viết mới | Bài MCQ 239 từ, bài T/F 172 từ, đều trong khoảng. Không đối chiếu kho nguồn hay đề khác; trùng bài đọc giữa các đề cùng Unit do et-lead validate. |
| 7 | Phù hợp Unit; CHƯA KIỂM trùng liên Unit | W31 thông số; W32 trình tự thao tác; W33 kết nối; W34 mục đích; W35 phần mềm nguồn mở. Không đọc đề Unit khác. |
| 8 | Đạt | Email cài phần mềm bán hàng có 6 gạch đầu dòng, 80–100 từ, bố cục email hướng dẫn và người nhận Marco rõ ràng. |
| 9 | Đạt trên đề hiển thị | Email buộc mệnh lệnh/trình tự, từ làm mềm, hai tân ngữ, lý do/mục đích. Speaking phủ số và đơn vị, lý do, kết nối, hướng dẫn và nâng cấp; xem đối chiếu từng phần dưới đây. |
| 10 | Không thấy lỗi Anh–Anh | Có `maximise`, `colour`, `grey`, `licence`; `program` dùng trong ngữ cảnh phần mềm phù hợp. Không đánh giá các đáp án mẫu đã bị loại khỏi stripped. |
| 11 | Không thấy diễn đạt lại định nghĩa đúng | Hai bài đọc và hai lời thoại không tái hiện đặc trưng quyết định của năm cặp nối đúng. Bài tai nghe nhắc plug/socket, nhưng đó là định nghĩa B thừa. |
| 12 | Đạt | R26 được câu “usually cheaper” khẳng định; R27 bị “many new phones do not have” phủ định; R28 trùng thời lượng 20–30 giờ; R29 bị “still prefer wired” phủ định; R30 bị “uses extra battery power” phủ định. Không câu nào cần suy ra từ thông tin vắng mặt. |
| 13 | Đạt | Yêu cầu ngữ pháp/chức năng xuất hiện trực tiếp trong email, từng câu S1, prompt S2 và S3; không chỉ ở targetGrammar/requiredGrammar. Theo thống nhất, không áp cho W31–W35 dịch Anh→Việt. |
| 14 | Đạt | Số/đơn vị, lý do, thao tác kết nối và hướng dẫn đều diễn đạt được bằng lời nói; không yêu cầu sinh viên phát âm dấu ngoặc hoặc thao tác chỉ có trong chữ viết. |
| 15 | CHƯA KIỂM nội dung sourceNotes | Quét đệ quy xác nhận sourceNotes và mọi trường đáp án/nội bộ đã bị loại khỏi stripped. Không thể xác nhận ghi chú gốc có chép đáp án hay không; et-lead kiểm ở nguồn có thẩm quyền. |

## Writing và Speaking

| Phần | Ràng buộc hiển thị cho sinh viên |
|---|---|
| W31–W35 | Dịch câu có thông số/số, mệnh lệnh và trình tự, kết nối, so that, kiến thức phần mềm nguồn mở; không yêu cầu tự tạo câu tiếng Anh. W33 trùng cấu trúc R10 và W35 cùng chủ đề bài Reading không tính lộ vì thi tuần tự. |
| W-EMAIL | Nêu trực tiếp `must use` với bốn nhóm cấu trúc; đủ 6 ý và khung From/To/Date/Subject đến chữ ký, giới hạn từ loại bốn dòng đầu thư. |
| S1 câu 1 | Yêu cầu nói rõ số và đơn vị, có ví dụ số nguyên và thập phân. |
| S1 câu 2 | Yêu cầu 2–3 lý do dùng because/for/to/so that. |
| S1 câu 3 | Yêu cầu câu hai tân ngữ với connect/to, plug/into, copy/onto. |
| S2 | Prompt yêu cầu mệnh lệnh, từ nối trình tự và ít nhất một từ làm mềm. |
| S3 | Prompt yêu cầu cấu trúc kết nối/hai tân ngữ và lý do/mục đích. Nhắc solid state drive ở kỹ năng sau không tính lộ R2. |

## Kiểm tra đã chạy và phần chuyển et-lead

- `python3 -` (đọc hai JSON đầu vào và bản giải mù bằng json/Path, kiểm tra bằng assert): PASS 40 ID L1–L10/R1–R30, miền đáp án, L6–L10 tối đa 3 từ; đủ lựa chọn A–D, 5 cặp nối/6 định nghĩa, 7 câu ngữ pháp, 8 từ vựng, hai nhóm đọc mỗi nhóm 5 câu, 5 câu dịch, 6 ý email, 3 câu S1 và thời lượng 45/90/90 giây. Metadata đúng unit=2/testId=C/source=ai.
- `python3 -` (đếm từ bằng split khoảng trắng): Listening A 193, B 196; Reading MCQ 239, T/F 172 — tất cả đạt giới hạn. Từ ghép có gạch nối tính một từ.
- `python3 -` (quét key đệ quy): PASS, không còn sourceNotes/answerKey/acceptedAnswers/explanation/referenceTranslation/modelAnswer/sampleAnswer. SHA-256 tính bằng hashlib như trên.
- Review thủ công toàn bộ stripped theo 15 quy tắc; đây là kiểm nội dung nguồn, không phải kiểm audio TTS, giao diện hay chấm điểm chạy thật.
- L6 chọn `top right-hand corner`; L7 chọn `Control and V`. Đề nghị et-lead kiểm bộ acceptedAnswers/chuẩn hoá có nhận các cách viết tương đương như `top right corner`, `Ctrl + V`, và số ở L10. Không kết luận bộ chấm sai khi chưa đọc nó.
- Không chạy `compare-blind.ts` hoặc `validate-exams.ts`, không mở đáp án tác giả. et-lead đối chiếu, kiểm các giới hạn liên đề/nguồn, yêu cầu tác giả sửa rồi giao câu sửa cho **phiên auditor mới**, theo PROTOCOL mục 5. Không chỉ đổi key cho khớp bản giải mù.
