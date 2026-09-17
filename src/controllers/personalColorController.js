/**
 * Personal Color Analysis Controller
 * Handles personal color analysis requests and language management
 */

const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/sendResponse");
const { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } = require("../utils/constant");
const {
  analyzePersonalColor,
  getAvailableLanguages,
} = require("../services/personalColorService");

/**
 * Analyze personal color from uploaded face image
 * Endpoint: POST /analyze
 * Body: multipart form with image file and optional language parameter
 */
const analyzePersonalColorHandler = async (req, res) => {
  try {
    // Files được multer đưa vào req.files (field "file" hoặc "image")
    const imageFile = req.files?.file?.[0] || req.files?.image?.[0];

    // Validate image file
    if (!imageFile || !imageFile.buffer?.length) {
      return sendErrorResponse(
        res,
        400,
        "Bad Request",
        "No image file uploaded. Please provide an image file.",
      );
    }

    // Get language parameter (default to English)
    const language = req.body?.language || DEFAULT_LANGUAGE;

    // Validate language is supported
    if (!AVAILABLE_LANGUAGES[language]) {
      return sendErrorResponse(
        res,
        400,
        "Bad Request",
        `Unsupported language: ${language}. Supported languages: ${Object.keys(AVAILABLE_LANGUAGES).join(", ")}`,
      );
    }

    // Call personal color service
    const analysisResult = await analyzePersonalColor(
      imageFile.buffer,
      language,
      imageFile.mimetype,
    );

    // Return success response
    return sendSuccessResponse(
      res,
      200,
      "Personal color analysis completed successfully",
      {
        analysis: analysisResult,
        metadata: {
          language,
          timestamp: new Date().toISOString(),
        },
      },
    );
  } catch (error) {
    console.error(
      "personalColorController.analyzePersonalColorHandler:",
      error,
    );

    // Handle specific error types
    if (error.statusCode && error.error) {
      return sendErrorResponse(
        res,
        error.statusCode,
        error.error,
        error.message || error.details,
      );
    }

    // Generic error handling
    return sendErrorResponse(
      res,
      500,
      "Internal Server Error",
      error.message || String(error),
    );
  }
};

/**
 * Get available languages for personal color analysis
 * Endpoint: GET /languages
 */
const getAvailableLanguagesHandler = async (req, res) => {
  try {
    const availableLanguages = getAvailableLanguages();

    return sendSuccessResponse(
      res,
      200,
      "Available languages retrieved successfully",
      {
        languages: availableLanguages,
        count: availableLanguages.length,
        defaultLanguage: DEFAULT_LANGUAGE,
      },
    );
  } catch (error) {
    console.error(
      "personalColorController.getAvailableLanguagesHandler:",
      error,
    );
    return sendErrorResponse(
      res,
      500,
      "Internal Server Error",
      error.message || String(error),
    );
  }
};

module.exports = {
  analyzePersonalColorHandler,
  getAvailableLanguagesHandler,
};
