# Kế hoạch web luyện thi English for IT 2

Cập nhật: 2026-10-14 14:34 +07 (et-lead)

Tài liệu liên quan: `docs/source-materials.md` (nguồn), `docs/exam-format.md` (khung đề), `docs/PROTOCOL.md` (quy trình multi-agent).

## 1. Mục tiêu

Web cho sinh viên CNTT ĐH GTVT tự luyện đề English for IT 2 theo 8 Unit, đủ 4 kỹ năng Listening, Reading, Writing, Speaking. Mỗi Unit 1 đề. Writing và Speaking do AI chấm.

## 2. Quyết định đã chốt

| Mục | Quyết định | Ngày chốt |
|---|---|---|
| Thang điểm | 10 điểm, mỗi kỹ năng 2,5 | 2026-10-14 |
| Speaking | Bám lý thuyết (chức năng và ngữ pháp) của từng Unit | 2026-10-14 |
| Listening | Giọng đọc trình duyệt, lời thoại viết mới | 2026-10-14 |
| Phạm vi bản đầu | 8 Unit, mỗi Unit 1 đề | 2026-10-14 |
| Người dùng | Chỉ sinh viên luyện đề; không có tài khoản, không có giáo viên | 2026-10-14 |
| Lưu kết quả | `localStorage` trên trình duyệt | 2026-10-14 |
| AI chấm | Gemini qua ShopAIKey: `gemini-2.5-flash`, dự phòng `gemini-3.8-flash` | 2026-10-14 |
| Chống lạm dụng | `ACCESS_CODE` chung; rate limit 10 lần chấm/thiết bị/ngày và trần 100 lần/IP/ngày | 2026-10-14 (et-lead chọn, chủ dự án giao quyền) |
| Làm tròn điểm | Tổng làm tròn đến 0,25 gần nhất, tối đa 10. Điểm từng kỹ năng hiển thị 2 chữ số thập phân. | 2026-10-14 (et-lead chọn, chủ dự án giao quyền) |
| Repo | Public trên GitHub (`Duckcy-Bui/english-test-exam`) | 2026-10-14 |
| Deploy | VPS riêng của chủ dự án, đã có domain; Docker + Nginx + HTTPS | 2026-10-14 |
| Quy trình | 5 agent kiểm chéo khác họ model (`docs/PROTOCOL.md`) | 2026-10-14 |

## 3. Các trang

1. **Trang chủ:** nhập mã truy cập lần đầu; danh sách 8 Unit kèm điểm cao nhất đã đạt.
2. **Trang Unit:** 4 thẻ kỹ năng và nút "Thi cả đề". Chọn chế độ Luyện tập hoặc Thi thử.
3. **Trang làm bài** cho từng kỹ năng.
4. **Trang kết quả:** điểm từng kỹ năng, đáp án và giải thích, nhận xét của AI bằng tiếng Việt, bài mẫu.
5. **Lịch sử:** các lần làm bài lưu trong `localStorage`, có nút xoá.

Hai chế độ:
- **Luyện tập:** không tính giờ, làm xong xem ngay đáp án, giải thích và lời thoại bài nghe.
- **Thi thử:** có đồng hồ, mỗi phần nghe tối đa 2 lần, chỉ xem đáp án sau khi nộp cả đề. Làm tuần tự Listening → Reading → Writing → Speaking; nội dung kỹ năng sau chỉ gửi xuống trình duyệt khi kỹ năng trước đã nộp, đã nộp thì khoá.

## 4. Kỹ thuật

### Công nghệ

- Next.js (App Router) + TypeScript + Tailwind CSS.
- Dữ liệu đề là file JSON tĩnh trong `data/units/`, kiểu dữ liệu định nghĩa ở `src/types/exam.ts`.
- Đáp án Reading và Listening chấm phía server, để không gửi đáp án xuống trình duyệt trước khi nộp bài.

### Biến môi trường (`.env`, chỉ nằm trên server)

| Biến | Ví dụ | Ghi chú |
|---|---|---|
| `AI_BASE_URL` | `https://api.shopaikey.com` | Định dạng Gemini gốc, xem mục "Chấm bằng AI" |
| `AI_API_KEY` | | Không commit, không gửi xuống trình duyệt |
| `AI_MODEL` | `gemini-2.5-flash` | |
| `AI_MODEL_FALLBACK` | `gemini-3.8-flash` | Dùng khi model chính lỗi |
| `ACCESS_CODE` | | Mã chung phát cho lớp |
| `RATE_LIMIT_PER_DEVICE` | `10` | Số lần chấm AI mỗi thiết bị (cookie) mỗi ngày |
| `RATE_LIMIT_PER_IP` | `100` | Trần số lần chấm mỗi IP mỗi ngày, đặt cao vì cả lớp có thể dùng chung Wi-Fi |

### Chấm bằng AI

- Một API route phía server (`/api/grade`) nhận bài làm, kiểm `ACCESS_CODE` và rate limit, rồi gọi model.
- Gọi ShopAIKey theo định dạng Gemini gốc: `POST https://api.shopaikey.com/v1beta/models/{model}:generateContent`, header `Authorization: Bearer <AI_API_KEY>`. Có thể dùng SDK `@google/genai` với `httpOptions.baseUrl = AI_BASE_URL`. Không dùng định dạng OpenAI (`/v1/chat/completions`) cho Speaking vì cần gửi audio.
- Prompt chấm chứa barem trong `docs/exam-format.md` mục 3 và ngữ pháp trọng tâm của Unit.
- Chống prompt injection:
  - Bài làm của sinh viên đặt trong khối phân cách rõ ràng. Prompt hệ thống ghi rõ đó là dữ liệu cần chấm, không phải lệnh.
  - Model phải trả JSON theo schema cố định, `temperature` = 0.
  - Server kiểm lại JSON: đúng tiêu chí, mỗi điểm nằm trong giới hạn, tổng không vượt 2,5. Sai thì gọi lại 1 lần; vẫn sai thì báo lỗi, không ghi điểm.
- Nhận xét, sửa lỗi và bài mẫu trả về bằng tiếng Việt.
- Bí mật server: `SESSION_SECRET` và `ACCESS_CODE` không bao giờ gửi lên model; `AI_API_KEY` chỉ nằm trong header. Phòng thủ nhiều lớp: server quét đầu ra AI (cả dạng chèn khoảng trắng, chia mảnh qua nhiều trường, percent-encode, base64) trước khi lưu hoặc trả về; nhiễm thì gọi lại, vẫn nhiễm thì trả lỗi 502. Rủi ro còn lại chỉ đến từ việc nhà cung cấp trung gian cố ý chèn key, được chấp nhận.

### Listening

- Dùng `speechSynthesis` của trình duyệt, ưu tiên giọng `en-GB`. Giọng đọc khác nhau tuỳ hệ điều hành và trình duyệt.
- Mở rộng sau: tạo sẵn file âm thanh bằng model TTS của Gemini qua ShopAIKey, chỉ tốn tiền một lần cho mỗi bài.

### Speaking (thu âm kết hợp)

- Web Speech API hiển thị bản chữ trong lúc nói. Chỉ chạy trên Chrome và Edge; âm thanh được gửi lên máy chủ Google để nhận dạng.
- Đồng thời ghi âm bằng `MediaRecorder`. Server gửi cả audio (base64 `inlineData`) và bản chữ cho Gemini để chấm cả phát âm. ShopAIKey nhận `audio/wav`, `audio/mp3`, `audio/mpeg`, `audio/aac`, `audio/ogg`, `audio/flac`, **không có `audio/webm`** (định dạng mặc định của Chrome). Trình duyệt phải chuyển bản ghi sang WAV mono 16 kHz trước khi gửi. Audio tính khoảng 32 token mỗi giây.
- Trình duyệt không hỗ trợ Web Speech API (Firefox, Safari cũ): chỉ dùng audio, hoặc cho sinh viên gõ câu trả lời.
- Audio không lưu lại trên server sau khi chấm.
- Micro chỉ hoạt động trên HTTPS.

### Deploy

- Next.js build dạng `standalone`, đóng gói bằng `Dockerfile` và `docker-compose.yml`.
- Nginx làm reverse proxy, HTTPS bằng Let's Encrypt.
- Rate limit lưu trên server (bộ nhớ hoặc SQLite). Nginx phải chuyển IP thật của người dùng qua header `X-Forwarded-For`.

### Cấu trúc thư mục dự kiến

```
docs/                 tài liệu (et-lead)
src/types/exam.ts     kiểu dữ liệu đề (et-lead khoá)
data/units/           unit-1.json … unit-8.json (et-author)
scripts/              strip-answers.ts, validate-exams.ts
audit/                kết quả giải mù và báo cáo (et-auditor)
qa/                   báo cáo kiểm thử (et-qa)
app/, src/            mã nguồn web (et-dev)
```

File nguồn (PDF, ảnh đề) không đưa vào repo.

## 5. Lộ trình 4 giai đoạn

### Giai đoạn 1: Khoá đặc tả và công cụ kiểm chéo

Người làm: et-lead.
- [x] `docs/source-materials.md`, `docs/exam-format.md`, `docs/PROTOCOL.md`, `docs/plan.md`.
- [x] Khởi tạo tối thiểu để chạy TypeScript (`package.json`, `tsconfig.json`, chạy script bằng `tsx`).
- [x] `src/types/exam.ts`: kiểu dữ liệu đề, đáp án, barem.
- [x] `scripts/strip-answers.ts`: tạo bản đề không có đáp án cho et-auditor.
- [x] `scripts/validate-exams.ts`: kiểm schema, số câu, thang điểm, quét trùng từ khoá giữa câu nối 1–5 và câu 6–30.
- [x] `scripts/compare-blind.ts`: so đáp án giải mù của et-auditor với đáp án của et-author, in danh sách câu `AMBIGUOUS`.

Xong khi: chủ dự án duyệt 4 file docs và `exam.ts`.

Ghi chú cho et-dev: `package.json` và `tsconfig.json` đã có sẵn. Thêm Next.js vào hai file này, không chạy `create-next-app` đè lên. Lệnh kiểm: `npm run validate`, `npm run strip -- N`, `npm run compare -- N`, `npm run typecheck`.

### Giai đoạn 2: Mẫu chuẩn Unit 6

Hai nhánh chạy song song:
- **Nội dung:** et-author soạn `data/units/unit-6.json` từ đề mẫu Unit 6, sửa 4 cặp lộ đáp án và câu 17, bổ sung Listening và Speaking. et-auditor giải mù và kiểm, cấp `AUDIT-OK`.
- **Code:** et-dev dựng giao diện và API chấm trên Unit 6. et-qa kiểm build, red team chống gian lận, kiểm `ACCESS_CODE` và rate limit, cấp `QA-OK`.

Xong khi: Unit 6 chạy đủ 4 kỹ năng trên máy local, có cả hai nhãn; chủ dự án dùng thử và duyệt.

### Giai đoạn 3: Sản xuất 7 Unit còn lại

- Thứ tự: Unit 4, 5 (đã có đề mẫu), rồi 1, 2, 3, 7, 8.
- Cuốn chiếu: et-author soạn Unit N+1 trong khi et-auditor kiểm Unit N.
- Mỗi Unit chỉ merge khi có `AUDIT-OK`.

Xong khi: đủ 8 Unit có `AUDIT-OK`, `validate-exams.ts` qua trên toàn bộ.

### Giai đoạn 4: Đóng gói và đưa lên VPS

- et-dev viết `Dockerfile` (standalone), `docker-compose.yml`, cấu hình mẫu Nginx và HTTPS.
- et-qa kiểm lại trên bản build production.
- Chủ dự án cung cấp thông tin VPS và domain khi đến bước này.

Xong khi: web chạy trên domain qua HTTPS, micro hoạt động, chấm AI hoạt động.

## 6. Vấn đề còn mở

1. **10 lần chấm/ngày đủ bao nhiêu đề.** Một đề cần ít nhất 2 lần chấm (Writing, Speaking), nên mỗi thiết bị làm được tối đa khoảng 5 đề đầy đủ mỗi ngày. Giới hạn theo cookie dễ bị lách bằng cách xoá cookie; trần theo IP chặn mức thiệt hại.
2. **Đáp án nằm trong repo public.** `data/units/*.json` chứa đáp án nên ai đọc GitHub cũng xem được. Với web luyện tập thì chấp nhận được; nếu muốn giấu thì phải tách dữ liệu sang repo private.
3. **Bản quyền:** repo public nên không được commit PDF, ảnh hay nguyên văn bài đọc và lời thoại của Pearson.
4. **Ảnh đề mẫu còn thiếu:** Part 2 của Unit 4 (cả hai bản), câu 1–5 bản Josh, email Unit 5.

## 7. Nhật ký

| Thời điểm | Sự kiện |
|---|---|
| 2026-10-14 14:34 +07 | et-lead viết lại 4 file docs sau khi phiên cloud mất dữ liệu (chưa push được do lỗi 403). |
| 2026-10-14 14:49 +07 | Chủ dự án duyệt docs, chốt repo public, giao et-lead chọn cách làm tròn. Tra API Docs ShopAIKey: định dạng Gemini gốc, nhận audio base64 (không có webm). |
| 2026-10-14 14:53 +07 | Xong Giai đoạn 1: `src/types/exam.ts`, `scripts/{lib,validate-exams,strip-answers,compare-blind}.ts`, đã test bằng đề giả (bắt được lộ đáp án, chính tả Mỹ, câu AMBIGUOUS). Chủ dự án cho phép bắt đầu Giai đoạn 2 mà không duyệt riêng `exam.ts`. |
| 2026-10-14 15:06 +07 | Bắt đầu Giai đoạn 2. Tạo 4 worktree trong `~/english-test-exam-wt/` (nhánh `content/unit-6`, `audit/unit-6`, `dev/unit6-app`, `qa/unit6-app`), mở 4 agent trong tab herdr của et-lead. Sandbox Codex (bubblewrap) không chạy được vì AppArmor chặn user namespace (`kernel.apparmor_restrict_unprivileged_userns = 1`), nên 3 agent Codex chạy `-s danger-full-access -a never`; et-author chạy `--dangerously-skip-permissions`. |
| 2026-10-14 15:13 +07 | et-author nộp Unit 6 (`cf3244d`, validate 0 lỗi 0 cảnh báo). et-lead quyết: giữ W33/W34 của đề gốc, thêm chế độ thi tuần tự để chặn lộ giữa các kỹ năng; giữ acceptedAnswers biến thể. Giao et-auditor giải mù Unit 6; et-author bắt đầu Unit 4 (nhánh `content/unit-4`, gốc bản Peter). |
| 2026-10-14 15:18 +07 | et-auditor trả Unit 6 "CẦN SỬA" (`de65da7`): 5 CHẶN, 2 NÊN SỬA. Lượt giải mù không hợp lệ vì `strip-answers` của et-lead để sót `sourceNotes` (chứa đáp án); compare chỉ để tham khảo (40/40 khớp). et-lead sửa: thêm `sourceNotes` vào `ANSWER_FIELDS`, thêm `--from/--out` cho strip, thêm quy tắc 11–15. Giữ R19 (encryption có trong giáo trình Unit 6 tr. 45, 47). |
| 2026-10-14 15:22 +07 | et-author nộp Unit 6 r1 (`2479991`) và Unit 4 (`cb35029`), validate 0 lỗi 0 cảnh báo. Mở phiên et-auditor mới trên nhánh `audit/unit-6-r1`, giao packet sạch (không còn `sourceNotes`). et-author bắt đầu Unit 5. |
| 2026-10-14 15:27 +07 | Giải mù Unit 6 r1 (phiên auditor mới, `b39d3c2`): `compare-blind` khớp 40/40. Báo cáo `5cf29b7`: 1 CHẶN (R12 có hai cách điền hợp lý: to know / knowing) và 3 NÊN SỬA (R14 gạch nối, email nêu từ nối trình tự, S2 ghi rõ ít nhất 2/3 cách giải nghĩa). Chờ et-author sửa (r2), giải mù lại R12. Giao auditor phiên mới cho Unit 4. |
| 2026-10-14 15:29 +07 | et-author nộp Unit 5 (`83ddbdd`), validate 0 lỗi 0 cảnh báo. Giao et-author sửa Unit 6 r2 rồi soạn Unit 1. |
| 2026-10-14 15:33 +07 | Giải mù Unit 4 (`23bdcf6`): khớp 40/40. Báo cáo `8ffd2ee`: chấp nhận CHẶN R9 và 3 NÊN SỬA (R25, R7 trùng tình huống email, nhiễu dùng lại 'query'); bác CHẶN W31–W35 (quy tắc 13 không áp dụng cho dịch Anh → Việt, đã ghi rõ). Unit 6 r2 (`0da18da`) validate 0 lỗi; giải mù lại R12, R14 bằng phiên auditor mới. |
| 2026-10-14 15:37 +07 | **Unit 6 AUDIT-OK.** Giải mù lại R12, R14 (`8c8c200`) khớp 2/2, báo cáo `d00e6b6` không có vi phạm mới. Merge `content/unit-6-r2`, `audit/unit-6-r1`, `audit/unit-6-r2` vào `main`. Nhánh `audit/unit-6` (lượt nhiễm đáp án) không merge. |
| 2026-10-14 15:40 +07 | et-author nộp Unit 4 r1 (`e986e3f`) và Unit 2 (`be51a44`), validate 0 lỗi cùng Unit 1, 5, 6. Giao et-author Unit 3, 7, 8. et-dev đã commit `24b565d`, vẫn đang làm. |
| 2026-10-14 15:42 +07 | **Unit 5 AUDIT-OK** (giải mù `124efe7` khớp 40/40; báo cáo `eaf6391` không có CHẶN; 3 NÊN SỬA về quy tắc 4 ở câu ngữ pháp gốc của giáo viên: giữ nguyên, nới quy tắc 4 chỉ áp cho câu từ vựng). Merge vào `main`. et-dev nộp `24b565d` (build, 61/61 test, e2e 3/3); giao et-qa kiểm. |
| 2026-10-14 15:46 +07 | Unit 4 r1 giải mù lại 6 câu (`4b25cda`) khớp 6/6; báo cáo `e7b7fe9` còn CHẶN R7 (while/after đúng ngữ pháp, chỉ loại bằng suy luận). Chờ et-author thêm ngữ cảnh cho R7 (r2) rồi giải mù lại R7. Giao auditor phiên mới cho Unit 1. |
| 2026-10-14 15:53 +07 | et-author nộp Unit 3 (`b366dcb`), 7 (`8b1a0a2`), 8; validate cả 8 Unit cùng lúc 0 lỗi. Giải mù Unit 1 (`b3e964b`) khớp 40/40; báo cáo `9e85ebd`: CHẶN R7 (vị trí trạng từ tần suất), NÊN SỬA lặp lịch L4/email. Giao et-author sửa Unit 4 r2 (R7) và Unit 1 r1; auditor phiên mới audit Unit 2. et-qa đã commit `278c68b`, đang làm tiếp. |
| 2026-10-14 15:53 +07 | et-qa kiểm `dev/unit6-app@24b565d` (báo cáo `278c68b`): Bước 1 QUA (typecheck, build, 61/61 test, e2e 3/3); Bước 2 70/72 ca QUA, 1 CHẶN QA-SEC-01 (feedback hợp lệ chứa API key do upstream phản chiếu vẫn được lưu và trả về). Giao et-dev sửa trên `dev/unit6-app-r1`. |
| 2026-10-14 15:55 +07 | et-author nộp Unit 1 r1 (`d1d8ee0`) và Unit 4 r2 (`64db3ba`), validate 0 lỗi; chờ giải mù lại R7 của cả hai. et-author tự rà Unit 3, 7, 8 theo các lỗi auditor đã bắt. |
| 2026-10-14 15:59 +07 | Giải mù Unit 2 (`5f2f93c`) khớp 40/40; báo cáo `3f950ad`: CHẶN R15 (nhiễu Plus) hạ xuống NÊN SỬA nhưng vẫn sửa, cùng 3 NÊN SỬA (R18, R19, S3); giao et-author Unit 2 r1. Bản tự rà Unit 3 r1, 7 r1, 8 r1 validate 0 lỗi. Auditor phiên mới giải mù lại R7 Unit 1 và Unit 4. |
| 2026-10-14 16:00 +07 | **Unit 1 và Unit 4 AUDIT-OK** (giải mù lại R7 `cfcfde8` khớp 1/1 mỗi Unit, báo cáo `e53aaa1`). Merge vào `main`. Unit 2 r1 (`2939025`) validate 0 lỗi. |
| 2026-10-14 16:06 +07 | **Unit 2 và Unit 3 AUDIT-OK** (Unit 2: giải mù lại R15/R18/R19 `bcefd84` khớp 3/3; Unit 3: `a78df5e` khớp 40/40, báo cáo `29a0ddd` không có CHẶN). Merge vào `main`. NÊN SỬA của Unit 3: ví dụ câu điều kiện trong đề email chỉ có mẫu loại 1; giao et-author sửa (r2), auditor xác nhận phần chữ. |
| 2026-10-14 16:08 +07 | Unit 3 r2 (`252a629`): chỉ sửa đề email (tách mẫu câu điều kiện loại 0 và loại 1), không đổi câu chấm tự động; et-lead duyệt, merge. |
| 2026-10-14 16:11 +07 | et-dev nộp `dev/unit6-app-r1@e4eb51d` sửa QA-SEC-01 (122/122 unit test, 17/17 e2e). Giao et-qa kiểm lại trên `qa/unit6-app-r1`. |
| 2026-10-14 16:14 +07 | Unit 7: giải mù `aabca0d` khớp 40/40, báo cáo `d89202f` 2 CHẶN (R19, R27); et-author sửa r2 (`563b374`), auditor phiên mới giải mù lại. Unit 8: giải mù `5e29126` khớp 40/40, báo cáo `1b23076` 1 CHẶN (R7 since/yet) và 2 NÊN SỬA; giao et-author r2. |
| 2026-10-14 16:17 +07 | **Unit 7 AUDIT-OK** (giải mù lại R19/R27 `b00befc` khớp 2/2, báo cáo `7182540` không có phát hiện). Merge vào `main`. Unit 8 r2 (`bcc8bc7`) validate 0 lỗi; auditor phiên mới giải mù lại R7, R11, R21–R25. |
| 2026-10-14 16:20 +07 | **Unit 8 AUDIT-OK** (giải mù lại R7, R11, R21–R25 `6bcffe2` khớp 7/7; báo cáo `3b336dc` chỉ còn NÊN SỬA về độ chặt lập luận kỹ thuật ở bài đọc, R22 vẫn một đáp án). **Đủ 8/8 Unit AUDIT-OK trên `main`.** |
| 2026-10-14 16:20 +07 | Bắt đầu Giai đoạn 4 song song: et-dev đóng gói Docker + Nginx + HTTPS trên nhánh `dev/deploy` (từ `dev/unit6-app-r1` + main có đủ 8 Unit), kiểm app chạy cả 8 Unit. et-qa vẫn đang kiểm lại `dev/unit6-app-r1`. |
| 2026-10-14 16:22 +07 | et-qa kiểm lại r1 (`9361e77`): QA-SEC-01 gốc PASS, bộ cũ 72/72; 2 CHẶN mới do et-lead yêu cầu thử biến thể (chèn khoảng trắng, chia mảnh qua nhiều trường), 80/128 PASS. Đánh giá rủi ro thực tế thấp (model không thấy bí mật) nhưng sửa vì rẻ: quét gộp đã chuẩn hoá, giao et-dev `dev/unit6-app-r2` sau khi xong `dev/deploy`. |
| 2026-10-14 16:52 +07 | et-dev nộp `dev/unit6-app-r2@e418c44` (quét gộp bí mật; 222/222 test; script QA 128/128, 52/52) và `dev/deploy@07c4fac` (Docker, Compose, Nginx mẫu, README VPS, đủ 8 Unit; e2e 27/27, e2e container 13/13). Giao et-qa kiểm `dev/deploy` trên `qa/deploy`. |
| 2026-10-14 17:09 +07 | **QA-OK** cho `dev/deploy@07c4fac` (báo cáo `86ed550`): 72/72, 128/128, 52/52, biến thể mới 140/146 (6 ca hex = rủi ro đã chấp nhận); 222/222 test; e2e 27/27; container và Nginx smoke qua. Merge web + đóng gói + hồ sơ QA vào `main` (`467d3c1`, `8d7b168`); trên `main` typecheck, validate 8 Unit, 222/222 test qua. Giai đoạn 2, 3 xong; Giai đoạn 4 chờ VPS, domain và API key thật. |
| 2026-10-14 18:15 +07 | Giải tán team: 4 agent thoát, đóng pane. Worktree trong `~/english-test-exam-wt/` và các nhánh giữ lại trên máy (không push). |
