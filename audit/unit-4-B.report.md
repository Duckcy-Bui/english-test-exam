# Báo cáo audit đề 4B — Unit 4, Test B

- Agent: et-auditor — gpt-6-astra.
- Nhánh: `audit/unit-4-B`.
- Thời gian: 2026-10-14 22:42:30 +07 (+0700) (lấy từ lệnh `date`).
- Đáp án giải mù: `audit/unit-4-B.blind.json`, commit `8a0fa68`, đã commit trước khi kiểm đặc tả.
- Kết quả: 40/40 câu đã giải; không ghi nhận câu có hai đáp án hợp lý ngang nhau. Không phát hiện lỗi CHẶN trong phạm vi bản stripped; có 2 điểm NÊN SỬA. Nhãn đề nghị: **CẦN SỬA**. Không tự cấp `AUDIT-OK`.

## Phạm vi và tính độc lập

Chỉ dùng `audit/unit-4-B.stripped.json` và template tương ứng để giải. Đã đọc brief, `docs/exam-format.md` mục 3–4 (trích từ dòng 90, không mở mục 2), `docs/PROTOCOL.md` mục 5 và 8, `docs/plan.md` mục 5b, `docs/source-materials.md` và schema `src/types/exam.ts`. Không đọc `data/units/*.json`, đề khác hoặc nhánh `content/*`; không đối chiếu đáp án tác giả, không chạy compare/validate trên dữ liệu gốc, không merge/push.

Áp dụng các thống nhất: quy tắc 4 chỉ cho từ vựng; quy tắc 13 không cho dịch Anh→Việt; trùng chủ đề dịch với Reading không tính lộ do thi tuần tự; từ phổ thông của Unit không tính lộ quy tắc 2 nếu không giúp nối cặp. Kiểm trùng bài đọc giữa các đề cùng Unit thuộc et-lead.

## Các điểm cần sửa

Mỗi dòng dưới đây là một phát hiện riêng:

- **R6–R25 | NÊN SỬA |** Theo đáp án giải mù đã commit, 20 câu liên tiếp có chu kỳ `B C D A` lặp đúng 5 lần; phân bố đều nhưng thứ tự dễ đoán. Đây là khuyến nghị chất lượng, không khẳng định vi phạm quy tắc 2 về nối R1–R5. **Đề xuất:** sau khi et-lead đối chiếu độc lập, hoán vị các phương án để bỏ chu kỳ và cập nhật khoá tương ứng; kiểm lại sau hoán vị.
- **W-EMAIL | NÊN SỬA |** Tệp bị xoá “yesterday” nhưng đề yêu cầu phục hồi từ “last night's backup”; nếu bản sao được tạo sau lúc xoá thì tệp có thể không còn trong bản sao đó. Đề chưa xác nhận bản sao giữ phiên bản trước khi xoá. **Đề xuất:** đổi thời điểm xoá thành “this morning”, giữ bản sao đêm qua; hoặc chỉ rõ một bản sao trước lúc xoá vẫn chứa tệp và sửa gợi ý chọn ngày cho nhất quán.

## Kiểm theo 15 quy tắc

| Quy tắc | Kết quả và căn cứ |
|---|---|
| 1. Một đáp án đúng | ĐẠT ở mức giải độc lập: L1–L5 và R6–R25 mỗi câu có một lựa chọn tốt nhất; R1–R5 nối riêng biệt, thừa B. R6 dùng `didn't + run`, R7 `chose`, R8 `by running`, R9–R10 liên từ + -ing, R11–R12 phối hợp quá khứ tiếp diễn/quá khứ đơn. `notes` rỗng vì không có lựa chọn thứ hai hợp lý ngang nhau. Chưa đối chiếu khoá tác giả. |
| 2. Lộ chéo nối → R6–R30 | Không phát hiện. Worksheet/single page or tab; retrieve a record/get back stored information; headset/headphones with microphone; read-only/read but not change; divide/how many times one number contains another không được cung cấp thành cặp gợi ý trong R6–R30. Bài server nói quyền mở thư mục, không giải thích read-only; bài thư viện nói mượn/gia hạn, không định nghĩa retrieve. Các từ chung như data, computer, spreadsheet, database không tự làm lộ cặp nối. |
| 3. Lặp tình huống | Không phát hiện lặp cùng tình huống cụ thể. Nghe: máy in kẹt ghim và công thức ngân sách; đọc: chuyển server và thư viện; email: phục hồi tệp; S2: cơ sở dữ liệu cửa hàng; S3: trà đổ vào bàn phím. S1 hỏi trải nghiệm cá nhân, không tái sử dụng nhân vật/sự kiện có sẵn của S3. Câu từ vựng về thiết bị không tái kể sự cố bài nghe. |
| 4. Nhiễu từ vựng | ĐẠT R13–R20: các nhóm danh từ đơn số/nhiều, từ chỉ phép toán, từ bổ nghĩa thiết bị, động từ ngôi ba, dạng -ing và tính từ tương ứng; tất cả phương án đều một từ, không có độ dài dạng cụm làm nổi bật đáp án. Không áp tiêu chí này cho ngữ pháp. |
| 5. Đúng nội dung Unit | Ngữ pháp R6–R12 bám Unit 4; từ vựng R13–R20 thuộc spreadsheets, databases, systems administration và peripherals theo bản đồ nguồn. CHƯA KIỂM đối chiếu từng mục từ với trang Workbook/Pearson và ghi trang trong `sourceNotes` vì chưa mở bản nguồn và `sourceNotes` bị strip. |
| 6. Độ dài và bài đọc mới | ĐẠT độ dài: R21–R25 = 237 từ (230–270); R26–R30 = 170 từ (160–200), không tính tiêu đề. CHƯA KIỂM tính nguyên tác qua so nguồn/đề khác; việc trùng bài đọc cùng Unit do et-lead validate. |
| 7. Dịch Anh→Việt | ĐẠT tại chỗ: 5 câu W31–W35, từ vựng quản trị/ứng dụng bảng tính; có quá khứ đơn, by + -ing, after + -ing, quá khứ tiếp diễn + when + quá khứ đơn. W35 kiểm ý nghĩa công thức. CHƯA KIỂM trùng câu giữa các Unit vì không đọc đề khác. |
| 8. Email | ĐẠT hình thức: 6 gạch đầu dòng, hướng dẫn phục hồi tệp thuộc Unit, 80–100 từ, nhắc đủ khung thư và loại bốn dòng đầu khỏi số từ. Có điểm cần làm rõ thời gian bản sao lưu như phát hiện W-EMAIL. |
| 9. Ngữ pháp Writing/Speaking | ĐẠT: email buộc before/after + -ing ít nhất hai lần, by + -ing ít nhất một lần. S1 lần lượt buộc quá khứ đơn và phủ định, by + -ing, quá khứ tiếp diễn + quá khứ đơn; S2 buộc by + -ing; S3 buộc phối hợp hai thì quá khứ. Câu dịch cho sẵn cấu trúc để kiểm hiểu. |
| 10. Anh–Anh | Không phát hiện lệch chuẩn: `formulae`, `learnt`, `colour`, `centre`, `alphabetical order` và cách diễn đạt phù hợp. |
| 11. Không diễn đạt lại định nghĩa nối | Không phát hiện bài đọc/lời thoại diễn giải lại nội dung đặc trưng của năm định nghĩa đúng. Listening B nêu phép chia spending/budget như bước tính phần trăm, không diễn giải định nghĩa E; “multiplied” liên quan định nghĩa nhiễu B, không cung cấp cặp đúng R1–R5. Các ví dụ sử dụng dữ liệu không đồng nhất với định nghĩa retrieve a record. |
| 12. True/False có căn cứ trực tiếp | ĐẠT cả 5: R26 F — `more than 40,000` phủ định `fewer than`; R27 T — barcode là primary key nói trực tiếp; R28 F — hệ thống tính hạn trả `automatically`; R29 T — báo cáo liệt kê sách `more than one week late`; R30 F — gia hạn `three weeks`, không phải `four`. |
| 13. Yêu cầu hiện cho sinh viên | ĐẠT: yêu cầu ngữ pháp nằm trong `email.task`, từng câu `S1.questions`, và `S2/S3.prompt`, không chỉ nằm trong metadata. Không áp cho W31–W35. |
| 14. Speaking làm được bằng lời | ĐẠT: kể trải nghiệm, hướng dẫn thao tác và gọi helpdesk; không yêu cầu ký hiệu/dấu câu chỉ tồn tại trong văn viết. Cues dạng mũi tên là ghi chú để chuyển thành lời nói. |
| 15. sourceNotes | CHƯA KIỂM nội dung vì bản stripped không có trường này; không suy ra ghi chú gốc sạch đáp án. Đã xác nhận stripped không chứa sourceNotes hoặc các trường đáp án/lời giải bị cấm. et-lead kiểm trên bản gốc. |

## Kiểm tra đã thực hiện và giới hạn

- `python3` (inline, chỉ đọc stripped/template/blind): PASS đúng 40 mã đáp án và Listening B tối đa 3 từ; đáp án theo template, Unit 4/Test B.
- `python3` (inline, chỉ đọc stripped/blind): PASS số lượng 5 MCQ nghe + 5 short nghe; nối 5 mục/6 định nghĩa; 7 ngữ pháp + 8 từ vựng + 5 đọc MCQ + 5 T/F; mỗi MCQ đúng A–D; 5 câu dịch; 6 email bullets, wordRange [80,100]; Speaking 3 phần, S1 có 3 câu; source `ai`.
- Đếm từ theo `split()` trên khoảng trắng, tương ứng `countWords` của schema: Listening A **167**, Listening B **168** (đều trong 150–250); Reading MCQ **237**, Reading T/F **170**. Không tính nhãn người nói hoặc tiêu đề bài đọc.
- Quét đệ quy các khoá: không có `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer` trong stripped.
- Kiểm thủ công 15 quy tắc và từng bằng chứng T/F; chuỗi lựa chọn R6–R25 lấy từ blind, chưa phải khoá tác giả đã xác minh.
- CHƯA KIỂM `acceptedAnswers` có nhận các biến thể đúng (ví dụ `equals sign`/`an equals sign`, `email`/`an email`); bài mẫu, bản dịch tham khảo, lời giải, TTS/audio và chấm thực tế đều nằm ngoài phạm vi bản stripped.
- et-lead cần chạy compare-blind và validate, kiểm các mục nguồn/đề khác/ghi chú nội bộ còn thiếu, rồi quyết định nhãn. Nếu compare phát hiện bất đồng, áp quy trình `AMBIGUOUS` và phiên giải mù mới theo PROTOCOL mục 5.

## Định danh đầu vào và đáp án độc lập

SHA-256:

- `audit/unit-4-B.stripped.json`: `a2677ff05a24a50745d9c4d46644b143d413f7d220b142e29f1bb3585b37fe59`
- `audit/unit-4-B.blind.template.json`: `078ec6370f8dc80476cf5fdd2dec05a4ab7393609f9a931837effb6bc36fbbe9`
- `audit/unit-4-B.blind.json`: `38d5a13fbf55ce39873d8a9a351ae9cde34bef7bf492e67f7699f41e28f9d364`
