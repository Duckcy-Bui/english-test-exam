# Giải mù lại một phần BC1 — et-auditor

Thời gian kiểm tra: `2026-10-14 22:01:01 +07 (+0700)` (đầu ra `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`).

Nhánh: `audit/reblind-bc1`. Solver: `et-auditor — GPT-6`.

Phạm vi: **1B: R11; 5C: R17, R18, R19; 1C: R12, R13, R17, R20**. Các phần còn lại của bản stripped chỉ dùng làm bối cảnh đối chiếu lộ đáp án/lặp tình huống; không giải hoặc cấp lại kết luận audit cho các câu đó. Quy tắc áp dụng: brief et-auditor, exam-format mục 3–4, PROTOCOL mục 5 và 8. Không mở exam-format mục 2, dữ liệu `data/units/*.json` hoặc nhánh khác.

Ba file đáp án đã được commit **trước bước kiểm đặc tả** tại `f5abf8a5e8e4937b8a25a54400680805a19d4fdf`. Mỗi file giữ nguyên khung 40 câu của template; chỉ điền câu được giao, tổng 8 đáp án và 112 ô trống. Không sửa đáp án đã niêm phong trong bước 2.

## Kết quả từng câu

| Đề – câu | Giải mù | Một đáp án phù hợp trong ngữ cảnh | Nhiễu / dạng từ | Đối chiếu tình huống hai bài đọc cùng đề | Kết quả trong phạm vi |
|---|---|---|---|---|---|
| 1B – R11 | B | Lời từ chối phù hợp với chưa đủ tiền; A/C đồng ý, D sai ngữ pháp | Câu ngữ pháp, được phép khác dạng | Không trùng: mua máy chủ bị hoãn vì ngân sách khác hỗ trợ khách sạn và quy tắc làm việc tại nhà | Không phát hiện lỗi |
| 5C – R17 | A | 2-D có hai chiều; 3-D có chiều sâu; HD/4K chỉ độ phân giải | Bốn nhãn viết tắt ngắn, dùng như thuộc tính hình ảnh; không coi khác lĩnh vực đo là lỗi từ loại | Không trùng mua/thuê laptop hoặc mua màn hình | Không phát hiện lỗi |
| 5C – R18 | B | Cụm memory card phù hợp tháo thẻ khỏi máy ảnh | plan/card/fee/set đều là danh từ ngắn | Không có thao tác chuyển thẻ nhớ trong hai bài đọc | Không phát hiện lỗi |
| 5C – R19 | C | phone plan là gói gồm dữ liệu và cuộc gọi, có giá hàng tháng | holder/set/plan/fee đều là danh từ một từ, độ dài 3–6 chữ cái | Không trùng tình huống hai bài đọc | CHẶN về gợi ý định nghĩa; NÊN SỬA về trùng bối cảnh Speaking |
| 1C – R12 | A | Shall I show… là lời đề nghị giúp đỡ; ba dạng còn lại không đúng cấu trúc | Câu ngữ pháp, được phép khác dạng | Hướng dẫn dùng máy in mới khác sửa máy in trong tuyển dụng Orbis và hạn mức in ở The Hub | Không phát hiện lỗi |
| 1C – R13 | B | install a program on a computer diễn đạt thao tác chuẩn bị sử dụng chương trình | attend/install/diagnose/maintain đều là động từ nguyên mẫu, dài 6–8 chữ cái | Không có tình huống cài chương trình trong hai bài đọc | Không phát hiện lỗi |
| 1C – R17 | A | data phù hợp lưu trữ; ba danh từ đếm được số ít còn lại không phù hợp sau all và ngữ cảnh | data/agenda/network/product đều là danh từ, dài 4–7 chữ cái; khác tính đếm được không phải khác từ loại | Không có quy định lưu dữ liệu khách hàng trên máy chủ thay USB trong hai bài đọc | CHẶN theo quy tắc từ khóa định nghĩa; NÊN SỬA về trùng bối cảnh Listening |
| 1C – R20 | D | check my email phù hợp hoạt động hằng ngày | attend/install/design/check đều là động từ nguyên mẫu, dài 5–7 chữ cái | Kiểm tra thư khác kiểm tra thiết bị/mạng; không trùng tình huống hai bài đọc | Không phát hiện lỗi |

Không phát hiện trường hợp có hai đáp án hợp lý trong ngữ cảnh trực tiếp của 8 câu. Đây là kết quả giải độc lập, **chưa so với khóa của tác giả**.

## Các lỗi và đề xuất

Mỗi dòng dưới đây là một phát hiện gắn với câu thuộc phạm vi được giao.

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| 5C:R19 | CHẶN | Quy tắc 2: `20 GB of data … a month` đưa ví dụ cụ thể của hạn mức dữ liệu theo tháng, gợi lại R2 `Monthly bandwidth` và định nghĩa F: `The amount of information that you are allowed to transfer through a connection in one month.` Không cần lặp nguyên thuật ngữ vẫn có gợi ý nội dung định nghĩa. | Giữ mục tiêu từ vựng `plan` nhưng chuyển sang kế hoạch công việc/dự án; bỏ hạn mức truyền dữ liệu và chu kỳ tháng, chọn các danh từ nhiễu cùng loại và chỉ một đáp án hợp lý. |
| 1C:R17 | CHẶN | Quy tắc 2: đáp án `data` trùng nguyên từ khóa nội dung trong định nghĩa B của phần nối: `A large amount of data stored in a computer system so that you can find and use it easily.` B là định nghĩa dư, không phải định nghĩa của một thuật ngữ R1–R5; vẫn thuộc bộ định nghĩa A–F. Phát hiện này áp dụng đúng cách viết hiện tại của quy tắc 2, không khẳng định câu đã tiết lộ một cặp nối đúng. | Đổi từ vựng mục tiêu và tình huống sang nội dung không dùng từ khóa bộ định nghĩa A–F; đối chiếu cả định nghĩa dư trước khi gửi giải mù lại. |
| 5C:R19 | NÊN SỬA | Quy tắc 3: dù không trùng bài đọc, câu về gói điện thoại trả phí hàng tháng lặp bối cảnh S1 câu 2: `How much do you usually pay for your mobile phone plan or home internet each month?` Đây là trùng tình huống giữa kỹ năng, không tính là lộ đáp án chéo theo ngoại lệ của quy tắc 2. | Khi viết lại R19, dùng tình huống kế hoạch công việc/dự án như trên để đồng thời tránh trùng bối cảnh. |
| 1C:R17 | NÊN SỬA | Quy tắc 3: dù không trùng bài đọc, yêu cầu dùng máy chủ công ty thay USB gần như lặp Listening B: `You mustn't use your own USB sticks on company computers any more. If you need to move files, please use the shared drive instead.` Cả hai cùng dùng quy định ổ lưu trữ công ty thay USB cá nhân; mức độ trùng giữa kỹ năng cần et-lead cân nhắc. | Chọn tình huống khác quy định lưu/chuyển tệp; không chỉ thay server bằng shared drive hoặc đổi loại khách hàng. |

## Đối chiếu đủ 15 quy tắc, giới hạn ở phần được giao

| Quy tắc | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án | ĐẠT trong phạm vi | Giải độc lập 8 câu ở bảng trên; chưa đối chiếu tác giả. |
| 2. Không lộ thuật ngữ/từ khóa định nghĩa | CHẶN | 5C:R19 gợi định nghĩa F; 1C:R17 trùng từ khóa định nghĩa B dư. Không phát hiện thuật ngữ nối R1–R5 nguyên văn trong 8 câu và lựa chọn của chúng. |
| 3. Không lặp tình huống | ĐẠT với hai bài đọc; NÊN SỬA với bối cảnh kỹ năng khác | Đối chiếu hai bài đọc của từng đề và ngữ cảnh stripped còn lại; hai điểm cần sửa nêu trên. Không coi chỉ cùng nhắc laptop/printer hoặc cùng cấu trúc ngữ pháp là lặp tình huống. |
| 4. Nhiễu cùng từ loại, độ dài tương đương | ĐẠT trong phạm vi | Sáu câu từ vựng đã đối chiếu từng nhóm lựa chọn; hai câu ngữ pháp áp dụng ngoại lệ cho phép trộn dạng. |
| 5. Đúng ngữ pháp/từ vựng Unit, có nguồn | ĐẠT phần ngữ pháp; CHƯA KIỂM nguồn từ vựng | 1B:R11 và 1C:R12 khớp chức năng/grammarFocus có sẵn trong stripped. Sáu câu còn lại kiểm từ vựng; bản stripped không có nguồn trang/Workbook để xác nhận xuất xứ. Không suy ra đã đạt nguồn chỉ vì thuộc chủ đề IT. |
| 6. Độ dài/tính mới hai bài đọc | NGOÀI PHẠM VI | Chỉ dùng bài đọc để đối chiếu 8 câu, không tái audit số từ hoặc tính nguyên bản. |
| 7. Câu dịch theo Unit, không trùng | NGOÀI PHẠM VI | Không có W31–W35 được giao. |
| 8. Email 5–7 gợi ý, đúng chủ đề | NGOÀI PHẠM VI | Không có email được giao. |
| 9. Writing/Speaking buộc dùng ngữ pháp | NGOÀI PHẠM VI | Không cấp lại kết luận cho Writing/Speaking. |
| 10. Chính tả Anh–Anh | ĐẠT trong phạm vi | Không phát hiện chính tả Mỹ không phù hợp trong 8 câu/lựa chọn. `program` ở 1C:R13 là chương trình máy tính, phù hợp cách dùng Anh–Anh. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa | NGOÀI PHẠM VI trực tiếp | Không có bài đọc/lời thoại sửa đổi được giao. Kiểm gợi ý định nghĩa trong các câu MCQ thuộc phạm vi theo quy tắc 2; không biến kết quả này thành kết luận cho toàn bộ bài đọc/lời thoại. |
| 12. T/F được xác nhận/phủ định rõ | NGOÀI PHẠM VI | Không có câu T/F được giao. |
| 13. Yêu cầu ngữ pháp hiển thị trong email/Speaking | NGOÀI PHẠM VI | Không có đề email/Speaking được giao. |
| 14. Speaking làm được bằng lời nói | NGOÀI PHẠM VI | Không có câu Speaking được giao. |
| 15. sourceNotes nội bộ, không chép đáp án | ĐẠT việc loại trường; CHƯA KIỂM nội dung gốc | Kiểm đệ quy xác nhận ba stripped không có sourceNotes, answerKey, acceptedAnswers, explanation. Không đọc dữ liệu gốc nên không kết luận nội dung sourceNotes gốc đạt. |

## Kiểm tra và provenance

- `python3` kiểm JSON/template/phạm vi: PASS cả ba file; giữ nguyên các khóa cấp cao, unit/test và 40 mã câu; chỉ 8 ô chỉ định có đáp án A–D, 112 ô còn lại trống; notes chỉ chứa câu được giao.
- `python3` kiểm câu đầu vào: PASS; đủ 8 mã câu, mỗi câu có đúng bốn lựa chọn với ID A/B/C/D, đáp án mù thuộc lựa chọn hiện có.
- `python3` kiểm đệ quy các trường bị loại: PASS; không có answerKey, acceptedAnswers, explanation hoặc sourceNotes trong ba bản stripped.
- Kiểm nội dung thủ công: tính duy nhất, 6 nhóm nhiễu từ vựng, thuật ngữ/định nghĩa A–F, hai bài đọc mỗi đề và bối cảnh còn lại để đối chiếu lặp tình huống. Các kết luận ngôn ngữ không phải kết quả của script.
- Không chạy compare-blind hoặc validate-exams trên dữ liệu tác giả; đó là bước của et-lead. Không merge, không push, không cấp AUDIT-OK.

SHA-256 đầu vào:

```text
4064576635e2079759866bd8dc3a3ac8bc63aa5b84d404c2c2621add30613260  audit/unit-1-B.stripped.json
9541b63ccb3e47340f90cc0604946ceea56eca4e1fff23e5acd2ed15ef2bcd30  audit/unit-5-C.stripped.json
c8a8214d1a9d8476b9d62aa2deea44065f8e668b8ce9de1becedd09b65aba0cb  audit/unit-1-C.stripped.json
dbba7cdc26de3d826091e6d4e1e82260a82704719516e4aa511ef371e13a9b79  audit/unit-1-B.blind.template.json
4c3b40c86f01ddb3a11f3d6fc21bce15c905e7a89c19a664f0147e36d6508424  audit/unit-5-C.blind.template.json
3e3c9bfa4021c68f0e16501a57912fdb0c47e652e811f5fa10988ef71c67c641  audit/unit-1-C.blind.template.json
```

**Nhãn đề nghị: CẦN SỬA** — 2 phát hiện CHẶN, 2 phát hiện NÊN SỬA, tập trung vào 5C:R19 và 1C:R17. Sáu câu còn lại không phát hiện lỗi trong phạm vi đã kiểm; không tương đương AUDIT-OK cho bất kỳ đề nào. et-lead so đáp án đã commit, xử lý các phát hiện và quyết định bước tiếp theo.
