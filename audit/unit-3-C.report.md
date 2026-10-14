# Audit giải mù — Unit 3, Test C

- Agent: et-auditor2 — GPT-6 (Codex).
- Nhánh: `audit/unit-3-C`.
- Thời gian: 2026-10-14 22:39:31 +07 (+0700).
- Đáp án mù đã commit riêng trước bước 2: `cf73438ec7063c41329f942dbfc9b4697da928b4` (`audit/unit-3-C.blind.json`).
- Phạm vi: chỉ đề 3C trong `audit/unit-3-C.stripped.json`; không mở `data/units/*.json`, nhánh `content/*` hoặc mục 2 của `docs/exam-format.md`.
- Đã đọc brief; exam-format mục 3–4; PROTOCOL mục 5, 8; plan mục 5b; source-materials; src/types/exam.ts. Sau commit mù, đối chiếu từ vựng với Workbook Unit 3 Part 1, trang 26–29.

## Kết quả

Giải đủ 40 câu L1–L10, R1–R30. Không phát hiện câu có hai đáp án hợp lý ngang nhau; `notes` để trống. Chưa đối chiếu đáp án tác giả.

Kiểm bước 2: **0 lỗi CHẶN, 0 lỗi NÊN SỬA được phát hiện trong phạm vi bản stripped**. Không có dòng lỗi cần giao sửa. Đây là kiểm nội dung tĩnh, không phải chứng nhận hệ thống chấm hay giao diện chạy thực tế.

Đề nghị et-lead xem xét **AUDIT-OK chỉ sau khi** `scripts/compare-blind.ts` không còn AMBIGUOUS và `scripts/validate-exams.ts` qua trên file của et-author. Auditor không tự cấp nhãn.

## Kiểm đủ 15 quy tắc

| Quy tắc | Kết quả / bằng chứng |
|---|---|
| 1 — Một đáp án đúng | Không phát hiện đa đáp án ở 25 câu MCQ và 5 câu nối. L6–L10 đều trả lời được trong tối đa 3 từ. Các biến thể diễn đạt câu trả lời ngắn không phải đa đáp án nội dung. Danh sách acceptedAnswers: CHƯA KIỂM vì đã bị strip. |
| 2 — Lộ đáp án nối | Không có nguyên thuật ngữ Guideline, Tag, Bus, Back button, Electronic version trong R6–R30, kiểm không phân biệt hoa/thường và theo ranh giới từ. Đọc ngữ nghĩa cũng không thấy gợi ý đủ để nối các thuật ngữ với định nghĩa đúng. R13 là đi theo link, không phải trở lại trang trước; R16 mô tả OCR, không định nghĩa Electronic version; các từ computer/data/network phổ thông không tính lộ. W34 có Electronic version, S2 có back button ở kỹ năng sau, không tính lộ theo thi tuần tự. |
| 3 — Lặp tình huống | Không phát hiện lặp cùng tình huống cụ thể. Listening A thiết kế mạng văn phòng mới, B hướng dẫn cổng sinh viên; Reading MCQ trang trại, T/F bảo trì mạng; email trả lời tự động; S2 giải thích trình duyệt; S3 wi-fi quán cà phê. R9 và bài T/F cùng nhắc VPN tại nhà nhưng nhiệm vụ lần lượt là mô tả người dùng và thông báo mất kết nối khi bảo trì, không lặp nguyên tình huống. |
| 4 — Nhiễu từ vựng | Chỉ áp dụng R13–R20. Các lựa chọn cùng chức năng từ loại: động từ R13/R14/R19, danh từ R15/R17/R20, tên viết tắt R16, trạng từ R18; độ dài tương đương, không có đáp án dài vượt trội. R19 take part là cụm động từ ngắn, đi với in có sẵn. Không áp tiêu chí này cho R6–R12. |
| 5 — Đúng Unit | R6 hiện tại tiếp diễn; R7 động từ trạng thái; R8–R9 quan hệ; R10 điều kiện 0; R11 điều kiện 1; R12 mạo từ trước USB. Đáp án từ vựng đều có trong Workbook Part 1 Unit 3: follow/take part in/sign trang 27; recharger/OCR/function/remotely/record trang 28. Không cần viện dẫn từ ngoài Workbook cho các đáp án này. |
| 6 — Bài đọc | R21–R25: 235 từ, đạt 230–270; R26–R30: 171 từ, đạt 160–200. Đếm nội dung paragraphs, không tính title; T/F gồm lời chào và chữ ký. Tính viết mới và trùng với các đề khác: CHƯA KIỂM; không đọc đề khác, et-lead kiểm validate theo phân công. |
| 7 — Câu dịch | W31 hiện tại tiếp diễn; W32 quan hệ; W33 điều kiện 1 và remotely/data; W34 điều kiện 0 và electronic version; W35 email/attachment/body và mạo từ. Đúng chủ đề Unit. Không mở Unit khác nên điều kiện không trùng câu giữa các Unit: CHƯA KIỂM. |
| 8 — Email | Chủ đề email trả lời tự động, 7 gạch đầu dòng, wordRange 80–100, có đủ chỉ dẫn khung email và cách loại 4 dòng đầu khỏi số từ. |
| 9 — Buộc dùng ngữ pháp | Email yêu cầu hiện tại tiếp diễn, mệnh đề quan hệ, điều kiện 0/1; từng S1 yêu cầu cấu trúc; S2 quan hệ; S3 điều kiện 1 và ít nhất một điều kiện 0. Các câu dịch chứa trực tiếp cấu trúc Unit cần hiểu. |
| 10 — Anh–Anh | Không phát hiện chính tả Mỹ cần sửa; có organisation; program dùng cho phần mềm là chấp nhận được trong Anh–Anh. |
| 11 — Diễn đạt lại định nghĩa nối | Đã đọc cả hai lời thoại và hai bài đọc: không thấy diễn đạt lại nội dung đặc trưng của 5 định nghĩa đúng. Listening A nói wired nhưng đó là định nghĩa nhiễu C, không phải cặp đúng R1–R5. |
| 12 — T/F rõ bằng chứng | R26 T: lịch 8 a.m.–2 p.m.; R27 F: VPN also offline / won't be able to connect from home; R28 F: phone system will work as normal; R29 F: don't unplug it; R30 T: update restarts it automatically. Không cần suy luận thông tin vắng mặt. |
| 13 — Yêu cầu hiển thị | Task email nêu rõ 3 nhóm cấu trúc; từng câu hỏi S1, prompt S2 và prompt S3 đều nêu cấu trúc ngay trong đề, không chỉ ở targetGrammar/requiredGrammar. Không áp quy tắc 13 cho W31–W35 Anh → Việt. |
| 14 — Nói được bằng lời | S1–S3 đều trả lời bằng lời nói; không yêu cầu dấu câu, viết bảng hay thao tác chỉ thực hiện được trên văn bản. |
| 15 — sourceNotes | Không có sourceNotes trong bản stripped, đã kiểm đệ quy. Nội dung ghi chú gốc có chép đáp án hay không: CHƯA KIỂM vì không được cung cấp. |

## Kiểm khung và tính toàn vẹn

- Listening A: 177 từ; B: 161 từ. Đạt 150–250 từ mỗi phần, không tính tên người nói/context.
- Số câu: Listening 5 MCQ + 5 short; Reading 5 nối / 7 ngữ pháp / 8 từ vựng / 5 MCQ đọc / 5 T/F; Writing 5 dịch + 1 email; Speaking 3 phần, S1 có 3 câu.
- Tất cả 25 MCQ có lựa chọn A–D; matching có 6 định nghĩa A–F; blind có đúng 40 ID của template. L6–L10 lần lượt 2, 2, 1, 2, 2 từ; các trường đáp án đúng kiểu chữ cái hoặc T/F.
- Metadata đúng `unit: 3`, `testId: C`, `source: ai`, phù hợp plan mục 5b.
- Quét đệ quy không thấy sourceNotes, answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer, sampleAnswer trong bản stripped.
- Chưa kiểm audio/TTS, barem AI, bài mẫu email/Speaking, bản dịch tham khảo hoặc giao diện. Không chạy compare-blind/validate-exams vì các bước đó thuộc et-lead và cần dữ liệu tác giả ngoài phạm vi.

## Lệnh kiểm đã thực hiện

- `python3` đọc hai JSON đầu vào và file blind: kiểm 40 ID, giới hạn 3 từ, chữ cái đáp án, lựa chọn A–D, số lượng các phần, metadata, trường bị strip; đếm từ bằng `len(text.split())`, cùng cách chia khoảng trắng trong countWords của src/types/exam.ts → đạt các kiểm nêu trên.
- `python3` quét thuật ngữ R1–R5 trong R6–R30 bằng regex theo ranh giới từ, không phân biệt hoa/thường → 0 lần xuất hiện cho cả 5 thuật ngữ; kết hợp đọc thủ công để kiểm gợi ý ngữ nghĩa.
- `pdftotext -f 26 -l 31 -layout '/home/duckcy/Downloads/Workbook for Students.pdf' -` → đối chiếu Part 1 Unit 3 trang 26–29; chỉ thực hiện sau commit giải mù.
- `date '+%Y-%m-%d %H:%M:%S %Z (%z)'` → thời gian đầu báo cáo.

SHA-256 đầu vào và đáp án đã khóa:

```text
08d47421ee9d4bd85694905639ed0ff7f2951e0aa08c030c0ddcbf7cf0e3ef4e  audit/unit-3-C.stripped.json
9c75edc38a4d5be3d55dd25798bb0a148b9d6d7ecd76673f97a850df654c61b5  audit/unit-3-C.blind.template.json
9783d941225a0ac2deba9a394f13c2b4222674dc0335683a2c1c75960e91945d  audit/unit-3-C.blind.json
```
