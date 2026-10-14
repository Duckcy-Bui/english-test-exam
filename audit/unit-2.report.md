# Audit Unit 2 — IT systems

- Agent / solver: et-auditor — gpt-6-astra.
- Nhánh: `audit/unit-2`.
- Thời gian lập báo cáo (lệnh `date`): **2026-10-14 15:57:44 +0700**.
- Bước 1 đã commit riêng trước khi bắt đầu Bước 2: `5f2f93c95704493a21d3b7ee6a488a42d9d5bf29` (`audit/unit-2.blind.json`, đủ 40 đáp án).
- Đề nghị: **CẦN SỬA** — 1 lỗi CHẶN, 3 góp ý NÊN SỬA. Không tự cấp `AUDIT-OK`.
- Không phát hiện câu trắc nghiệm có từ hai phương án hợp lý trong lần giải mù; `notes` rỗng. Đây chưa phải kết quả so đáp án với et-author.

## Phạm vi và nguồn

Chỉ dùng packet `audit/unit-2.stripped.json` và template cùng Unit để giải mù. Không đọc `data/units`, nhánh `content/*`, thư mục `audit/` trên main hoặc các nhánh `audit/*` khác. Không đọc mục 2 “Đáp án” của `docs/exam-format.md`. Không merge, push hay sửa đề.

Đã đọc brief, `docs/PROTOCOL.md` (đặc biệt mục 5, 8), `docs/exam-format.md` mục 3 và mục 4 đủ quy tắc 1–15, `docs/source-materials.md`, `src/types/exam.ts`. Sau commit giải mù, đã đối chiếu riêng Part 1 Pre-stage Unit 2, trang PDF/in 15–19 của `/home/duckcy/Downloads/Workbook for Students.pdf`; không dùng bài tập hoặc đáp án Workbook để giải mù. Ngữ pháp được đối chiếu với bản đồ Unit 2 trong `docs/source-materials.md`; chưa kiểm trực tiếp các trang scan Pearson.

Áp dụng bổ sung của et-lead: các kỹ năng thi tuần tự; W31–W35 trùng nội dung/ngữ pháp Reading không tính là lộ; quy tắc 13 không áp dụng dịch Anh → Việt; yêu cầu cùng từ loại ở quy tắc 4 chỉ áp dụng R13–R20.

Dấu vân tay SHA-256:

| Tệp | SHA-256 |
|---|---|
| `audit/unit-2.stripped.json` | `1d08f6acc231a580ed395b5bd83e6889dea562773645bf1b2ac6db51b9ff6fd7` |
| `audit/unit-2.blind.template.json` | `dee808eb15c7aea67d71de415cd55677f7ab93416a9750124a0abf52d651cfeb` |
| `audit/unit-2.blind.json` | `0915d0bbee7430f89d9a9fc0fae0de570e2fae389c5e8fe26632570d0aa84b82` |

## Các lỗi và đề xuất

Mỗi dòng là một phát hiện; mức NÊN SỬA không tự tạo điều kiện chặn.

| Mã câu / vị trí | Mức độ | Mô tả và căn cứ | Đề xuất sửa |
|---|---|---|---|
| R15 | **CHẶN** | Quy tắc 4: `Maximise`, `Restart`, `Minimise` là các động từ dùng đặt tên thao tác; `Plus` là tên dấu cộng, được Workbook Unit 2 tr. 16 ghi rõ là danh từ. Phương án D không cùng từ loại với ba phương án còn lại theo vốn từ đang kiểm tra. Việc cả bốn đều đứng trước `button` không xoá sự lệch loại từ mục tiêu này. | Thay D bằng một động từ thao tác GUI như `Close`; giữ bốn lựa chọn có độ dài tương đương và kiểm lại tính duy nhất. |
| L-A / R18 / S2 | **NÊN SỬA** | Quy tắc 3: thao tác kéo tệp vào thư mục được dùng lại ở cuối cuộc gọi Lucy–Omar, toàn bộ R18 và một bước chính của S2. Các tình huống đầy đủ vẫn khác nhau (tìm tệp lưu nhầm / di chuyển tệp / tạo thư mục), nên chưa kết luận là lặp nguyên tình huống ở mức CHẶN; tuy nhiên nhiệm vụ cụ thể bị lặp nhiều. Không coi đây là lộ đáp án giữa kỹ năng. | Đổi R18 sang thao tác GUI khác thuộc Unit, chẳng hạn chọn một mục hoặc đổi kích thước cửa sổ, với stem và bốn lựa chọn mới; giữ bối cảnh S2 tạo thư mục. |
| R19 | **NÊN SỬA** | Cụm `software is free` bám Workbook tr. 18 nhưng dễ khiến người học hiểu mọi phần mềm nguồn mở đều có giá bằng không. Open Source Definition cho phép bán phần mềm, đồng thời yêu cầu quyền tiếp cận mã nguồn và sửa đổi; lỗi diễn đạt này không tạo đáp án đúng thứ hai. | Bỏ khẳng định về giá; dùng mô tả quyền truy cập, sửa đổi và phân phối mã nguồn theo giấy phép, giữ độ khó A2–B1. Căn cứ: [Open Source Initiative, mục 1–3](https://opensource.org/osd). |
| S3 | **NÊN SỬA** | Đề nêu một bài học trực tuyến, nhưng cue máy chiếu lại phục vụ học sinh trong phòng và cue loa giải thích bằng phòng học lớn. Có thể hiểu là lớp kết hợp trực tiếp/trực tuyến, nhưng prompt chưa nói rõ điều này. Các cấu trúc ngữ pháp bắt buộc vẫn phù hợp và làm được bằng lời nói. | Nêu rõ đây là lớp hybrid, có học sinh trong phòng và học sinh tham gia trực tuyến; điều chỉnh cue thiết bị theo bối cảnh đó. |

## Ma trận kiểm đủ quy tắc 1–15

| Quy tắc | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án đúng mỗi MCQ | ĐẠT qua giải mù | Đã giải độc lập 25 MCQ: L1–L5 và R6–R25; mỗi câu chọn được một phương án phù hợp. R7 theo cách đọc thập phân chính thức của Unit; R8 theo trình tự bắt đầu rồi bước tiếp theo. Chưa so với khoá của tác giả. |
| 2. Không lộ đáp án nối ở R6–R30 | ĐẠT trong packet | Không thấy `Partition`, `Title bar`, `Webcam`, `Product key`, `Motherboard` xuất hiện ở R6–R30. Đã đọc ngữ nghĩa cả stem, options và passages; `licence terms` trong bài cài OS không mô tả chuỗi mã kích hoạt, `hard disk` không mô tả chia vùng lưu trữ. Không lấy sự trùng giữa Writing và Reading làm lỗi. |
| 3. Không lặp tình huống | NÊN SỬA | L-A tìm tệp, L-B nhận laptop, bài đọc MCQ mua máy cho hai nhóm, T/F cài lại OS, email lắp màn hình thứ hai và S3 dạy học là các bối cảnh khác nhau. Có lặp thao tác cụ thể ở L-A/R18/S2, ghi thành góp ý riêng ở trên. Lặp cấu trúc ngữ pháp hoặc nhắc lại cùng thiết bị không tự động là lặp tình huống. |
| 4. Nhiễu cùng từ loại và độ dài | CHẶN — R15 | R13 danh từ/cụm danh từ; R14 và R18 động từ; R16–R17 danh từ thiết bị; R19 tính từ/cụm tính từ; R20 các từ bổ nghĩa cho `hard drive`. Độ dài nhìn chung 1–2 từ, không có đáp án dài nổi bật. Riêng R15 trộn tên dấu `Plus` với động từ thao tác. `audio` ở R20 được dùng làm từ bổ nghĩa chỉ loại; dù Workbook liệt kê nghĩa danh từ ở tr. 19, không đủ căn cứ xem riêng cách dùng bổ nghĩa này là sai. Không áp tiêu chí này cho R6–R12. |
| 5. Ngữ pháp và từ vựng đúng Unit | ĐẠT trên nguồn đã đọc | R6 tiền tố số; R7 thập phân; R8 trình tự; R9–R10 động từ + tân ngữ + giới từ + tân ngữ; R11 mục đích; R12 lý do. Từ mục tiêu R13/R15: Workbook tr. 15; R14/R18: tr. 16; R16: tr. 17; R17/R19/R20: tr. 18. Tất cả tám từ mục tiêu có trong Pre-stage Unit 2, không cần dựa vào `sourceNotes` để chứng minh nguồn của chúng. |
| 6. Độ dài và bài đọc viết mới | ĐẠT độ dài; CHƯA KIỂM tính nguyên gốc đầy đủ | Bài MCQ 251 từ, trong 230–270; bài T/F 180 từ, trong 160–200. Packet không chứng minh được lịch sử sáng tác; chưa đối chiếu toàn bộ nguồn Pearson/Workbook để khẳng định viết mới. |
| 7. Câu dịch đúng Unit, không trùng giữa Unit | ĐẠT bám Unit; CHƯA KIỂM trùng liên Unit | W31 thông số; W32 mệnh lệnh/trình tự; W33 unplug … from …; W34 so that; W35 mục đích to + V. Không truy cập dữ liệu Unit khác, nên không xác nhận tính duy nhất liên Unit. |
| 8. Email 5–7 gợi ý, đúng chủ đề | ĐẠT | W-EMAIL có 6 bullet, yêu cầu 80–100 từ, hướng dẫn nối và cấu hình màn hình thứ hai; đúng multimedia hardware và GUI operations. |
| 9. Writing và Speaking buộc dùng ngữ pháp Unit | ĐẠT | Email yêu cầu trực tiếp mệnh lệnh/trình tự, softener, hai tân ngữ, lý do/mục đích. S1.1 yêu cầu nói thông số/số; S1.2 yêu cầu cấu trúc nối thiết bị; S1.3 yêu cầu lý do/mục đích. S2 yêu cầu mệnh lệnh/trình tự/softener; S3 yêu cầu hai tân ngữ và lý do/mục đích. Dịch dùng các cấu trúc nguồn tương ứng, không đòi người học tự tạo tiếng Anh. |
| 10. Chính tả Anh–Anh | ĐẠT qua đọc thủ công | Có `metres`, `coloured`, `licence`, `organise`, `Maximise`, `Minimise`; chưa thấy biến thể Mỹ trái yêu cầu trong nội dung hiển thị. `program` là cách viết phù hợp khi nói về phần mềm, không coi là lỗi Anh–Anh. |
| 11. Không diễn đạt lại định nghĩa nối trong bài đọc/lời thoại | ĐẠT trong packet | Đã đọc cả hai lời thoại và hai bài đọc: không mô tả chia ổ thành nhiều vùng, thanh tiêu đề, camera truyền hình ảnh qua mạng, mã chứng minh giấy phép hoặc bảng mạch chứa các mạch máy tính. Nhắc licence, ổ đĩa hay màn hình riêng lẻ không đủ thành diễn đạt lại định nghĩa. |
| 12. T/F được khẳng định/phủ định rõ | ĐẠT | R26–R30 đều có mệnh đề hoặc trình tự đối lập trực tiếp trong bài; bảng bằng chứng bên dưới. Không cần dùng kiến thức ngoài để suy ra. |
| 13. Ngữ pháp/chức năng hiện rõ trên đề | ĐẠT | Có yêu cầu trong `email.task`, từng câu `S1.questions`, `S2.prompt`, `S3.prompt`; không chỉ nằm ở `targetGrammar`/`requiredGrammar`. W31–W35 không thuộc phạm vi quy tắc này. |
| 14. Speaking làm được bằng lời nói | ĐẠT | Nói số, giải thích thao tác, nêu lý do; không yêu cầu viết ký hiệu hay dấu câu. Các dấu ngoặc trong đề chỉ đưa ví dụ cấu trúc, không yêu cầu đọc/viết dấu ngoặc. |
| 15. sourceNotes nội bộ, không chép đáp án | ĐẠT việc loại trường khỏi packet; CHƯA KIỂM nội dung gốc | Duyệt đệ quy không thấy `sourceNotes` hoặc bất kỳ trường đáp án/lời giải bị cấm nào. Không thể xác nhận `sourceNotes` gốc có chép đáp án hay không vì trường này đã bị loại và dữ liệu gốc nằm ngoài quyền đọc. |

## Bằng chứng T/F

| Câu | Giải mù | Căn cứ trực tiếp trong bài |
|---|---|---|
| R26 | T | Đoạn 1 nói cài đặt sẽ xoá mọi thứ trên laptop. |
| R27 | T | Đoạn 1 chỉ rõ nhấn F2 để mở BIOS. |
| R28 | F | Đoạn 2 nói máy tự khởi động lại và yêu cầu không tắt máy. |
| R29 | F | Đoạn 2 nêu khoảng 40 phút, trái với bốn giờ. |
| R30 | F | Đoạn cuối đặt tạo tài khoản sau bước nhập thời gian, ngày và thông tin mạng ở cuối, trái với đầu quá trình. |

## Kiểm tra đã chạy và giới hạn bàn giao

- `python3` đọc JSON hai packet và bài giải: **PASS**, đủ 40 khoá L1–L10/R1–R30, đúng định dạng đáp án; L6–L10 lần lượt 2/3/1/3/1 từ, đều không quá 3 từ.
- `python3` kiểm cấu trúc bản stripped: **PASS**, 5 MCQ nghe + 5 câu ngắn, 5 câu nối/6 định nghĩa, 7 ngữ pháp, 8 từ vựng, 5 đọc MCQ, 5 T/F, 5 câu dịch, 6 bullet email, 3 phần Speaking; đúng ID, loại câu, thứ tự A–D, khung 80–100 từ và thời gian Speaking.
- `python3` đếm từ theo tách khoảng trắng như `countWords` trong schema, chỉ tính lời thoại và thân bài: Listening A **180**, Listening B **172**, Reading MCQ **251**, Reading T/F **180** — tất cả trong giới hạn.
- `python3` duyệt JSON đệ quy: **PASS**, không có `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer`; tìm chuỗi năm thuật ngữ nối ở R6–R30: không có hit. Đã bổ sung đọc ngữ nghĩa thủ công cho quy tắc 2 và 11, không dùng tìm chuỗi làm bằng chứng duy nhất.
- `pdftotext -layout` + lọc riêng Unit 2 Part 1 Pre-stage: đã đối chiếu nguồn từ vựng và từ loại nêu trên sau commit giải mù.
- Kiểm tay đủ **15/15 quy tắc**: không đồng nghĩa 15/15 đạt; các phần thiếu bằng chứng được ghi CHƯA KIỂM ngay trong ma trận.
- **Chưa chạy** `scripts/compare-blind.ts` hoặc `scripts/validate-exams.ts` trên dữ liệu tác giả vì sẽ cần đọc dữ liệu bị cấm. Kiểm cấu trúc stripped không thay thế hai gate này; không xác nhận `acceptedAnswers` có bao phủ các cách diễn đạt hợp lệ của L6–L10.
- et-lead cần xử lý R15, cân nhắc ba góp ý, kiểm tính nguyên gốc bài đọc, trùng câu dịch liên Unit và `sourceNotes` gốc; chạy compare/validate trước quyết định nhãn. Nếu sửa câu, áp dụng phiên giải mù mới theo PROTOCOL; giữ nguyên commit giải mù hiện tại.
