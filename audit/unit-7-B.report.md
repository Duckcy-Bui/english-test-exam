# Kiểm định giải mù — Unit 7, Test B (7B)

Thời gian: 2026-10-14 22:26:41 +07 (+0700), lấy từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`.

Agent: et-auditor. Phiên chạy: Codex/GPT-6; trường `solver` giữ nhãn `et-auditor — gpt-6-astra` theo brief, không phải xác minh độc lập biến thể model của phiên.

Nhánh: `audit/unit-7-B`. Commit giải mù: `7d6f178a3102edb1dffcb357c1f7d617ff657cd6`, hoàn tất trước bước kiểm đặc tả và trước tra từ điển. Bản giải mù giữ nguyên sau commit.

Đầu vào: `audit/unit-7-B.stripped.json`, `audit/unit-7-B.blind.template.json`.
SHA-256 bản stripped: `70c4dee3518cbd2d9d20cce478fa01743219656c42034db1212e54db57c621fd`.

Đã đọc brief; `docs/exam-format.md` chỉ mục 3–4; `docs/PROTOCOL.md` mục 5 và 8; `docs/plan.md` mục 5b; `docs/source-materials.md`; `src/types/exam.ts`. Không đọc mục 2 của exam-format, không đọc `data/units/*.json`, không truy cập nhánh `content/*`, không đọc đề khác. Không merge/push.

Kết quả đề nghị: **AMBIGUOUS — R9, cần viết lại**. Một lỗi mức CHẶN; không phát hiện lỗi NÊN SỬA độc lập khác. Đây là đánh giá của auditor, chưa phải kết quả so với đáp án tác giả. Không tự cấp AUDIT-OK.

## Lỗi và đề xuất

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| R9 | CHẶN | Quy tắc 1: chọn A `can be downloaded` theo ý kiểm tra bị động, nhưng B `can download` có cách đọc nội động từ hợp lý với chính ứng dụng là thứ được tải xuống. Câu “The app ______ from our website or from the app store.” không có thành phần buộc chọn bị động; đã ghi nghi vấn ngay trong bản giải mù. | Thêm tác nhân rõ ràng: “The app ______ by users from our website or from the app store.” và rà lại toàn bộ phương án; hoặc thay động từ/nhiễu để chỉ còn một cách đọc đúng. Viết lại câu rồi giao phiên auditor mới giải mù; không chỉ đổi đáp án. |

Kiểm chứng bổ sung sau commit giải mù: [Collins, mục download](https://www.collinsdictionary.com/dictionary/english/download) có nghĩa nội động từ “to be transferred in this way”, ví dụ “the program takes two hours to download” trong phần Webster’s New World. Phần British English của Collins ghi ngoại động từ; [Oxford Learner’s Dictionaries](https://www.oxfordlearnersdictionaries.com/definition/english/download_1) cũng minh hoạ cấu trúc có tân ngữ. Vì vậy A là đáp án sư phạm dự kiến rất rõ; kết luận B vẫn có cách đọc hợp lý là suy luận ngôn ngữ của auditor, dựa trên nghĩa nội động từ đã được ghi nhận. Quy tắc 10 yêu cầu chính tả Anh–Anh, không nêu loại bỏ mọi cách dùng ngữ pháp được ghi nhận ở biến thể khác. Đề có thể tránh tranh luận này bằng thay đổi nhỏ ở câu dẫn như trên. Không dùng từ điển hay nguồn ngoài để sửa đáp án đã commit.

## Đối chiếu đủ 15 quy tắc

| Quy tắc | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1. Đúng một đáp án | CHẶN R9 | 40 câu đã có đáp án độc lập. Các MCQ khác và 5 câu nối chưa thấy phương án đúng thứ hai trong ngữ cảnh. Các biến thể diễn đạt cùng thông tin ở Listening B không tự động là đa đáp án về nội dung. |
| 2. Không lộ cặp nối | Không phát hiện lỗi | Năm thuật ngữ Release candidate, Pop-up menu, Search ranking, PHP, Navigation chart không xuất hiện ở R6–R30. Đọc cả ngữ cảnh không thấy gợi ý đủ đặc trưng để nối lại các định nghĩa đúng C/E/A/D/F. Các từ chung như computer, website, app, code không được tính riêng lẻ thành lộ. W31 có release candidate nhưng khác kỹ năng, thi tuần tự. |
| 3. Không lặp tình huống | Không phát hiện lỗi | Nghe A: lịch ra mắt ứng dụng chuỗi tiệm bánh; Nghe B: bãi đỗ xe; Reading MCQ: thuê xe đạp; Reading T/F: chuông cửa; email: đăng bài tin; S1: đặt phòng học, hệ thống học trực tuyến, kế hoạch bài tập; S2: website nhà hàng; S3: yêu cầu ứng dụng trung tâm ngoại ngữ. Cùng chức năng phân tích yêu cầu hoặc cảm biến điều khiển thiết bị chưa phải cùng một tình huống. |
| 4. Nhiễu từ vựng | Đạt | Chỉ xét R13–R20: R13 bốn động từ quá khứ; R14–R16 bốn động từ nguyên thể; R17–R18 bốn tính từ; R19–R20 các danh từ. Mỗi phương án một từ, độ dài tương đương, không có đáp án nổi bật do hình thức. Không áp quy tắc này cho R6–R12. |
| 5. Bám Unit | Đạt về ngữ pháp/chủ đề; CHƯA KIỂM nguồn từng từ | R6 want + O + to V; R7 have to; R8–R9 bị động; R10 make + O + V; R11 cause + O + to V; R12 be scheduled to. R13–R20 phù hợp ngữ cảnh Development. Bản stripped không có sourceNotes, chưa xác nhận từng từ nằm trong Workbook Part 1 hoặc trang giáo trình được dẫn. |
| 6. Độ dài và viết mới | Đạt độ dài; CHƯA KIỂM nguồn gốc | Reading MCQ 237 từ (230–270), T/F 163 từ (160–200). Chưa kiểm chứng độc lập việc viết mới. Trùng bài đọc giữa các đề cùng Unit do et-lead chạy validate, không đọc đề khác. |
| 7. Dịch | Đạt trong đề; CHƯA KIỂM trùng liên Unit | W31 bị động, W32 want + O + to V, W33 cause + O + to V, W34 be scheduled to, W35 have to; từ vựng phần mềm/website. Không so với đề Unit khác. |
| 8. Email | Đạt | 7 gợi ý, chủ đề xuất bản nội dung website; 80–100 từ; có khung email hướng dẫn và quy định không tính 4 dòng đầu thư. |
| 9. Ngữ pháp Writing/Speaking | Đạt | Email buộc ít nhất hai cấu trúc should/have to/need to, một câu bị động và một cấu trúc lịch trình. Câu dịch thể hiện cấu trúc Unit. S1.1 yêu cầu modal/want + O + to; S1.2 ít nhất hai câu bị động; S1.3 cấu trúc kế hoạch; S2 ít nhất bốn câu bị động; S3 modal và want + O + to ít nhất hai lần. |
| 10. Chính tả Anh–Anh | Không phát hiện lỗi | Dùng `program` đúng chính tả Anh–Anh trong ngữ cảnh máy tính; dùng colour, organised, centre, car park. Không thấy biến thể chính tả Mỹ cần sửa. |
| 11. Không diễn đạt lại định nghĩa nối | Không phát hiện lỗi | Đã đọc hai lời thoại và hai bài đọc. Lịch làm phiên bản đầu/kiểm thử ở Nghe A không định nghĩa một bản beta đủ điều kiện thành sản phẩm cuối. Không thấy mô tả pop-up menu, vị trí kết quả tìm kiếm, ngôn ngữ PHP hoặc sơ đồ điều hướng trong các đoạn này. |
| 12. True/False rõ chứng cứ | Đạt | R26 cập nhật hàng tháng: T, đoạn 1. R27 bật đèn ban ngày: F, đoạn 3 nói không bật ban ngày. R28 lưu một tháng: F, đoạn 3 ghi 14 ngày. R29 khởi động lại mỗi giờ: T, đoạn 4. R30 hơn một tuần để sửa: F, đoạn 4 ghi trong hai ngày. |
| 13. Hiện rõ yêu cầu ngữ pháp | Đạt | Yêu cầu nằm trực tiếp trong task email, từng câu S1, prompt S2 và S3; không chỉ trong targetGrammar/requiredGrammar. Không áp cho W31–W35 theo thống nhất. |
| 14. Speaking làm được bằng lời nói | Đạt | Các yêu cầu là nói câu bị động, modal, lịch trình và yêu cầu phần mềm. Dấu ngoặc trong đề chỉ minh hoạ câu nói; không bắt thí sinh đọc hay tạo dấu ngoặc. |
| 15. sourceNotes | Đạt việc loại khỏi stripped; CHƯA KIỂM nội dung gốc | Duyệt đệ quy không thấy sourceNotes hoặc các trường đáp án/lời giải. Không đọc nguồn đầy đủ nên không xác nhận sourceNotes gốc có chép đáp án hay không. |

## Kiểm tra cơ học và cấu trúc

Đã chạy Python 3 chỉ trên hai đầu vào được giao và bản giải mù: parse JSON, kiểm 40 ID theo template, giới hạn L6–L10 tối đa 3 từ, đếm từ bằng tách khoảng trắng như `countWords`, duyệt trường bị loại, tìm nguyên cụm thuật ngữ nối trong R6–R30, tính SHA-256. Đọc thủ công bổ sung để kiểm lộ bằng diễn đạt lại; tìm nguyên cụm không đủ chứng minh không lộ.

| Hạng mục | Kết quả |
|---|---|
| unit / testId / source | 7 / B / ai, đúng mục 5b |
| Bản giải mù | JSON hợp lệ; đủ 40/40 ID; L6–L10 không quá 3 từ |
| Listening A / B | 193 / 153 từ; mỗi phần 5 câu, đúng 150–250 |
| Reading | Nối 5 câu/6 định nghĩa; ngữ pháp 7; từ vựng 8; đọc MCQ 5; T/F 5 |
| Writing / Speaking | 5 câu dịch; email 7 gợi ý; Speaking 3 phần, S1 có 3 câu |
| Trường nhạy cảm trong stripped | 0: sourceNotes, answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer, sampleAnswer |
| Thuật ngữ nối nguyên cụm trong R6–R30 | 0/5 thuật ngữ xuất hiện |

L9 chọn `the app`; lời thoại đồng thời có “on their phones”. L10 chọn `11 p.m.` theo “eleven o’clock at night”. Et-lead cần đối chiếu các biến thể hợp lệ trong acceptedAnswers; auditor chưa đọc trường đó và không kết luận danh sách hiện tại thiếu biến thể.

Không chạy `scripts/compare-blind.ts` hay `scripts/validate-exams.ts`: hai gate đó thuộc et-lead và cần bản có đáp án. Chưa kiểm TTS/runtime. Et-lead tiếp nhận commit giải mù và báo cáo, xử lý R9, so đáp án rồi quyết định nhãn cuối.
