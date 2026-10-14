# Unit 4 — báo cáo giải mù và kiểm đặc tả

- Agent / solver: `et-auditor — gpt-6-astra`.
- Nhánh: `audit/unit-4`.
- Thời gian kiểm: `2026-10-14 15:29:55 +0700` (đầu ra `date`).
- Commit đáp án mù, có trước báo cáo: `23bdcf694a15f7613aa4bd0f269d001d05bc050b`.
- Kết luận: **CẦN SỬA**; có 2 phát hiện CHẶN và 3 phát hiện NÊN SỬA. R9 có nguy cơ đa đáp án từ giải độc lập; chưa chạy đối chiếu với đáp án tác giả, chưa gắn nhãn AMBIGUOUS theo kết quả compare, không tự cấp AUDIT-OK.

## Phạm vi và tính độc lập

Đã đọc brief, `docs/PROTOCOL.md`, `docs/exam-format.md` mục 1, 3, 4 (đủ quy tắc 1–15), `docs/source-materials.md`, `src/types/exam.ts`, packet stripped và template của Unit 4. Không xuất/đọc mục 2 “Đáp án” của exam-format. Đã giải đủ L1–L10 và R1–R30 rồi commit riêng file blind trước khi kiểm bước 2. Bước 2 có đối chiếu từ vựng với Workbook PDF trang 37–42, ưu tiên Part 1 trang 37–40.

Không đọc `data/units`, nhánh `content/*`, nhánh `audit/*` khác hoặc commit của chúng ở cả hai bước. Không đọc đáp án tác giả, không chạy compare hay validate trên dữ liệu tác giả. Chỉ ghi trong `audit/`; không merge, không push. Packet và template đầu vào giữ nguyên, không đưa vào commit sản phẩm audit.

SHA-256 đầu vào:

```text
ba7d642e89533b46d362c2153764b1cb5dd162b14e207ac3868b635637a7595b  audit/unit-4.stripped.json
2ae44db2d7a05e06004e6ab4f654e5f3875e5a7ac4dc3fc38e28dc5b32036ee7  audit/unit-4.blind.template.json
```

## Phát hiện

Mỗi dòng là một phát hiện; đề xuất dưới đây chưa được áp dụng vào đề.

| Mã câu | Mức độ | Mô tả | Đề xuất sửa |
|---|---|---|---|
| R9 | CHẶN | Quy tắc 1: chọn A `by running`, nhưng C `from running` cũng có cách hiểu hợp lý: nhìn thấy/biết tổng doanh số từ kết quả chạy báo cáo. Câu không loại rõ cách đọc nguồn thông tin/kết quả; đã ghi trong notes trước commit mù. | Viết lại stem/phương án để chỉ có một cách diễn đạt phương thức đúng; thay `from running` bằng nhiễu sai rõ ràng như `by run`. Không chỉ đổi answerKey; giao phiên auditor mới giải lại câu sửa. |
| W31–W35 (instructions) | CHẶN | Quy tắc 13: hướng dẫn chỉ ghi `Translate these sentences into Vietnamese`; không nêu cấu trúc hoặc chức năng Unit 4 phải thể hiện. Việc cấu trúc nằm trong câu nguồn chưa đáp ứng yêu cầu nêu rõ trong đề bài; W31 và W33 còn chủ yếu dùng hiện tại đơn. | Bổ sung hướng dẫn hiển thị về chức năng và ý ngữ pháp cần giữ khi dịch: mô tả chức năng thiết bị/cơ sở dữ liệu, hành động đã hoàn tất, hành động đang diễn ra bị gián đoạn và trình tự trước/sau. Có thể điều chỉnh W31/W33 để thêm `by + -ing` hoặc quá khứ đơn. Không yêu cầu người học trả lời bằng tiếng Anh trong bài dịch sang tiếng Việt. |
| R25 | NÊN SỬA | D là lựa chọn gần nhất, nhưng bài viết `stopped making brown bread for the second shop`, còn D viết `stopped sending brown bread to one shop`; ngừng sản xuất và ngừng vận chuyển không hoàn toàn tương đương. | Đổi D thành `She stopped making brown bread for the second shop.` hoặc một diễn đạt tương đương đúng nghĩa sản xuất; giữ các phương án cân đối. |
| R7 ↔ W-EMAIL | NÊN SỬA | Quy tắc 3: cùng tình huống sao lưu dữ liệu trước cập nhật phần mềm trên hệ thống, xuất hiện ở R7 và các bullet 1/3 của email. Đây là trùng tình huống, không phải kết luận lộ đáp án chéo kỹ năng. | Giữ nhiệm vụ email; đổi R7 sang một tình huống khác nhưng vẫn kiểm `before + -ing`, ví dụ ngắt nguồn trước vệ sinh thiết bị. |
| R3 ↔ R14(C), R15(A); R1 ↔ R23(A) | NÊN SỬA | Quy tắc 2: `Query` của thuật ngữ nối R3 được dùng lại làm nhiễu ở R14/R15; R23(A) lặp cụm `stopped working` gần định nghĩa D của R1. Chưa thấy chúng cung cấp một ánh xạ thuật ngữ–định nghĩa đủ để khẳng định lộ trực tiếp, nhưng còn tái sử dụng các dấu hiệu bị quy tắc yêu cầu tránh. | Thay các nhiễu này bằng từ/cụm ngoài bộ nối, rồi rà lại cả stem, options và bài đọc; không thay bằng một định nghĩa khác của thuật ngữ nối. |

## Kiểm đủ quy tắc 1–15

| Quy tắc | Kết quả | Bằng chứng / giới hạn |
|---|---|---|
| 1. Một đáp án đúng mỗi MCQ | CHẶN | Đã giải 25 MCQ (5 Listening, 15 grammar/vocabulary, 5 passage). R9 có A/C hợp lý theo hai cách đọc. Các MCQ còn lại có lựa chọn tốt nhất xác định được; R25 cần chỉnh độ trung thành với văn bản. |
| 2. Không lộ từ bộ nối sang R6–R30 | NÊN SỬA | Đã rà cả 5 thuật ngữ và 6 định nghĩa với R6–R30. Các chỗ tái xuất hiện nằm trong nhiễu R14/R15/R23, ghi riêng ở bảng phát hiện; chưa khẳng định lộ ánh xạ trực tiếp. W31–W35 trùng ngữ pháp R6–R12 không tính là lộ vì thi tuần tự. |
| 3. Không lặp tình huống | NÊN SỬA | R7 và email lặp tình huống sao lưu trước cập nhật phần mềm. Các tình huống chính còn lại phân biệt được: phòng khám, tiệm bánh, phòng đào tạo, cấp máy cho nhân viên, sự cố mạng lúc thuyết trình. L-A và S3 cùng khung quản lý vắng mặt nhưng sự cố/nhiệm vụ cụ thể khác nhau. |
| 4. Nhiễu cùng từ loại, độ dài tương đương | ĐẠT trong phạm vi đọc | Nhóm từ vựng dùng danh từ/cụm danh từ; MCQ nghe/đọc dùng các cụm/câu tương đối cân đối. Nhiễu chia động từ ở R6–R12 khác hình thái để kiểm ngữ pháp, không coi chính khác biệt cần kiểm tra là vi phạm. Không có đáp án dài nổi bật đến mức tự bật mí. |
| 5. Ngữ pháp/từ vựng đúng Unit | ĐẠT về nguồn và chủ điểm; R9 có lỗi quy tắc 1 | R6/R11 quá khứ đơn; R7/R8 before/after + -ing; R9/R10 by + -ing; R12 quá khứ tiếp diễn. R13 row: WB tr.39; R14 primary key, R15 form: tr.37; R16 permissions, R17 logs: tr.40; R18 NAS, R19 touch pad, R20 jam: tr.38 (jam nằm nối trong ô input device do bố cục PDF). Không cần suy đoán trang giáo trình để xác nhận các đáp án từ vựng này. |
| 6. Độ dài và bài đọc viết mới | ĐẠT độ dài; CHƯA KIỂM toàn bộ tính viết mới | R21–R25: 241 từ, yêu cầu 230–270; R26–R30: 175 từ, yêu cầu 160–200. Hai ngữ cảnh khác nhau. Không có đủ toàn bộ nguồn/tiền sử soạn để xác nhận tính nguyên gốc; không dùng độ dài làm bằng chứng đã viết mới. |
| 7. Câu dịch đúng Unit, không trùng giữa các Unit | ĐẠT chủ đề; CHƯA KIỂM trùng liên Unit | Câu dịch có thiết bị/đĩa quang, spreadsheet/date format, record/field, sự cố server, sao lưu; W32 dùng quá khứ đơn, W34 phối hợp quá khứ tiếp diễn–đơn, W35 before + -ing. W31/W33 chưa tự buộc ngữ pháp trọng tâm; xử lý cùng phát hiện quy tắc 13. Không mở các Unit khác để kiểm trùng. |
| 8. Email 5–7 bullet, chủ đề Unit | ĐẠT | 5 bullet, wordRange [80,100], có recipient Peter và yêu cầu 80–100 từ hiện trong task; chủ đề quản trị hệ thống, nâng cấp, tài khoản. |
| 9. Writing/Speaking buộc ngữ pháp Unit | ĐẠT email/Speaking; cần sửa hướng dẫn dịch | Email hiện rõ before/after + -ing ít nhất hai lần và by + -ing ít nhất một lần. S1 từng câu lần lượt yêu cầu quá khứ đơn, before/after + -ing, by + -ing. S2 yêu cầu before/while/after; S3 yêu cầu quá khứ tiếp diễn và quá khứ đơn. Phần dịch cần làm rõ yêu cầu theo quy tắc 13. |
| 10. Chính tả Anh–Anh | ĐẠT trong packet | Đã đọc toàn bộ nội dung hiển thị và lời thoại; có `formulae`, không phát hiện chính tả Mỹ trái yêu cầu Anh–Anh. |
| 11. Bài đọc/lời thoại không diễn đạt lại định nghĩa nối | ĐẠT trong packet | Hai script và hai passage không định nghĩa lại crash, stylus, query the database, subtract, graphics tablet hoặc graphics design (định nghĩa dư E). Bài nghe B giải thích primary key/record/form nhưng chúng không phải thuật ngữ nối R1–R5. R23(A) là phương án nhiễu, đã rà ở quy tắc 2. |
| 12. T/F được khẳng định/phủ định rõ | ĐẠT | R26 T: nine o'clock in the morning; R27 F: projector was working correctly; R28 F: course started fifteen minutes late; R29 T: while listening to the finance director, sound stopped; R30 T: test headsets every Monday morning. Không cần suy luận thành Not Given. |
| 13. Yêu cầu ngữ pháp/chức năng hiển thị rõ | CHẶN phần dịch; ĐẠT phần còn lại | Translation instructions chỉ yêu cầu dịch. Email có yêu cầu cấu trúc ngay trong task; cả ba câu S1 đều có `Use`/`Answer with`; S2/S3 nêu cấu trúc ngay trong prompt, không chỉ trong trường nội bộ. |
| 14. Speaking làm được bằng lời nói | ĐẠT | Mọi phần yêu cầu kể, giải thích, xử lý tình huống bằng lời; không bắt viết dấu ngoặc/ký hiệu hoặc thao tác giao diện. Ví dụ trong ngoặc chỉ minh hoạ lời nói. Thời lượng S1 45 giây/câu, S2/S3 90 giây. |
| 15. sourceNotes không chứa đáp án | CHƯA KIỂM nội dung nội bộ | Quét đệ quy packet: không có sourceNotes hoặc sáu trường đáp án/lời giải khác. Điều này chỉ chứng minh trường đã được loại khỏi packet; không chứng minh nội dung sourceNotes nguyên bản không chép đáp án. et-lead kiểm riêng. |

## Kiểm cấu trúc và chấm điểm trong phạm vi cho phép

- Listening A: 193 từ, 5 MCQ; B: 174 từ, 5 câu ngắn, maxWords = 3. Cả hai trong 150–250 từ. Speaker/voice và người nói khớp trong từng phần.
- Reading: 5 câu nối/6 định nghĩa, 7 grammar, 8 vocabulary, 5 passage MCQ, 5 T/F; đủ R1–R30. Tất cả MCQ có A–D.
- Writing: đủ W31–W35 và một email. Speaking: đủ S1/S2/S3, S1 có 3 câu hỏi.
- File blind có đúng 40 ID, không trống, đáp án đúng miền chữ cái/T–F; L6–L10 không quá 3 từ. `notes` ghi R9, L9, R25 trước commit.
- Theo hằng số schema: Listening 10 × 0,25 = 2,5; Reading 30 × (2,5/30) = 2,5; Writing 5 × 0,25 + 0,5 + 3 × 0,25 = 2,5; Speaking 4 × 0,625 = 2,5; tổng 10. Đây là kiểm đặc tả, không phải chạy thử giao diện/chấm điểm runtime.

L9 có các diễn đạt cùng nghĩa `every evening` và `before going home` (đều ≤3 từ). Đây là biến thể câu ngắn, không phải kết luận MCQ đa đáp án. et-lead cần kiểm acceptedAnswers; chưa thấy trường đó nên chưa kết luận thiếu biến thể. L6 (`three`/`3`), L7 (`patient number`), L8 (`New Patient form`), L10 (`Daily Diary report`) cũng cần đối chiếu bằng công cụ của lead.

## Lệnh kiểm và bàn giao tiếp

Đã dùng `pdftotext -f 37 -l 42 -layout '/home/duckcy/Downloads/Workbook for Students.pdf' -` để đối chiếu nguồn từ vựng. Đếm từ bằng tách khoảng trắng, cùng cách `countWords` trong schema; không tính title, speaker, context hay instructions. Đã dùng Python kiểm hash và quét đệ quy các trường bị loại.

Lệnh kiểm packet và blind có thể chạy lại từ worktree này:

```bash
python3 - <<'PY'
import json
from pathlib import Path
p = json.loads(Path('audit/unit-4.stripped.json').read_text())
b = json.loads(Path('audit/unit-4.blind.json').read_text())
a = b['answers']
assert b['unit'] == p['unit'] == 4
assert b['solver'] == 'et-auditor — gpt-6-astra'
expected = {f'L{i}' for i in range(1, 11)} | {f'R{i}' for i in range(1, 31)}
assert set(a) == expected and all(a.values())
mcq = p['listening']['parts'][0]['questions'] + p['reading']['grammar'] + p['reading']['vocabulary'] + p['reading']['passageMcq']['questions']
assert len(mcq) == 25
for q in mcq:
    assert [o['id'] for o in q['options']] == list('ABCD')
    assert a[q['id']] in list('ABCD')
assert all(a[f'R{i}'] in list('ABCDEF') for i in range(1, 6))
assert all(a[f'R{i}'] in ['T', 'F'] for i in range(26, 31))
assert all(1 <= len(a[f'L{i}'].split()) <= 3 for i in range(6, 11))
ids = [q['id'] for q in mcq] + [q['id'] for q in p['listening']['parts'][1]['questions']] + [q['id'] for q in p['reading']['matching']['items']] + [q['id'] for q in p['reading']['passageTrueFalse']['questions']]
assert len(ids) == len(set(ids)) == 40 and set(ids) == expected
for part in p['listening']['parts']:
    n = len(' '.join(line['text'] for line in part['script']).split())
    assert 150 <= n <= 250 and len(part['questions']) == 5
    print('Listening', part['id'], n)
for key, lo, hi in [('passageMcq', 230, 270), ('passageTrueFalse', 160, 200)]:
    n = len(' '.join(p['reading'][key]['passage']['paragraphs']).split())
    assert lo <= n <= hi and len(p['reading'][key]['questions']) == 5
    print(key, n)
forbidden = {'sourceNotes', 'answerKey', 'acceptedAnswers', 'explanation', 'referenceTranslation', 'modelAnswer', 'sampleAnswer'}
def walk(v):
    if isinstance(v, dict):
        assert not forbidden.intersection(v)
        for child in v.values(): walk(child)
    elif isinstance(v, list):
        for child in v: walk(child)
walk(p)
assert len(p['reading']['matching']['definitions']) == 6
assert len(p['reading']['grammar']) == 7 and len(p['reading']['vocabulary']) == 8
assert [q['id'] for q in p['writing']['translation']['items']] == [f'W{i}' for i in range(31, 36)]
assert 5 <= len(p['writing']['email']['bullets']) <= 7
assert p['writing']['email']['wordRange'] == [80, 100]
assert [s['id'] for s in p['speaking']['parts']] == ['S1', 'S2', 'S3']
assert len(p['speaking']['parts'][0]['questions']) == 3
print('PASS: packet structure, word limits, stripped fields, 40 blind answers')
PY
```

Đã chạy nguyên khối Python trên: **PASS**; số từ trả về lần lượt 193, 174, 241, 175. Kiểm thêm sự hiện diện đủ 15 dòng quy tắc: **PASS**. Những kiểm tra này chỉ xác nhận packet và sản phẩm audit, không xác nhận đáp án tác giả hoặc runtime.

et-lead chạy `scripts/compare-blind.ts`, kiểm sourceNotes và trùng câu dịch liên Unit, rồi yêu cầu tác giả sửa các điểm chặn. Câu đã viết lại phải giao phiên auditor mới giải mù theo PROTOCOL. `scripts/validate-exams.ts` trên dữ liệu tác giả và quyết định AUDIT-OK vẫn thuộc cổng kiểm của et-lead; báo cáo này không thay thế các bước đó.
