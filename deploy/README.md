# Triển khai English for IT 2 trên VPS Ubuntu

Bản đóng gói gồm Next.js standalone, Node.js 24 và 8 đề trong `data/units/`. Nginx chạy trên VPS, chuyển HTTPS vào container qua `127.0.0.1:3000`; SQLite quota nằm trên volume `quota` tại `/var/lib/english-it/rate-limits.sqlite`. App chạy bằng UID/GID `1001:1001`, filesystem image chỉ đọc. Các lệnh dưới đây dành cho VPS mới; máy đã có Docker/Nginx dùng cấu hình hiện có và thêm site riêng.

`example.com` là placeholder: đổi thành domain do bạn quản lý trong DNS, lệnh Certbot và cấu hình Nginx. Hướng dẫn chưa chứng minh hoạt động trên VPS/domain thật; cần kiểm HTTPS, micro thật và ShopAIKey thật sau khi cài. Chỉ dùng commit đã được et-lead duyệt; nếu `main` chưa nhận gói triển khai thì chọn commit được bàn giao thay cho `main`.

## 1. Chuẩn bị VPS và cài công cụ

Dùng Ubuntu 24.04 LTS hoặc bản Ubuntu còn được Docker hỗ trợ, có quyền `sudo`. Trỏ bản ghi A của domain vào IPv4 VPS; chỉ thêm AAAA khi IPv6 đã hoạt động. Mở TCP 80/443 ở firewall VPS/nhà cung cấp, giữ cổng SSH hiện tại; không mở cổng 3000 ra Internet.

Cài Docker qua repository chính thức và Compose plugin theo [Docker: Ubuntu](https://docs.docker.com/engine/install/ubuntu/). Nếu đã cài Docker, kiểm `sudo docker version` và `sudo docker compose version`, rồi chuyển sang bước 2.

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git nginx openssl snapd
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker nginx
sudo docker version
sudo docker compose version
```

Cài Certbot bằng snap theo [hướng dẫn chính thức](https://certbot.eff.org/instructions?os=snap&ws=nginx); dùng đường dẫn `/snap/bin/certbot` để rõ bản đang chạy. Nếu VPS đã dùng một bản Certbot khác, giữ cách cài/gia hạn đang hoạt động.

```bash
sudo snap install --classic certbot
sudo /snap/bin/certbot --version
```

## 2. Lấy code và điền `.env`

```bash
sudo install -d -m 0755 -o "$USER" -g "$(id -gn)" /opt/english-test-exam
git clone https://github.com/Duckcy-Bui/english-test-exam.git /opt/english-test-exam
cd /opt/english-test-exam
DEPLOY_REF=main
git checkout --detach "$DEPLOY_REF"
umask 077
cp .env.example .env
chmod 600 .env
```

Điền `.env` bằng trình soạn thảo trên VPS. Sinh hai giá trị khác nhau bằng `openssl rand -hex 18` cho `ACCESS_CODE` và `openssl rand -hex 32` cho `SESSION_SECRET`; chia sẻ mã truy cập cho lớp, giữ session secret riêng trên server. Không commit `.env`, không đặt bí mật vào `NEXT_PUBLIC_*`, không dùng `docker compose config` đầy đủ khi chia sẻ log vì có thể in giá trị môi trường.

```dotenv
ACCESS_CODE=THAY_BANG_MA_TRUY_CAP_NGAU_NHIEN
SESSION_SECRET=THAY_BANG_CHUOI_NGAU_NHIEN_KHAC
AI_BASE_URL=https://api.shopaikey.com
AI_API_KEY=THAY_BANG_KEY_SHOPAIKEY
AI_MODEL=gemini-2.5-flash
AI_MODEL_FALLBACK=gemini-3.8-flash
AI_MOCK=0
RATE_LIMIT_PER_DEVICE=10
RATE_LIMIT_PER_IP=100
TRUST_PROXY=1
EXAM_DATA_DIR=/app/data/units
RATE_LIMIT_DB=/var/lib/english-it/rate-limits.sqlite
```

Đặt `AI_MOCK=1`, để trống `AI_API_KEY` khi chạy thử mà không gọi dịch vụ thật. Mock chỉ chứng minh luồng chấm, không chứng minh chất lượng AI. `TRUST_PROXY=1` chỉ dùng khi app đứng sau cấu hình Nginx bên dưới; nếu truy cập app trực tiếp để thử thì đặt `0` (các kết nối dùng chung bucket IP). Nginx phải ghi đè `X-Forwarded-For` bằng IP kết nối; không nối header do người dùng gửi. Nếu có thêm CDN/proxy trước Nginx, cần cấu hình nguồn IP đáng tin riêng trước khi dùng IP đó tính quota.

Compose đọc `.env` qua `env_file`; các đường dẫn đề/quota, `NODE_ENV=production`, port và hostname được Compose đặt cố định. Muốn dùng file khác: `sudo APP_ENV_FILE=/duong/dan/file.env docker compose up -d --build --wait`; dùng cùng biến cho các lệnh sau. `env_file` chỉ truyền biến lúc chạy; `.dockerignore` loại file môi trường, DB và nguồn tài liệu khỏi build context.

## 3. Chạy container và kiểm local

```bash
sudo docker compose build app
sudo docker compose up -d --wait app
sudo docker compose ps
curl --fail --silent --show-error http://127.0.0.1:3000/api/health
sudo docker compose logs --tail=50 app
sudo docker compose exec -T app id
sudo docker compose exec -T app node --input-type=module -e \
  'import { readdirSync } from "node:fs"; console.log(readdirSync("/app/data/units").filter(x => /^unit-[1-8]\.json$/.test(x)).sort());'
```

Health trả HTTP 200 khi đủ 8 đề, SQLite và cấu hình mã/key sẵn sàng; kết quả không phải phép thử kết nối ShopAIKey. Đầu ra `id` phải là UID/GID 1001; danh sách đề có Unit 1–8. `HEALTHCHECK` kiểm app định kỳ; `restart: unless-stopped` khởi động lại khi tiến trình thoát, không tự khởi động lại chỉ vì trạng thái `unhealthy`.

Để thử UI trước khi cấp HTTPS, tạo SSH tunnel từ máy của bạn:

```bash
ssh -L 3000:127.0.0.1:3000 USER_VPS@IP_VPS
```

Mở Chrome/Edge tại `http://localhost:3000`, nhập `ACCESS_CODE`, kiểm trang chủ đủ 8 Unit; làm cả đề Unit 1 rồi Unit 8 bằng `AI_MOCK=1`. Thi thử phải đi Listening → Reading → Writing → Speaking, phần đã nộp bị khoá; Luyện tập chọn kỹ năng tự do. Localhost được trình duyệt xử lý như nguồn an toàn. Truy cập `http://IP_VPS:3000` bị chặn bởi bind loopback; domain HTTP trước khi có cert không dùng để đăng nhập production vì cookie có `Secure` và micro cần nguồn an toàn.

## 4. HTTPS không mắc vòng lặp thiếu chứng chỉ

Tạo site HTTP tạm trước; chưa cài template HTTPS khi file chứng chỉ chưa tồn tại. Certbot webroot ghi challenge dưới `/var/www/certbot/.well-known/acme-challenge/`, Nginx phục vụ trực tiếp trên cổng 80. Cơ chế này được mô tả trong [Certbot: webroot](https://eff-certbot.readthedocs.io/en/stable/using.html#webroot).

```bash
sudo install -d -m 0755 /var/www/certbot/.well-known/acme-challenge
sudo tee /etc/nginx/sites-available/english-it >/dev/null <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name example.com;
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type text/plain;
        try_files $uri =404;
    }
    location / {
        default_type text/plain;
        return 200 "Dang cau hinh HTTPS.\n";
    }
}
NGINX
sudo ln -s /etc/nginx/sites-available/english-it /etc/nginx/sites-enabled/english-it
sudo nginx -t
sudo systemctl reload nginx
sudo /snap/bin/certbot certonly --webroot -w /var/www/certbot -d example.com
```

Đổi `example.com` trong khối trên trước khi chạy; Certbot hỏi email quản trị và điều khoản. Nếu site `english-it` đã tồn tại, lưu bản cũ trước khi thay và dùng symlink hiện có. Các site khác được giữ nguyên. Sau khi chứng chỉ đã có, cài template rồi thay domain trong file:

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/english-it
sudoedit /etc/nginx/sites-available/english-it
sudo nginx -t
sudo systemctl reload nginx
curl --fail --silent --show-error https://example.com/api/health
curl -I http://example.com/
curl -I https://example.com/
```

HTTP trang chủ phải chuyển 308 sang HTTPS; response HTTPS có `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, HSTS và `Permissions-Policy: microphone=(self), camera=()`. Nginx giữ challenge trên HTTP để gia hạn, ghi đè IP client và chuyển `Host`/`X-Forwarded-Proto`. Limit `48m` đủ cho payload WAV base64 dưới giới hạn 42 MiB của app; proxy timeout 180 giây đủ cho hai lượt chấm AI. Xem [Nginx proxy headers](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header) và [body limit](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size).

Tạo hook để Nginx nạp chứng chỉ mới và kiểm phép gia hạn:

```bash
sudo install -d -m 0755 /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/english-it-nginx >/dev/null <<'HOOK'
#!/bin/sh
/usr/sbin/nginx -t && /usr/bin/systemctl reload nginx
HOOK
sudo chmod 0755 /etc/letsencrypt/renewal-hooks/deploy/english-it-nginx
sudo /snap/bin/certbot renew --dry-run --run-deploy-hooks
systemctl list-timers --all '*certbot*'
```

Certbot snap cài lịch gia hạn tự động; `--dry-run` kiểm DNS/challenge và `--run-deploy-hooks` kiểm hook. Giữ cổng 80 và đường dẫn challenge hoạt động sau triển khai. Hướng dẫn về hook/gia hạn nằm trong [Certbot: renewing certificates](https://eff-certbot.readthedocs.io/en/stable/using.html#renewing-certificates).

## 5. Kiểm trước khi cho lớp dùng

Trên HTTPS, kiểm đủ 8 Unit, hoàn tất Unit 1 và Unit 8, nghe bằng giọng trình duyệt, ghi âm Speaking thật và xem WAV được chấm. Khi thử UI xong, chuyển `AI_MOCK=0`, điền key thật rồi `sudo docker compose up -d --force-recreate --wait app`; làm Writing và Speaking để kiểm ShopAIKey. Model/khả năng tương thích key phụ thuộc nhà cung cấp, cần xác minh trực tiếp; health không kiểm việc này.

Thi thử khoá phần đã nộp và chỉ tải kỹ năng kế tiếp sau khi nộp phần trước. Luyện tập cho phép chọn kỹ năng tự do. Quota mặc định 10 lần chấm/thiết bị/ngày và 100/IP/ngày, mỗi đề hoàn chỉnh dùng 2 lượt AI; giữ cùng `ACCESS_CODE`/`SESSION_SECRET` qua cập nhật nếu muốn giữ hiệu lực cookie và danh tính quota.

## 6. Cập nhật và quay lại image trước

Sao lưu quota theo mục 7 trước khi cập nhật. Trong `/opt/english-test-exam`, giữ image hiện tại, chọn commit đã được duyệt rồi build lại:

```bash
PREVIOUS_REV=$(git rev-parse HEAD)
CURRENT_IMAGE=$(sudo docker inspect --format '{{.Config.Image}}' "$(sudo docker compose ps -q app)")
sudo docker image tag "$CURRENT_IMAGE" "english-it-exam:rollback-$PREVIOUS_REV"
git fetch origin
git checkout --detach 'COMMIT_MOI_DA_DUYET'
NEW_IMAGE="english-it-exam:$(git rev-parse HEAD)"
sudo APP_IMAGE="$NEW_IMAGE" docker compose build app
sudo APP_IMAGE="$NEW_IMAGE" docker compose up -d --wait app
curl --fail --silent --show-error https://example.com/api/health
```

Thay `COMMIT_MOI_DA_DUYET` bằng hash/tag thật. Kiểm lại Unit 1/8 và một bài AI; nếu cần quay lại, dùng hash cũ đã ghi và image đã giữ:

```bash
git checkout --detach "$PREVIOUS_REV"
sudo APP_IMAGE="english-it-exam:rollback-$PREVIOUS_REV" docker compose up -d --no-build --force-recreate --wait app
curl --fail --silent --show-error https://example.com/api/health
```

Compose chọn image bằng `APP_IMAGE`, mặc định `english-it-exam:local`. Sau cập nhật, ghi `APP_IMAGE=english-it-exam:HASH_MOI` vào `.env` để các lệnh vận hành sau dùng đúng tag; sau rollback ghi tag rollback tương ứng. Biến được chỉ định trước `docker compose` ưu tiên hơn `.env`.

Volume quota tồn tại qua rebuild/recreate. Giữ thư mục dự án và tên Compose project để dùng đúng volume; không chạy `docker compose down -v` hoặc xoá volume quota. Sau mỗi restart, phiên làm bài và kết quả tạm trên RAM server mất; sinh viên nên nộp/lưu lịch sử trước cửa sổ bảo trì. Lịch sử đã lưu nằm trong `localStorage` trình duyệt, không có trong bản sao DB của VPS.

## 7. Sao lưu và khôi phục SQLite quota

DB dùng WAL. Không sao chép riêng file `.sqlite` đang mở: giao dịch có thể còn trong `-wal`. Quy trình này dừng app ngắn, dùng API [Node SQLite backup](https://nodejs.org/api/sqlite.html#sqlitebackupsource-db-path-options) để tạo một file SQLite nhất quán, kiểm integrity rồi bật lại app. Chạy trong thư mục dự án; nếu lệnh sao lưu lỗi, bật lại app bằng `sudo docker compose start app` và xử lý lỗi trước khi cập nhật.

```bash
install -d -m 0700 backups
BACKUP_STAMP=$(date -u +%Y%m%dT%H%M%SZ)
sudo docker compose stop app
sudo docker compose run --rm --no-deps -T \
  -e BACKUP_STAMP="$BACKUP_STAMP" --entrypoint node app --input-type=module -e '
import { mkdirSync, chmodSync } from "node:fs";
import { DatabaseSync, backup } from "node:sqlite";
const folder = "/var/lib/english-it/backups";
mkdirSync(folder, { recursive: true, mode: 0o700 });
const source = new DatabaseSync(process.env.RATE_LIMIT_DB, { readOnly: true });
const target = `${folder}/quota-${process.env.BACKUP_STAMP}.sqlite`;
await backup(source, target);
source.close();
const check = new DatabaseSync(target, { readOnly: true });
if (check.prepare("PRAGMA integrity_check").get().integrity_check !== "ok") throw new Error("Backup SQLite khong hop le");
check.close();
chmodSync(target, 0o600);
console.log("Da tao ban sao SQLite nhat quan.");
'
sudo docker compose start app
sudo docker compose cp "app:/var/lib/english-it/backups/quota-$BACKUP_STAMP.sqlite" "backups/quota-$BACKUP_STAMP.sqlite"
sudo chown "$USER:$(id -gn)" "backups/quota-$BACKUP_STAMP.sqlite"
chmod 600 "backups/quota-$BACKUP_STAMP.sqlite"
```

Chép file backup sang nơi lưu riêng của bạn; volume và thư mục VPS cùng hỏng thì không còn bản dự phòng. Quota chỉ theo dõi lượt chấm/đăng nhập; không chứa toàn bộ bài làm hay lịch sử của sinh viên. Giữ `.env` trong nơi lưu bí mật riêng nếu cần khôi phục cùng danh tính quota.

Để khôi phục, trước hết tạo bản sao của DB hiện tại bằng quy trình trên, chọn file backup đã kiểm và dừng app. Đổi tên file mẫu bên dưới thành bản sao cần dùng. Truyền backup qua stdin để container bảo trì ghi file bằng cùng UID 1001; không cần chạy root hay đổi quyền volume:

```bash
sudo docker compose stop app
sudo docker compose run --rm --no-deps -T --entrypoint node app --input-type=module -e '
import { writeFileSync, chmodSync, renameSync, rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const source = `/var/lib/english-it/restore-${Date.now()}.sqlite`;
writeFileSync(source, Buffer.concat(chunks), { mode: 0o600 });
const check = new DatabaseSync(source, { readOnly: true });
if (check.prepare("PRAGMA integrity_check").get().integrity_check !== "ok") throw new Error("Backup SQLite khong hop le");
check.close();
const target = process.env.RATE_LIMIT_DB;
rmSync(`${target}-wal`, { force: true });
rmSync(`${target}-shm`, { force: true });
renameSync(source, target);
chmodSync(target, 0o600);
' < backups/quota-THOI_DIEM.sqlite &&
sudo docker compose start app &&
curl --fail --silent --show-error http://127.0.0.1:3000/api/health
```

Nếu đọc/kiểm/khôi phục lỗi, giữ app dừng đến khi xác định DB còn nguyên hay đã thay; tránh khởi động với bản khôi phục chưa kiểm. Khôi phục đúng thời điểm sẽ quay quota về thời điểm đó. `data/units` được đóng trong image và cập nhật cùng code, không cần mount từ host.
