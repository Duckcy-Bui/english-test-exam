# QA Unit 6 app r1 — CẦN SỬA

- Agent: et-qa — Codex gpt-6.1-sol, effort high.
- Commit et-dev được giao: **`e4eb51d931e99cac0b024eaa953900340378486b`**, nhánh `dev/unit6-app-r1`.
- Tạo `qa/unit6-app-r1` từ `qa/unit6-app`, merge bằng `git merge --no-edit e4eb51d`; merge commit **`15deee3`**. Không conflict, giữ nguyên báo cáo/chứng cứ QA vòng đầu.
- Chốt kiểm tra theo `date '+%Y-%m-%d %H:%M:%S %z'`: **2026-10-14 16:18:29 +0700**.
- Runtime dùng Unit 6 thật trong `data/units/`; gate validate kiểm cả Unit 5 và Unit 6 đang có trong commit, và fixture Unit 6 riêng.
- Node `v24.21.0`, npm `11.19.0`, Next.js `16.4.0`; Chromium headless. Không có API key thật; mọi secret trong harness là synthetic, không gọi dịch vụ AI bên ngoài.
- Không sửa code et-dev, docs, data hoặc test có sẵn. Chỉ thêm/sửa file trong `qa/`. Đã dọn `AGENTS.md` và hoàn nguyên `next-env.d.ts` do Next dev tự sinh/đổi. Không merge main, không push. MCP graph không expose trong phiên, dùng đọc source trực tiếp làm fallback; không đọc chat et-dev.

## Kết luận

**Bước 1 QUA. Bước 2 KHÔNG QUA. Đề nghị CẦN SỬA; chưa cấp QA-OK.**

QA-SEC-01 nguyên văn của vòng đầu đã **PASS**: upstream trả key trong feedback thì retry một lần, trả 502 và không lưu kết quả; GET sau đó trả 409. Bộ cũ chạy lại đầy đủ **72/72 PASS**. Unit tests **122/122 PASS**, E2E **17/17 PASS** đã được QA tự chạy, không chỉ dựa trên số et-dev báo.

Phạm vi mở rộng theo et-lead phát hiện **2 lỗi CHẶN** của cùng boundary bí mật: chèn whitespace và chia bí mật thành mảnh nhỏ qua nhiều trường. Cả ba biến `AI_API_KEY`, `SESSION_SECRET`, `ACCESS_CODE` đều có thể khôi phục đầy đủ từ kết quả HTTP 200 của Writing/Speaking và GET đọc lại. Bộ biến thể HTTP: **80 PASS / 48 FAIL**; kiểm handler cached result: **28 PASS / 24 FAIL**, củng cố cùng hai lỗi này, không phải thêm 24 lỗi độc lập.

Đây là giả lập upstream độc hại, không chứng minh sinh viên đã lấy được key thật hoặc model thật đã biết/tiết lộ secret. Tuy nhiên, invariant được giao là không trả bí mật server qua đầu ra AI; các ca FAIL trả đủ dữ liệu để người đọc browser khôi phục toàn bộ bí mật synthetic.

## Lỗi — mỗi lỗi một dòng

- **QA-SEC-01-R1-A | CHẶN | Whitespace vượt bộ quét, cả Writing/Speaking và cả 3 secret |** Fake Gemini trả JSON chấm đúng barem với secret đã chèn khoảng trắng giữa từng ký tự, xuống dòng sau mỗi 4 ký tự, tab+xuống dòng; hoặc base64 chia dòng mỗi 4 ký tự, URL percent-encode có khoảng trắng giữa byte, Unicode escape có xuống dòng giữa ký tự. `POST /api/grade` **200**, gọi upstream **1 lần** (không retry), lưu kết quả; `GET /api/grade` **200**. Harness bỏ whitespace rồi decode nếu cần và thu lại **đúng toàn bộ secret**, không chỉ một prefix. **Tái hiện:** `node qa/unit6-app-r1.secrets.mjs`, xem 36 FAIL thuộc `spaces-every-character`, `newlines-every-four`, `tabs-newlines-every-four`, `base64-newlines-four`, `URL-with-spaces`, `unicode-with-newlines`; ví dụ snapshot `qa/unit6-app-r1-evidence/leak-writing-AI_API_KEY-spaces-every-character-feedback.json` có `reconstructable=true`, `readbackReconstructable=true`, `savedResult=true`. **Nguồn:** `src/server/secrets.ts:144–169` quét string nguyên trạng, decode nhưng không tạo bản đã chuẩn hoá whitespace; regex token base64 `:162` không gom nhóm ký tự bị ngắt. **Đề xuất:** thêm các biểu diễn chuẩn hoá whitespace trước/sau decode (vẫn giới hạn byte/depth), kiểm đúng toàn secret hoặc fragment đủ nhận dạng sau chuẩn hoá; cùng một guard phải được dùng lúc nhận AI và khi trả cached result. Thêm regression HTTP cho cả 3 secret, 2 kỹ năng, GET/POST và retry sạch.
- **QA-SEC-01-R1-B | CHẶN | Secret chia qua feedback + corrections vượt bộ quét, cả Writing/Speaking và cả 3 secret |** Chia secret nguyên văn hoặc base64 thành các mảnh 4 ký tự: mảnh đầu ở `feedback`, phần còn lại theo thứ tự ở `corrections[].original`, `corrected`, `note`. Từng string hợp lệ và ngắn hơn ngưỡng fragment 8; JSON điểm vẫn hợp lệ. API **200** sau **1 lần** gọi model, lưu kết quả, GET **200**. Ghép `feedback + corrections` theo thứ tự và decode base64 nếu cần khôi phục **đúng toàn bộ secret**. **Tái hiện:** cùng script, xem 12 FAIL `split-four` / `split-base64-four`, ví dụ `qa/unit6-app-r1-evidence/leak-speaking-SESSION_SECRET-split-four-feedback.json` hoặc `leak-writing-AI_API_KEY-split-base64-four-corrected.json`; kiểm cached bằng `node --conditions=react-server --import tsx qa/unit6-app-r1.cached.mts`. **Nguồn:** `src/server/secrets.ts:124–144` tách các string rồi tạo queue độc lập, không kiểm biểu diễn ghép các giá trị; `app/api/grade/route.ts:25,51,86` gọi lại cùng guard nên cached GET/POST không cứu được. **Đề xuất:** kiểm biểu diễn ghép các giá trị text theo thứ tự xác định trong cùng grade/corrections, cả raw và decoded, với giới hạn tài nguyên; không chỉ hạ ngưỡng fragment từng field vì sẽ tăng false positive. Giữ fail closed và không lưu/trả grade nhiễm. Cần regression chia nhỏ qua nhiều field ở HTTP và cache guard.

Không có lỗi NÊN SỬA mới được xác nhận. Không tính một mảnh 1–4 ký tự riêng lẻ là secret leak; các ca ở đây ghép lại được đầy đủ một credential duy nhất, đã kiểm equality bằng harness.

## Bước 1 — lệnh và kết quả thực chạy

Output dưới `qa/unit6-app-r1-evidence/`. Log text đã bỏ CR/khoảng trắng cuối dòng và dòng trống cuối file, không đổi kết quả.

| Lệnh | Kết quả | Chứng cứ |
| --- | --- | --- |
| `git switch -c qa/unit6-app-r1 qa/unit6-app` rồi `git merge --no-edit e4eb51d` | Thành công, không conflict | Merge `15deee3` |
| `npm ci` | Exit 0 | `npm-ci.log` |
| `npm run typecheck` | Exit 0 | `typecheck.log` |
| `npm run validate` | Exit 0; Unit 5 và Unit 6 đều 0 lỗi/0 cảnh báo | `validate-data.log` |
| `npm run validate -- fixtures/unit-6.sample.json` | Exit 0; fixture 0 lỗi/0 cảnh báo | `validate-fixture.log` |
| `npx next build` | Exit 0, standalone production thành công | `build.log` |
| `npm test` | Exit 0, **122/122 PASS**, 0 skip | `unit-tests.log` |

Validator kiểm số câu, schema và hằng số thang điểm 2,5 mỗi kỹ năng/tổng 10. Không mở rộng audit nội dung của Unit 5; dữ liệu Unit 5 đi kèm commit chỉ được kiểm qua schema gate.

## Bước 2 — lệnh và kết quả thực chạy

| Lệnh | Kết quả | Chứng cứ |
| --- | --- | --- |
| `node qa/unit6-app.redteam.mjs` | Exit 0, **72/72 PASS**, toàn bộ bộ vòng đầu | `redteam.log`, `redteam-results.json`, `key-feedback-{writing,speaking}.json` |
| `node qa/unit6-app-r1.secrets.mjs` | Exit 1 do phát hiện leak, **80 PASS / 48 FAIL** | `secret-variants.log`, `secret-variants-results.json`, `leak-*.json` |
| `node --conditions=react-server --import tsx qa/unit6-app-r1.cached.mts` | Exit 1 do guard cached cho qua whitespace/split, **28 PASS / 24 FAIL** | `cached.log`, `cached-results.json` |
| Từ `qa/unit6-app-r1-run`: `TMPDIR=/home/duckcy/english-test-exam-wt/qa/qa/unit6-app-r1-evidence/runtime ../../node_modules/.bin/playwright test --config ../unit6-app-r1.playwright.config.ts` | Exit 0, **17/17 E2E PASS**, 16.1 giây | `e2e.log`; screenshots trong `qa/unit6-app-r1-run/test-results/` |

Harness cũ chỉ đổi default evidence sang thư mục r1, gắn commit nguồn r1, và siết ca QA-SEC-01 kỳ vọng 502/2 calls/GET 409/no result. Không bỏ ca nào trong bộ cũ. Các evidence vòng đầu và báo cáo cũ không bị ghi đè.

### Ma trận biến thể secret

120 ca chính = 20 biểu diễn × 3 secret × 2 kỹ năng. Thêm 1 ca feedback của bản dịch Writing, 6 ca retry sạch (3 secret × 2 kỹ năng) và 1 ca log => tổng 128.

| Biểu diễn | Số ca | Kết quả |
| --- | ---: | --- |
| Nguyên văn | 6 | PASS: POST 502, 2 calls, GET 409, không lưu result |
| Cắt prefix 16 / đoạn giữa 8 / suffix 16 ký tự | 18 | PASS, cùng hành vi reject |
| URL percent-encode / double URL | 12 | PASS |
| Base64 / base64url / base64 cắt prefix hoặc suffix 16 ký tự | 24 | PASS |
| Literal Unicode `\\uXXXX` / JSON wire escape Unicode trong key và string | 12 | PASS: JSON parse/decode không làm secret lọt ra |
| Space giữa mỗi ký tự / newline mỗi 4 / tab+newline mỗi 4 | 18 | **FAIL: POST 200, GET 200, 1 call, full secret reconstructable** |
| Base64 có newline / URL byte có space / Unicode escape có newline | 18 | **FAIL**, cùng hành vi |
| Chia secret raw / base64 thành mảnh 4 qua feedback + corrections | 12 | **FAIL**, cùng hành vi |
| Key nguyên văn trong translation feedback | 1 | PASS |
| Secret base64 ở corrections.note lần đầu, lần sau sạch | 6 | PASS: 2 calls, POST/GET 200 chỉ chứa grade sạch |
| App log không chứa secret nguyên văn | 1 | PASS |

Placement: base64 ở `corrections.corrected`, URL ở `corrections.original`, literal Unicode ở `corrections.note`; raw/truncated/whitespace ở feedback; split trải cả feedback và các trường corrections. Fake upstream thực sự phục vụ HTTP Gemini `generateContent`; kiểm Authorization, model route, temperature 0 và skill tương ứng. Không sửa/mocking hàm production trong bộ HTTP này. Biến thể chạy `TRUST_PROXY=1`, XFF riêng mỗi ca, quota cao để tránh giới hạn 30 login/15 phút làm nhiễu kết quả; bộ hồi quy riêng vẫn kiểm `TRUST_PROXY=0` và các quota thật 10/100.

Harness không chỉ tìm string nguyên văn trong response: nó **tự tái tạo credential từ JSON trả browser** rồi so sánh với secret synthetic. Snapshot đã thay nội dung synthetic bằng placeholder; các boolean `reconstructable`, `readbackReconstructable`, `savedResult` và code tái tạo được giữ để tái hiện.

### Cached result — kiểm riêng hai guard

`unit6-app-r1.cached.mts` import handler GET/POST thật, tạo phiên/grade bằng hàm server thật, rồi seed grade cached với payload kiểm thử. Đây là **integration in-process**, không phải HTTP/browser proof và không thay file source. Mỗi fixture được dọn khỏi map sau assertion để không vướng cap 20 phiên.

- 4 ca cached sạch (2 kỹ năng × 2 method): 200, result giữ nguyên.
- 24 ca nguyên văn/base64 (3 secret × 2 biểu diễn × 2 kỹ năng × 2 method): 502, `s.result` bị xoá, status về idle.
- 24 ca whitespace/split-four: **200**, `s.result` vẫn giữ, status submitted. Củng cố QA-SEC-01-R1-A/B ở cả GET và cached POST.
- Các bộ HTTP bên trên đã chứng minh POST thực tế tạo và lưu được cùng dạng output bypass; đây không chỉ là một cached fixture không thể sinh từ upstream.

### Không hồi quy

Toàn bộ 72 ca bộ cũ và 17 E2E PASS. Các kiểm sau đã chạy lại trên code r1:

- ACCESS_CODE thiếu/sai, cookie giả: 401; đọc phiên khác device: 404.
- 10 AI grade/device: 10 ca 200, lượt 11 là 429. 100/IP: đổi cookie/device/XFF không vượt trần với `TRUST_PROXY=0`; lượt 101 là 429. Khởi động lại server vẫn 429 do SQLite quota tồn tại.
- Limit cấu hình 3/device, 5/IP; full scope tốn 2; 4 grade đồng thời khi còn 2 quota chỉ 2 ca thành công. Cached result sạch không trừ thêm quota.
- Thi full tuần tự Listening → Reading → Writing → Speaking; không mở trước kỹ năng sau, nhảy thứ tự/nộp sớm bị 409; snapshot đáp án đã nộp không bị sửa từ request cuối. Mỗi phần Listening tối đa 2 lượt.
- Response session/section/units không có đáp án, giải thích, reference translation/model/sample answer hoặc sourceNotes; GET kết quả trước nộp 409. Script nghe được gửi qua playback cho browser TTS, không có đáp án trong playback.
- Quét 52 JS/map dev + production: không có key synthetic/bài mẫu/chuỗi tham chiếu riêng tư được chọn; HTML không chứa key/bài mẫu. Paths dữ liệu, source, `.env` đều 404. Không phát hiện lộ đáp án qua app trước nộp.
- JSON điểm sai, thêm tổng, thiếu field, điểm âm/vượt barem/kiểu sai, wordCount giả, ID trùng, bài trống có điểm, phát âm khi chỉ text đều bị từ chối; retry/fallback đúng số lần, không lưu grade sai.
- 7 payload injection × Writing/Speaking chạy lại trong mock và Gemini giả lập; bài trống 0, điểm mock/fake cố định không bị command tăng lên. WAV mono 16 kHz được gửi inlineData, webm sai MIME bị 400 trước upstream.
- E2E Chromium làm đủ đề Unit 6 thật 7,50, review sau nộp, lưu/xoá history, mobile 390 px không overflow, thu âm WAV. 14 E2E secret có sẵn kiểm raw/URL/base64/truncation và clean retry cũng PASS.

## Giới hạn, tái chạy và cleanup

**CHƯA KIỂM model thật:** sức chống prompt injection ngữ nghĩa, chấm tiếng Việt/chép đề và phát âm thực tế. Không có API key thật trong gói. AI_MOCK/fake upstream không chứng minh chất lượng chấm của Gemini thật.

Sau `npm ci` và `npx next build`, chạy ba lệnh QA trong bảng; bộ cũ copy static sang standalone cho browser. Các port QA cần trống: dev 3100; production regression 3101; variant app 3111; Gemini fake 3199 và 3197. E2E dùng 3106/3108 và fake 3198. Harness tự tắt process group/server trong finally.

Để tái chạy E2E từ subdirectory mà không thay test et-dev dùng `process.cwd()`, tạo `qa/unit6-app-r1-run/.next` symlink tới `../../.next`, tạo `qa/unit6-app-r1-evidence/runtime/`, rồi chạy đúng command trong bảng. Mọi output/tạm do QA cấu hình ở dưới `qa/`; symlink, SQLite/WAL/SHM và runtime/playwright output phụ được ignore. Chỉ snapshot/log/JSON và script/config/report được nộp.

Đã xác nhận `ss -ltn '( sport = :3100 or sport = :3101 or sport = :3106 or sport = :3108 or sport = :3111 or sport = :3197 or sport = :3198 or sport = :3199 )'` không có listener sau khi xong. Không có server do QA khởi động còn chạy.

et-dev cần sửa hai bypass trên nhánh revision mới; et-lead giao commit mới để QA chạy lại ca nguyên văn lẫn biến thể và cache guards. Không tự sửa implementation trong nhánh QA.
