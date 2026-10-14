# Báo cáo giải mù lại một phần — BC3

- Agent: et-auditor — gpt-6-astra.
- Nhánh: `audit/reblind-bc3`.
- Thời gian từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`: `2026-10-14 22:17:27 +07 (+0700)`.
- Commit bước 1, thực hiện trước kiểm đặc tả: `517517c08ff0225e3c29404f70abeca0ef5464d3`.
- Chỉ giải/kiểm 32 câu: 1B L1–L10, R6, R12, R14 (13); 1C L1–L10, R9, R11 (12); 2B L6, L8, L9, L10, R6, R15, R20 (7).
- Đầu vào duy nhất cho nội dung đề: ba bản stripped và template tương ứng do người điều phối cung cấp. R1–R5 và hai bài đọc mỗi đề chỉ được dùng làm ngữ cảnh đối chiếu lộ đáp án/lặp tình huống; không giải hoặc tái kiểm định các câu ngoài danh sách.
- Đã đọc brief, exam-format mục 3–4, PROTOCOL mục 5 và 8. Không xuất/đọc nội dung mục 2, không mở `data/units/*.json`, không truy cập nhánh khác, không sửa đầu vào, không merge/push.

## Kết quả trong phạm vi

Không phát hiện câu có hai đáp án trắc nghiệm hợp lý hoặc lỗi mức CHẶN trong 32 câu. Có 1 điểm NÊN SỬA. Đây là kiểm nội dung từ bản stripped; chưa so với đáp án tác giả, chưa kiểm tập `acceptedAnswers`, chưa chạy validate trên bản tác giả. Không tự cấp AUDIT-OK.

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| 1B–R6 | NÊN SỬA | D (`hardly ever`) là lựa chọn phù hợp nhất. Tuy nhiên “They only work from Monday to Friday” diễn đạt không làm cuối tuần, còn “hardly ever” diễn đạt gần như không, có thể có ngoại lệ. Đây là lệch độ chính xác ngữ nghĩa, không phải hai đáp án đúng: B (`hardly ever don't`) có thể phân tích được về cú pháp nhưng mang nghĩa hầu như luôn làm cuối tuần, trái câu sau; A/C không phù hợp tiếng Anh chuẩn ở đây. | Giữ D và thay câu sau bằng “They work at weekends only once or twice a year.” để tần suất ăn khớp rõ ràng. |

## Dấu vết giải từng câu

Các dòng dưới là kết quả độc lập đã đóng băng ở commit bước 1, không phải đáp án đã đối chiếu tác giả.

| Đề | Câu | Đáp án mù | Căn cứ |
|---|---|---|---|
| 1B | L1 | B | Hai người lên kế hoạch gian hàng hội chợ công nghệ. |
| 1B | L2 | C | USB đắt; phần lớn khách vứt chúng đi năm trước. |
| 1B | L3 | A | Lucy đề xuất pens and stickers. |
| 1B | L4 | D | Sam có cuộc họp khách hàng ở Da Nang ngày đầu. |
| 1B | L5 | C | Sam hứa chuẩn bị bản trình diễn ngắn trước thứ Sáu tới. |
| 1B | L6 | the overnight log | Việc đầu tiên mỗi sáng là đọc overnight log. |
| 1B | L7 | two hundred | Khoảng 200 cuộc gọi vào ngày bận. |
| 1B | L8 | password resets | Lời thoại gọi đây là công việc thường gặp nhất. |
| 1B | L9 | the library | Hai nhân viên làm ở thư viện thứ Ba/thứ Năm. |
| 1B | L10 | once a fortnight | Tần suất họp được nói trực tiếp. |
| 1B | R6 | D | Trạng từ tần suất trước động từ; xem điểm NÊN SỬA. |
| 1B | R12 | C | Shall we + động từ nguyên mẫu dùng đề xuất. |
| 1B | R14 | D | Developers là nghề viết và kiểm thử ứng dụng. Các nghề/đối tượng còn lại không được ngữ cảnh hỗ trợ. |
| 1C | L1 | A | Jack tìm công ty sao lưu trực tuyến cho phòng khám. |
| 1C | L2 | B | Business plan sao lưu mỗi giờ; every night là lịch của standard plan. |
| 1C | L3 | C | Hai trung tâm dữ liệu tại UK. |
| 1C | L4 | D | Phí tính theo dung lượng lưu trữ. |
| 1C | L5 | A | Đường dây hỗ trợ mở mỗi ngày, 7 giờ sáng–11 giờ đêm. |
| 1C | L6 | 1 April | Quy định có hiệu lực first of April. |
| 1C | L7 | Thursday | Cập nhật bảo mật mỗi thứ Năm. |
| 1C | L8 | ten minutes | Cảnh báo trước khi khởi động lại 10 phút. |
| 1C | L9 | the shared drive | Dùng shared drive thay USB cá nhân. |
| 1C | L10 | Room 4B | Địa điểm tập huấn được nêu rõ. |
| 1C | R9 | B | Chủ ngữ số ít: has to answer; needs thiếu to. |
| 1C | R11 | D | Mệnh lệnh phủ định Don't open. |
| 2B | L6 | 27 inches | Màn hình 27-inch. |
| 2B | L8 | three days | Thời hạn mượn tối đa up to three days; câu trả lời rút gọn đúng 2 từ. |
| 2B | L9 | game design projects | Mục đích dùng kính VR được nêu trực tiếp. |
| 2B | L10 | every Sunday night | Lịch dọn máy được nêu trực tiếp. |
| 2B | R6 | C | nano- = một phần tỷ. |
| 2B | R15 | C | Projector chiếu slide lên màn hình lớn. |
| 2B | R20 | D | Audio kém khiến khó nghe lời nói. |

## Đối chiếu 15 quy tắc

| Quy tắc | Kết quả giới hạn theo phạm vi |
|---|---|
| 1. Một đáp án | 18 câu MCQ có một lựa chọn phù hợp nhất; 14 câu nghe trả lời ngắn có thông tin xác định và đáp án không quá 3 từ. Biến thể cùng nghĩa không phải nhiều đáp án nội dung. 1B–R6 có điểm NÊN SỬA như trên. |
| 2. Không lộ thuật ngữ/định nghĩa nối | Các câu Reading được giao không chứa thuật ngữ R1–R5 hoặc gợi ý xác định định nghĩa đúng của chúng. Không tính từ phổ thông chỉ có trong định nghĩa dư. Xem đối chiếu cụ thể bên dưới. |
| 3. Không lặp tình huống | Các lời thoại gắn với câu được giao và tình huống các câu Reading được giao không lặp tình huống của hai bài đọc tương ứng; trùng chủ đề IT chung không đồng nghĩa lặp tình huống. Không kết luận cho phần ngoài phạm vi. |
| 4. Nhiễu từ vựng cùng từ loại/độ dài | 1B–R14: bốn danh từ đếm được số nhiều chỉ người, mỗi phương án một từ. 2B–R15: bốn danh từ thiết bị số ít, mỗi phương án một từ. 2B–R20: bốn danh từ, mỗi phương án một từ; audio không đếm được nhưng cùng từ loại danh từ, không gây hai đáp án. Nhiễu ngữ pháp được phép khác dạng. |
| 5. Bám nội dung Unit | 1B–R6/R12 và 1C–R9/R11 khớp grammarFocus của Unit 1; 2B–R6 khớp tiền tố nano- trong Unit 2. Developers, projector, audio phù hợp chủ đề nghề IT/phần cứng đa phương tiện. CHƯA KIỂM nguồn Workbook/giáo trình và số trang vì không mở thêm nguồn ngoài phạm vi, sourceNotes đã bị lược. |
| 6. Độ dài/bài đọc viết mới | Ngoài phạm vi tái kiểm: không có R21–R30 được giao. Hai bài đọc mỗi đề chỉ dùng đối chiếu tình huống; không xác nhận độ mới của bài đọc. Riêng đặc tả Listening mục 3: 1B A/B = 192/181 từ; 1C A/B = 196/172 từ; 2B B = 156 từ, đều trong 150–250 (đếm theo khoảng trắng, không tính tên người nói). |
| 7. Câu dịch | Không áp dụng phạm vi này: không được giao W31–W35; chưa kiểm câu dịch hay trùng giữa Unit. |
| 8. Email 5–7 gợi ý | Không áp dụng phạm vi này: không được giao email. |
| 9. Writing/Speaking buộc ngữ pháp Unit | Không áp dụng phạm vi này: không được giao Writing/Speaking; không kế thừa kết quả audit cũ. |
| 10. Anh–Anh | Không thấy lỗi chính tả Anh–Anh trong câu được giao và lời thoại liên quan; cụ thể 1C dùng data centres; không có dạng center trong phần kiểm. |
| 11. Lời thoại/bài đọc không diễn đạt lại định nghĩa nối | Lời thoại liên quan không giải thích chức năng đặc trưng dùng để nối R1–R5. Các bài đọc ngoài danh sách không được tái cấp kết quả quy tắc 11. Chi tiết các từ dễ nhầm bên dưới. |
| 12. True/False được văn bản xác nhận/phủ định | Không áp dụng phạm vi này: không được giao câu True/False. |
| 13. Yêu cầu ngữ pháp hiển thị ở email/Speaking | Không áp dụng phạm vi này: không được giao email/Speaking. |
| 14. Speaking làm được bằng lời | Không áp dụng phạm vi này: không được giao Speaking. |
| 15. sourceNotes không chép đáp án | Ba stripped không có sourceNotes, answerKey, acceptedAnswers, explanation. CHƯA KIỂM sourceNotes bản tác giả; không thể kết luận từ trường đã bị xoá. |

### Đối chiếu lộ đáp án và tình huống

- **1B:** Thuật ngữ nối là Database administrator, Supplier, Launch, Videoconference, Maintain; định nghĩa đúng lần lượt thuộc C/F/B/D/A. Định nghĩa E về tài liệu trình bày là dư. “Demonstration”, “screens”, “new app” trong hội chợ không mô tả hành vi đưa sản phẩm ra bán lần đầu; developers viết/kiểm thử ứng dụng không phải người quản trị cơ sở dữ liệu, supplier hay maintain. Listening A là tổ chức gian hàng hội chợ, B là tuần làm việc của helpdesk trường; hai bài đọc là dịch vụ IT cho khách sạn và quy định làm việc tại nhà của công ty bảo hiểm. Không lặp tình huống cụ thể.
- **1C:** Thuật ngữ nối là Helpdesk supervisor, Provider, Minutes, Stream, Version; định nghĩa đúng E/C/A/F/D; định nghĩa B về database là dư. Lời thoại sao lưu nêu giao dịch cụ thể với SafeStore, không định nghĩa provider là công ty/người cung cấp dịch vụ; lời nhắn bảo mật không mô tả người giám sát helpdesk. “Minutes” xuất hiện ở “a few minutes” và “ten minutes”, mang nghĩa đơn vị thời gian, không gợi nghĩa biên bản cuộc họp của R3. Ghi nhận trùng chuỗi chữ này, nhưng không coi là lộ định nghĩa; quy tắc 2 cũng loại trừ lộ chéo giữa kỹ năng trong trình tự thi. Các từ files/data/storage không làm lộ định nghĩa đúng R1–R5; không dùng định nghĩa dư B để gắn lỗi. Cuộc gọi mua dịch vụ sao lưu và lời nhắn quy định bảo mật khác tình huống tuyển kỹ thuật viên và FAQ không gian làm việc chung trong hai bài đọc.
- **2B:** Thuật ngữ nối là Pane, Boot drive, Licence terms, Trainee, Microphone; định nghĩa đúng D/F/B/A/E. Định nghĩa C về camera là dư. Cameras/filming trong Media Lab không phải rò định nghĩa đúng của năm thuật ngữ; không mô tả thiết bị thu/khuếch đại giọng nói (microphone). “Audio ... hard to hear” ở R20 chỉ chất lượng âm thanh, không định nghĩa microphone. Bài giới thiệu Media Lab, cho mượn camera và dùng VR khác bài đánh giá Nimbus Mini PC và hướng dẫn split screen; R15 là chiếu slide ở phòng họp, R20 là âm thanh video kém, không lặp hai tình huống bài đọc.

## Kiểm tra và giới hạn bàn giao

- Python 3 kiểm JSON theo template: đúng unit/test, 40 khoá câu mỗi file; chỉ điền đúng 13/12/7 câu; mọi khoá ngoài phạm vi rỗng; solver và notes hợp lệ.
- 18 đáp án MCQ thuộc A–D; 14 đáp án Listening Part B không quá 3 từ; mọi mã câu được giao có trong stripped.
- Quét trường bị lược: không thấy answerKey/acceptedAnswers/explanation/sourceNotes trong ba đầu vào.
- Quét thuật ngữ chính xác trên câu được giao/lời thoại liên quan: chỉ có hai chỗ “minutes” của 1C nêu trên; đã xét nghĩa và phạm vi kỹ năng bằng đọc thủ công, không coi quét chuỗi là bằng chứng đủ cho kiểm ngữ nghĩa.
- SHA-256 đầu vào để et-lead xác nhận đúng phiên bản:

| Đầu vào | SHA-256 |
|---|---|
| unit-1-B.stripped.json | `51cc5d96f492002a448aa1629f945836290963080cca5b9647de323308cf3572` |
| unit-1-C.stripped.json | `791928e82d8d9fbed970e0dcef86a3c604399b6fbe4c27c0c9dd049e478d8bdd` |
| unit-2-B.stripped.json | `a0fb55d853a321f6ae8192e6ce1b634fc1caf4038d4c29caefce128f537f3387` |
| unit-1-B.blind.template.json | `dbba7cdc26de3d826091e6d4e1e82260a82704719516e4aa511ef371e13a9b79` |
| unit-1-C.blind.template.json | `3e3c9bfa4021c68f0e16501a57912fdb0c47e652e811f5fa10988ef71c67c641` |
| unit-2-B.blind.template.json | `f0457d17d157d238c5f1fe8b576e9dbca3207af0e3afd5fdbe08c2d8fab256e1` |

Nhãn đề nghị: **CẦN SỬA** cho điểm NÊN SỬA 1B–R6; không có CHẶN được phát hiện trong phạm vi. Et-lead quyết định xử lý điểm này, so đáp án (kể cả các cách viết tương đương của câu nghe), và chạy validation trên bản tác giả. Không suy rộng kết quả sang toàn bộ ba đề hoặc câu ngoài danh sách.
