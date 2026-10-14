# Kiểm định đề 1B — Unit 1, Test B

- Agent / solver: et-auditor — gpt-6-astra.
- Nhánh: `audit/unit-1-B`.
- Thời gian: 2026-10-14 21:43:05 +07 (+0700) (lấy từ `date`).
- Đầu vào duy nhất để giải: `audit/unit-1-B.stripped.json`; khuôn đáp án: `audit/unit-1-B.blind.template.json`.
- SHA-256 bản stripped: `215b0ebd7eb87f20b1bc22bf9661b00372b69e07d186cc358455e01b6a0f0a1c`.
- Đáp án mù: `audit/unit-1-B.blind.json`, đã commit riêng tại `78d2ae4` trước bước kiểm định này. Đủ L1–L10 và R1–R30; L6–L10 đều không quá 3 từ.
- Tài liệu đã đọc: brief et-auditor; `docs/exam-format.md` chỉ mục 3–4; `docs/PROTOCOL.md` chỉ mục 5 và 8; `docs/plan.md` chỉ mục 5b; `docs/source-materials.md`; `src/types/exam.ts`. Sau commit giải mù, đối chiếu thêm Workbook Part 1 Unit 1, trang 6–9, để kiểm nguồn từ vựng.
- Không đọc mục 2 của exam-format, không đọc `data/units/*.json`, không truy cập nhánh `content/*`, không đọc đề khác. Chỉ ghi đầu ra trong `audit/`; không merge hoặc push.

## Kết quả và lỗi

Nhãn đề nghị: **AMBIGUOUS** do một câu có hai phản hồi hợp lý về nghĩa. Đây là nhận định độc lập từ bản stripped, không phải kết quả so đáp án với et-author. Không tự cấp `AUDIT-OK`.

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| R11 | CHẶN | Quy tắc 1: đã chọn B, “I'm afraid not”, vì trực tiếp từ chối mua server trong tháng này. Tuy nhiên C, “That's a great idea”, vẫn là phản hồi hợp lý: người nói tán thành ý tưởng mua server rồi nêu trở ngại “We don't have enough money until June”, ngầm hoãn thời điểm. Câu sau chưa bắt buộc lời mở đầu phải là lời từ chối. Cách hiểu này đã được ghi trong notes trước commit giải mù. | Viết lại câu hoặc phương án C để thể hiện rõ việc đồng ý mua ngay trong tháng này, trái với mốc ngân sách; chẳng hạn “Yes, let's buy it this month”. Giữ một phản hồi duy nhất phù hợp cả ngữ pháp lẫn ngữ cảnh. Không chỉ đổi đáp án cho khớp; câu viết lại cần phiên auditor mới theo PROTOCOL 5. |

Không ghi thêm lỗi chỉ vì cùng chủ đề IT hoặc cùng cấu trúc ngữ pháp. Các biến thể trả lời ngắn được ghi trong notes để et-lead kiểm danh sách acceptedAnswers; chưa kết luận danh sách của tác giả thiếu biến thể.

## Đối chiếu đủ 15 quy tắc

| Quy tắc | Kết quả trên phạm vi được phép đọc |
|---|---|
| 1. Một đáp án đúng | **CHẶN: R11** như bảng lỗi. Các câu MCQ còn lại có một phương án phù hợp trong ngữ cảnh; nối R1–R5 phân biệt được năm thuật ngữ và một định nghĩa thừa. |
| 2. Không lộ đáp án chéo | Không phát hiện thuật ngữ hoặc cụm định nghĩa đặc trưng R1–R5 dùng để gợi đáp án ở R6–R30. Tìm nguyên cụm cả năm thuật ngữ đều không có kết quả; đã đọc ngữ nghĩa bổ sung, không chỉ dựa vào tìm chuỗi. Từ phổ thông như company, product, computer xuất hiện lại nhưng không đủ khôi phục quan hệ thuật ngữ–định nghĩa. Không tính tương đồng giữa các kỹ năng thi tuần tự là lộ. |
| 3. Không lặp tình huống | Không phát hiện tình huống hoàn chỉnh bị dùng lại: hội chợ công nghệ; hướng dẫn tuần làm việc của helpdesk trường cao đẳng; công ty hỗ trợ khách sạn; nội quy làm việc tại nhà; đóng cửa phòng máy; hỏi nghề nghiệp, đề xuất tiệc, giới thiệu công ty và nội quy phòng server. Cùng chức năng họp/nội quy hoặc cùng chủ đề IT không tự động là cùng tình huống. |
| 4. Nhiễu từ vựng | R13–R16 dùng danh từ/cụm danh từ; R17–R19 dùng động từ/cụm động từ; R20 dùng tính từ. Độ dài tương đương về hình thức, không có phương án dài thành câu nổi bật; “carry out” là cụm động từ ngắn. Không áp quy tắc này cho R6–R12 hoặc câu đọc hiểu/nghe. |
| 5. Đúng ngữ pháp và từ vựng Unit | R6 vị trí trạng từ tần suất; R7 hỏi tần suất; R8 câu hỏi hiện tại đơn; R9–R10 nghĩa vụ/cấm; R11 phản hồi đề xuất; R12 How about + -ing. Từ mục tiêu R13–R20 đều có trong Workbook Part 1 Unit 1 (bảng trang bên dưới). Không cần mở sourceNotes để xác nhận nguồn của tám từ này. |
| 6. Bài đọc đúng độ dài, viết mới | R21–R25: 239 từ, đạt 230–270; R26–R30: 167 từ, đạt 160–200. Đếm phần paragraphs, không tính tiêu đề. **CHƯA KIỂM** tính nguyên tác bằng đối sánh toàn bộ giáo trình/nguồn khác. Trùng bài đọc giữa các đề cùng Unit do validate của et-lead kiểm theo phân công. |
| 7. Câu dịch | W31 tần suất; W32 câu hỏi hiện tại đơn; W33 don't have to / must; W34 mô tả hoạt động doanh nghiệp; W35 What about + -ing. Đều phù hợp Unit 1. **CHƯA KIỂM** trùng câu giữa các Unit vì không đọc đề khác. Dịch trùng chủ đề Reading không tính là lộ đáp án. |
| 8. Email | Có 7 gạch đầu dòng, hướng dẫn Kate đóng phòng máy; phù hợp nội quy IT, giới hạn 80–100 từ và khung email đầy đủ được nêu trong đề. |
| 9. Writing/Speaking buộc dùng trọng tâm | Email bắt buộc ít nhất hai trạng từ/cụm tần suất và hai cấu trúc nội quy hoặc mệnh lệnh. S1 lần lượt yêu cầu tần suất, câu hỏi hiện tại đơn, đề xuất; S2 hiện tại đơn + tần suất; S3 các cấu trúc nội quy + ít nhất hai mệnh lệnh. Các câu dịch cũng mang ngữ pháp/chức năng Unit. |
| 10. Anh–Anh | Không phát hiện lỗi chính tả Anh–Anh trong bản stripped; có organise, centre, fortnight, holiday. Không đánh giá bài mẫu/giải thích đã bị loại khỏi đầu vào. |
| 11. Không diễn đạt lại định nghĩa nối | Không phát hiện hai bài đọc hoặc hai lời thoại diễn đạt lại định nghĩa của database administrator, supplier, launch, videoconference hoặc maintain. Công ty Kestrel cung cấp hỗ trợ, chọn và thiết lập thiết bị; đoạn đó không gắn nhãn supplier với định nghĩa của R2. Không có mô tả bảo dưỡng máy bằng kiểm tra/sửa chữa định kỳ như R5. |
| 12. T/F có chứng cứ trực tiếp | Cả năm câu có chứng cứ khẳng định/phủ định rõ ràng, chi tiết ở bảng dưới. Không phải suy ra từ thông tin bị thiếu. |
| 13. Yêu cầu ngữ pháp hiện rõ | Đạt: task email, từng câu S1, prompt S2 và prompt S3 đều nêu rõ cấu trúc/chức năng cần dùng. Không chỉ ghi trong targetGrammar/requiredGrammar. Không áp quy tắc 13 cho W31–W35 Anh→Việt theo thống nhất. |
| 14. Speaking làm được bằng lời | Đạt: hỏi, đề xuất, mô tả và hướng dẫn nội quy đều nói được; không bắt buộc ký hiệu hay thao tác viết. Các dấu ngoặc trong đề chỉ minh hoạ mẫu ngôn ngữ. |
| 15. sourceNotes | Quét đệ quy xác nhận không còn sourceNotes hoặc các trường đáp án/bài mẫu trong stripped. **CHƯA KIỂM** nội dung sourceNotes gốc có chép đáp án hay không, vì trường này đã bị xoá và không được đọc bản đầy đủ. |

### Nguồn từ vựng R13–R20

Đối chiếu sau khi commit giải mù bằng `pdftotext -f 6 -l 9 -layout '/home/duckcy/Downloads/Workbook for Students.pdf' -`.

| Câu | Từ mục tiêu | Workbook Part 1 Unit 1, trang in |
|---|---|---|
| R13 | agenda | 9, Lesson 1D |
| R14 | developer | 6, Lesson 1A |
| R15 | production facility | 7, Lesson 1B |
| R16 | character | 8, Lesson 1C |
| R17 | attend meetings | 7, Lesson 1A |
| R18 | download | 9, Lesson 1C |
| R19 | carry out | 7, Lesson 1B |
| R20 | personal | 9, Lesson 1C |

### Chứng cứ True/False

| Câu | Đáp án mù | Chứng cứ trực tiếp trong bài |
|---|---|---|
| R26 | F | “two days a week”, trái với “three days a week”. |
| R27 | T | “connect ... through the VPN before you open any work files”. |
| R28 | F | “Family members and friends mustn't use it, even for a few minutes.” |
| R29 | F | “You can use your own printer at home”. |
| R30 | T | “Outside these hours, send an email, and a technician will reply the next morning.” |

## Kiểm tra đã chạy và giới hạn

- `python3` kiểm JSON/đáp án trước commit: PASS, đủ 40 ID và định dạng; L6–L10 không quá 3 từ.
- `python3` kiểm cấu trúc bản stripped sau commit: PASS, Listening 5 MCQ + 5 short; Reading 5 nối/6 định nghĩa + 7 ngữ pháp + 8 từ vựng + 5 đọc hiểu + 5 T/F; mọi MCQ có A–D; Writing có 5 câu dịch, 7 gợi ý email, wordRange [80,100]; Speaking có S1–S3, ba câu hỏi S1.
- `python3` đếm từ bằng tách khoảng trắng, cùng quy ước countWords trong schema: Listening A **192**, Listening B **181**, Reading MCQ **239**, Reading T/F **167**; tất cả trong giới hạn.
- `python3` quét đệ quy các trường sourceNotes, answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer, sampleAnswer: **0 trường** còn lại.
- `python3` tìm nguyên cụm năm thuật ngữ nối trong R6–R30: **0 lượt**; kiểm ngữ nghĩa thủ công bổ sung theo quy tắc 2 và 11.
- `git show --stat --oneline HEAD` sau bước 1: `78d2ae4` chỉ chứa file blind; giữ nguyên hai đầu vào chưa được git theo dõi.
- Chưa chạy `scripts/compare-blind.ts` hoặc `scripts/validate-exams.ts`: et-lead thực hiện trên bản đầy đủ, kể cả kiểm trùng bài đọc giữa các đề cùng Unit. Không suy ra đáp án tác giả, acceptedAnswers, bài mẫu, barem AI hoặc hoạt động web/TTS từ bản stripped.

Bàn giao et-lead xem xét R11; nếu viết lại, giải mù lại câu đó trong phiên auditor mới. Các điều kiện cấp AUDIT-OK vẫn thuộc et-lead.
