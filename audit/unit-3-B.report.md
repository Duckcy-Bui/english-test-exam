# Kiểm định mã 3B — Unit 3, Test B

- Agent: et-auditor2 — GPT-6 (Codex); nhánh `audit/unit-3-B`.
- Thời gian: 2026-10-14 22:30:05 +07 (+0700) (lấy từ `date`).
- Đầu vào: `audit/unit-3-B.stripped.json`, SHA-256 `977a229db38a07983cbba815e04a789b5dbedfc736e33e8600ccb8ed03221f30`.
- Đáp án mù: `audit/unit-3-B.blind.json`, commit `49a9ea4c32422ebd12807c680c2fc8c8023f7bf9`, đã commit trước bước kiểm đặc tả. Đủ 40 đáp án; R17 có ghi chú đa nghĩa.
- Kết luận đề nghị: **CẦN SỬA** — 1 lỗi CHẶN, 2 điểm NÊN SỬA. R17 cần xử lý đa nghĩa; chưa có kết quả so đáp án với et-author nên không tuyên bố có sai khác đáp án chính thức. Không tự cấp `AUDIT-OK`.

## Phạm vi và bảo toàn giải mù

Đã đọc brief; `docs/exam-format.md` chỉ mục 3–4 (xác định dòng bằng tiêu đề, đọc từ dòng 90), `docs/PROTOCOL.md` mục 5 và 8, `docs/plan.md` mục 5b, `docs/source-materials.md` và schema `src/types/exam.ts`. Không mở nội dung mục 2 của exam-format; không đọc `data/units/*.json`, đề khác hoặc nhánh `content/*`. Giải 40 câu chỉ từ stripped. Sau commit đáp án mới đối chiếu Workbook **Unit 3, Part 1**, trang in 26–29, để kiểm nguồn từ vựng; không dùng bài tập/đáp án Workbook để giải. Hai nguồn kỹ thuật công khai ở bảng lỗi chỉ phục vụ bước 2. Không sửa nội dung đề, không merge/push. Chỉ tạo hai file kết quả trong `audit/`.

Tên model trong artifact phản ánh thông tin phiên hiện tại là GPT-6 (Codex); không tự nhận biến thể gpt-6-astra được ghi sẵn trong brief.

## Các lỗi / đề xuất sửa

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| R17 | CHẶN | Quy tắc 1: chọn A (LAN), nhưng D (VPN) vẫn là một cách hoàn thành hợp lý cho “All the computers in our building are on the same …, so we can share files and printers.” Vị trí trong cùng tòa nhà gợi LAN nhưng không loại trừ việc các máy cùng tham gia VPN để truy cập tài nguyên chia sẻ. Stem không hỏi phân loại mạng theo phạm vi địa lý. Đã ghi nhận trong đáp án mù trước khi đọc nguồn bổ sung. | Viết lại stem để hỏi rõ thuật ngữ phân loại mạng cục bộ theo phạm vi: “Which term names a network that connects devices within a small geographical area, such as one office building?”; đồng thời rà lại bộ lựa chọn để chỉ một đáp án hợp lý. Không chỉ đổi khóa đáp án. Giao phiên auditor mới giải mù câu viết lại. |
| R28 / bài đọc T/F đoạn 3 | NÊN SỬA | Câu “Real antivirus programs do not warn you in a browser window” khái quát quá mức: công cụ bảo vệ hợp lệ có thể hiển thị cảnh báo trong trình duyệt. Norton Safe Web mô tả phát hiện virus/malware trên website và hiển thị trang chặn hoặc banner cảnh báo ([Norton Support](https://support.norton.com/sp/en/ca/norton-security-suite/current/solutions/v19116982)). Theo chính văn bản hiện tại R28 vẫn rõ là F, nên đây là vấn đề độ chính xác nội dung, không phải thiếu căn cứ T/F theo quy tắc 12. | Phân biệt pop-up của website tự nhận máy đã nhiễm virus với cảnh báo từ phần mềm bảo vệ đã cài. Ví dụ viết “Do not trust an unexpected website pop-up that claims your computer is infected. Close it and check your installed security software.”; thay R28 bằng một phát biểu được đoạn mới khẳng định hoặc phủ định rõ. |
| W35 | NÊN SỬA | Câu dịch nói phòng tối khiến cảm biến làm màn hình sáng hơn, đảo chiều hoạt động tự điều chỉnh độ sáng thông thường. Apple xác nhận cảm biến giảm độ sáng ở nơi tối và tăng ở nơi sáng ([Apple Support](https://support.apple.com/en-au/109351)). Cấu trúc điều kiện loại 0 vẫn đúng nhưng nội dung kỹ thuật cần sửa. | Đổi thành “If the room is dark, the phone automatically reduces the screen brightness when auto-brightness is enabled.”; et-author cập nhật bản dịch tham khảo tương ứng. |

## Bảng kiểm đủ 15 quy tắc

| Quy tắc | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án MCQ | CHẶN | R17 có A/D hợp lý như trên. 24 MCQ còn lại có một đáp án phù hợp nhất theo ngữ cảnh; mỗi MCQ đủ bốn lựa chọn A–D. Chưa so với khóa et-author. |
| 2. Không lộ cặp nối R1–R5 sang R6–R30 | ĐẠT trong stripped | Năm thuật ngữ Spell checker, Invoice, Customise, Mesh, Link và nội dung đặc trưng của các định nghĩa đúng không được cung cấp ở R6–R30 để nối cặp. R16/R17 nói mạng, máy tính, chia sẻ tệp nhưng không mô tả đặc trưng mesh là mỗi máy nối tới nhiều máy khác. Không coi từ chung của Unit là lộ. W34 có invoice thuộc kỹ năng sau, không gắn lỗi lộ chéo. |
| 3. Không lặp tình huống | ĐẠT | Các nhiệm vụ chính khác nhau: cuộc gọi xử lý video qua wi-fi; ứng dụng tàu; quản lý email công ty; duyệt web an toàn; cài email điện thoại; giải thích thuật ngữ email; báo lỗi giao diện trình duyệt. Cùng chủ đề email/helpdesk không tự động là cùng tình huống; LA và S3 có triệu chứng và thao tác khác nhau. |
| 4. Nhiễu từ vựng cùng từ loại, độ dài tương đương | ĐẠT | Chỉ xét R13–R20: R14/R15/R18 là các động từ cùng dạng; R13/R16/R17/R19/R20 là danh từ/cụm danh từ, viết tắt được dùng như danh từ. Phương án dài 1–2 từ, không có đáp án dài bất thường. Không áp quy tắc này cho R6–R12. |
| 5. Đúng ngữ pháp/từ vựng Unit | ĐẠT phần quan sát được | R6 hiện tại đơn; R7 động từ trạng thái; R8–R9 mệnh đề quan hệ; R10 điều kiện loại 0; R11 loại 1; R12 mạo từ. Từ đúng R13–R20 (subject line, delete, post, server, LAN, access, location, feature) đều có trong Workbook Unit 3 Part 1, trang 26–29; các từ nhiễu cũng có ở bảng này. `sourceNotes` bị strip nên không kiểm được nội dung ghi nguồn nội bộ. |
| 6. Độ dài và bài đọc viết mới | ĐẠT độ dài / CHƯA KIỂM tính nguyên gốc | Bài MCQ 238 từ (230–270); T/F 169 từ (160–200). Đếm phần paragraphs theo whitespace như countWords; T/F bao gồm 5 số đầu mục, bỏ số còn 164 từ vẫn đạt. Không có căn cứ từ stripped để chứng nhận nguyên gốc tuyệt đối; việc trùng bài đọc giữa đề cùng Unit do validate của et-lead kiểm. |
| 7. Câu dịch thuộc Unit, không trùng giữa Unit | ĐẠT chủ đề-ngữ pháp / CHƯA KIỂM liên Unit | W31 hiện tại tiếp diễn/mạng; W32 mệnh đề quan hệ/bookmark; W33 điều kiện loại 1; W34 invoice/email và mệnh đề thời gian; W35 điều kiện loại 0/cảm biến. W35 có đề xuất sửa kỹ thuật riêng. Không đọc các Unit khác nên không kết luận về trùng câu liên Unit. Dịch trùng chủ đề Reading không tính lộ. |
| 8. Email 5–7 gợi ý, đúng chủ đề | ĐẠT | W-EMAIL có 7 gạch đầu dòng, hướng dẫn cài tài khoản email trên điện thoại, recipient Ellie, wordRange [80,100], hướng dẫn loại bốn dòng đầu thư khỏi số từ. |
| 9. Writing/Speaking buộc ngữ pháp Unit | ĐẠT | Email yêu cầu hiện tại tiếp diễn, mệnh đề quan hệ, điều kiện loại 0/1 trực tiếp trong task. Các câu dịch chứa cấu trúc Unit; không đòi người dịch tạo câu tiếng Anh. S1–S3 có yêu cầu ngữ pháp rõ như bảng dưới. Không yêu cầu mỗi nhiệm vụ riêng lẻ phải chứa toàn bộ ngữ pháp Unit. |
| 10. Anh–Anh | ĐẠT trong stripped | Customise, programme, per cent và các cách viết còn lại chấp nhận được trong Anh–Anh; “spelled” cũng là biến thể hợp lệ. Không thấy lỗi cần sửa. Bài mẫu/lời giải đã strip nên chưa kiểm. |
| 11. Không diễn đạt lại định nghĩa nối trong bài đọc/lời thoại | ĐẠT | Không có đoạn nào giải thích spell checker/invoice/customise/mesh/link theo định nghĩa đúng để nối cặp. Listening B nhắc charger nhưng C là định nghĩa thừa, không phải một cặp R1–R5; hơn nữa không diễn giải cách nạp điện cho pin. |
| 12. T/F có chứng cứ rõ | ĐẠT | R26 T đối chiếu đoạn 1; R27 F đối lập “update themselves automatically” đoạn 2; R28 F đối lập trực tiếp câu phủ định đoạn 3; R29 T từ đoạn 4; R30 F từ câu không che hoạt động với employer ở đoạn 4. Đề xuất sửa nội dung R28 không thay đổi kết luận rằng đáp án hiện tại có chứng cứ trực tiếp. |
| 13. Cấu trúc/chức năng phải hiện trong đề | ĐẠT | Task email, từng câu S1 và prompt S2/S3 đều nêu cấu trúc cần dùng, không chỉ để trong metadata. Ngoại lệ W31–W35 được áp dụng đúng. |
| 14. Speaking thực hiện được bằng lời nói | ĐẠT | Trả lời câu hỏi, giải thích thuật ngữ, gọi helpdesk; không có yêu cầu dấu câu/bố cục viết. Các ví dụ trong ngoặc chỉ là gợi ý, không buộc nói dấu ngoặc. |
| 15. sourceNotes không chép đáp án | CHƯA KIỂM bản gốc | Không có sourceNotes hay bất kỳ trường đáp án/lời giải nào trong stripped (đã duyệt đệ quy). Điều đó không chứng minh sourceNotes gốc sạch; et-lead kiểm ở bản có đáp án. Không mở file gốc để xác nhận. |

## Writing và Speaking: yêu cầu hiển thị cho sinh viên

| Mục | Yêu cầu cụ thể |
|---|---|
| W-EMAIL | Hiện tại tiếp diễn ít nhất một lần; ít nhất một mệnh đề quan hệ which/that/who; ít nhất một điều kiện loại 0 hoặc 1; mệnh lệnh và từ nối thứ tự trong khung thư. |
| S1 câu 1 | Hiện tại đơn cho thói quen và hiện tại tiếp diễn cho tuần này. |
| S1 câu 2 | Điều kiện loại 0 với flight mode và loại 1 với đầy bộ nhớ tuần tới. |
| S1 câu 3 | Mệnh đề quan hệ who/which/that để tả người giúp về công nghệ. |
| S2 | Prompt yêu cầu mệnh đề quan hệ khi giải thích thành phần email; cues gồm subject line, recipient, cc, attachment, signature. |
| S3 | Prompt yêu cầu hiện tại đơn, hiện tại tiếp diễn và động từ trạng thái ở dạng đơn khi báo lỗi trình duyệt. |

## Kiểm tra đã thực hiện và giới hạn bàn giao

- Python đọc JSON: đủ L1–L10 và R1–R30; đủ 40 đáp án; L6–L10 lần lượt 1/3/2/2/2 từ, đều không quá 3; R17 có notes. Không sửa đáp án sau commit bước 1.
- Python đếm theo whitespace: Listening A **192**, B **173** từ, đều trong 150–250; Reading MCQ **238**, T/F **169** từ, đều đúng giới hạn.
- Cấu trúc stripped: Listening 5+5; Reading 5 nối/6 định nghĩa + 7 ngữ pháp + 8 từ vựng + 5 MCQ + 5 T/F; Writing 5 câu dịch + email 7 gợi ý; Speaking đủ S1/S2/S3, S1 có 3 câu, thời lượng 45/90/90 giây.
- Python kiểm đệ quy: không còn `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer`.
- Trích xuất chỉ phần từ vựng: `pdftotext -f 26 -l 32 -layout '/home/duckcy/Downloads/Workbook for Students.pdf' -` qua Python, chỉ in từ `Unit 3` đến trước `PART 2`; không ghi thêm file nguồn.
- Nhận dạng đa đề theo plan 5b: unit 3, testId B, source ai, khớp mã 3B. Câu “mỗi Unit có 1 đề” ở đặc tả cũ được thay bằng quyết định nhiều đề mới hơn.
- Không chạy `compare-blind.ts` hoặc `validate-exams.ts` vì các bước đó cần dữ liệu gốc do et-lead sở hữu. Chưa kiểm acceptedAnswers, lời giải, bài mẫu, audio/TTS, hiển thị web/PDF, trùng đề hay trùng câu liên Unit. Không coi kiểm tra stripped là bằng chứng runtime.
- Đề nghị et-lead điều phối sửa R17, cân nhắc hai điểm NÊN SỬA, giao phiên auditor mới cho câu được viết lại, rồi chạy compare và validate trước quyết định nhãn cuối.
