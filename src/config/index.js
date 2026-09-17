require("dotenv").config();

const toInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const config = {
  server: {
    port: toInt(process.env.PORT, 8080),
    env: process.env.NODE_ENV || "development",
    // Số proxy đứng trước app (Nginx/Caddy/Cloudflare) để lấy đúng IP client
    trustProxy: toInt(process.env.TRUST_PROXY, 1),
    publicUrl: process.env.PUBLIC_URL || "",
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    // Bản cloud function thực tế luôn dùng gemini-2.5-pro cho phân tích ảnh
    analysisModel: process.env.GEMINI_ANALYSIS_MODEL || "gemini-2.5-pro",
    translationModel: process.env.GEMINI_TRANSLATION_MODEL || "gemini-2.5-flash",
    timeoutMs: toInt(process.env.GEMINI_TIMEOUT_MS, 120000),
  },

  upload: {
    maxFileSizeMb: toInt(process.env.MAX_FILE_SIZE_MB, 10),
  },

  cors: {
    // "*" hoặc danh sách phân tách bằng dấu phẩy
    origins: (process.env.CORS_ORIGINS || "*")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  },

  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 60000),
    // Giới hạn số request /analyze mỗi IP trong 1 window (0 = tắt)
    maxAnalyze: toInt(process.env.RATE_LIMIT_ANALYZE_MAX, 10),
  },

  // Nếu đặt API_KEY, mọi request /v1/* phải gửi header x-api-key
  apiKey: process.env.API_KEY || "",
};

if (!config.gemini.apiKey) {
  throw new Error("GEMINI_API_KEY is required");
}

module.exports = config;
