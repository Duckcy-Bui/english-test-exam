# Unit 8 — kiểm định mù và đặc tả

- Agent: et-auditor — gpt-6-astra; nhánh `audit/unit-7-8`.
- Thời gian: 2026-10-14 16:12:27 +0700.
- Thứ tự: Unit 7 blind `aabca0d` → Unit 7 report `d89202f` → Unit 8 blind `5e29126` → báo cáo này. Unit 8 đã commit đủ L1–L10 và R1–R30 trước khi làm Bước 2.
- Kết luận: **CẦN SỬA; 1 lỗi CHẶN, 2 lỗi NÊN SỬA**. Có nghi vấn AMBIGUOUS tại R7. Không tự cấp AUDIT-OK; chưa đối chiếu đáp án tác giả.

## Phạm vi và bằng chứng

Chỉ đọc packet sạch Unit 7–8, brief, `docs/PROTOCOL.md`, `docs/exam-format.md` mục 3–4, `docs/source-materials.md`, `src/types/exam.ts`. Sau commit giải mù Unit 8, đối chiếu Workbook Unit 8 (PDF trang 75–80) và nguồn ngữ pháp/kỹ thuật nêu dưới. Không đọc mục 2 “Đáp án”, `data/units`, nhánh content/* hoặc audit/* khác, hay audit Unit 1–6/reblind-r7 có sẵn. Không merge/push; chỉ ghi trong audit/.

SHA-256 packet: `120c940d0f0b4204f4c389f93b4aec2abf6669aa95eceec4b270af9f47f0f8b7`.
SHA-256 template: `8340e1a62ec08de8fdfda43ce1127690a77b19571aa68387e4787f6a7a4e2e7e`.

## Lỗi cần xử lý

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| R7 | CHẶN | QT1: “I haven't checked the cables ______.” D (yet) là đáp án tự nhiên nhất tôi chọn. Tuy nhiên B (since) có cách dùng trạng từ độc lập ở cuối câu, nghĩa là kể từ đó; đề không có văn cảnh để xác định/loại cách hiểu mốc thời gian ngầm. Không thể giải thích B sai chỉ vì since thiếu tân ngữ. Nghi vấn đã được ghi trước commit giải mù. | Thay nhiễu since bằng một dạng sai rõ ràng trong stem, hoặc viết lại câu để kiểm tra yet với văn cảnh đủ ràng buộc. Không chỉ đổi key; gửi câu sửa cho phiên giải mù mới. |
| R11 | NÊN SỬA | Nội dung lời khuyên thiếu tính khả thi: sau khi “screen goes black” mới yêu cầu “save your work” nhưng không nêu cách thao tác khi không thấy màn hình. Không làm thay đổi lựa chọn should, song ví dụ chưa tốt cho chức năng đề xuất giải pháp của Unit. | Đổi điều kiện thành máy bắt đầu chậm nhưng vẫn thao tác được, hoặc nêu thao tác kiểm tra màn hình/nguồn phù hợp trước khi tiếp tục. Giữ cấu trúc If + hiện tại, should + V. |
| R22 / bài đọc MCQ đoạn 2 | NÊN SỬA | Văn bản kết luận “the network can't be the cause” chỉ từ “wi-fi signal is strong in all areas”. Tín hiệu mạnh không đủ loại mọi lỗi kết nối mạng. R22 vẫn có một đáp án C theo đúng văn bản; lỗi ở lý do kỹ thuật dùng để dạy mức chắc chắn can't. | Thu hẹp kết luận thành loại trừ tín hiệu yếu, hoặc thêm bằng chứng kiểm tra đường truyền/tái hiện lỗi khi không dùng mạng, rồi sửa câu hỏi tương ứng. |

Nguồn kiểm chứng sau commit giải mù: [Cambridge Dictionary, Since, for and ago](https://dictionaryblog.cambridge.org/2015/12/30/since-for-and-ago-talking-about-periods-of-time/) xác nhận since có thể là trạng từ cuối câu. Nhận định áp vào R7 là phân tích của auditor, chưa phải kết quả compare. [Microsoft Support, Troubleshooting Wi-Fi connection on your Surface](https://support.microsoft.com/en-us/surface/wifi-cellular/troubleshooting-wi-fi-connection-on-your-surface) phân biệt trạng thái nối mạng không dây với kết nối thực sự hoạt động; từ đó auditor đánh giá lý do loại trừ toàn bộ mạng ở R22 là quá mạnh.

## Kiểm đủ quy tắc 1–15

| QT | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1 | CHẶN | Đã giải và xét mọi phương án L1–L5, R6–R25. R7 có nghi vấn B/D như bảng lỗi; các câu còn lại có một đáp án phù hợp rõ ràng trong văn cảnh. R1–R5 nối E/F/C/A/D, dư B. R22 trả lời theo văn bản được, dù cơ sở kỹ thuật nên sửa. |
| 2 | ĐẠT trong packet | Không thấy ticket, escalate, hang, RSI, qualification được cung cấp như đáp án/định nghĩa ở R6–R30. Bài app nói crashes, không mô tả hiện tượng treo vẫn mở nhưng ngừng nhận input; không đồng nhất crash với hang. R19 mô tả CV, không mô tả bằng chứng vượt qua kỳ thi/khóa học. Từ education/course/skills chung không tự cung cấp đủ định nghĩa qualification. |
| 3 | ĐẠT | Các tình huống chính riêng: hộp mực máy in, hướng dẫn an toàn văn phòng, ứng dụng khách sạn, Linh tại ngân hàng, laptop Ben, máy chiếu, phỏng vấn ứng viên hỗ trợ IT. S1 và S3 cùng chức năng kế hoạch nghề nghiệp nhưng không lặp cùng sự kiện/nhân vật; tương tự bài Linh không phải cùng cuộc phỏng vấn. |
| 4 | ĐẠT | R13–R16, R18–R20 là các danh từ hoặc thành phần danh từ của cụm; R17 bend/spill/burn/award đều có thể là động từ. Mọi lựa chọn đều một từ. Không áp cùng từ loại cho R6–R12. |
| 5 | ĐẠT | R6 past simple với yesterday; R7 present perfect/yet; R8 hope to; R9–R10 can't/might be + V-ing; R11 điều kiện và should; R12 try + V-ing. Từ đích R13–R20: call centre, error code, virus, manual, bend, electric shock, CV, work experience đều có ở Workbook Part 1 Unit 8 trang 75–78. |
| 6 | ĐẠT độ dài; CHƯA KIỂM trọn tính viết mới | MCQ 246 từ (230–270), T/F 177 từ (160–200), đếm tách khoảng trắng theo countWords. Chủ đề khác bài computer viruses bắt đầu trang 80 của Workbook. Chưa có căn cứ chứng nhận toàn bộ nội dung chưa từng chép từ Pearson/nguồn khác. |
| 7 | ĐẠT nội dung và cặp 7–8; CHƯA KIỂM với 1–6 | W31 present perfect/already; W32 might be + V3; W33 If + should + try -ing; W34 intend to; W35 present perfect/yet. Không trùng câu trong Unit 8 hoặc với 5 câu Unit 7 (so sau chuẩn hoá chữ thường/khoảng trắng hai đầu và đọc thủ công). Unit 1–6 nằm ngoài phạm vi được phép đọc. |
| 8 | ĐẠT | Email cho Ben về điều tra/sửa laptop chậm, 6 gạch đầu dòng, 80–100 từ, đúng Unit. |
| 9 | ĐẠT | Task email buộc present perfect với cả already/yet, phỏng đoán may/might/could, lời khuyên should hoặc try -ing. S1 lần lượt buộc present perfect, đề xuất giải pháp, kế hoạch; S2 phỏng đoán và đề xuất; S3 kinh nghiệm và kế hoạch nghề nghiệp. Câu dịch chứa ngữ pháp trọng tâm. |
| 10 | ĐẠT trong packet | centre, programmes không dùng sai (computer programs là chuẩn Anh–Anh), wi-fi, learnt/learned đều không tạo lỗi chính tả; không thấy biến thể Mỹ bắt buộc sửa. |
| 11 | ĐẠT trong packet | Đã đọc 2 script và 2 passage: không diễn đạt đủ định nghĩa ticket/escalate/hang/RSI/qualification. Backache và đi bộ không phải đau tay do thao tác lặp của RSI; crash không phải định nghĩa hang. Việc Linh học/hoàn thành một phần khóa học là thông tin tiểu sử, không giải thích qualification như bằng chứng trình độ. Không có chuyển vụ việc lên cấp hỗ trợ cao hơn hoặc mô tả hồ sơ issue tracking chứa sự cố và các bước xử lý. |
| 12 | ĐẠT theo văn bản | R26: “finished her degree in 2021” → T; R27: từ 2021 làm help desk, còn làm cùng network team là sắp xếp một ngày/tháng được nói sau đó → F; R28: “twice a week” → T; R29: thời hạn December, không phải June → F; R30: “plans to work abroad”, mâu thuẫn làm tại Vietnam cả sự nghiệp → F. Không coi việc chưa nói đến như bằng chứng False. |
| 13 | ĐẠT | Các yêu cầu ngữ pháp nằm trong task email, từng câu hỏi S1, prompt S2/S3. Không chỉ dựa targetGrammar/requiredGrammar. Không áp quy tắc này cho dịch Anh → Việt W31–W35. |
| 14 | ĐẠT | Tất cả nhiệm vụ Speaking trả lời được bằng lời nói; không yêu cầu viết/dùng dấu ngoặc. Các ví dụ có dấu câu chỉ minh hoạ cấu trúc. |
| 15 | ĐẠT stripping; CHƯA KIỂM sourceNotes gốc | Quét đệ quy không thấy sourceNotes hay bất kỳ answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer, sampleAnswer. Vì không mở bản gốc, không kết luận nội dung sourceNotes không chép đáp án; giao et-lead kiểm. |

## Kiểm khung đề và chấm tự động

- Listening A/B: 161/162 từ, đều trong 150–250. Đủ 5 MCQ A–D và 5 câu ngắn maxWords=3. L6–L10 trong file blind dài 3/2/3/2/3 từ. L8 trả lời “a short walk” không vượt giới hạn; nên chấp nhận các biến thể cùng ý trong acceptedAnswers. L6 có the IT team/IT team; L7 your eyes/eyes; L9 twenty minutes/20 minutes. Chưa xác nhận whitelist gốc.
- Reading đủ 30 câu: 5 nối/6 định nghĩa, 7 grammar, 8 vocabulary, 5 đọc MCQ, 5 T/F. Writing đủ 5 dịch + 1 email/6 gợi ý. Speaking đủ 3 câu S1, 45 giây/câu; S2/S3 90 giây/phần.
- Đã chạy Python3 assertions trên đúng hai stripped và hai blind của Unit 7–8: kiểm schemaVersion/unit, toàn bộ ID theo thứ tự, số lựa chọn, tập ký tự đáp án, độ dài short-answer, số câu/gợi ý, wordRange, thời gian Speaking và giới hạn từ. Cả hai PASS. Đây là kiểm cấu trúc packet, không phải validate-exams trên bản gốc.
- Đã đọc nguồn Unit 8 bằng `pdftotext -f 75 -l 80 '/home/duckcy/Downloads/Workbook for Students.pdf' -`; quét đệ quy trường bị strip; đối chiếu câu dịch Unit 7–8; rà thủ công đủ câu/phương án và QT1–15.
- Thi tuần tự: không gắn cờ lộ chỉ vì câu dịch giống nội dung Reading. Kiểm lộ và diễn giải định nghĩa vẫn thực hiện trên toàn packet theo QT2/QT11.
- Chưa chạy compare-blind, validate-exams hoặc TTS/UI/chấm AI thực tế; chưa kiểm trùng câu dịch với Unit 1–6, tính nguyên bản tuyệt đối của lời thoại/bài đọc và nội dung sourceNotes gốc. Đây là các giới hạn bằng chứng/phạm vi, không phải lỗi nội dung tự suy đoán. Et-lead kiểm các cổng còn lại và quyết định nhãn cuối cùng.
