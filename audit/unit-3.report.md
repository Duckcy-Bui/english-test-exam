# Unit 3 — kiểm định đầy đủ

- Auditor: et-auditor — gpt-6-astra.
- Thời gian: 2026-10-14 16:04:07 +0700 (lệnh `date`).
- Nguồn đề: `audit/unit-3.stripped.json`, SHA-256 `9370508bf95bb2c4f65f4e617cc2bb135b03216b31e3397e743d1bccd46a960c`; mẫu đáp án: `audit/unit-3.blind.template.json`.
- Đã commit đủ 40 đáp án giải mù ở `a78df5ed14193d7ee3c6666a244e75602114afbb` **trước** bước kiểm định này. Không phát hiện câu đa đáp án khi giải; `notes` rỗng. Đây là kết quả giải độc lập, chưa phải kết quả so với đáp án tác giả.

## Phát hiện và đề xuất

- R16 | **NÊN SỬA** | Quy tắc 4: phương án “back” chỉ hướng quay lại, còn “refresh/delete/sign” là động từ thao tác; cách dùng như nhãn nút khiến chúng đều đặt được trước “button”, nhưng chưa bảo đảm cùng từ loại từ vựng một cách rõ ràng. Không phát hiện đa đáp án; B vẫn là lựa chọn duy nhất phù hợp nghĩa. | Đổi stem thành “Click the ______ to return to the page that you were looking at before.” và dùng các cụm danh từ đồng dạng “refresh button / back button / delete button / home button”.
- W-EMAIL | **NÊN SỬA** | Cho phép “first or zero conditional” nhưng ví dụ hiện cho sinh viên chỉ có “will / won't”, tức loại 1; điều này dễ làm người học tưởng loại 0 cũng phải có will. | Cho hai mẫu riêng: “If + present simple, present simple” và “If + present simple, will + verb”.

Không phát hiện lỗi **CHẶN** hoặc câu **AMBIGUOUS** trên bản stripped. Hai dòng trên là góp ý cải thiện đặc tả/diễn đạt, không phải yêu cầu đổi đáp án cho khớp tác giả.

## Kiểm đủ quy tắc 1–15

| Quy tắc | Kết quả trong phạm vi được phép | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án MCQ | Đạt khi giải độc lập | L1–L5 và R6–R25 mỗi câu có một phương án phù hợp; R8 chỉ có who, R9 chỉ có which nên không có cặp who/that hoặc which/that cùng đúng. R12 dùng an trước hour trong ngữ cảnh không có giờ cụ thể đã được nhắc tới. |
| 2. Không lộ đáp án nối sang R6–R30 | Chưa thấy vi phạm | Không có Bookmark, Attachment, Dongle, Accelerometer hoặc WAN trong R6–R30; đọc ngữ nghĩa cũng không thấy gợi ý định nghĩa quyết định đáp án. Từ chung như email, network, web page không tự tạo thành định nghĩa của năm thuật ngữ này. |
| 3. Không lặp tình huống | Chưa thấy lặp nguyên tình huống | Nghe A xử lý trình duyệt; nghe B nội quy email; bài đọc MCQ y tá thăm nhà; T/F mạng trường học; email triển khai mạng công ty; S2 giải thích thuật ngữ; S3 ứng dụng cho nhân viên khách sạn. Các ví dụ ngắn cùng chủ đề không sao chép toàn bộ tình huống hỏi–đáp. |
| 4. Từ loại/độ dài phương án R13–R20 | Có góp ý R16 | R13–R15 là danh từ/cụm danh từ; R17 là viết tắt danh từ; R18 danh từ; R19 tính từ; R20 động từ. Độ dài các lựa chọn tương đương. R16 nên thống nhất thành cụm danh từ như dòng góp ý. Không áp quy tắc này cho R6–R12. |
| 5. Bám nội dung Unit | Đạt về chủ đề/ngữ pháp; xuất xứ từng từ CHƯA KIỂM | R6 hiện tại tiếp diễn, R7 động từ trạng thái, R8–R9 quan hệ, R10 điều kiện 0, R11 điều kiện 1, R12 mạo từ. Từ vựng gắn trình duyệt, email, mạng và thiết bị di động. Chưa đối chiếu từng từ với Workbook/giáo trình; đặc biệt vị trí nguồn của flowchart ở R15 cần et-lead kiểm tra. Không có sourceNotes để kiểm số trang cho từ ngoài Workbook. |
| 6. Hai bài đọc đúng độ dài, viết mới | Độ dài đạt; nguồn gốc CHƯA KIỂM | MCQ 243 từ, T/F 170 từ, đếm phần paragraphs bằng tách khoảng trắng như countWords trong schema. Không xác minh tính viết mới với nguyên bản giáo trình. |
| 7. Câu dịch bám Unit, không trùng giữa Unit | Đạt nội dung; đối chiếu liên Unit có giới hạn | W31 đối chiếu hiện tại đơn/tiếp diễn; W32 và W35 mệnh đề quan hệ; W33 điều kiện 1; W34 điều kiện 0. Không trùng nguyên câu với Unit 2 được phép đọc. Chưa kiểm các Unit còn lại vì ngoài phạm vi truy cập. |
| 8. Email 5–7 gợi ý, chủ đề Unit | Đạt | 6 gợi ý, chủ đề triển khai mạng không dây/VPN; yêu cầu 80–100 từ. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | Đạt | Email yêu cầu hiện tại tiếp diễn, mệnh đề quan hệ, điều kiện; S1 lần lượt yêu cầu hiện tại đơn/tiếp diễn, điều kiện, quan hệ; S2 quan hệ; S3 điều kiện 1 và ít nhất một câu điều kiện 0. Câu dịch cũng chứa cấu trúc Unit. |
| 10. Chính tả Anh–Anh | Chưa thấy vi phạm | Có colours, organising, Organises; không thấy cách viết Mỹ gây lệch chuẩn. |
| 11. Không diễn đạt lại định nghĩa nối trong bài đọc/nghe | Chưa thấy vi phạm | Không mô tả lưu địa chỉ trang để quay lại, file đính kèm email, khoá phần mềm dạng thiết bị, đo gia tốc hoặc kết nối máy tính trên vùng rộng/quốc gia. App gửi báo cáo điện tử không được mô tả là gửi file kèm email; mạng nội bộ trường không phải định nghĩa WAN. |
| 12. T/F có căn cứ khẳng định/phủ định rõ | Đạt | Căn cứ từng câu ở bảng dưới; không cần suy đoán thông tin ngoài bài. |
| 13. Cấu trúc/chức năng hiện trong đề email và mọi câu Speaking | Đạt, có góp ý ví dụ email | Email ghi rõ ba yêu cầu; từng câu S1 đều có “Use…”; prompt S2 và S3 nêu cấu trúc cụ thể. Không chỉ dựa vào targetGrammar/requiredGrammar. Không áp quy tắc này cho dịch Anh → Việt. |
| 14. Speaking thực hiện được bằng lời | Đạt | Yêu cầu giải thích, đưa ví dụ, nói lợi ích/vấn đề và dùng câu điều kiện/quan hệ; không đòi viết hay tạo dấu câu. |
| 15. sourceNotes không chép đáp án | CHƯA KIỂM nội dung gốc | Bản stripped không chứa sourceNotes và cả sáu trường đáp án/giải thích còn lại trong ANSWER_FIELDS. Không được suy từ việc bị xoá rằng sourceNotes gốc đạt quy tắc; et-lead kiểm phần này. |

## Căn cứ T/F và đáp án ngắn

| Câu | Giải mù | Căn cứ trực tiếp trong bài đọc |
|---|---|---|
| R26 | T | Máy trong ba phòng thực hành “are connected to the network with cables”. |
| R27 | F | Wi-fi “is free for everyone who has a college account”. |
| R28 | F | Mạng khách “does not give access to the college server”. |
| R29 | F | Máy phòng thực hành “delete all local files when they restart”. |
| R30 | T | Cuối tuần trường “asks students to report any problems by email”. |

L6–L10 lần lượt được lời thoại xác nhận bằng giới hạn tám từ, settings, spell checker, trong một ngày và thông tin cá nhân của khách hàng. Tất cả đáp án đã nộp không quá ba từ. Et-lead cần so các cách viết tương đương hợp lệ với acceptedAnswers, chẳng hạn eight/8, settings/in the settings, spell checker/the spell checker, one day/within one day. Chưa đọc danh sách acceptedAnswers nên không khẳng định các biến thể đã được hỗ trợ.

## Kiểm tra đã chạy và ranh giới

- `python3` chỉ đọc hai stripped được giao, template Unit 3 và hai file giải mù mới: JSON đọc được; 40 ID L/R đúng và không trùng; 4 lựa chọn A–D cho MCQ Reading; 6 định nghĩa, 5 câu nối, 7 ngữ pháp, 8 từ vựng, 5 MCQ đọc hiểu, 5 T/F; 5 câu dịch; email 6 gợi ý, khoảng 80–100; 3 phần Speaking, S1 có 3 câu hỏi. Unit 3 có đủ 40 đáp án khớp ID mẫu, đáp án ngắn tối đa 3 từ.
- Listening Unit 3 A/B có 197/169 từ và 5 câu mỗi phần, đúng giới hạn 150–250 từ. Reading có 243/170 từ, đúng giới hạn 230–270 và 160–200.
- Kiểm đệ quy không còn ANSWER_FIELDS; dò thuật ngữ nối nguyên dạng trong R6–R30 không có kết quả; sau đó đọc kiểm ngữ nghĩa quy tắc 2/11. Hai Unit được giao không trùng nguyên văn câu dịch.
- Đây là kiểm cấu trúc trên stripped và đánh giá nội dung, **không thay thế** validate-exams trên dữ liệu gốc, compare-blind, kiểm barem lúc chạy ứng dụng hoặc kiểm phát âm/TTS.
- Không đọc data/units, content/*, nhánh audit khác, các audit cũ trên main hoặc mục 2 “Đáp án” của exam-format. Không tính trùng nội dung giữa Reading và câu dịch là lộ đáp án vì thi tuần tự.

Bàn giao et-lead: xem hai góp ý NÊN SỬA, so đáp án độc lập, kiểm nguồn và chạy validator trong phạm vi quyền của lead. Không tự cấp AUDIT-OK.
