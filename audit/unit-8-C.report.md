# Báo cáo kiểm định mù — Unit 8, Test C (8C)

- Auditor: et-auditor; định danh solver theo brief: `et-auditor — gpt-6-astra`.
- Nhánh: `audit/unit-8-C`.
- Thời gian: 2026-10-14 22:45:59 +07 (+0700), lấy từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`.
- Đáp án mù đã commit **trước bước kiểm định này**: `8b197690201386369f6f5e50f626c5a87022b4b0`.
- Phạm vi: `audit/unit-8-C.stripped.json`, template và đáp án mù; brief; `docs/exam-format.md` chỉ mục 3–4; `docs/PROTOCOL.md` mục 5, 8; `docs/plan.md` mục 5b; `docs/source-materials.md`; `src/types/exam.ts`.
- Không đọc nội dung mục 2 của exam-format, không đọc `data/units/*.json`, không truy cập nhánh `content/*`, không xem đề khác.

## Kết quả

Đã giải đủ 40 câu L1–L10, R1–R30. Chưa thấy câu có từ hai đáp án hợp lý; `notes` để trống. Đây là kết quả giải độc lập, **chưa đối chiếu đáp án tác giả**. Không phát hiện lỗi CHẶN trong phạm vi bản stripped; có 1 điểm NÊN SỬA về chất lượng kiểm tra Listening. Nhãn đề nghị: **CẦN SỬA** (khuyến nghị bên dưới). Auditor không tự cấp `AUDIT-OK`.

## Danh sách vấn đề

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| L1 / Listening A.context | NÊN SỬA | Context ghi “a projector that keeps switching itself off”, trùng trực tiếp nội dung phương án B của L1: “It keeps switching itself off.” Người học đọc phần giới thiệu đã trả lời được L1 mà không cần nghe. Đây là khuyến nghị chất lượng Listening trong bước kiểm lộ, không quy thành vi phạm quy tắc 2 vốn xét câu nối R1–R5. | Đổi context thành “Leah and Sam, two IT technicians at a college, discuss a problem with classroom equipment.” Giữ thông tin về triệu chứng trong lời thoại. |

## Đối chiếu đủ 15 quy tắc

| Quy tắc | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án đúng | ĐẠT theo giải mù | 25 MCQ (5 Listening, 20 Reading) đều có một phương án phù hợp ngữ cảnh; 5 cặp nối độc lập rõ ràng. L6–L10 đều có câu trả lời trực tiếp, không quá 3 từ. Chưa chạy đối chiếu với khóa tác giả. |
| 2. Không lộ từ câu nối sang R6–R30 | Không phát hiện vi phạm | Không có nguyên cụm của 5 thuật ngữ trong R6–R30; đã đọc thêm nội dung để kiểm diễn đạt tương đương. R9 nói cáp hình ảnh có thể hỏng nhưng không giải nghĩa thuật ngữ connection error; bài Huy nhắc bằng cấp và kế hoạch nhưng không định nghĩa further qualification hay organisational skill. Không coi mọi tình huống cáp hỏng, từ “plan”, “degree”, “problem” hoặc “accidents” là lộ cặp nối. W31/W32/W35 có thuật ngữ câu nối nhưng thuộc kỹ năng sau, được miễn theo quy tắc thi tuần tự. |
| 3. Không lặp tình huống | Không phát hiện lặp nguyên tình huống | Nghe A: máy chiếu tự tắt; nghe B: cập nhật mật khẩu email; đọc MCQ: Huy tìm việc và phát triển game; đọc T/F: đổ đồ uống lên laptop; email: màn hình thứ hai không có hình; S2: máy in có vệt xám; S3: chia sẻ kinh nghiệm với học sinh trường cũ. Các câu ngắn cùng chủ đề sửa lỗi hoặc kế hoạch nghề nghiệp không tự động là cùng một sự cố/tình huống. S1.3 hỏi ngắn về nghề mong muốn, S3 thêm vai trò người nói, người nghe và kinh nghiệm đã làm. |
| 4. Nhiễu từ vựng cùng từ loại, độ dài tương đương | ĐẠT | R13/R18 dùng các dạng động từ quá khứ/phân từ; R17/R20 dùng động từ nguyên mẫu; R14–R16/R19 dùng danh từ. Các phương án đều một từ, không có đáp án dài nổi bật. Không áp quy tắc này cho R6–R12. |
| 5. Đúng từ vựng/ngữ pháp Unit | ĐẠT về nội dung; nguồn từng từ CHƯA KIỂM | R6–R7: quá khứ đơn/hiện tại hoàn thành, yet; R8–R9: phỏng đoán; R10–R11: should, try + danh từ; R12: hope + to V. R13–R20 phù hợp các chủ đề sự cố, giải pháp, sức khoẻ nơi làm việc và việc làm. Chưa xác minh từng từ với Workbook/Pearson và trang nguồn; sourceNotes bị loại khỏi bản stripped. |
| 6. Độ dài và bài đọc viết mới | ĐẠT độ dài; xuất xứ CHƯA KIỂM | MCQ 234 từ (230–270); T/F 163 từ (160–200). Đếm tách theo khoảng trắng, không tính tiêu đề. Không có đủ bằng chứng trong stripped để chứng nhận xuất xứ viết mới. Trùng bài đọc giữa các đề cùng Unit thuộc validate của et-lead, không kiểm đề khác. |
| 7. Câu dịch theo Unit, không trùng giữa các Unit | ĐẠT nội dung; trùng liên Unit CHƯA KIỂM | W31: issue tracking; W32: connection error/might; W33: already; W34: if/should/try; W35: organisational skills/hope to. Không đọc các Unit khác. Câu dịch cùng chủ đề Reading không tính lộ theo thống nhất thi tuần tự. |
| 8. Email 5–7 gợi ý, đúng chủ đề | ĐẠT | Có 7 gạch đầu dòng, hướng dẫn khắc phục màn hình thứ hai; wordRange 80–100, loại bốn dòng đầu thư khỏi số từ; yêu cầu đủ khung email hướng dẫn. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | ĐẠT | Email bắt buộc already/yet, phỏng đoán may/might/could và should hoặc try + -ing. S1 hỏi điều đã thử, nguyên nhân có thể và kế hoạch nghề nghiệp; S2 bắt buộc các động từ phỏng đoán; S3 bắt buộc hiện tại hoàn thành và cấu trúc kế hoạch. Câu dịch có các cấu trúc/thuật ngữ của Unit để kiểm hiểu. |
| 10. Anh–Anh | Không phát hiện lỗi | Có metre, licence, organisational; “program” dùng cho phần mềm là phù hợp. “Burned” là biến thể dùng được, không bắt buộc thay bằng “burnt”. |
| 11. Không diễn đạt lại định nghĩa nối trong bài đọc/lời thoại | Không phát hiện vi phạm | Không bài nào mô tả phần mềm quản lý danh sách lỗi người dùng báo, định nghĩa lỗi kết nối, tai nạn vấp/ngã, năng lực tổ chức hay bằng cấp theo định nghĩa D. Sự cố đồ uống đổ không phải vấp/ngã; Huy lập kế hoạch không phải lời giải nghĩa organisational skill. |
| 12. T/F phải có căn cứ rõ | ĐẠT | R26 F: “You shouldn't wait to save your work”; R27 T: “turn the laptop upside down”; R28 F: “You shouldn't use a hairdryer”; R29 T: “at least forty-eight hours”; R30 F: “Sweet drinks such as cola are more dangerous than water”. Không câu nào cần tự suy diễn từ thông tin thiếu. |
| 13. Nêu ngữ pháp ngay trong đề bài nhìn thấy | ĐẠT | Email.task ghi rõ các cấu trúc; cả ba câu hỏi S1 đều có “Use…”/“using…”; prompt S2 liệt kê may/might/could/must/can't; prompt S3 yêu cầu hiện tại hoàn thành và plan/intend/hope/expect + to V. Không dựa riêng vào targetGrammar/requiredGrammar. Không áp cho dịch Anh→Việt. |
| 14. Speaking làm được bằng lời nói | ĐẠT | Các yêu cầu đều là kể, phỏng đoán, nêu kế hoạch và đề xuất; không cần thao tác viết hay dấu câu. S1 45 giây/câu; S2/S3 90 giây/phần. |
| 15. sourceNotes không chứa đáp án | CHƯA KIỂM nội dung gốc | sourceNotes không có trong bản stripped như thiết kế. Đã kiểm đệ quy không còn sourceNotes, answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer, sampleAnswer. Et-lead kiểm nội dung sourceNotes trên bản tác giả. |

## Kiểm tra đã chạy

- `python3` đọc JSON, kiểm bằng assertion: định danh 8C/ai; 40 đáp án đúng tập ID và không rỗng; 4 phương án A–D cho mỗi MCQ; miền giá trị chữ cái/T/F; L6–L10 tối đa 3 từ; số câu từng phần; 5 câu dịch, 7 gợi ý email, 3 phần Speaking; không có trường đáp án bị cấm trong stripped → PASS.
- Đếm từ bằng `len(text.split())`: Listening A **170**, B **162**, đều trong 150–250; Reading MCQ **234**, T/F **163**, đều đúng giới hạn → PASS.
- Quét nguyên cụm thuật ngữ nối trong R6–R30 → không có; đọc thủ công tiếp để đánh giá nội dung tương đương, không lấy kết quả tìm nguyên cụm làm bằng chứng duy nhất.
- Đọc thủ công toàn bộ 15 quy tắc, lời thoại, phương án, hai bài đọc, Writing và Speaking → kết quả theo bảng.
- `git commit -m 'audit(8C): commit independent blind answers'` → `8b197690201386369f6f5e50f626c5a87022b4b0`, chỉ thêm file đáp án mù trước báo cáo.
- Không chạy `scripts/compare-blind.ts` hoặc `scripts/validate-exams.ts`: et-lead thực hiện trên bản tác giả và quyết định nhãn cuối.

## Dấu vết đầu vào

SHA-256:

```text
a867e26894a98087965f414356443e20ef626cc45c99fc2f3906d8d773ff60d9  audit/unit-8-C.stripped.json
e4ff4a12131c90315cb3657e45a2ddd825561598abbeb7abfd509d6c66c829b5  audit/unit-8-C.blind.template.json
5081aa838cbcc11d9dcdb1463fd8830db7dd42f3003a2c1b7b7abd09d3e8bc93  audit/unit-8-C.blind.json
```

Bàn giao et-lead: đối chiếu 40 đáp án, cân nhắc sửa context L1, chạy validate và kiểm các mục chưa thể xác minh từ bản stripped. Nếu có câu phải viết lại do bất đồng đáp án, giải lại bằng phiên auditor mới theo PROTOCOL mục 5.
