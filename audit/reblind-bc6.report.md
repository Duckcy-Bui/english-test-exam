# Báo cáo giải mù lại một phần — bc6

- Agent: et-auditor — gpt-6-astra.
- Nhánh: `audit/reblind-bc6`.
- Thời gian từ `date '+%Y-%m-%d %H:%M:%S %Z (%z)'`: `2026-10-14 22:35:11 +07 (+0700)`.
- Phạm vi kết luận: **3B R17, R26–R30; 2C R10**. Các phần khác của bản stripped chỉ dùng làm ngữ cảnh đối chiếu lộ đáp án và lặp tình huống; không giải hay cấp kết luận kiểm định cho các câu ngoài phạm vi.
- Đáp án mù đã commit **trước bước kiểm đặc tả**, tại `e5bc4d8b169213db12b727013fa6c330113d32d2`: `audit/unit-3-B.blind-bc6.json`, `audit/unit-2-C.blind-bc6.json`. Giữ các ô ngoài phạm vi trống theo template.
- Chỉ dùng đầu vào stripped và template; không đọc `data/units/*.json`, đáp án tác giả, mục 2 của exam-format hay nội dung nhánh khác.

## Định danh đầu vào

SHA-256 của bản stripped được kiểm:

| File | SHA-256 |
|---|---|
| `audit/unit-3-B.stripped.json` | `542b96cde343264d116dd9cf5777337da1ab773b3198225580c6f12f7d87f1aa` |
| `audit/unit-2-C.stripped.json` | `27a9d4d54dbc8f2d28ba6d7cb53a4826dcc4ecbf797034bf9d66eb2bd9cf7a59` |

## Kết quả từng câu

| Câu | Đáp án mù | Căn cứ và kết luận |
|---|---|---|
| 3B R17 | A | `LAN` phù hợp mạng trong cùng toà nhà để chia sẻ tệp và máy in. GPS, OCR, dongle không đáp ứng nghĩa này. Bốn phương án đều là danh từ/thuật ngữ danh từ, mỗi phương án một từ; độ dài ngắn tương đương. Không có đáp án hợp lý thứ hai. |
| 3B R26 | T | Đoạn 1 khẳng định trực tiếp: địa chỉ bắt đầu bằng https thì kết nối được mã hoá. |
| 3B R27 | F | Đoạn 2 nói `Most browsers update themselves automatically`, phủ định việc đa số cần người dùng cài cập nhật bằng tay. Yêu cầu khởi động lại ở mệnh đề sau không biến cập nhật tự động thành cài thủ công. |
| 3B R28 | F | Đoạn 3 nói `Real antivirus companies never ask you to phone them from a pop-up on a website`; `never` phủ định trực tiếp `sometimes` trong câu hỏi. |
| 3B R29 | T | Đoạn 4 nói trình duyệt không lưu lịch sử hoặc mật khẩu khi đóng cửa sổ riêng tư; câu hỏi chỉ lấy phần lịch sử, đúng với văn bản. |
| 3B R30 | F | Đoạn 4 nói rõ chế độ riêng tư `does not hide what you do from your employer`; câu hỏi khẳng định điều ngược lại. |
| 2C R10 | C | `Connect the printer to the laptop.` có cấu trúc mệnh lệnh + tân ngữ + giới từ + tân ngữ đúng. A/D sai vị trí mạo từ; B đặt `to` sau `the laptop`. Không có đáp án hợp lý thứ hai. |

## Đối chiếu 15 quy tắc

| Quy tắc | Kết quả trong phạm vi được giao |
|---|---|
| 1. Một đáp án đúng | ĐẠT: R17 và R10 chỉ có một phương án đúng; năm câu T/F có căn cứ trực tiếp như bảng trên. |
| 2. Không lộ thuật ngữ/định nghĩa nối | ĐẠT trong phạm vi: không có thuật ngữ nối hoặc diễn đạt đủ nội dung định nghĩa đúng làm gợi ý. Chi tiết dưới đây. Không tính từ phổ thông thuộc định nghĩa dư. |
| 3. Không lặp tình huống | ĐẠT trong phạm vi: 3B R17 nói về mạng trong toà nhà, không lặp bài đọc giảm email ở Brightline hay bài hướng dẫn duyệt web an toàn. Bài T/F không lặp tình huống bài MCQ, cuộc gọi xử lý video giật, ứng dụng tàu RailGo, thiết lập email điện thoại hay lỗi hiển thị trang đặt hàng. 2C R10 nối máy in với laptop, không lặp bài trường Hillside đổi hệ điều hành hay bài chọn tai nghe; không lặp các tình huống mua máy dựng video, chụp màn hình, cài phần mềm và chia sẻ tệp. Chủ đề thiết bị/mạng chung không tự nó là tình huống trùng. |
| 4. Nhiễu cùng từ loại, độ dài tương đương | ĐẠT với 3B R17: LAN/GPS/OCR/dongle đều là danh từ, một từ, dài 3/3/3/6 ký tự. R10 là câu ngữ pháp, không áp tiêu chí nhiễu của câu từ vựng. |
| 5. Đúng nội dung Unit | ĐẠT về chủ đề/cấu trúc theo metadata stripped: LAN thuộc Networks của Unit 3; R10 kiểm tra `verb + object + preposition + object` và mệnh lệnh của Unit 2. CHƯA KIỂM xuất xứ từ vựng/trang Workbook hoặc giáo trình vì ngoài đầu vào được giao và không có sourceNotes. |
| 6. Độ dài và tính mới bài đọc | Bài 3B R26–R30 có **178 từ**, tách theo khoảng trắng sau khi bỏ số thứ tự 1.–5., không tính tiêu đề: ĐẠT khoảng 160–200. Tính viết mới: CHƯA KIỂM đối chiếu nguồn ngoài. Bài R21–R25 và bài đọc 2C không thuộc phạm vi kiểm độ dài của phiên này. |
| 7. Câu dịch đúng Unit, không trùng liên Unit | KHÔNG ÁP DỤNG cho 7 câu Reading; không tái kiểm W31–W35. |
| 8. Email có 5–7 gợi ý, đúng chủ đề | KHÔNG ÁP DỤNG; không tái kiểm email. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | KHÔNG ÁP DỤNG; không tái kiểm đặc tả Writing/Speaking. |
| 10. Chính tả Anh–Anh | ĐẠT trong các câu được giao và bài đọc 3B T/F: không phát hiện chính tả Mỹ xung đột; các từ như browser, encrypted, antivirus, employer dùng được trong Anh–Anh. |
| 11. Bài đọc/lời thoại không nhắc lại định nghĩa nối | ĐẠT đối với bài đọc 3B R26–R30: không diễn đạt lại năm định nghĩa đúng của phần nối. Không cấp kết luận cho lời thoại hoặc bài đọc ngoài phạm vi. |
| 12. T/F được khẳng định/phủ định rõ | ĐẠT cả R26–R30, có câu chứng minh trực tiếp; không dùng kiến thức ngoài văn bản hoặc suy diễn từ thông tin bị thiếu. |
| 13. Prompt Writing/Speaking nêu cấu trúc cần dùng | KHÔNG ÁP DỤNG cho phạm vi Reading. |
| 14. Speaking thực hiện được bằng lời nói | KHÔNG ÁP DỤNG cho phạm vi Reading. |
| 15. sourceNotes nội bộ, không chép đáp án | Quét đệ quy xác nhận cả hai bản stripped không có `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`. CHƯA KIỂM nội dung sourceNotes gốc vì không được đọc dữ liệu tác giả. |

### Căn cứ kiểm lộ đáp án

- **3B:** đối chiếu Spell checker, Invoice, Customise, Mesh, Link và các định nghĩa tương ứng D, A, F, B, E. R17 chỉ mô tả phạm vi mạng nội bộ và chia sẻ tài nguyên; không mô tả cấu trúc Mesh nối mỗi máy với nhiều máy khác. Các từ chung như computers/files không cung cấp đặc điểm định nghĩa Mesh. Bài T/F nói về https, cập nhật, pop-up, chế độ riêng tư và cookies; không mô tả sửa chính tả, hoá đơn, tuỳ biến, cấu trúc mesh hoặc một từ/hình được bấm để chuyển trang. `website`/`page` đơn lẻ không diễn đạt định nghĩa Link. Định nghĩa C về bộ sạc là định nghĩa dư.
- **2C:** đối chiếu Icon, Solid state drive, User account, Drag, Ethernet cable và các định nghĩa tương ứng F, A, C, D, E. R10 không nhắc các thuật ngữ này. Việc nối một máy in với laptop không định nghĩa cáp nối máy tính với mạng khác, không nêu vật cắm hoặc vị trí cắm. Định nghĩa B về socket là định nghĩa dư; các từ phổ thông như connect/laptop không bị gắn cờ chỉ vì cùng miền thiết bị.

## Lỗi và bàn giao

**Không phát hiện lỗi CHẶN, NÊN SỬA hoặc câu đa nghĩa trong 7 câu được giao.** Không có dòng lỗi cần đề xuất sửa.

Đã kiểm bằng Python: JSON đọc được; đúng 6 + 1 đáp án được điền; tất cả câu khác để trống; notes chỉ chứa mã câu được giao; không có trường đáp án/giải thích/sourceNotes trong stripped; đếm độ dài bài T/F và ghi SHA-256 đầu vào. Đối chiếu ngôn ngữ, định nghĩa và tình huống được thực hiện thủ công trên stripped.

Đề nghị et-lead xem xét `AUDIT-OK` **chỉ cho phần tái kiểm này** sau khi so đáp án bằng `scripts/compare-blind.ts` và hoàn tất điều kiện kiểm định liên quan. Auditor không tự cấp nhãn. **CHƯA CHẠY compare-blind hoặc validate-exams, chưa xác nhận khớp đáp án tác giả, không kết luận toàn bộ hai đề đạt.**
