const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const config = require("../config");
const { sendErrorResponse } = require("../utils/sendResponse");

/**
 * Bảo vệ API bằng header x-api-key nếu biến môi trường API_KEY được đặt
 */
const apiKeyAuth = (req, res, next) => {
  if (!config.apiKey) return next();

  const provided = Buffer.from(String(req.get("x-api-key") || ""));
  const expected = Buffer.from(config.apiKey);

  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(provided, expected)
  ) {
    return sendErrorResponse(
      res,
      401,
      "Unauthorized",
      "Missing or invalid x-api-key header",
    );
  }
  return next();
};

/**
 * Giới hạn số request phân tích mỗi IP (mỗi request tốn phí Gemini)
 */
const analyzeRateLimit =
  config.rateLimit.maxAnalyze > 0
    ? rateLimit({
        windowMs: config.rateLimit.windowMs,
        limit: config.rateLimit.maxAnalyze,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        handler: (req, res) =>
          sendErrorResponse(
            res,
            429,
            "Too Many Requests",
            "Rate limit exceeded. Please try again later.",
          ),
      })
    : (req, res, next) => next();

module.exports = { apiKeyAuth, analyzeRateLimit };
