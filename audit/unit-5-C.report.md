# Kiểm định mù đề 5C — Unit 5: Choice, Test C

- Agent / solver: et-auditor — gpt-6-astra.
- Nhánh: `audit/unit-5-C`.
- Thời gian lập báo cáo từ `date`: `2026-10-14 21:46:58 +07 (+0700)`.
- Đầu vào: `audit/unit-5-C.stripped.json`, `audit/unit-5-C.blind.template.json`.
- SHA-256 bản stripped: `a6206699e22590bf89fd1370dd7780b7877450ccf99e40ab1c0a5ce496f88e83`.
- Đáp án độc lập: `audit/unit-5-C.blind.json`, đã commit tại `bc2cbd0c5c7713fbb920c4f04f81e0e3f5c36014` **trước khi bắt đầu bước 2**.
- Nhãn đề nghị: **CẦN SỬA**. Có 2 điểm CHẶN thuộc quy tắc 2 và 1 điểm NÊN SỬA về phương án nhiễu. Không tự cấp `AUDIT-OK`.

## Phạm vi và tính độc lập

Giải 40 câu chỉ từ bản stripped, điền bản sao template, không xem đáp án của tác giả. Không đọc `data/units/*.json`, không mở nội dung nhánh `content/*`, không đọc mục 2 của `docs/exam-format.md`, không xem đề khác. Tài liệu áp dụng: brief et-auditor; `docs/exam-format.md` chỉ mục 3–4; `docs/PROTOCOL.md` mục 5 và 8; `docs/plan.md` mục 5b; bản đồ Unit trong `docs/source-materials.md`; schema `src/types/exam.ts`.

Áp dụng đủ **15** quy tắc hiện hành, thay cho con số 10 trong brief/PROTOCOL. Quy tắc 4 chỉ xét R13–R20; quy tắc 13 không áp dụng W31–W35. Trùng chủ đề/cấu trúc giữa Reading và câu dịch không tính lộ trong thi tuần tự. Kiểm trùng bài đọc giữa các đề cùng Unit thuộc validate của et-lead, không thuộc lần đọc này.

## Lỗi và đề xuất

Mỗi dòng dưới đây là một phát hiện; không sửa nội dung đề trong worktree auditor.

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| R18 → R5 | CHẶN | Quy tắc 2: R5 yêu cầu nối **Tiered pricing**; R18 đưa **tier** vào phương án D. Đây là từ gốc đặc trưng của thuật ngữ câu nối, xuất hiện lại ở phần 6–30. Phương án nhiễu vẫn là nội dung sinh viên nhìn thấy và có thể dùng làm gợi ý. | Đổi phương án D của R18 sang một danh từ ngắn, không thuộc thuật ngữ/từ khoá của R1–R5, đồng thời không tạo thêm đáp án hợp lý cho “memory ___”. |
| R19 → R5 | CHẶN | Quy tắc 2: “Which price ___ is best for a small business: **Basic or Pro**?” cùng phương án **plan** cung cấp ví dụ các mức gói giá, gợi cách hiểu **Tiered pricing** và định nghĩa A về phiên bản đơn giản/phức tạp có mức phí khác nhau. Đây là gợi ý trong cùng kỹ năng Reading, không thuộc ngoại lệ thi tuần tự. | Viết lại ngữ cảnh R19 để kiểm từ “plan” mà không dùng các cấp gói giá hoặc đối chiếu phiên bản; kiểm lại tính duy nhất của đáp án. |
| R17 | NÊN SỬA | Quy tắc 4: **2-D / HD** mô tả đặc tính hình ảnh, còn **PDF / USB** là danh từ viết tắt chỉ định dạng/giao tiếp, được đặt vào vị trí bổ nghĩa cho “images”; nhất là “USB images” không phải nhiễu tự nhiên trong ngữ cảnh chương trình vẽ. Độ dài tương đương nhưng tính đồng dạng của phương án nhiễu chưa tốt. | Thiết kế lại bộ phương án theo cùng nhóm từ mô tả hình ảnh, giữ độ dài tương đương và điều chỉnh stem nếu cần để vẫn chỉ có một đáp án đúng. |

## Đối chiếu 15 quy tắc

| Quy tắc | Kết quả trong phạm vi kiểm | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án đúng | Không phát hiện câu đa đáp án hợp lý trong ngữ cảnh IT | Đã giải độc lập 25 câu trắc nghiệm: L1–L5, R6–R25; nối R1–R5 có 5 cặp xác định và định nghĩa D thừa. `notes` để trống. Chưa so với key tác giả, chưa kết luận khớp đáp án. |
| 2. Không lộ từ câu nối sang R6–R30 | CHẶN | R18 và R19 gợi R5 như bảng lỗi. Không gắn lỗi cho W31/W32/W35 hay S2 nhắc lại thuật ngữ, vì khác kỹ năng và thi tuần tự. |
| 3. Không lặp tình huống | Không phát hiện lặp tình huống cụ thể | Nghe A chọn camera cho cửa hàng; nghe B nâng Wi-Fi khách sạn; đọc MCQ mua/thuê laptop công ty; đọc T/F màn hình cho người dịch; email hướng dẫn cài antivirus; S2 chọn hosting cho đại lý du lịch; S3 sửa hoá đơn thiết bị. Việc cùng dùng chủ đề so sánh/chi phí của Unit không tự tạo thành tình huống trùng. |
| 4. Nhiễu từ vựng cùng từ loại, độ dài tương đương | NÊN SỬA | R17 như bảng lỗi; các nhóm R13–R16, R18–R20 có phương án cùng dạng tính từ, cụm động từ hoặc danh từ, độ dài theo số từ tương đương. Không áp điều kiện này cho R6–R12. |
| 5. Ngữ pháp/từ vựng đúng Unit và nguồn | Ngữ pháp đạt; nguồn từ vựng CHƯA KIỂM đầy đủ | R6–R8 so sánh; R9–R10 cost/come to; R11 câu hỏi gián tiếp; R12 khuyến nghị should, phù hợp bản đồ Unit 5. Từ vựng thuộc các ngữ cảnh IT/sản phẩm/chi phí; chưa đối chiếu từng từ với Workbook/Pearson và trang trong `sourceNotes`, vì bản stripped không có ghi chú nguồn. et-lead cần kiểm phần này trên nguồn được phép của mình. |
| 6. Độ dài và bài đọc mới | Độ dài đạt; tính viết mới CHƯA KIỂM độc lập | MCQ 240 từ, nằm trong 230–270; T/F 169 từ, nằm trong 160–200. Không so corpus nguồn hay đề khác để chứng nhận tính mới. Kiểm trùng giữa các đề cùng Unit do et-lead thực hiện. |
| 7. Câu dịch đúng Unit, không trùng giữa Unit | Đúng trọng tâm trong đề; tính không trùng CHƯA KIỂM | W31 so sánh hosting; W32 câu hỏi gián tiếp về bandwidth; W33 cost/came to; W34 so sánh nhất; W35 recommend that. Không đọc đề Unit khác. |
| 8. Email có 5–7 gợi ý, đúng chủ đề | Đạt | W-EMAIL có 7 gợi ý; hướng dẫn cài ShieldPro gắn so sánh sản phẩm, tính chi phí, khuyến nghị và câu hỏi gián tiếp; `wordRange` là 80–100. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | Đạt ở đề bài | W-EMAIL nêu bắt buộc so sánh, cost/come to, khuyến nghị, câu hỏi gián tiếp. W31–W35 chứa cấu trúc Unit. S1 phân bố so sánh/chi phí/khuyến nghị; S2 so sánh và khuyến nghị; S3 chi phí và ít nhất 3 câu hỏi gián tiếp. |
| 10. Chính tả Anh–Anh | Không phát hiện lỗi | Có fibre, centre, licence; “program” dùng cho phần mềm là phù hợp Anh–Anh. Không đánh giá lời giải/bài mẫu đã bị strip. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa nối | Không phát hiện | Không mô tả hosting riêng, quota truyền dữ liệu theo tháng, bảo hành hỏng hóc, tài liệu hướng dẫn hay định giá phiên bản trong 2 lời thoại và 2 bài đọc. Việc TechLease đổi laptop định kỳ là thuê thiết bị, không phải định nghĩa bảo hành. R19 là câu từ vựng và đã được ghi dưới quy tắc 2. |
| 12. T/F có chứng cứ khẳng định/phủ định | Đạt | R26: laptop 14 inch; R27: £230 > £135 nên không rẻ hơn; R28: “the same HDMI cable”; R29: “not included”/£25 extra; R30: tổng £160 < ngân sách £200. Hai phép so sánh số được quyết định trực tiếp từ dữ kiện, không cần giả định bên ngoài. |
| 13. Yêu cầu ngữ pháp nằm trong đề hiển thị | Đạt | W-EMAIL và từng câu S1 đều nêu cấu trúc/chức năng cần dùng; prompt S2/S3 cũng nêu rõ, không chỉ dựa vào `targetGrammar`/`requiredGrammar`. Không áp dụng cho dịch Anh→Việt. |
| 14. Speaking làm được bằng lời nói | Đạt | So sánh, khuyến nghị, đọc giá và hỏi gián tiếp đều nói được; không bắt trình bày dấu câu hay hình thức chỉ có trong văn viết. |
| 15. `sourceNotes` nội bộ, không chép đáp án | Việc loại khỏi stripped đạt; nội dung gốc CHƯA KIỂM | Quét đệ quy không thấy `sourceNotes` hoặc 6 trường đáp án/lời giải còn lại. Không đọc ghi chú gốc nên không kết luận chúng không chứa đáp án. |

## Kiểm tra khung đề và file giải mù

- Định danh: `schemaVersion=1`, `unit=5`, `testId=C`, `source=ai`, phù hợp mục 5b.
- Listening: A có 181 từ/5 MCQ; B có 166 từ/5 câu ngắn. Cả hai nằm trong 150–250 từ, không tính tên người nói/context/instructions.
- Reading: 5 câu nối/6 định nghĩa, 7 ngữ pháp, 8 từ vựng, 5 đọc MCQ, 5 T/F; đủ 30 câu.
- Writing: 5 câu dịch và 1 email; đề email ghi rõ khung hướng dẫn, 80–100 từ không tính bốn dòng tiêu đề. Speaking đủ S1 (3 câu), S2, S3 với thời lượng 45/90/90 giây.
- Python kiểm JSON/template và miền giá trị: đủ đúng 40 ID, không bỏ trống; 30 đáp án chữ cái, 5 T/F, 5 đáp án ngắn đều không quá 3 từ. Đây là kiểm định dạng, không phải so khớp đáp án tác giả.
- Đếm từ bằng tách khoảng trắng như `countWords` trong schema, chỉ nối các dòng `script.text` hoặc `passage.paragraphs`.
- Quét đệ quy 7 trường cấm: `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer`: không thấy trong stripped.
- Không chạy `scripts/compare-blind.ts` hay `scripts/validate-exams.ts` trên đề tác giả. et-lead chịu trách nhiệm so key, nguồn, kiểm trùng và validate; nếu viết lại câu thì giải mù lại trong phiên auditor mới theo PROTOCOL mục 5.

Kết quả là kiểm nội dung bản stripped, không phải kiểm giao diện, TTS, chấm tự động hay runtime. Giữ nguyên hai file đầu vào và chỉ commit file đáp án, báo cáo của auditor.
