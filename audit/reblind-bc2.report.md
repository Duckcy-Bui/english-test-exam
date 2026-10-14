# Giải mù lại một phần BC2 — et-auditor

- Nhánh: `audit/reblind-bc2`.
- Thời gian: 2026-10-14 22:11:59 +07 (+0700).
- Phạm vi: **5C:R19; 6B:R6,R10,R15,R18**. Các phần khác của bản stripped chỉ được dùng làm ngữ cảnh đối chiếu; không giải hoặc cấp kết luận kiểm định cho các câu ngoài phạm vi.
- Đã commit đáp án trước khi kiểm đặc tả: `610fd21dd1cbef617468fa18197bab8e195818c9`.
- Đầu vào: hai bản stripped và hai template cùng tên. Không đọc `data/units/*.json`, đáp án tác giả, mục 2 của exam-format hoặc nhánh khác; không sửa đầu vào.
- Căn cứ: brief et-auditor (quy tắc giải mù), `docs/exam-format.md` mục 3–4 (đủ 15 quy tắc), `docs/PROTOCOL.md` mục 5 và 8; phạm vi giao việc hiện tại ưu tiên hơn phạm vi toàn đề trong brief.

## Kết quả giải mù

| Câu | Chọn | Căn cứ và tính duy nhất |
|---|---|---|
| 5C:R19 | C — plan | Kế hoạch cho biết ai làm nhiệm vụ nào và khi nào. holder/set/fee không phù hợp nghĩa. |
| 6B:R6 | B — are choosing | employees số nhiều; hiện tại tiếp diễn diễn tả xu hướng với these days, more and more. is/was sai hoà hợp; choosing thiếu trợ động từ. |
| 6B:R10 | A — wouldn't need | Không có hệ thống ở hiện tại; If we had one yêu cầu kết quả giả định loại 2. Ba phương án còn lại không phù hợp ngữ cảnh và cấu trúc này. |
| 6B:R15 | B — prefer | prefer A to B phù hợp nghĩa thích màn hình lớn hơn màn hình nhỏ; integrate/process/decrease không phù hợp cấu trúc và nghĩa. |
| 6B:R18 | B — face-to-face | meet people in person xác định gặp trực tiếp; remote/online/virtual không phù hợp. |

Không phát hiện hai đáp án hợp lý trong từng bộ lựa chọn. Đây là kết quả giải độc lập, chưa so với đáp án tác giả.

## Lỗi trong phạm vi được giao

Mỗi dòng dưới là một lỗi riêng; 3 lỗi CHẶN trên 2 câu.

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| 6B:R10 | CHẶN | Quy tắc 2: stem có **online** trong “online booking system”. Đây là từ khoá thuộc định nghĩa **đúng B** của R1 Bricks and clicks: “A business model in which a company is present both offline and online.” Không thuộc ngoại lệ từ phổ thông trong định nghĩa dư. | Viết lại tình huống điều kiện loại 2, tránh online/offline và các dấu hiệu của định nghĩa nối đúng; có thể dùng kho thiếu xe đẩy nên nhân viên phải mang hộp bằng tay. |
| 6B:R10 | CHẶN | Quy tắc 3: tình huống hệ thống đặt lịch hẹn xuất hiện lại ở bài đọc R21–R25 “New Software at Northgate Hospital”, mở đầu “a new system for booking patient appointments”. Đổi chủ thể thành customers và chuyển sang giả định chưa có hệ thống vẫn giữ cùng tình huống nghiệp vụ đặt lịch hẹn. | Đổi hẳn tình huống R10 như đề xuất trên; giữ If + past simple, would + infinitive và đúng một đáp án. |
| 6B:R18 | CHẶN | Quy tắc 2: phương án C **online** tái hiện từ khoá của định nghĩa đúng B cho R1 Bricks and clicks. Phương án nhiễu vẫn là nội dung người học nhìn thấy; việc B là đáp án không loại bỏ gợi ý này. | Thay nhiễu online bằng tính từ khác, chẳng hạn virtual / remote / digital; kiểm lại cả bộ để chỉ face-to-face phù hợp “in person”, cùng từ loại và độ dài tương đương. |

## Đối chiếu đủ 15 quy tắc

| Quy tắc | Kết quả trong phạm vi | Bằng chứng / giới hạn |
|---|---|---|
| 1. Đúng một đáp án | ĐẠT — 5/5 | Lập luận ở bảng giải mù; không có AMBIGUOUS do tự giải. |
| 2. Không lộ thuật ngữ/định nghĩa nối | CHẶN — 6B:R10,R18 | online thuộc định nghĩa đúng của Bricks and clicks. Ba câu còn lại không chứa thuật ngữ nối hoặc dấu hiệu định nghĩa đúng. |
| 3. Không lặp tình huống | CHẶN — 6B:R10 | Trùng nghiệp vụ hệ thống đặt lịch hẹn với bài đọc bệnh viện. Bốn câu còn lại không lặp tình huống bài đọc cùng đề; đối chiếu thêm ngữ cảnh các phần khác không cho thấy lặp tình huống cụ thể. |
| 4. Nhiễu từ vựng cùng từ loại, độ dài tương đương | ĐẠT | 5C:R19: bốn danh từ ngắn holder/set/plan/fee. 6B:R15: bốn động từ nguyên thể integrate/prefer/process/decrease. 6B:R18: bốn tính từ bổ nghĩa meetings, khoảng 2–3 âm tiết; face-to-face là tính từ ghép. R6/R10 là ngữ pháp, được trộn dạng. |
| 5. Đúng trọng tâm Unit, nguồn từ vựng | ĐẠT phần ngữ pháp; CHƯA KIỂM nguồn từ vựng | 6B:R6 khớp mô tả xu hướng; R10 khớp điều kiện loại 2 trong grammarFocus. Không có Workbook/giáo trình và sourceNotes trong đầu vào được giao để xác nhận nguồn/trang của plan, prefer, face-to-face. Không suy ra đạt nguồn chỉ từ tính tự nhiên của câu. |
| 6. Độ dài, tính mới của bài đọc | KHÔNG ÁP DỤNG cho 5 câu | Bài đọc chỉ làm ngữ cảnh so trùng; không kiểm lại độ dài/tính mới toàn bài. |
| 7. Câu dịch đúng Unit, không trùng liên Unit | NGOÀI PHẠM VI | Không có W31–W35 được giao kiểm. |
| 8. Email có 5–7 gợi ý, đúng chủ đề | NGOÀI PHẠM VI | Không có email được giao kiểm. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | NGOÀI PHẠM VI | Không cấp kết luận cho Writing/Speaking. |
| 10. Chính tả Anh–Anh | ĐẠT — 5/5 | Không thấy chính tả Mỹ hoặc lỗi chính tả trong stem và các lựa chọn; face-to-face có dấu nối phù hợp vị trí trước danh từ. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa nối | KHÔNG ÁP DỤNG trực tiếp | Không có bài đọc/lời thoại được giao kiểm lại. Dấu hiệu định nghĩa ở 5 câu được kiểm theo quy tắc 2; không tuyên bố toàn bài đạt quy tắc 11. |
| 12. True/False có bằng chứng rõ | KHÔNG ÁP DỤNG | Cả 5 câu đều là MCQ. |
| 13. Đề Writing/Speaking nêu cấu trúc cần dùng | NGOÀI PHẠM VI | Không có đề Writing/Speaking được giao kiểm. |
| 14. Speaking thực hiện được bằng lời nói | NGOÀI PHẠM VI | Không có câu Speaking được giao kiểm. |
| 15. sourceNotes không chép đáp án | CHƯA KIỂM nội dung nội bộ | sourceNotes không có trong đầu vào stripped; không mở bản tác giả để suy đoán. |

Đối chiếu nghĩa của phần nối để kiểm rò rỉ: ở 5C, các định nghĩa đúng là B/F/C/E/A theo thứ tự thuật ngữ R1–R5, còn D là định nghĩa dư; ở 6B, các định nghĩa đúng là B/F/E/A/D, còn C là định nghĩa dư. Đây là đối chiếu nội bộ ở bước 2, không điền đáp án R1–R5 vào file blind. Không gắn lỗi chỉ vì từ phổ thông trong định nghĩa dư. Các từ chức năng chung như a/the/to không được coi là dấu hiệu tiết lộ định nghĩa; online là thành phần phân biệt mô hình offline-and-online trong định nghĩa đúng B.

## Kiểm tra và bàn giao

- Kiểm JSON bằng Python 3: đúng cấu trúc template; chỉ 5C:R19 và 6B:R6,R10,R15,R18 có đáp án, các ô khác giữ trống; notes chỉ có các mã được giao.
- Kiểm thủ công 5 câu theo 15 quy tắc; dùng phần nối và ngữ cảnh stripped để so lộ đáp án/lặp tình huống.
- Không chạy compare-blind hoặc validate-exams vì phiên này không đọc dữ liệu tác giả. et-lead cần so đáp án và kiểm nguồn từ vựng; nếu sửa các câu bị chặn thì chuyển phiên giải mù mới theo PROTOCOL mục 5.
- **Nhãn đề nghị: CẦN SỬA.** 5C:R19, 6B:R6 và R15 không có lỗi nội dung phát hiện được trong phạm vi; nguồn từ vựng vẫn chưa được xác minh. Không tự cấp AUDIT-OK.

SHA-256 đầu vào:

```text
f4802e7171a8bef8095f006fb5dea48047cba117d262275b01c00d854c7a5c02  audit/unit-5-C.stripped.json
8834a67f664ab62d6a71c4cf874482205ccb7e5c473837603e80708223993c5e  audit/unit-6-B.stripped.json
4c3b40c86f01ddb3a11f3d6fc21bce15c905e7a89c19a664f0147e36d6508424  audit/unit-5-C.blind.template.json
2f30043c36a5cad9baf4680247abcee04966ae139120c2d693c238f1c3146d7f  audit/unit-6-B.blind.template.json
```
