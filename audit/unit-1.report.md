# Unit 1 — báo cáo giải mù và kiểm định nội dung

Agent: et-auditor — gpt-6-astra

Nhánh: `audit/unit-1`

Thời gian: 2026-10-14 15:50:38 +0700 (+07) (lấy bằng `date`)

Đề nghị: **CẦN SỬA**; R7 có cờ **AMBIGUOUS** do auditor phát hiện độc lập. Đây chưa phải kết quả so đáp án của et-lead và không phải nhãn `AUDIT-OK`.

Đã hoàn tất Bước 1 và commit riêng `audit/unit-1.blind.json` tại `b3e964b021f2a6efaecb53e443635ed0434982ec` trước khi thực hiện Bước 2. Đủ 40 đáp án L1–L10/R1–R30; L6–L10 đều không quá 3 từ. R7 chọn B và đã ghi phương án A có thể hợp lý trong `notes`. Không sửa đáp án mù sau commit.

**Phạm vi và nguồn**

- Chỉ đọc packet `audit/unit-1.stripped.json`, template tương ứng và tài liệu được giao: brief, `docs/PROTOCOL.md`, mục 3–4 của `docs/exam-format.md`, `docs/source-materials.md`, `src/types/exam.ts`.
- Không đọc mục 2 của `docs/exam-format.md`, `data/units`, nhánh `content/*`, thư mục `audit/` trên main hoặc bất kỳ nhánh `audit/*` nào khác. Không merge, không push; chỉ tạo hai file bàn giao trong `audit/`.
- Sau commit giải mù, đối chiếu từ vựng bằng `pdftotext -layout -f 6 -l 10 '/home/duckcy/Downloads/Workbook for Students.pdf' -`. Phần dùng làm bằng chứng là Part 1, trang in/PDF 6–9; trang 10 là bài tập liền sau. Không dùng Workbook để thay đổi đáp án mù.
- Sau commit giải mù, kiểm chứng ngoại lệ trật tự trạng từ ở R7 qua Cambridge English Grammar Today, đường dẫn tại dòng lỗi bên dưới. Nguồn này không được dùng trong Bước 1.
- Áp dụng bổ sung của người giao: kỹ năng thi tuần tự; W31–W35 trùng nội dung Reading không tính lộ; quy tắc 13 không áp dụng cho dịch Anh → Việt; yêu cầu cùng từ loại ở quy tắc 4 chỉ áp dụng R13–R20.

**Lỗi và đề xuất** — mỗi lỗi một dòng, gồm mã câu, mức độ, bằng chứng và hướng sửa.

| Mã câu | Mức độ | Mô tả và bằng chứng | Đề xuất sửa |
|---|---|---|---|
| R7 | CHẶN | Quy tắc 1: B tạo “Our project manager is hardly ever late for meetings”, đúng trật tự trung tính. A tạo “Our project manager hardly ever is late for meetings”, có thể dùng khi nhấn mạnh `is`; stem không loại ngữ cảnh này. Cambridge xác nhận trạng từ có thể đứng trước động từ chính `be` khi nhấn mạnh; việc áp dụng ngoại lệ đó cho A là nhận định của auditor. Vì vậy không nên chấm A là sai tuyệt đối chỉ dựa trên trật tự thông dụng. [Cambridge: Adverbs and adverb phrases — position](https://dictionary.cambridge.org/grammar/british-grammar/adverbs-and-adverb-). | Viết lại câu hoặc bộ nhiễu để chỉ còn một cách hoàn chỉnh hợp lệ, vẫn kiểm tra trạng từ tần suất với `be`; tránh dùng một trật tự nhấn mạnh hợp lệ làm nhiễu. Không chỉ đổi khóa đáp án. Câu viết lại cần phiên auditor mới theo PROTOCOL mục 5. |
| L4 / W-EMAIL gợi ý 4 | NÊN SỬA | Quy tắc 3: Listening A đề xuất chuyển cập nhật phần mềm sang “Friday afternoon”; email lại yêu cầu “install updates every Friday afternoon”. Đây là chi tiết tác vụ và lịch thực hiện bị lặp, dù toàn bộ hai tình huống khác nhau. Không gắn lỗi lộ đáp án chéo vì hai kỹ năng thi tuần tự. | Đổi lịch hoặc đổi tác vụ định kỳ ở một phần, vẫn giữ yêu cầu cụm thời gian; chẳng hạn gợi ý email về kiểm tra thiết bị vào một buổi khác. |

**Kiểm đủ quy tắc 1–15**

“ĐẠT trong packet” chỉ xác nhận nội dung quan sát được ở bản stripped. “CHƯA KIỂM” không có nghĩa là đạt hoặc đã có lỗi.

| Quy tắc | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1. Mỗi MCQ có đúng một đáp án | CHẶN — R7 | Đã giải và rà thủ công toàn bộ 25 MCQ: L1–L5, R6–R25. R7 có hai cách đặt trạng từ hợp lý như bảng lỗi. Chưa phát hiện đa đáp án ở 24 câu còn lại. Nối R1–R5 có ánh xạ riêng B/F/D/E/A; định nghĩa C thừa. |
| 2. Không lộ từ nối sang R6–R30 | ĐẠT trong packet | Năm thuật ngữ `systems analyst`, `agenda`, `manufacturer`, `alphanumeric`, `diagnose` không xuất hiện nguyên cụm trong R6–R30. Đọc ngữ nghĩa cũng không thấy câu sau cho biết trực tiếp định nghĩa của chúng. Từ chung như company/software/meeting không đủ để suy ra một cặp nối; không coi mọi lần lặp từ chung là lộ. W31–W35 được xử lý theo ngoại lệ thi tuần tự. |
| 3. Không lặp tình huống | NÊN SỬA — L4/W-EMAIL | Hai phần lặp chi tiết cập nhật vào chiều thứ Sáu. Các tình huống chính còn lại phân biệt được: xử lý quá tải helpdesk; nghề kỹ thuật mạng bệnh viện; công việc developer Cloudbridge; nội quy Harbour Bank; chào đón Tom; phỏng vấn công ty; giới thiệu nghề; tổ chức ngày đào tạo. Các chủ đề rộng về công việc/nội quy lặp vì cùng Unit, chưa đủ để kết luận trùng nguyên tình huống. |
| 4. Nhiễu từ vựng cùng từ loại, độ dài tương đương | ĐẠT | R13: bốn cụm nghề nghiệp, đều 2 từ. R14/R17/R19: danh từ; R18: danh từ bổ nghĩa cho `centre`; R15/R16/R20: động từ nguyên mẫu. R14–R20 mỗi phương án đều 1 từ, độ dài không tạo dấu hiệu nổi bật. Không áp dụng điều kiện này cho R6–R12. |
| 5. R6–R12 và R13–R20 bám Unit | ĐẠT về nội dung đích | R6–R7 vị trí trạng từ; R8–R9 câu hỏi hiện tại đơn; R10–R11 quy tắc/nghĩa vụ; R12 `what about + -ing`. Tám từ/cụm từ vựng đích đều có trong Workbook Part 1 Unit 1, bảng trang bên dưới. R7 vẫn cần sửa theo quy tắc 1. |
| 6. Độ dài và tính mới của hai bài đọc | ĐẠT độ dài; CHƯA KIỂM tính mới toàn bộ | Cloudbridge 244 từ, trong 230–270; Harbour Bank 166 từ, trong 160–200. Đếm theo khoảng trắng, chỉ tính `paragraphs`, không tính tiêu đề. Chưa đối chiếu toàn bộ giáo trình, Workbook và nguồn khác để khẳng định không sao chép; bản stripped không chứa provenance. |
| 7. Dịch bám Unit, không trùng giữa các Unit | ĐẠT nội dung Unit 1; CHƯA KIỂM liên Unit | W31 trạng từ tần suất và công việc hỗ trợ; W32 câu hỏi hiện tại đơn về dịch vụ công ty; W33 `have to`/`mustn't`; W34 trách nhiệm project manager; W35 `how about + -ing` và cuộc họp. Mệnh đề mục đích ở W31 là phần bổ sung, không thay trọng tâm tần suất. Không đọc Unit khác nên không xác nhận tính không trùng liên Unit. |
| 8. Email 5–7 gợi ý, đúng chủ đề | ĐẠT | W-EMAIL có 7 gợi ý, chào đón kỹ thuật viên hỗ trợ mới, mô tả nhiệm vụ và hai nội quy; giới hạn hiển thị 80–100 từ, khớp `wordRange`. |
| 9. Writing/Speaking buộc dùng ngữ pháp Unit | ĐẠT | Email yêu cầu tối thiểu hai trạng từ/cụm thời gian và hai cấu trúc nội quy/mệnh lệnh. Câu dịch mang cấu trúc Unit trong câu nguồn. S1 buộc tần suất, đặt câu hỏi hiện tại đơn, và nội quy; S2 buộc hiện tại đơn, `be responsible for`, tần suất; S3 buộc đề xuất, làm mềm ý kiến và phản đối lịch sự. Chi tiết bên dưới. |
| 10. Chính tả Anh–Anh | ĐẠT trong packet | Có `organisations`, `centre`, `programs` dùng đúng nghĩa chương trình máy tính; không thấy lỗi chính tả Anh–Mỹ cần đổi. `programs` trong ngữ cảnh phần mềm không cần đổi thành `programmes`. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa nối | ĐẠT trong packet | Đã đọc cả hai lời thoại và cả hai bài đọc: không mô tả chức năng systems analyst là khảo sát nhu cầu và cung cấp giải pháp; không giải nghĩa agenda/manufacturer/alphanumeric/diagnose. “Fifteen minutes” ở Listening B là đơn vị thời gian, không phải biên bản họp ở định nghĩa thừa C. Việc developer kiểm thử platform không tự diễn đạt định nghĩa diagnose là tìm nguyên nhân lỗi bằng kiểm tra. |
| 12. T/F có chứng cứ rõ trong văn bản | ĐẠT | R26–R30 có câu khẳng định/phủ định trực tiếp; không câu nào cần gán F chỉ vì văn bản không nêu. Bảng bằng chứng bên dưới. |
| 13. Cấu trúc phải hiện trong đề email và mọi prompt Speaking | ĐẠT | W-EMAIL nêu ngay trong `task`; từng câu S1 đều có chỉ dẫn `Use ...`; S2/S3 nêu trong `prompt`, không chỉ trong `requiredGrammar`. Không áp dụng quy tắc này cho W31–W35. Đây là kiểm nội dung trường hiển thị theo schema, chưa kiểm giao diện chạy thật. |
| 14. Speaking thực hiện được bằng lời nói | ĐẠT | Trả lời/đặt câu hỏi, mô tả nghề và phản hồi ý kiến quản lý đều nói được. Cues dùng dấu `/`, mũi tên và dấu ba chấm làm ký hiệu gợi ý; không yêu cầu sinh viên nói dấu câu hay thể hiện bố cục văn bản. |
| 15. sourceNotes nội bộ, không chép đáp án | ĐẠT việc loại trường; CHƯA KIỂM nội dung gốc | Quét đệ quy xác nhận không có `sourceNotes` hoặc sáu trường đáp án/lời giải khác trong packet. Vì trường đã bị loại, không thể xác nhận sourceNotes của author có chép đáp án hay không. Et-lead cần kiểm trên bản gốc trong phạm vi quyền của mình. |

**Bằng chứng từ vựng R13–R20**

| Câu | Từ/cụm từ đích | Workbook Unit 1 Part 1, trang in/PDF |
|---|---|---|
| R13 | helpdesk supervisor | 6 — Lesson 1A |
| R14 | client (trong câu: clients) | 8 — Lesson 1B |
| R15 | launch | 8 — Lesson 1B |
| R16 | stream | 9 — Lesson 1C |
| R17 | chairperson | 9 — Lesson 1D |
| R18 | service centre | 7 — Lesson 1B |
| R19 | spreadsheet | 8 — Lesson 1B |
| R20 | connect | 9 — Lesson 1C |

**Bằng chứng T/F**

| Câu | Giải mù | Bằng chứng trong Harbour Bank |
|---|---|---|
| R26 | T | Đoạn 2: “you have to change it every two months”. |
| R27 | F | Đoạn 2: “don't share it with anyone, including your manager”. |
| R28 | T | Đoạn 3: “a technician will install it for you”. |
| R29 | F | Đoạn 3: “you can't use social networking sites during working hours”. |
| R30 | F | Đoạn 4: “you mustn't connect it to a company computer”, với `it` là smartphone cá nhân ở cùng câu. |

**Writing và Speaking: yêu cầu thực sự nhìn thấy trong đề**

| Mục | Yêu cầu hiển thị và mức bám Unit 1 |
|---|---|
| W31–W35 | Năm câu nguồn lần lượt kiểm nghĩa của tần suất/nhiệm vụ, câu hỏi công ty, nội quy, trách nhiệm nghề và đề xuất họp. Dịch sang tiếng Việt không cần thêm chỉ thị viết ngữ pháp tiếng Anh. |
| W-EMAIL | `task` bắt buộc ít nhất hai trạng từ hoặc cụm thời gian và hai cấu trúc nội quy hoặc mệnh lệnh. Gợi ý về nhiệm vụ thường lệ tạo ngữ cảnh dùng hiện tại đơn. |
| S1 câu 1 | Hiển thị “Use adverbs of frequency and time expressions” và ví dụ; cần nói tần suất dùng thiết bị cho việc học. |
| S1 câu 2 | Hiển thị “Ask three questions ... Use present simple questions”; chức năng phỏng vấn công ty đúng bài IT organisations. |
| S1 câu 3 | Hiển thị “Use must, mustn't, have to, can't or should”; nội quy phòng máy đúng bài IT workplace rules. |
| S2 | `prompt` yêu cầu present simple, be responsible for, adverbs of frequency/time expressions; nói nhiệm vụ của một nghề IT. |
| S3 | `prompt` yêu cầu shall/could, how about/what about + -ing, maybe/perhaps, I'm afraid; cues yêu cầu phản đối một ý, đồng ý một ý và ít nhất hai đề xuất riêng. |

**Kiểm tra cấu trúc và provenance**

Đã chạy `python3` kiểm trên đúng hai file `audit/unit-1.stripped.json` và `audit/unit-1.blind.json`: schemaVersion/unit/testId, đủ và đúng dãy ID, 4 lựa chọn A–D cho mỗi MCQ, 5 cặp nối/6 định nghĩa, 7 câu ngữ pháp, 8 câu từ vựng, hai nhóm bài đọc mỗi nhóm 5 câu, 5 câu dịch, 7 gợi ý email, 3 phần Speaking với 3 câu S1; thời gian 45/90/90 giây; 40 đáp án đúng định dạng và câu ngắn không quá 3 từ. **PASS**. Đây là kiểm cấu trúc packet đã lược đáp án, không phải chạy validator trên đề gốc.

Đã chạy `python3` đếm từ bằng `len(text.split())`, cùng quy ước với `countWords` trong `src/types/exam.ts`:

| Nội dung | Số từ | Giới hạn | Kết quả |
|---|---:|---|---|
| Listening A, nối các `script[].text` | 174 | 150–250 | PASS |
| Listening B, nối các `script[].text` | 164 | 150–250 | PASS |
| Reading 21–25, nối `paragraphs` | 244 | 230–270 | PASS |
| Reading 26–30, nối `paragraphs` | 166 | 160–200 | PASS |

Quét khóa JSON đệ quy: không có `sourceNotes`, `answerKey`, `acceptedAnswers`, `explanation`, `referenceTranslation`, `modelAnswer`, `sampleAnswer` — **PASS**. Lời thoại vẫn có trong packet theo quy trình để auditor giải Listening; chưa kiểm việc ẩn lời thoại trên trình duyệt.

SHA-256 của đầu vào và đáp án đã commit:

```text
c4f7337e5c25fc5386fc2bdbbfbb11bf70532d84b8a014bd3bbfa5be8d29f29f  audit/unit-1.stripped.json
5349156ad56a9b81d9d65df7f2424d70d905bec275a294823926947f92f35a9b  audit/unit-1.blind.template.json
6a3ef9b17eb2b4fdd09b29c84cfc267922cfc75009c7bc583b22890cba245b1d  audit/unit-1.blind.json
```

Không chạy `scripts/compare-blind.ts` hoặc `scripts/validate-exams.ts`, vì các bước đó cần đề gốc ngoài phạm vi được phép. Et-lead cần so đáp án, kiểm danh sách `acceptedAnswers` cho L6–L10 (kể cả các biến thể hợp lệ), kiểm sourceNotes, tính mới và trùng câu liên Unit, rồi chạy validator. Báo cáo này không xác nhận barem thực thi, TTS, API chấm hoặc giao diện runtime. Packet/template đầu vào không sửa và không đưa vào hai commit bàn giao.
