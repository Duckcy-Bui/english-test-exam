# Báo cáo kiểm định mù — Unit 1, Test C (1C)

- Agent: et-auditor — gpt-6-astra.
- Nhánh: audit/unit-1-C.
- Thời gian từ `date`: 2026-10-14 21:53:32 +07 (+0700).
- Commit đáp án mù, hoàn tất trước bước 2: `aff857c99c18eed6a900b7a5298bdc2460f76f9d`.
- Đầu vào: `audit/unit-1-C.stripped.json`, `audit/unit-1-C.blind.template.json`.
- SHA-256 bản stripped: `280d132c380e996e601477a4c393e80a8c0f2e00008fbe2a86e6dfd777a5d1ed`.
- Chỉ đọc mục 3–4 của `docs/exam-format.md`; mục 5, 8 của `docs/PROTOCOL.md`; mục 5b của `docs/plan.md`; tài liệu nguồn và kiểu dữ liệu theo brief. Không đọc mục 2 của exam-format, `data/units/*.json`, đề khác hoặc nhánh content/*. Chỉ ghi trong audit/.

Nhãn đề nghị: **AMBIGUOUS** vì R12 có hai cách hoàn thành hợp lý. Đây là nhận định độc lập về câu hỏi, chưa phải kết quả so đáp án tác giả. Không tự cấp AUDIT-OK; et-lead cần chạy compare-blind và validate.

## Các lỗi và đề xuất

Mỗi dòng dưới đây là một phát hiện độc lập. Không thay đáp án mù sau khi kiểm đặc tả.

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| R12 | CHẶN | QT1 — Chọn A, “Shall I book a meeting room for Thursday?”, vì phù hợp lời đề nghị làm giúp. Tuy nhiên C tạo câu hỏi hiện tại đơn đúng ngữ pháp “Do I book a meeting room for Thursday?”, hợp lý khi hỏi xác nhận việc mình cần làm; lời đáp “Yes, please. That would be great.” không loại trừ cách hiểu này. Khả năng này đã được ghi trong notes của bản giải mù. | Thay phương án C bằng một cấu trúc sai rõ ràng trong câu này, hoặc viết lại ngữ cảnh/câu để chỉ còn một cách hiểu hợp lý. Câu viết lại phải được giải mù trong phiên auditor mới theo PROTOCOL mục 5. |
| R1 ↔ R13-D, R20-B | CHẶN | QT2 — Định nghĩa E của R1 có “Someone who supervises the department…”, trong khi hai câu từ vựng dùng “supervise” làm phương án nhiễu. Đây là lặp từ khóa cùng gốc của định nghĩa; không phải lộ toàn bộ cặp đáp án. Theo quy tắc cấm từ khóa của câu nối xuất hiện làm gợi ý ở R6–R30, cần loại bỏ sự lặp này. | Thay supervise trong cả hai bộ phương án bằng động từ Unit 1 khác, không trùng từ khóa của câu nối và vẫn chỉ để một đáp án đúng. |
| R17 | NÊN SỬA | QT4 — Các phương án đều là danh từ, nhưng độ dài “data” (4 ký tự) lệch rõ so với “colleagues” (10), “agendas” (7), “characters” (10); hai nhiễu colleagues/characters cũng yếu trong ngữ cảnh lưu dữ liệu trên server. | Dùng các danh từ nhiễu có độ dài gần nhau và phù hợp hơn về hình thức; kiểm lại để không tạo thêm đáp án đúng như files/records trong câu hiện tại. |
| R12 ↔ đoạn 3 bài R26–R30 | NÊN SỬA | QT3 — Tình huống đặt phòng họp xuất hiện trong “book a meeting room for Thursday” và lại xuất hiện trong quy định “book the meeting room at least one day before you need it”. Không kết luận đây là lộ đáp án R12; đây là lặp hành động/tình huống cụ thể trong cùng đề. | Khi sửa R12, chuyển sang một lời đề nghị làm giúp khác thuộc Unit 1; giữ riêng tình huống đặt phòng ở bài The Hub. |

## Đối chiếu đủ 15 quy tắc

| Quy tắc | Kết quả trong phạm vi bản stripped |
|---|---|
| 1. Một đáp án đúng | CHẶN ở R12 như trên. Các MCQ còn lại và 5 câu nối có một lựa chọn phù hợp khi giải độc lập. Listening B có biến thể câu trả lời ngắn; chưa đối chiếu acceptedAnswers. |
| 2. Không lộ chéo từ câu nối sang R6–R30 | CHẶN do supervise/supervises. Không tìm thấy nguyên cụm Helpdesk supervisor, Provider, Minutes, Stream, Version trong R6–R30. Các từ chung như meeting không tự chứng minh lộ nghĩa “minutes”; không gắn lỗi chỉ từ sự trùng đó. |
| 3. Không lặp tình huống | NÊN SỬA trường hợp đặt phòng họp nêu trên. Bốn ngữ cảnh dài chính khác nhau: hỏi dịch vụ sao lưu, thông báo an ninh IT, tuyển dụng ở Orbis Travel và FAQ của The Hub. Không đồng nhất việc cùng chủ đề IT/nội quy với sao chép tình huống. |
| 4. Nhiễu từ vựng cùng từ loại, độ dài tương đương | R13/R14/R20 là động từ; R15 là tính từ; R16–R19 là danh từ. NÊN SỬA độ dài và chất lượng nhiễu R17. Chỉ áp dụng quy tắc này cho R13–R20, không áp cho R6–R12. |
| 5. Ngữ pháp/từ vựng của Unit | R6 tần suất; R7 câu hỏi hiện tại đơn; R8 câu trả lời ngắn; R9 have to; R10 can't; R11 mệnh lệnh phủ định; R12 đề nghị. Từ vựng phù hợp chủ đề công việc IT/công ty theo docs/source-materials.md. CHƯA KIỂM đối chiếu từng từ với Workbook/Pearson và trang dẫn nguồn vì không mở nguồn gốc đề hay sourceNotes. |
| 6. Độ dài và bài đọc viết mới | ĐẠT độ dài: R21–R25 có 237 từ (230–270); R26–R30 có 165 từ (160–200). CHƯA KIỂM tính nguyên tác bằng so khớp tài liệu ngoài. Trùng bài giữa các đề cùng Unit do validate của et-lead kiểm; không mở đề khác. |
| 7. Dịch đúng Unit, không trùng giữa Unit | W31 tần suất; W32 câu hỏi hiện tại đơn; W33 nội quy have to/mustn't; W34 mô tả công ty bằng hiện tại đơn; W35 phản đối lịch sự/gợi ý could. Phù hợp Unit 1; không trùng nội bộ 5 câu. CHƯA KIỂM trùng giữa các Unit, giữ phạm vi một đề. |
| 8. Email 5–7 gợi ý thuộc Unit | ĐẠT: 6 gạch đầu dòng, hướng dẫn lễ tân cấp Wi-Fi cho khách, giới hạn 80–100 từ và khung email đầy đủ; loại trừ 4 dòng tiêu đề khi tính từ. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | ĐẠT trong đề bài: email bắt buộc ít nhất 2 trạng từ/cụm tần suất và ít nhất 2 cấu trúc nội quy hoặc mệnh lệnh; S1 lần lượt yêu cầu tần suất, câu hỏi hiện tại đơn, nội quy; S2 yêu cầu hiện tại đơn/tần suất; S3 yêu cầu gợi ý, làm mềm, phản đối lịch sự. Dịch Anh→Việt dùng chính câu nguồn để kiểm hiểu cấu trúc, không buộc sinh viên viết câu tiếng Anh. |
| 10. Anh–Anh | Không phát hiện lỗi chính tả Anh–Mỹ trong nội dung đã đọc; có centre/centres và licence. Các cách dùng at weekends, pounds phù hợp ngữ cảnh Anh. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa nối | Không thấy đoạn nào định nghĩa lại vai trò giám sát helpdesk, biên bản họp, phiên bản hay streaming. SafeStore là một công ty cung cấp dịch vụ trong ngữ cảnh cụ thể, không có câu giải nghĩa provider. Mô tả hỗ trợ kỹ thuật ở Orbis không mô tả người giám sát bộ phận. Không suy từ trùng chủ đề chung thành lộ định nghĩa. |
| 12. T/F có căn cứ rõ | ĐẠT cả 5: R26 “Most… freelance designers and developers”; R27 “Gold… twenty-four hours a day”; R28 “Do I have to book a desk? No…”; R29 “every morning” phủ định once a week; R30 chỉ 100 trang miễn phí rồi 5p/trang phủ định in miễn phí không giới hạn. |
| 13. Yêu cầu ngữ pháp hiển thị cho sinh viên | ĐẠT: W-EMAIL.task nêu cấu trúc; từng câu hỏi S1 đều có “Use…”; S2.prompt và S3.prompt cũng nêu rõ. Không chỉ dựa vào targetGrammar/requiredGrammar. Không áp cho W31–W35 theo thống nhất. |
| 14. Speaking làm được bằng lời nói | ĐẠT: hỏi/đáp, mô tả lịch làm việc, đồng ý/phản đối và gợi ý đều có thể nói. Dấu ngoặc và mũi tên trong gợi ý là chỉ dẫn, không yêu cầu đọc hay tạo dấu câu bằng lời. S1 câu 2 có thể thu âm ba câu hỏi mà không cần thu lời đáp của bạn học. |
| 15. sourceNotes nội bộ, không chép đáp án | ĐẠT kiểm tra bản stripped: không có sourceNotes hoặc trường đáp án/lời giải/bài mẫu ở bất kỳ cấp nào. CHƯA KIỂM nội dung sourceNotes gốc; et-lead kiểm trên bản đầy đủ. |

## Kiểm tra khung và đầu ra

- Bản giải mù đủ 40 ID đúng template: L1–L10, R1–R30; không bỏ trống. MCQ/nối ghi chữ cái, T/F ghi T/F. L6–L10 đều không quá 3 từ.
- Lời thoại A: 191 từ; B: 166 từ; đều nằm trong 150–250 từ. Đếm bằng tách khoảng trắng, chỉ phần lời nói, không tên người nói. Reading đếm các paragraphs, không tiêu đề.
- Cấu trúc: Listening 5 MCQ + 5 trả lời ngắn; Reading 5 nối/6 định nghĩa + 7 ngữ pháp + 8 từ vựng + 5 đọc MCQ + 5 T/F; Writing 5 dịch + email; Speaking 3 phần, S1 có 3 câu, S2/S3 mỗi phần 90 giây.
- Metadata: schemaVersion=1, unit=1, testId=C, source=ai; đúng phân loại đề 1C theo plan mục 5b.
- Dò đệ quy các khóa sourceNotes, answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer, sampleAnswer: 0 khóa trong stripped.
- L7 đã chọn “12 characters minimum” để giữ ý tối thiểu trong 3 từ. Notes còn nêu biến thể ngày L6, số L8 và mạo từ L9. Các cách viết tương đương không tự động chứng minh câu sai; et-lead phải kiểm acceptedAnswers trước khi chốt chấm tự động.
- Không tính lộ đáp án giữa kỹ năng thi tuần tự; W32 có version và W34 cùng chủ đề công ty không bị gắn lỗi lộ đáp án. Không kiểm đề khác để so bài đọc.
- Chưa chạy scripts/compare-blind.ts hoặc scripts/validate-exams.ts vì việc đó cần bản đáp án/full exam do et-lead giữ. Chưa kiểm UI/TTS/PDF, bài mẫu hoặc rubric AI bị strip; báo cáo này chỉ chứng minh kiểm định nội dung đầu vào đã giao.

## Bàn giao xử lý

et-lead đối chiếu bản mù đã commit và xác minh các biến thể Listening B; chuyển các dòng lỗi cho et-author. Nếu viết lại R12 hoặc câu khác, giao bản stripped mới cho một phiên auditor mới theo PROTOCOL. Chỉ et-lead quyết định AUDIT-OK sau khi đủ cả đối chiếu đáp án, hết lỗi chặn và validate PASS.
