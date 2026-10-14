# Kiểm định đề 6B — Unit 6, Test B

- Người kiểm: et-auditor — gpt-6-astra.
- Thời gian từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`: 2026-10-14 21:56:28 +07 (+0700).
- Nhánh: `audit/unit-6-B`.
- Đầu vào: `audit/unit-6-B.stripped.json`, SHA-256 `e0803564be6a8e68169aea2374812fad59bc377331d44dc88e266102b115e82b`.
- Bản mù: `audit/unit-6-B.blind.json`; đã commit riêng tại `0886d15a12c304f6b17efa2951d9b093011e981d` trước khi kiểm đặc tả.
- Đã đọc brief, exam-format chỉ mục 3–4, PROTOCOL mục 5 và 8, plan mục 5b, source-materials và kiểu dữ liệu exam. Không mở exam-format mục 2, không đọc `data/units/*.json`, không truy cập nhánh `content/*` hay đề khác.

Đề nghị **CẦN SỬA**, có nghi vấn **AMBIGUOUS tại R10** đã ghi ngay trong bản mù. Chưa so đáp án tác giả; không tự cấp AUDIT-OK.

## Lỗi và đề xuất

Mỗi dòng dưới đây là một lỗi; ba lỗi mức CHẶN.

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| R10 | CHẶN | Quy tắc 1: chọn A, “wouldn't need”, nếu hiểu là giả định hiện tại. D, “didn't need”, cũng tạo câu điều kiện thực trong quá khứ: mỗi khi dùng hệ thống đặt lịch trực tuyến thì khách không cần gọi điện. Stem không đặt thời điểm hoặc xác nhận chưa có hệ thống; trọng tâm Unit không tự loại bỏ cách hiểu ngữ pháp thứ hai. | Viết lại thành tình huống giả định hiện tại rõ ràng, chẳng hạn “We do not have an online booking system at present. If we had one, customers ______ to phone us for appointments.” và giữ duy nhất một phương án hợp ngữ cảnh; đưa câu sửa sang phiên giải mù mới. |
| R3 ↔ R15-D | CHẶN | Quy tắc 2: thuật ngữ nối “Archiving” xuất hiện lại dưới dạng động từ “archive” trong phương án R15-D. Đây là trùng gốc thuật ngữ trong cùng Reading; dù là phương án nhiễu, nó vẫn đưa lại thuật ngữ của phần nối vào vùng R6–R30. | Thay “archive” bằng một động từ cùng độ dài tương đối, không liên quan R1–R5 và không tạo thêm đáp án đúng; ví dụ “monitor”, rồi kiểm lại cả bốn phương án. |
| R6 / R15 / R26–R30 | CHẶN | Quy tắc 3: cùng tình huống ngày càng chọn thanh toán bằng điện thoại thay cho tiền mặt xuất hiện ở R6 (“more and more … pay with their phones”), R15 (“prefer paying by phone to paying with cash”) và bài đọc Riverside College café. Đây là lặp hành vi cụ thể, không chỉ cùng chủ đề Interactions. | Giữ bài đọc café; đổi ngữ cảnh R6 sang xu hướng dùng đào tạo trực tuyến, đổi R15 sang sở thích nhận hướng dẫn bằng video thay vì tài liệu in, vẫn giữ cấu trúc ngữ pháp/từ vựng cần kiểm. |

## Đối chiếu đủ 15 quy tắc

| Quy tắc | Kết quả trong phạm vi bản stripped |
|---|---|
| 1. Một đáp án đúng | CHẶN ở R10 như trên. Đã giải đủ L1–L10 và R1–R30; không thấy đáp án cạnh tranh hợp lý khác ở các MCQ còn lại. Kết quả so với tác giả: CHƯA KIỂM, do et-lead thực hiện. |
| 2. Không lộ chéo câu nối → R6–R30 | CHẶN ở R3/R15-D. W31, W33, W34 và S2 nhắc lại các thuật ngữ nối ở kỹ năng sau không bị gắn lỗi lộ chéo vì thi tuần tự. Không coi riêng từ chung như “online” là bằng chứng tiết lộ định nghĩa “Bricks and clicks”. |
| 3. Không lặp tình huống | CHẶN ở cụm thanh toán bằng điện thoại. Không gắn lỗi chỉ vì các câu cùng chủ đề hội nghị truyền hình hoặc đào tạo người dùng. |
| 4. Nhiễu cùng từ loại, độ dài tương đương | Không thấy lỗi rõ trong R13–R20: các bộ lựa chọn dùng danh từ, động từ hoặc tính từ tương ứng, đều là từ/cụm ngắn; “face-to-face” là tính từ ghép. Chỉ áp dụng quy tắc này cho từ vựng, không áp cho R6–R12. |
| 5. Ngữ pháp/từ vựng của Unit | R6–R8 mô tả xu hướng; R9–R10 điều kiện loại 2 dự kiến; R11 giải nghĩa bằng “called”; R12 yêu cầu lịch sự. Từ vựng phù hợp chủ đề theo bản đồ Unit 6. Xuất xứ từng từ từ Workbook/giáo trình và trang dẫn trong sourceNotes: CHƯA KIỂM vì không có trong đầu vào; et-lead kiểm trên nguồn của tác giả. |
| 6. Hai bài đọc viết mới, đúng độ dài | Độ dài đạt: MCQ 240 từ, T/F 163 từ, không tính tiêu đề. Tính mới so với toàn bộ tài liệu nguồn: CHƯA KIỂM. Không mở đề khác; trùng bài đọc giữa các đề cùng Unit do validate của et-lead kiểm. |
| 7. Dịch dùng từ vựng/ngữ pháp Unit, không trùng giữa Unit | W31 thuật ngữ e-commerce; W32 xu hướng; W33 điều kiện loại 2; W34 yêu cầu đào tạo; W35 xu hướng và so sánh. Đạt phần nội dung nhìn thấy. Không trùng giữa các Unit: CHƯA KIỂM do không đọc đề khác. |
| 8. Email có 5–7 gợi ý, đúng chủ đề | Đạt: 7 gạch đầu dòng, hướng dẫn chia sẻ tệp DriveHub, giới hạn 80–100 từ, hướng dẫn không tính 4 dòng đầu thư. |
| 9. Writing/Speaking buộc dùng trọng tâm Unit | Đạt trong đề bài: email buộc xu hướng + điều kiện loại 2 + yêu cầu lịch sự; S1 lần lượt xu hướng, điều kiện loại 2, giải nghĩa; S2 ít nhất 4 yêu cầu lịch sự; S3 ít nhất 4 câu điều kiện loại 2. Câu dịch chứa nội dung Unit như quy tắc 7. |
| 10. Chính tả Anh–Anh | Không thấy lỗi trong phần nhìn thấy; “favourite” dùng chính tả Anh–Anh và “set-up” phù hợp danh từ. Không suy ra chất lượng chính tả của lời giải/bài mẫu đã bị loại khỏi stripped. |
| 11. Không diễn đạt lại định nghĩa nối trong bài đọc/lời thoại | Không thấy hai bài nghe hoặc hai bài đọc diễn đạt lại định nghĩa của Bricks and clicks, Threaded view, Archiving, Speech-to-text hay Privacy. |
| 12. T/F có bằng chứng rõ | Đạt cả 5 câu: R26 văn bản nói phần lớn sinh viên trả tiền mặt hai năm trước; R27 nói thanh toán điện thoại đang tăng; R28 hàng đợi ngắn hơn; R29 một số nhân viên lớn tuổi vẫn thích tiền mặt; R30 giữ một quầy tiền mặt mở. Không cần suy luận ngoài văn bản. |
| 13. Nêu cấu trúc/chức năng ngay trong đề người học thấy | Đạt với W-EMAIL, từng câu S1, prompt S2 và S3, không chỉ dựa vào targetGrammar/requiredGrammar. Không áp dụng cho W31–W35 theo thống nhất Anh → Việt. |
| 14. Speaking làm được bằng lời nói | Đạt: hỏi đáp, giải nghĩa bằng called/which means/is, tin nhắn thoại và thuyết phục bằng điều kiện loại 2; không yêu cầu thể hiện dấu ngoặc hoặc trình bày chữ viết. |
| 15. sourceNotes nội bộ, không chép đáp án | Không có trường sourceNotes hoặc trường đáp án/bài mẫu nào trong stripped. Nội dung sourceNotes gốc: CHƯA KIỂM, không suy ra đạt từ việc trường đã bị xoá. |

## Kiểm tra bổ sung và bằng chứng

- Listening A: 195 từ; B: 152 từ, chỉ đếm text, không tính tên người nói. Cả hai nằm trong 150–250 từ và mỗi phần có 5 câu.
- Metadata: unit = 6, testId = B, source = ai, phù hợp plan mục 5b.
- Có đúng 40 ID tự chấm duy nhất, trùng tập ID trong bản mù; các MCQ có đủ A–D; matching có 5 câu và 6 định nghĩa; Writing có 5 câu dịch; Speaking có 3 phần, S1 có 3 câu hỏi.
- Bản mù có đủ 40 câu trả lời; L6–L10 đều không quá 3 từ. Chưa kiểm acceptedAnswers có chấp nhận các biến thể tương đương như “1200”/“twelve hundred” và “6”/“six”; các trường này không có trong đầu vào.
- Quét đệ quy xác nhận không có sourceNotes, answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer hoặc sampleAnswer trong stripped.
- Kiểm bằng Python 3 đọc đúng hai JSON stripped/blind, đếm từ bằng `split()`, kiểm ID/phương án/trường bị cấm bằng assertions và quét gốc thuật ngữ; tất cả assertions cấu trúc trên PASS. Đây là kiểm tra cấu trúc và rà nội dung bản stripped, không phải kết quả `scripts/validate-exams.ts` hay `scripts/compare-blind.ts`.
- Không kiểm TTS/audio runtime, giao diện, barem AI, bài mẫu hoặc đáp án gốc; không merge/push. Đối chiếu đáp án, validate và quyết định AUDIT-OK thuộc et-lead. Các câu viết lại cần phiên auditor mới theo PROTOCOL mục 5.
