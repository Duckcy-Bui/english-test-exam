# QA Unit 6 app — CẦN SỬA

- Agent: et-qa — Codex gpt-6.1-sol, effort high.
- Gói được kiểm: `dev/unit6-app @ 24b565dce748a1a9f67aab69431cedb6ec4396c3`, fast-forward vào `qa/unit6-app` theo lệnh et-lead.
- Dữ liệu runtime: `data/units/unit-6.json` thật đã AUDIT-OK; fixture được validate riêng.
- Thời điểm chốt kiểm tra, lấy từ `date '+%Y-%m-%d %H:%M:%S %z'`: **2026-10-14 15:49:34 +0700**.
- Môi trường: Node `v24.21.0`, npm `11.19.0`, Next.js `16.4.0`, Linux; Chromium headless cho E2E.
- Không sửa code, docs, dữ liệu hoặc test et-dev. Chỉ nộp file trong `qa/`; không merge main, không push. `next dev` tự sinh `AGENTS.md` và đổi đường dẫn generated types trong `next-env.d.ts`; đã xác minh nguồn sinh và dọn/hoàn nguyên về trạng thái nhận gói sau khi tắt dev server.
- MCP graph không được expose trong phiên này; đọc source trực tiếp làm fallback. Không đọc lịch sử chat et-dev.

## Kết luận

**Bước 1 QUA. Bước 2 KHÔNG QUA. Đề nghị CẦN SỬA, chưa cấp QA-OK.**

Có **1 lỗi CHẶN**, tái hiện ở cả Writing và Speaking: JSON chấm đúng schema nhưng có key thử nghiệm do upstream phản chiếu trong `feedback` được server nhận, lưu và trả về browser. Đây là kiểm boundary với upstream giả lập độc hại; không phải bằng chứng sinh viên đã lấy được key thật hoặc Gemini thật đã tiết lộ key.

Các kiểm khác: 61/61 unit test có sẵn PASS; 3/3 E2E production PASS; bộ kiểm HTTP độc lập **70 PASS / 2 FAIL** (2 FAIL là hai đường tái hiện của cùng lỗi CHẶN).

## Lỗi

- **QA-SEC-01 | CHẶN | Writing + Speaking |** Upstream phản chiếu `AI_API_KEY` trong chuỗi `feedback` của một JSON chấm hợp lệ: `POST /api/grade` trả **200**, chứa key thử nghiệm; `GET /api/grade?sessionId=...` đọc lại cũng **200** và vẫn chứa key. **Tái hiện:** chạy `node qa/unit6-app.redteam.mjs`, xem hai ca `Gemini writing/speaking does not expose key echoed by upstream in feedback` và `qa/unit6-app-evidence/key-feedback-{writing,speaking}.json` (`leaked=true`, `readbackLeaked=true`); server Gemini cục bộ lấy key synthetic từ header Authorization rồi đưa vào feedback, mọi điểm vẫn hợp lệ. **Nguồn:** `src/server/ai.ts:69–72` chỉ kiểm kiểu/độ dài chuỗi, `:157–158` và `:214–215` nhận feedback/corrections; `app/api/grade/route.ts:66–69` lưu rồi trả kết quả. UI hiển thị chuỗi ở `src/components/ResultsPage.tsx:108` và `:154`; có khả năng được lưu tiếp vào lịch sử browser. **Đề xuất:** trước khi lưu/trả kết quả AI, kiểm hoặc che các bí mật server trong mọi chuỗi model trả về (feedback của từng bản dịch/email/Speaking, original/corrected/note); nếu phát hiện thì fail closed bằng lỗi public an toàn và không lưu điểm, hoặc áp dụng chính sách redaction thống nhất. Thêm regression cho POST và GET đọc lại, không log nguyên đầu ra chứa bí mật. Raw error/HTTP 500 upstream đã được che tốt; lỗi nằm ở nhánh JSON hợp lệ.

Không có lỗi NÊN SỬA khác được xác nhận trong phạm vi này.

## Bước 1 — lệnh và kết quả

Các lệnh chạy ở root worktree trừ E2E (chạy trong `qa/` để screenshot của test có sẵn cũng nằm đúng phạm vi QA). Log text chỉ chuẩn hoá CR/khoảng trắng cuối dòng và dòng trống cuối file, không đổi nội dung kết quả.

| Lệnh thực tế | Kết quả | Chứng cứ |
| --- | --- | --- |
| `git merge --no-edit 24b565d` | Fast-forward, không conflict | Commit nguồn ở đầu báo cáo |
| `npm ci` | Exit 0; 53 packages; audit 0 vulnerabilities | Output terminal; dùng đúng lockfile theo hướng dẫn et-lead |
| `npm run typecheck` | Exit 0 | `unit6-app-evidence/typecheck.log` |
| `npm run validate` | Exit 0; Unit 6: 0 lỗi, 0 cảnh báo | `unit6-app-evidence/validate-data.log` |
| `npm run validate -- fixtures/unit-6.sample.json` | Exit 0; fixture: 0 lỗi, 0 cảnh báo | `unit6-app-evidence/validate-fixture.log` |
| `npx next build` | Exit 0, standalone production build thành công | `unit6-app-evidence/build.log` |
| `npm test` | Exit 0, 61/61 PASS, 0 skipped | `unit6-app-evidence/unit-tests.log` |
| `node qa/unit6-app.redteam.mjs` | Exit 1 có chủ đích do 2 ca phát hiện lỗi; 70 PASS / 2 FAIL | `unit6-app-evidence/redteam.log`, `redteam-results.json` |
| `cd qa` rồi `../node_modules/.bin/playwright test --config unit6-app.playwright.config.ts` | Exit 0, 3/3 PASS, 13.4 giây | `unit6-app-evidence/e2e.log`; `test-results/unit-6-{results-desktop,home-mobile}.png` |

Validator xác nhận số câu Listening 10, Reading 30, dịch 5, email 1, Speaking 3 phần; hằng số mỗi kỹ năng 2,5/tổng 10. E2E dùng đáp án dữ liệu thật xác nhận Listening/Reading đều 2,5; Writing/Speaking mock đều 1,25; cả đề 7,50 sau làm tròn.

## Bước 2 — ma trận kiểm chống gian lận

`unit6-app.redteam.mjs` tự khởi động và tắt các process group nó tạo: Next dev mock `127.0.0.1:3100`, Next standalone production `127.0.0.1:3101`, Gemini giả lập `127.0.0.1:3199`. Server production cho E2E dùng `127.0.0.1:3106`, Playwright quản lý vòng đời. Runtime luôn trỏ dữ liệu Unit 6 thật. Key trong QA là chuỗi synthetic, không có key thật và không gọi ShopAIKey bên ngoài.

| Nhóm kiểm | Kết quả đã quan sát |
| --- | --- |
| Writing/Speaking injection với `AI_MOCK=1` | 7 payload × 2 kỹ năng: lệnh bỏ hướng dẫn/trả 2,5; lệnh tiếng Việt giấu trong bản dịch; JSON giả điểm; bài tiếng Việt; bài trống; chép đề; giả kết thúc delimiter/đổi role. Bài không rỗng nhận điểm mock cố định 1,25, bài trống 0; không tăng điểm theo lệnh. Kết quả đánh dấu `mock=true`. |
| Cùng payload qua Gemini HTTP giả lập, `AI_MOCK=0` | 14 ca PASS về cấu trúc truyền tải/validation. `temperature=0`, JSON schema đóng, system instruction quy định bài là dữ liệu không đáng tin và cấm chấm theo lệnh; delimiter có nonce ngẫu nhiên. Payload nằm trong contents/user, không thành system instruction. Bài trống trả 0 và không gọi upstream. Fake server trả điểm cố định 1,25 cho các bài khác, **không đánh giá nội dung/ngôn ngữ**. |
| JSON điểm sai chung cho hai kỹ năng | Vượt barem, âm, kiểu chuỗi, thêm tổng điểm, thiếu tiêu chí, JSON hỏng, số vô hạn qua `1e309`: HTTP 502 sau đúng 2 lần gọi, không có `result`; GET kết quả trả 409. |
| Writing riêng | Word count giả, trùng ID bản dịch, điểm dịch 0,2 (không phải 0/0,125/0,25), email <60 từ nhưng steps=0,5, email trống có điểm, bản dịch trống có điểm đều bị 502; không lưu điểm. |
| Speaking riêng | Nhận xét phát âm khi chỉ có text, task tối đa khi thiếu câu trả lời đều bị 502; không lưu điểm. |
| Envelope/upstream độc hại | Body >128 KiB, finishReason=SAFETY, upstream HTTP 500 có key synthetic trong body: 502 an toàn, không lộ raw error/key trong response/log. |
| Retry và fallback | JSON sai lần đầu rồi đúng: đúng 2 lần gọi, lưu điểm hợp lệ. Primary HTTP 500: chuyển sang fallback, 2 lần gọi. JSON hợp lệ ngay: 1 lần gọi. Tất cả điểm kỹ năng ≤2,5 và tổng ≤10. |
| Audio | WAV PCM 16-bit mono 16 kHz giả lập được gửi dưới `inlineData`, MIME `audio/wav`; audio/webm bị 400 trước upstream. E2E Chromium ghi âm thật bằng thiết bị media giả của browser, kiểm header WAV và hoàn tất chấm. Không thấy dữ liệu base64 audio trong kết quả. |
| ACCESS_CODE | Thiếu code, code sai: 401; grade không có auth: 401; auth/device cookie giả chữ ký: 401. Đăng nhập đúng cấp cookie; đọc phiên từ device khác: 404. |
| Rate limit mặc định | `RATE_LIMIT_PER_DEVICE=10`, `RATE_LIMIT_PER_IP=100`, `TRUST_PROXY=0`: device đầu 10 lượt 200, lượt 11 là 429; đổi cookie/device 9 lần làm đủ 100 lượt, device mới với XFF mới vẫn 429 ở lượt 101. XFF đổi liên tục không tạo bucket IP khác. Đọc/chấm lại kết quả đã lưu không mất thêm quota. |
| Persistence quota | Tắt rồi khởi động lại standalone với cùng SQLite DB; cookie mới/XFF mới vẫn 429 do trần IP đã dùng hết. |
| Rate limit cấu hình + race | Đổi limit thành 3/device, 5/IP; chấm scope full tốn 2 lượt, thêm Writing tốn 1, lượt kế tiếp device bị 429. Device mới gửi 4 grade đồng thời: đúng 2 ca 200 và 2 ca 429, không vượt 5/IP. |
| Thi tuần tự | Ban đầu chỉ Listening; nộp lần lượt mở Reading → Writing → Speaking. Nhảy kỹ năng/nộp cả đề sớm: 409. Section đã nộp bị khoá; sửa đáp án trước đó trong request cuối không đổi điểm Listening/Reading/Writing. GET kết quả trước nộp: 409; request đổi mode khi grade: 400. |
| Giới hạn Listening | Thi thử mỗi phần nghe 2 lần; lần 3 trả 429. Playback chứa script để browser TTS hoạt động, không có trường đáp án/giải thích. |
| Lộ đáp án trước nộp | Recursively kiểm `/api/units`, `/api/session`, `/api/section` ở các scope/mốc: không có answerKey/acceptedAnswers/explanation/referenceTranslation/modelAnswer/sampleAnswer/sourceNotes/script. Trước khi nộp đủ đề không lấy được review. Sau khi nộp mới có review/đáp án theo scope. |
| HTML/bundle/file paths | Quét JS/source map client của dev và standalone production (52 file), không có key synthetic hoặc các chuỗi tham chiếu riêng tư đã chọn từ đề thật. HTML trang chủ không có key/bài mẫu. `/data/units/unit-6.json`, `/fixtures/unit-6.sample.json`, `/.env`, `/.env.local`, `/src/server/ai.ts` đều 404. E2E cũng kiểm API trả về không có đáp án/key. |
| API key trong logs và response | Logs app không có key synthetic. Error response upstream được che. **FAIL** khi JSON đúng schema chứa key ở feedback: POST và GET đều trả nguyên key; xem QA-SEC-01. |
| UI production | 3 E2E PASS: API security/sequential; browser làm đủ đề 7,50, xem bài mẫu sau nộp, lưu/xoá history; ghi âm WAV trong luyện tập Speaking. Không pageerror; mobile 390 px không overflow. Đã xem screenshot mobile. |

## Giới hạn chứng cứ và tái chạy

**CHƯA KIỂM bằng model thật:** khả năng Gemini thật bị prompt injection, chấm sai ngôn ngữ/chép đề hoặc đánh giá phát âm. Không có API key thật theo bàn giao. AI_MOCK và fake server chỉ chứng minh không có đường client trực tiếp ghi điểm, JSON/barem được kiểm, request/prompt được phân tách; không chứng minh chất lượng hay sức chống injection ngữ nghĩa của model thật. Bản dịch Anh → Việt hợp lệ đương nhiên dùng tiếng Việt; payload sai ngôn ngữ trong nhóm này áp dụng vào email/Speaking.

Không coi lời thoại gửi browser để TTS là lỗi lộ đáp án: đó là đường playback được thiết kế; bộ kiểm đã xác nhận giới hạn nghe và không có trường answerKey/acceptedAnswers/explanation trong playback. Repo public chứa đáp án là quyết định của đặc tả, không được tính thành lỗi bundle.

Tái chạy từ root sau `npm ci` và `npx next build`: `node qa/unit6-app.redteam.mjs`; script copy static assets sang standalone, dùng các port trên (cần trống), tạo lại DB quota riêng trong `qa/unit6-app-evidence/`, ghi JSON/log và tắt server trong finally. Gemini fake là một server HTTP `generateContent` thực sự, không monkey-patch code et-dev. Tái chạy E2E bằng lệnh trong bảng; config QA dùng data thật, SQLite riêng và output dưới `qa/`. Các SQLite/WAL/SHM là runtime cục bộ, bị ignore; JSON evidence đủ mô tả quota và call counts. Chứng cứ key phản chiếu đã thay chuỗi synthetic bằng `[SYNTHETIC_API_KEY_REDACTED]` trong snapshot.

Sau cả hai lượt kiểm, `ss -ltn '( sport = :3100 or sport = :3101 or sport = :3199 or sport = :3106 )'` không có listener. Không còn server QA/E2E được khởi động trong lượt này.

et-dev cần sửa QA-SEC-01 trên nhánh revision mới, et-lead giao commit mới để QA kiểm lại boundary JSON hợp lệ, không tự sửa code et-dev trong worktree QA.
