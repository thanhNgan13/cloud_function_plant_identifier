const multer = require("multer");
const config = require("../config");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSizeMb * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const error = new Error(
        `Unsupported image type: ${file.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
      );
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

// Chấp nhận field "file" hoặc "image" giống bản cloud function
const faceImageUpload = imageUpload.fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

module.exports = { faceImageUpload, ALLOWED_MIME_TYPES };
