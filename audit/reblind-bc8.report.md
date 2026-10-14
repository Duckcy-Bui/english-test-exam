# Kiểm định giải mù lại một phần — bc8

- Agent: et-auditor2 — GPT-6 (Codex).
- Nhánh: audit/reblind-bc8.
- Thời gian: 2026-10-14 22:52:30 +07 (+0700) (lấy từ lệnh date).
- Phạm vi duy nhất: 1B–L1, 1C–L1, 2C–L1, 4C–L6.
- Commit đáp án trước khi kiểm đặc tả: `7df9898c313448abf91930715abd9dd7b4244403`.
- Căn cứ: brief et-auditor; exam-format chỉ mục 3–4; PROTOCOL chỉ mục 5 và 8; bốn bản stripped và template được giao. Không đọc data/units/*.json, đáp án tác giả, mục 2 exam-format, hay nhánh content/* và các nhánh audit/* khác.
- Chỉ giải bốn câu được giao. R1–R5 và hai bài đọc từng đề được dùng làm ngữ cảnh đối chiếu lộ đáp án/lặp tình huống; không đánh giá độc lập các câu ngoài phạm vi.

## Kết quả giải mù và tính duy nhất

| Câu | Đáp án đã commit | Căn cứ từ lời thoại và kiểm phương án |
|---|---|---|
| 1B–L1 | B | Lucy nói “we need to plan our stand” tại Hanoi Technology Fair. A không có trong hội thoại; C là lịch hẹn riêng khiến Sam vắng ngày đầu; D không phải mục đích cuộc bàn bạc, họ chuẩn bị trình diễn ứng dụng hiện có. Chỉ B đúng. |
| 1C–L1 | A | Jack nói “I'm looking for an online backup company”. Không xin việc hay mua máy. Câu hỏi “What happens if I lose a file?” là giả định, không xác nhận đã mất hồ sơ. Chỉ A đúng. |
| 2C–L1 | B | Chloe nói “My old one is far too slow for 4K video”. Không nói máy hỏng, chơi game hay lập công ty. Chỉ B đúng. |
| 4C–L6 | 10 p.m. | Nora nói “I started at ten o'clock in the evening”, rồi sao lưu trước khi cài đặt. “start work on the update” chỉ thời điểm bắt đầu công việc, gồm sao lưu; không hỏi riêng thời điểm bắt đầu cài đặt sau khoảng 40 phút. 1.30 là giờ kết thúc. Một mốc thời gian, đáp án 2 từ theo khoảng trắng, không quá 3 từ. |

Không phát hiện câu có từ hai đáp án nội dung hợp lý. Các cách viết cùng mốc 22:00 không phải nhiều đáp án nội dung. `acceptedAnswers` bị loại khỏi stripped nên CHƯA KIỂM khả năng bộ chấm nhận các cách viết tương đương; et-lead cần đối chiếu đáp án đã commit bằng quy trình của dự án.

## Kiểm lộ thuật ngữ và định nghĩa đúng

Kiểm câu hỏi, toàn bộ phương án của câu được giao, context và lời thoại chứa câu đó. Không gắn lỗi chỉ vì trùng từ phổ thông hay từ trong định nghĩa dư.

| Câu | Đối chiếu R1–R5 của chính đề | Kết quả |
|---|---|---|
| 1B–L1 | Database administrator; Supplier; Launch; Videoconference; Maintain | Không thấy thuật ngữ hoặc diễn đạt lại định nghĩa đúng. Chuẩn bị gian hàng/trình diễn app không khẳng định đưa sản phẩm ra bán lần đầu. “new version” trong D không phải thuật ngữ nối của đề 1B. Định nghĩa dư về tài liệu trình chiếu không dùng để kết luận lộ đáp án. |
| 1C–L1 | Helpdesk supervisor; Provider; Minutes; Stream; Version | Không thấy thuật ngữ theo nghĩa nối hay định nghĩa đúng được nêu lại. Hỏi mua dịch vụ sao lưu cụ thể không giải nghĩa khái quát “a company or person that provides a service”. “a few minutes” trong lời thoại chỉ thời lượng, không phải Minutes theo nghĩa biên bản họp. Định nghĩa dư về database không dùng để bắt lỗi từ data/records. |
| 2C–L1 | Icon; Solid state drive; User account; Drag; Ethernet cable | Không nêu thuật ngữ hoặc định nghĩa đúng. “two terabyte drive” chỉ dung lượng, không mô tả ổ dùng chip thay bộ phận cơ học; processor/memory/graphics card không phải năm thuật ngữ nối. Định nghĩa dư về socket không tạo lỗi. |
| 4C–L6 | Deploy; Caps Lock; Touch screen; Primary key; Jam | Không nêu thuật ngữ hoặc định nghĩa đúng. Cài bản cập nhật phần mềm lên server không diễn đạt định nghĩa Deploy về bố trí/di chuyển thiết bị. Lỗi tự khởi động không mô tả Jam do bộ phận chuyển động bị chặn. Định nghĩa dư về column không tạo lỗi. |

## Kiểm tình huống với hai bài đọc

| Câu | Tình huống nghe | Hai tình huống đọc | Kết luận |
|---|---|---|---|
| 1B–L1 | Lập kế hoạch gian hàng hội chợ công nghệ | Công ty hỗ trợ IT cho khách sạn; quy định làm tại nhà của hãng bảo hiểm | Không lặp. |
| 1C–L1 | Chủ phòng khám hỏi công ty sao lưu trực tuyến về dịch vụ | Tuyển kỹ thuật viên IT cho hãng du lịch; hỏi đáp không gian làm việc chung | Không lặp. |
| 2C–L1 | Biên tập viên đặt máy mới để dựng video 4K | Trường chuyển máy cũ sang hệ điều hành nguồn mở; lựa chọn tai nghe | Không lặp tình huống cụ thể. Cùng nhắc hiệu năng/video là chủ đề IT chung; nhân vật, mục tiêu, ràng buộc và giải pháp khác nhau. |
| 4C–L6 | Bàn giao ca sau công việc sao lưu/cập nhật ba server ban đêm | Lỗi bản cập nhật đầu đọc thẻ tại rạp; sửa lỗi bảng tính doanh thu | Không lặp tình huống cụ thể. Cùng nhắc update là thao tác IT chung; bài nghe kể bảo trì server, bài đọc xử lý sự cố thanh toán do bug. |

## Đối chiếu đủ 15 quy tắc trong phạm vi được giao

| Quy tắc | Kết quả và giới hạn |
|---|---|
| 1 — Một đáp án | ĐẠT: ba MCQ có một lựa chọn đúng; L6 có một mốc thời gian xác định như bảng trên. |
| 2 — Không lộ đáp án chéo | ĐẠT trong phạm vi câu và lời thoại liên quan: đã đối chiếu thuật ngữ/định nghĩa đúng R1–R5 của từng đề. Không viện dẫn miễn trừ giữa kỹ năng để bỏ kiểm yêu cầu này. |
| 3 — Không lặp tình huống | ĐẠT đối chiếu với hai bài đọc mỗi đề như bảng trên; không cấp kết luận cho toàn đề. |
| 4 — Nhiễu từ vựng cùng từ loại/độ dài | KHÔNG ÁP DỤNG: cả bốn câu là Listening, không có câu từ vựng R13–R20 trong phạm vi. Ba MCQ vẫn có các lựa chọn cùng dạng trả lời: cụm danh từ ở 1B, mệnh đề ở 1C/2C. L6 không có nhiễu. |
| 5 — Ngữ pháp/từ vựng R6–R20 đúng Unit | KHÔNG ÁP DỤNG: không có R6–R20 được giao. Không mở thêm nguồn để kiểm xuất xứ các câu ngoài phạm vi. |
| 6 — Độ dài/tính viết mới hai bài đọc | NGOÀI PHẠM VI: chỉ dùng bài đọc để đối chiếu tình huống và lộ đáp án. Không chứng nhận tính viết mới. |
| 7 — Câu dịch đúng Unit/không trùng | NGOÀI PHẠM VI: không có W31–W35 được giao. |
| 8 — Email 5–7 gợi ý/chủ đề | NGOÀI PHẠM VI: không có email được giao. |
| 9 — Writing/Speaking buộc dùng ngữ pháp | NGOÀI PHẠM VI: không có Writing/Speaking được giao. |
| 10 — Chính tả Anh–Anh | ĐẠT trong câu/lời thoại liên quan; không thấy chính tả Mỹ gây lỗi. Các cách viết như centres, programmes không bị áp đặt sang tên gọi IT; “programs” ở 2C là cách viết dùng cho phần mềm trong Anh–Anh. |
| 11 — Lời thoại không diễn đạt định nghĩa nối | ĐẠT với bốn lời thoại liên quan, theo đối chiếu cụ thể phía trên. |
| 12 — T/F có bằng chứng rõ | KHÔNG ÁP DỤNG: không có câu T/F được giao. |
| 13 — Đề email/Speaking nêu rõ cấu trúc | NGOÀI PHẠM VI: không có email/Speaking được giao. |
| 14 — Speaking làm được bằng lời nói | NGOÀI PHẠM VI: không có Speaking được giao. |
| 15 — sourceNotes nội bộ/không chép đáp án | Xác nhận bốn stripped không chứa sourceNotes. Nội dung sourceNotes gốc CHƯA KIỂM vì không được đọc dữ liệu tác giả. |

Đối chiếu thêm mục 3: lời thoại liên quan có lần lượt 192, 196, 193, 169 từ (tách khoảng trắng, không tính tên người nói), đều trong 150–250 từ. Ba câu Part A có đủ lựa chọn A–D; 4C–L6 thuộc Part B, maxWords=3, đáp án đã nộp không quá 3 từ. Không kiểm TTS/runtime.

## Lỗi và trạng thái bàn giao

- CHẶN: 0 trong phạm vi bốn câu.
- NÊN SỬA: 0 trong phạm vi bốn câu.
- Không có dòng lỗi cần đề xuất sửa. Không sửa đề hoặc file đầu vào.
- Chỉ kết luận kiểm nội dung trên stripped; chưa so với đáp án tác giả, chưa chạy compare-blind hoặc validate-exams trên data/units.
- Chờ et-lead đối chiếu bốn đáp án và quyết định nhãn; et-auditor2 không tự cấp AUDIT-OK. Đây không phải kiểm định lại toàn bộ bốn đề.

## Kiểm tra tệp

- Python/json: bốn tệp đáp án parse được; giữ nguyên cấu trúc và danh sách câu của template; mỗi tệp chỉ có đúng câu được giao mang đáp án, các câu khác để trống.
- Python: xác nhận không có answerKey, acceptedAnswers, explanation, sourceNotes trong bốn stripped.
- SHA-256 của đầu vào và template để et-lead xác nhận đúng phiên bản:

- `audit/unit-1-B.stripped.json`: `fef20ee2cd708309ee3384f57022b06dd674b60be2f0ddbcc13b8a42fd6ba00a`
- `audit/unit-1-B.blind.template.json`: `dbba7cdc26de3d826091e6d4e1e82260a82704719516e4aa511ef371e13a9b79`
- `audit/unit-1-C.stripped.json`: `138b2e65b536a0fdf18d8699221733d14ad0da50ef434f00a84fea9955609b5a`
- `audit/unit-1-C.blind.template.json`: `3e3c9bfa4021c68f0e16501a57912fdb0c47e652e811f5fa10988ef71c67c641`
- `audit/unit-2-C.stripped.json`: `ae9488c210daf8419741e2f00ec8bf295d1dffe27fe99fcb165963112d9c6078`
- `audit/unit-2-C.blind.template.json`: `ad483a6c4d812b3e3c255c41df61ad058ff3340d109bc0987070ba52b52e5447`
- `audit/unit-4-C.stripped.json`: `1dabfe5eb165a58081e07afd5197232ea11b92fda8e7fde6e7c3abc9b55271b5`
- `audit/unit-4-C.blind.template.json`: `6c8eaf1142e41c99d3d693e9c5dd2acfc577659e420529b606edbebda1efb974`
