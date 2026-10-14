# QA deploy @ 07c4fac

Agent: **et-qa — Codex gpt-6.1-sol (high)**. Nhánh kiểm: `qa/deploy`, tạo từ `qa/unit6-app-r1`, merge `07c4facfbabc45dfa439954a57e670ec1f0c73b3` bằng merge commit `8376ca0`. Gói gồm sửa security r2 `e418c444eef40bb1abc10944eb1abcad2001cdcf`, Docker/Nginx/health và đủ 8 Unit. Không sửa implementation, docs, data hoặc tests et-dev; mọi file QA dưới `qa/`. Không merge main, không push. MCP graph không expose trong phiên, đọc source trực tiếp; không đọc chat et-dev.

Thời điểm chốt theo `date '+%Y-%m-%d %H:%M:%S %z'`: **2026-10-14 17:06:10 +0700**.

## Kết luận và mức độ

**Đề nghị QA-OK trong phạm vi đặc tả và rủi ro đã được et-lead chấp nhận tại `docs/plan.md:70`. Không còn CHẶN trong phạm vi này.**

QA-SEC-01 nguyên văn và QA-SEC-01-R1-A/B đã PASS: bộ nền 72/72, 128 ca biến thể cũ 128/128, cached GET/POST 52/52. Zero-width và đảo thứ tự mảnh mới cũng PASS. Gate tĩnh, 222 unit tests, 27 E2E, API cả 8 Unit, container và Nginx smoke đều qua.

**Không gọi bộ biến thể mở rộng là toàn bộ PASS:** tổng **140 PASS / 6 FAIL**. Sáu FAIL là hex, ghi NÊN SỬA dưới đây. Đây là residual từ upstream giả lập cố ý chèn một secret mà harness đã cung cấp. Đặc tả hiện hành ghi rõ: “Rủi ro còn lại chỉ đến từ việc nhà cung cấp trung gian cố ý chèn key, được chấp nhận.” Vì vậy không tự mở lại CHẶN cho một encoding mới ngoài các invariant r2 được giao; vẫn giữ nguyên FAIL và snapshot để et-lead biết giới hạn. Không suy ra rằng sinh viên đã lấy được key thật.

- **QA-DEPLOY-NS-01 | NÊN SỬA, residual đã chấp nhận |** Secret hex nguyên chuỗi chưa bị scanner nhận diện: fake Gemini trả điểm đúng schema và `feedback=Buffer.from(secret).toString('hex')`; Writing và Speaking với cả `AI_API_KEY`, `SESSION_SECRET`, `ACCESS_CODE` đều **POST 200**, **GET 200**, **1 lần gọi upstream**, lưu result. Decode hex thu lại toàn secret synthetic. **Tái hiện:** `QA_EVIDENCE_DIR=qa/deploy-evidence QA_SOURCE_COMMIT=07c4fac QA_NEW_VARIANTS=1 node qa/unit6-app-r1.secrets.mjs`; xem 6 ca `/hex/feedback`, `secret-variants-results.json` và `leak-*-hex-feedback.json`. **Nguồn:** `src/server/secrets.ts` decode percent/Unicode/base64 và chuẩn hoá text, chưa decode hex. **Đề xuất:** thêm nhánh decode token hex có kiểm độ dài/even bytes, giới hạn ngân sách, rồi dùng cùng matcher/retry/cache guard; có regression hex riêng. **Phân loại:** theo chấp nhận rủi ro ở `docs/plan.md:70`; fake biết SESSION_SECRET/ACCESS_CODE qua harness, không qua model prompt. Không chứng minh nhà cung cấp thật có hai secret này.

Không xác nhận lỗi hướng dẫn deploy/Nginx nào trong phạm vi đọc và smoke local. Không có waiver do QA tự đặt ngoài quyết định đã ghi trong đặc tả.

## Bước 1 — lệnh và kết quả

Chứng cứ ở `qa/deploy-evidence/`. Log text chỉ bỏ CR/whitespace cuối dòng và dòng trống cuối file, giữ nội dung kết quả.

| Lệnh | Kết quả | File |
| --- | --- | --- |
| `npm ci` | Exit 0 | `npm-ci.log` |
| `npm run typecheck` | Exit 0 | `typecheck.log` |
| `npm run validate` | Exit 0, **8 Unit, mỗi Unit 0 lỗi/0 cảnh báo** | `validate-data.log` |
| `npm run validate -- fixtures/unit-6.sample.json` | Exit 0 | `validate-fixture.log` |
| `npx next build` | Exit 0, standalone gồm `/api/health` | `build.log` |
| `npm test` | Exit 0, **222/222 PASS**, không skip | `unit-tests.log` |

Validator kiểm schema/số câu, thang 2,5 mỗi kỹ năng và tổng 10. Không dùng fixture làm dữ liệu runtime trong kiểm tích hợp này.

## Red team và các sửa r2

Chạy đúng ba harness đã nộp; chỉ bổ sung biến môi trường để không ghi đè evidence r1 và flag bật biến thể mới.

| Lệnh, với `QA_EVIDENCE_DIR=qa/deploy-evidence QA_SOURCE_COMMIT=07c4fac` | Kết quả |
| --- | --- |
| `node qa/unit6-app.redteam.mjs` | **72/72 PASS**, exit 0; `redteam.log`, `redteam-results.json` |
| `QA_NEW_VARIANTS=1 node qa/unit6-app-r1.secrets.mjs` | **140 PASS / 6 FAIL**, exit 1 do hex; `secret-variants.log`, `secret-variants-results.json` |
| `node --conditions=react-server --import tsx qa/unit6-app-r1.cached.mts` | **52/52 PASS**, exit 0; `cached.log`, `cached-results.json` |

- **R1-A PASS:** space/newline/tab, base64 chia dòng, URL byte có space, Unicode escape có newline đều 502 sau một retry; GET 409 và không có result đã lưu.
- **R1-B PASS:** raw/base64 chia mảnh 4 ký tự qua feedback + corrections bị chặn; cả cache guard GET/POST cũng xoá grade nhiễm và trở về idle.
- **Biến thể mới:** zero-width U+200B giữa mỗi ký tự: 6/6 PASS. Mảnh raw 4 ký tự đảo thứ tự hoàn toàn: 6/6 PASS. Hex: 6/6 FAIL, phân loại ở trên.
- Truncated prefix/middle/suffix, URL/double URL, base64/base64url/truncated base64, literal Unicode và JSON wire escape vẫn PASS. Clean retry vẫn 2 calls và chỉ lưu grade sạch.
- Mỗi request fake Gemini kiểm model route, Authorization và temperature 0. Đã assert **không có secret nào trong JSON prompt**; key synthetic chỉ ở header. SESSION_SECRET/ACCESS_CODE do fake fixture biết, không được app gửi lên model.
- Bộ nền kiểm lại injection Writing/Speaking, bài tiếng Việt/trống/chép đề/JSON giả điểm; barem/schema JSON sai; lỗi upstream an toàn; ACCESS_CODE; 10/device,100/IP; xoá cookie, giả XFF với TRUST_PROXY=0; race quota; quota qua restart; thi tuần tự/snapshot bất biến; nghe tối đa 2 lần; private fields/bundle; WAV và loại webm. Tất cả PASS.

Cached harness là integration **in-process handler GET/POST thật**, seed grade riêng và dọn fixture sau assertion; không được trình bày là HTTP/browser proof. Bộ HTTP riêng đã kiểm đường nhận/saved/readback thực tế. Key snapshot đã redacted, không có key thật.

## 8 Unit và E2E

**Trong chính container đã build**, chạy `QA_QUOTA_PHASE=before QA_API_LABEL=container-before node qa/deploy.api.mjs`, restart app rồi `QA_QUOTA_PHASE=after QA_API_LABEL=container-after node qa/deploy.api.mjs`: **10/10 PASS trước và 10/10 PASS sau restart**.

Với Unit 1–8, API list đều available. Session practice full/Reading/Listening/Writing/Speaking không chứa answerKey, acceptedAnswers, explanation, referenceTranslation, modelAnswer, sampleAnswer, sourceNotes hay script trước nộp. GET result trước nộp 409. Reading 30 câu, Listening 10 câu: đáp án đúng **2,5**, bài trống **0**, đáp án sai không rỗng **0**; kiểm từng `correctAnswer` trong review khớp answerKey/acceptedAnswers của file nguồn. `sourceNotes` không xuất hiện ngay cả trong result. Chứng cứ `api-container-{before,after}.log`, `api-container-{before,after}-results.json`.

E2E standalone production bằng Chromium, dữ liệu thật: **27/27 PASS, 34.1 giây**. Gồm API thi tuần tự cả 8 Unit, browser hoàn tất Unit 1/8/6 được tổng 7,50 với AI_MOCK, review/lịch sử, mobile, recording WAV, cùng các E2E secret raw/encoded/clean retry. File `e2e.log`; ảnh ở `qa/deploy-run/test-results/`.

Lệnh E2E từ `qa/deploy-run`: `TMPDIR=/home/duckcy/english-test-exam-wt/qa/qa/deploy-evidence/runtime ../../node_modules/.bin/playwright test --config ../deploy.playwright.config.ts`. Thư mục chạy có symlink `.next -> ../../.next`, `data -> ../../data` để các test et-dev dùng cwd chạy được mà không sửa test. Output/tạm chỉ dưới `qa/`.

## Container

Build và runtime dùng Compose gốc, project QA riêng **`et-qa-deploy-07c4fac`**, image **`english-it-exam:qa-deploy-07c4fac`**. Image ID: `sha256:cee07baca543123ae8a153c4b6d13c4d795e86afccafca4fa31c709c5f231712`.

Cho mọi lệnh Compose: `APP_ENV_FILE=/home/duckcy/english-test-exam-wt/qa/qa/deploy-evidence/container.env APP_IMAGE=english-it-exam:qa-deploy-07c4fac docker compose -p et-qa-deploy-07c4fac -f docker-compose.yml -f qa/deploy.compose.override.yml ...`.

Đã chạy `build app`, `up -d --wait app`, `restart app`, `logs --no-color app`, `down -v`. Override QA thay danh sách ports bằng **127.0.0.1:3120:3000**, không append port 3000; [Compose hỗ trợ `!override`](https://docs.docker.com/reference/compose-file/merge/#replace-value). File env synthetic chmod 600, bị ignore; không viết `.env` vào root/build context. Runtime **AI_MOCK=1**, TRUST_PROXY=0, quota cấu hình **3/device,5/IP** để kiểm nhanh; bộ nền riêng kiểm mặc định 10/100.

`node qa/deploy.container.mjs`: **4/4 PASS** (`container-checks.log`, `container-results.json`):

- Docker health **healthy**; `/api/health` 200 `{status:"ok"}`. Health không chứng minh upstream AI thật.
- UID/GID **1001:1001**, image USER nextjs; read-only rootfs, cap_drop ALL, no-new-privileges; chỉ bind 127.0.0.1:3120.
- `docker image inspect` không có AI_API_KEY/SESSION_SECRET/ACCESS_CODE trong image Env; `docker history --no-trunc` không có secret synthetic (`image-history.log`). Runtime config nhận env qua env_file đúng thiết kế, không in raw env runtime vào report.
- Kiểm filesystem `/app`: chỉ `.next`, `data`, `node_modules`, `package.json`, `server.js`; không `.git`, `qa`, `audit`, `tests`, `fixtures`. Quét `.env/.env.*` dưới `/app` không thấy file nào; đủ 8 JSON đề.
- SQLite tại `/var/lib/english-it/rate-limits.sqlite`, nằm trên volume QA, owner UID 1001, integrity `ok`. Trước restart: 3 lượt/device thành công, lượt 4 là 429; cookie mới thêm được 2 lượt đạt 5/IP. Sau restart cùng volume: device cũ vẫn 429 và cookie mới cũng 429. Không bị reset quota.

Có hai lỗi timing của harness trong các lượt đầu: probe ngay sau `restart` gặp socket chưa mở; metadata kiểm quá sớm khi Docker health còn `starting` dù HTTP 200. Đã thêm readiness polling và chạy lại trọn cycle; không phải lỗi product. Giữ ghi nhận ở `startup-timing.md`, kết quả cuối từ cycle đã sửa timing.

## Nginx và deploy README

Đọc toàn bộ hai file. Template có TLS 1.2/1.3, certificate paths, HTTP 308→HTTPS, ACME webroot exception, HSTS, nosniff, DENY, Referrer-Policy, **Permissions-Policy microphone=(self)**, proxy timeout 180 s và **client_max_body_size 48m** phù hợp route tối đa 42 MiB. XFF dùng `$remote_addr` ghi đè header client; README chỉ bật TRUST_PROXY=1 sau proxy được kiểm soát, giải thích CDN và shared bucket khi direct mode. Header upstream trùng được hide. Cách set header/body limit khớp [Nginx proxy directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header) và [body limit](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).

README hướng dẫn DNS/firewall/loopback, cài Docker/Compose/Nginx, env server-only, mock vs thật, SSH tunnel; bootstrap HTTP trước cấp cert, sau đó mới cài HTTPS template; hook reload và dry-run renew; giữ image rollback và volume; backup SQLite bằng API backup thay vì chép riêng file WAL đang chạy, restore trong cửa sổ app dừng. Không phát hiện hướng dẫn sai/thiếu trong phạm vi này; renewal flow có hướng dẫn đối chiếu [Certbot chính thức](https://eff-certbot.readthedocs.io/en/stable/using.html#renewing-certificates).

Ngoài đọc source, chạy `node qa/deploy.nginx.mjs`: **4/4 PASS** trên Nginx **1.24.0**, template copy dưới QA, local test cert/self-signed CA, ports **127.0.0.1:3121/3122**:

- `nginx -t` qua; HTTP 308 đúng Location, challenge trả 200.
- HTTPS proxy tới container health 200; các security/microphone headers đúng, không trùng upstream.
- Request khai báo 49 MiB bị Nginx 413 và vẫn có security headers.
- Endpoint echo kiểm XFF giả 1.2.3.4 thành 127.0.0.1, proto https, Host example.com. Endpoint echo chỉ thuộc config QA, không thêm vào production code.

Chứng cứ `nginx-tests.log`, `nginx-results.json`, `nginx-{access,runtime,version}.log`. Đây là TLS local có CA test được client tin, **không phải domain/Let's Encrypt/VPS thật**.

## Giới hạn và cleanup

**CHƯA KIỂM:** deploy lên VPS/domain thật, cấp/gia hạn Let's Encrypt thực tế, microphone người dùng trên HTTPS công khai và ShopAIKey/model thật. Chưa có key thật theo bàn giao; mock/fake không chứng minh chất lượng chấm hoặc chống injection ngữ nghĩa của model thật. Không coi QA-OK local là chứng nhận live release.

Đã dừng/remove container, network và volume **do QA tạo trong project riêng**, không động vào container/volume khác. Các process fake/dev/standalone/Nginx/echo đều dừng. Giữ image QA để truy xuất build đã kiểm, image không phải process đang chạy. Chứng cứ binary DB, env, private test certificate và cookies không commit; snapshots/log/JSON/scripts/config/report đều dưới `qa/`. Hoàn nguyên các file Next tự sinh ngoài QA.
