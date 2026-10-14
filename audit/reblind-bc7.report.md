# Báo cáo giải mù lại một phần — bc7

- Agent: et-auditor — gpt-6 (Codex).
- Nhánh: `audit/reblind-bc7`.
- Thời gian kiểm: `2026-10-14 22:50:00 +07 (+0700)` (đầu ra lệnh `date`).
- Commit đáp án mù, hoàn tất trước bước kiểm quy tắc: `3ad443729b3c9f93f0d0668809b77e7a3bc54bbb`.
- Phạm vi kết luận: **7C: R18, R19, R20; 8B: R19, L3; 8C: L1**. Các phần khác chỉ dùng làm ngữ cảnh đối chiếu, không giải hoặc tái kiểm định độc lập.
- Căn cứ: brief et-auditor, `docs/exam-format.md` mục 3 và 4, `docs/PROTOCOL.md` mục 5 và 8; ba bản stripped và template được giao. Không đọc mục 2 của exam-format, không đọc `data/units/*.json`, không truy cập nhánh khác.

## 1. Kết quả giải mù

| Câu | Đáp án đã commit | Căn cứ và tính duy nhất |
|---|---|---|
| 7C-R18 | B — challenge | Làm ứng dụng chạy với kết nối rất chậm là thử thách; headset, schedule, purchase không mô tả công việc khó khăn đó. |
| 7C-R19 | C — bug | Lỗi trong chương trình làm ứng dụng crash và cần được sửa; ba danh từ còn lại không phù hợp quan hệ nguyên nhân này. |
| 7C-R20 | D — milestone | Hoàn thành phiên bản hoạt động đầu tiên là cột mốc dự án, phù hợp việc ăn mừng; không phải thiết bị, giao dịch mua hay lịch trình. |
| 8B-R19 | D — responsibilities | Kiểm tra bản sao lưu mỗi sáng là một nhiệm vụ của quản trị viên; không phải bằng cấp, đơn ứng tuyển/ứng dụng hay chính phủ. |
| 8B-L3 | A — When the domain name expires | Mốc “Before Sophie looks at it with him” đặt câu hỏi trước khi hai người kiểm tra. Max trả lời “Not yet” về hạn tên miền; đã kiểm tra server, thông báo lỗi, và gọi hosting để xác minh mạng. Phương án C đã được kiểm tra qua nhà cung cấp, không đòi Max trực tiếp đo mạng. |
| 8C-L1 | B — It keeps switching itself off. | Máy chiếu tự tắt lần thứ ba trong tuần, sau khoảng 20 phút; có thể bật lại sau vài phút. Không có bằng chứng cho không hình hoặc tiếng ồn, và D trái với việc bật lại được. |

Không phát hiện đa đáp án trong sáu câu. Đây là kết quả giải độc lập; **CHƯA so với đáp án tác giả**, không kết luận `AUDIT-OK`.

## 2. Lỗi trong phạm vi được giao

Mỗi dòng dưới đây là một phát hiện, gồm mã câu, mức độ, căn cứ và hướng sửa.

- **7C-R19 | CHẶN | Quy tắc 3:** câu “The app crashed because of a … in the program, so the developers had to fix it” lặp sự kiện cốt lõi của Listening A: Tom nói “a mistake caused the app to crash after question ten”, rồi xác định dùng sai số trong vòng lặp. Hai chỗ cùng mô tả ứng dụng crash vì lỗi chương trình; không chỉ cùng chủ đề phát triển phần mềm. **Đề xuất:** đổi riêng ngữ cảnh R19 sang một bug gây kết quả tính toán sai, không làm ứng dụng crash hay trang thanh toán tải lại; giữ một đáp án duy nhất và giải mù lại câu đã sửa. Hai bài đọc của 7C không lặp tình huống này; lỗi nằm ở đối chiếu với Listening A theo quy tắc 3 áp dụng trong cùng đề, không phải lộ đáp án chéo giữa kỹ năng theo quy tắc 2.
- **7C-R19 | NÊN SỬA | Quy tắc 4:** bốn phương án đều là danh từ đếm được số ít, nhưng `bug` chỉ có 3 chữ cái/1 âm tiết, còn `schedule` 8 chữ, `headset` 7 chữ, `purchase` 8 chữ đều thường có 2 âm tiết; đáp án ngắn nổi bật dù cả bốn đều là một từ. **Đề xuất:** cân bằng độ dài bằng các danh từ ngắn cùng từ loại, chẳng hạn `fee`, `job`, `sale`; kiểm lại nghĩa trong stem cuối cùng để tránh thêm đáp án đúng.

Không có phát hiện riêng cho năm câu còn lại trong phạm vi này. Nhãn đề nghị của gói: **CẦN SỬA**.

## 3. Kiểm lộ đáp án và lặp tình huống bài đọc

- **7C-R18/R19/R20:** không có các thuật ngữ Alpha testing, Line of code, Specification, Premium content, Value trong stem/phương án. Không diễn đạt định nghĩa đúng về kiểm thử nội bộ, dòng chỉ dẫn máy tính, đặc tả chi tiết, nội dung cao cấp trả phí hay đại lượng toán học. Các từ chung như app/program/work không tự tạo thành gợi ý định nghĩa. Định nghĩa dư “Two or more different things … used together” không dùng để bắt lỗi từ phổ thông. Tình huống thử thách mạng chậm, bug làm app crash, ăn mừng phiên bản đầu tiên đều khác bài đọc website Oakfield và màn hình gọi món Pho House. Riêng R19 lặp Listening A như đã ghi.
- **8B-R19/L3:** không có Troubleshooting guide, Short circuit, Tier 1, Bloatware, Customised, cũng không có diễn giải đặc trưng của năm định nghĩa đúng. “company” trong lời thoại không bị bắt lỗi theo định nghĩa dư “The people who work in a company or organisation”. R19 nói nhiệm vụ kiểm tra backup buổi sáng, khác sự cố backup tự tải dữ liệu lúc ba giờ làm nghẽn mạng trong bài đọc; trùng đối tượng backup không đồng nghĩa lặp sự kiện. L3 nói mục kiểm tra hạn tên miền còn thiếu, khác bài đọc nghẽn mạng do backup và bài đọc tiết kiệm điện ở trường.
- **8C-L1:** cả câu hỏi, bốn lựa chọn và lời thoại liên quan không đưa thuật ngữ hay định nghĩa đúng của Issue tracking system, Connection error, Trips and falls, Organisational skill, Further qualification. Máy chiếu quá nóng do nghi bộ lọc bẩn không phải định nghĩa lỗi kết nối điện giữa hai bộ phận. Tình huống này khác kế hoạch nghề nghiệp của Huy và đổ đồ uống lên laptop. Định nghĩa dư “A job that you used to do” không dùng để bắt lỗi từ phổ thông.

## 4. Đối chiếu đủ 15 quy tắc, giới hạn theo sáu câu

| Quy tắc | Kết quả trong phạm vi |
|---|---|
| 1. Đúng một đáp án | ĐẠT cả sáu câu; lập luận ở mục 1. |
| 2. Không lộ thuật ngữ/từ khoá định nghĩa đúng R1–R5 | ĐẠT trong các câu được giao; đối chiếu chi tiết ở mục 3. Không đánh đồng từ chung hoặc từ thuộc định nghĩa dư với gợi ý đáp án. |
| 3. Không lặp tình huống trong đề | CHẶN 7C-R19 do lặp Listening A. Sáu câu không lặp tình huống hai bài đọc của đề tương ứng; năm câu còn lại không thấy lặp sự kiện cụ thể trong ngữ cảnh đã đối chiếu. |
| 4. Nhiễu cùng từ loại, độ dài tương đương | Cùng từ loại: ĐẠT bốn câu R. 7C: tất cả là danh từ số ít; 8B-R19: tất cả danh từ số nhiều. Độ dài: 7C-R18/R20 có 7–9 chữ; 8B-R19 có 11–16 chữ, đều một từ dài; 7C-R19 NÊN SỬA như mục 2. Không áp dụng tiêu chí nhiễu từ vựng cho L3/L1. |
| 5. Từ vựng/ngữ pháp đúng Unit và nguồn | Các từ challenge, bug, milestone phù hợp ngữ cảnh Development; responsibilities phù hợp công việc IT. Nguồn chính xác từ Workbook/giáo trình và trang: CHƯA KIỂM vì đầu vào không có sourceNotes, không mở rộng sang tài liệu nguồn ngoài phạm vi. Không có R6–R12 cần tái kiểm. |
| 6. Độ dài và tính viết mới bài đọc | Không áp dụng cho sáu câu được sửa; bài đọc chỉ dùng đối chiếu tình huống và lộ định nghĩa, không chứng nhận độ dài/tính viết mới. |
| 7. Câu dịch đúng Unit, không trùng liên Unit | Không áp dụng: không có W31–W35 trong danh sách được giao. |
| 8. Email có 5–7 gợi ý, đúng chủ đề | Không áp dụng: không có email trong danh sách được giao. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | Không áp dụng: không có câu Writing/Speaking được giao tái kiểm. |
| 10. Chính tả Anh–Anh | ĐẠT phần câu hỏi, lựa chọn và lời thoại liên quan: không thấy biến thể Mỹ trái yêu cầu; program dùng cho phần mềm phù hợp Anh–Anh. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa nối | ĐẠT đối với lời thoại hỗ trợ 8B-L3, 8C-L1 và liên hệ với sáu câu. Không tái chứng nhận toàn bộ các bài đọc/lời thoại ngoài phạm vi. |
| 12. True/False có chứng cứ trực tiếp | Không áp dụng: cả sáu câu là MCQ, không có câu T/F được giao. |
| 13. Email/Speaking nêu cấu trúc ngay trong đề | Không áp dụng: không có email/Speaking được giao. |
| 14. Speaking làm được bằng lời nói | Không áp dụng: không có Speaking được giao. |
| 15. sourceNotes nội bộ, không chép đáp án | Ba stripped không chứa sourceNotes, answerKey, acceptedAnswers hoặc explanation (đã quét tên trường đệ quy). Nội dung sourceNotes của tác giả: CHƯA KIỂM vì không nằm trong đầu vào được phép. |

## 5. Kiểm tra và dấu vết đầu vào

- Kiểm JSON/template bằng Python 3: giữ nguyên bộ khoá gốc và 40 khoá answers mỗi đề; chỉ có 3/2/1 đáp án khác rỗng tương ứng 7C/8B/8C; notes chỉ thuộc câu được giao; lựa chọn tồn tại trong câu nguồn.
- Kiểm độc lập thủ công sáu câu, đối chiếu R1–R5, hai bài đọc từng đề và ngữ cảnh khác chỉ để phát hiện lặp tình huống; đã đánh dấu những quy tắc không áp dụng hoặc CHƯA KIỂM.
- Không chạy compare-blind.ts hoặc validate-exams.ts trên dữ liệu tác giả. et-lead thực hiện đối chiếu và quyết định nhãn theo PROTOCOL.
- Sáu file đầu vào untracked được giữ nguyên, không đưa vào commit; chỉ ghi ba file đáp án và báo cáo này.

SHA-256 bản stripped dùng để kiểm:

| File | SHA-256 |
|---|---|
| audit/unit-7-C.stripped.json | `1cec2dcdbaa083beaf3b1a7adc11f0a54984f6b3225198eed66b57ac09572ef0` |
| audit/unit-8-B.stripped.json | `9fb0b4317282e6c444ed6753d1a3ef1681e404aaa31237495d510a9be867d5e5` |
| audit/unit-8-C.stripped.json | `6f03d92979104f2a1b1340593bc323618a4d87bfbceb3a599870ff091eb17f08` |

Bàn giao et-lead: xử lý hai phát hiện tại 7C-R19, sau đó giải mù lại câu thay đổi trong phiên mới; so sáu đáp án đã commit với key tác giả. Báo cáo này không cấp AUDIT-OK cho câu hoặc toàn đề.
