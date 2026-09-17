# Personal Color Analysis Service

Đây là bản độc lập của Personal Color API, trước đây nằm trong `functions/`. Service chạy bằng Express, dùng Gemini để phân tích và được deploy bằng Docker lên VPS, không cần Firebase Cloud Functions.

## Endpoints

| Method | Path | Mô tả |
|---|---|---|
| POST | `/v1/personal-color-service/analyze` | Nhận ảnh khuôn mặt qua multipart, field `file` hoặc `image`, và `language` (tùy chọn) |
| GET | `/v1/personal-color-service/languages` | Trả về danh sách ngôn ngữ được hỗ trợ |
| GET | `/health` | Health check |
| GET | `/api-docs` | Swagger UI (file JSON ở `/api-docs.json`) |

Request và response giữ nguyên format của bản cloud function. Chi tiết xem [docs/PERSONAL_COLOR_API.md](docs/PERSONAL_COLOR_API.md).

## Chạy local

```bash
cp .env.example .env      # điền GEMINI_API_KEY
npm install
npm run dev               # http://localhost:8080
```

Test nhanh:

```bash
curl http://localhost:8080/v1/personal-color-service/languages
curl -X POST http://localhost:8080/v1/personal-color-service/analyze \
  -F "file=@face.jpg" -F "language=vi"
```

## Deploy lên VPS bằng Docker

### 1. Chuẩn bị VPS (Ubuntu)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # đăng xuất rồi đăng nhập lại
```

### 2. Đưa code lên VPS

Dùng `git clone` repo, hoặc copy riêng folder này:

```bash
scp -r personal_color_service user@VPS_IP:~/personal_color_service
```

Không copy `node_modules` và `.env` của máy local.

### 3. Cấu hình và chạy

```bash
cd ~/personal_color_service
cp .env.example .env
nano .env                       # GEMINI_API_KEY, API_KEY, CORS_ORIGINS, PUBLIC_URL...
docker compose up -d --build
docker compose logs -f
curl http://127.0.0.1:8080/health
```

Mặc định container chỉ bind vào `127.0.0.1:8080`, nên từ bên ngoài không truy cập trực tiếp được. Nên đặt Nginx hoặc Caddy phía trước để có HTTPS (bước 4). Nếu muốn mở thẳng port ra ngoài, sửa `ports` trong `docker-compose.yml` thành `"8080:8080"`.

### 4. HTTPS với Nginx và Let's Encrypt

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Tạo file `/etc/nginx/sites-available/personal-color`:

```nginx
server {
    listen 80;
    server_name color.example.com;

    client_max_body_size 12m;          # >= MAX_FILE_SIZE_MB

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;       # Gemini có thể phản hồi chậm
        proxy_send_timeout 180s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/personal-color /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d color.example.com
```

### 5. Cập nhật phiên bản

```bash
git pull   # hoặc scp lại code
docker compose up -d --build
docker image prune -f
```

## Biến môi trường

| Biến | Mặc định | Ghi chú |
|---|---|---|
| `GEMINI_API_KEY` | (bắt buộc) | |
| `PORT` | `8080` | Port bên trong container |
| `HOST_PORT` | `8080` | Port trên VPS, dùng trong docker-compose |
| `GEMINI_ANALYSIS_MODEL` | `gemini-2.5-pro` | Model phân tích ảnh |
| `GEMINI_TRANSLATION_MODEL` | `gemini-2.5-flash` | Model dịch kết quả |
| `GEMINI_TIMEOUT_MS` | `120000` | |
| `MAX_FILE_SIZE_MB` | `10` | Chấp nhận ảnh jpeg, png, webp, heic, heif |
| `CORS_ORIGINS` | `*` | Danh sách origin, phân tách bằng dấu phẩy |
| `API_KEY` | (trống) | Nếu đặt, client phải gửi header `x-api-key` |
| `RATE_LIMIT_ANALYZE_MAX` | `10` | Số request `/analyze` tối đa mỗi IP trong mỗi window. Đặt `0` để tắt |
| `RATE_LIMIT_WINDOW_MS` | `60000` | |
| `TRUST_PROXY` | `1` | Số reverse proxy đứng trước app |
| `PUBLIC_URL` | (trống) | Domain public, hiển thị trong Swagger |

## Cấu trúc

```
server.js                 # Entry: listen + graceful shutdown
src/app.js                # Express app, middleware, swagger, routes
src/config/               # env config, swagger
src/routes/               # personalColorRoutes (+ swagger docs)
src/controllers/          # request/response handling
src/services/             # personalColorService, personalColorData
src/prompts/              # system prompt
src/helpers/              # geminiClient, translationHelper
src/middlewares/          # upload (multer), security (api key, rate limit), errors
scripts/                  # testPersonalColorAPI.js
```
