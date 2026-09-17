const multer = require("multer");
const config = require("../config");
const { sendErrorResponse } = require("../utils/sendResponse");

const notFoundHandler = (req, res) => {
  return sendErrorResponse(
    res,
    404,
    "Not Found",
    `Route ${req.method} ${req.originalUrl} not found`,
  );
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? `Image is too large. Max size is ${config.upload.maxFileSizeMb}MB.`
        : err.message;
    return sendErrorResponse(res, 400, "Bad Request", message);
  }

  if (err.type === "entity.too.large") {
    return sendErrorResponse(res, 413, "Payload Too Large", err.message);
  }

  const statusCode = err.statusCode || err.status || 500;
  if (statusCode >= 500) {
    console.error("Unhandled error:", err);
  }

  return sendErrorResponse(
    res,
    statusCode,
    statusCode >= 500 ? "Internal Server Error" : "Bad Request",
    err.message || String(err),
  );
};

module.exports = { notFoundHandler, errorHandler };
