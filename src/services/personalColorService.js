/**
 * Personal Color Analysis Service
 * Handles personal color analysis by calling Gemini AI
 */

const { analyzeImage } = require("../helpers/geminiClient");
const {
  buildPersonalColorSystemPrompt,
} = require("../prompts/personalColorSystemPrompt");
const {
  isValidUndertone,
  isValidSubseason,
  isValidSkintone,
} = require("./personalColorData");
const { translateTexts } = require("../helpers/translationHelper");
const { AVAILABLE_LANGUAGES } = require("../utils/constant");

// Prompt không phụ thuộc request nên build một lần khi khởi động
const SYSTEM_PROMPT = buildPersonalColorSystemPrompt();

/**
 * Analyze personal color from an image buffer
 * @param {Buffer} imageBuffer - Image buffer of person's face
 * @param {string} language - Language code for response translation (default: 'en')
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<Object>} Personal color analysis result
 */
async function analyzePersonalColor(
  imageBuffer,
  language = "en",
  mimeType = "image/jpeg",
) {
  try {
    // Validate image buffer
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      throw new Error("Invalid image buffer");
    }

    // Call Gemini API with image analysis
    const analysisResult = await analyzeImage(
      imageBuffer,
      SYSTEM_PROMPT,
      mimeType,
    );

    // Validate response structure and values
    const validatedResult = validateAnalysisResult(analysisResult);

    // If language is not English, translate explanations
    if (language && language !== "en") {
      return await translateAnalysisResult(validatedResult, language);
    }

    return validatedResult;
  } catch (error) {
    const message = error?.message || String(error);

    // Handle AI API errors
    if (
      message.includes("Invalid input") ||
      message.includes("No face detected")
    ) {
      throw {
        statusCode: 400,
        error: "INVALID_FACE_IMAGE",
        message:
          "Image must contain a clear human face. The image provided does not show a valid human face.",
        details: message,
      };
    }

    // Generic AI errors
    throw {
      statusCode: 500,
      error: "ANALYSIS_FAILED",
      message:
        "Failed to analyze personal color. Please try again with a different image.",
      details: message,
    };
  }
}

/**
 * Validate and sanitize the AI response
 * Ensures all required fields exist and have valid values
 * @param {Object} result - Raw result from AI
 * @returns {Object} Validated result
 */
function validateAnalysisResult(result) {
  // Check if AI returned an error
  if (result.error) {
    throw new Error(result.error);
  }

  // Validate required fields exist
  if (
    !result.undertone ||
    !result.subseason ||
    result.skintone === undefined ||
    !result.detail ||
    !result.description
  ) {
    throw new Error("Invalid response structure from AI");
  }

  // Validate undertone
  if (!isValidUndertone(result.undertone.value)) {
    throw new Error(`Invalid undertone value: ${result.undertone.value}`);
  }
  if (
    typeof result.undertone.explain !== "string" ||
    result.undertone.explain.trim().length === 0
  ) {
    throw new Error("Undertone explanation is missing or invalid");
  }

  // Validate subseason
  if (!isValidSubseason(result.subseason.value)) {
    throw new Error(`Invalid subseason value: ${result.subseason.value}`);
  }
  if (
    typeof result.subseason.explain !== "string" ||
    result.subseason.explain.trim().length === 0
  ) {
    throw new Error("Subseason explanation is missing or invalid");
  }

  // Validate skintone
  if (!isValidSkintone(result.skintone)) {
    throw new Error(`Invalid skintone value: ${result.skintone}`);
  }

  // Validate detail array
  if (!Array.isArray(result.detail) || result.detail.length === 0) {
    throw new Error("Detail array is missing or empty");
  }

  // Validate each detail entry
  result.detail = result.detail.map((entry, index) => {
    if (!isValidSubseason(entry.season)) {
      throw new Error(`Invalid season in detail[${index}]: ${entry.season}`);
    }
    if (
      typeof entry.percentage !== "number" ||
      entry.percentage < 0 ||
      entry.percentage > 100
    ) {
      throw new Error(
        `Invalid percentage in detail[${index}]: ${entry.percentage}`,
      );
    }
    return {
      season: entry.season,
      percentage: entry.percentage,
    };
  });

  // Ensure percentages sum to approximately 100 (allow 5% tolerance for rounding)
  const totalPercentage = result.detail.reduce(
    (sum, entry) => sum + entry.percentage,
    0,
  );
  if (totalPercentage === 0) {
    throw new Error("Detail percentages sum to 0");
  }
  if (totalPercentage < 95 || totalPercentage > 105) {
    console.warn(
      `Detail percentages sum to ${totalPercentage}, not 100. Normalizing...`,
    );
    // Normalize percentages
    result.detail = result.detail.map((entry) => ({
      ...entry,
      percentage: Math.round((entry.percentage / totalPercentage) * 100),
    }));
  }

  // Validate description
  if (
    typeof result.description !== "string" ||
    result.description.trim().length === 0
  ) {
    throw new Error("Description is missing or invalid");
  }

  return {
    undertone: {
      value: result.undertone.value,
      explain: result.undertone.explain,
    },
    subseason: {
      value: result.subseason.value,
      explain: result.subseason.explain,
    },
    skintone: result.skintone,
    detail: result.detail,
    description: result.description,
  };
}

/**
 * Translate analysis result to target language
 * Translates all explanation and description fields
 * @param {Object} result - Validated analysis result
 * @param {string} language - Target language code
 * @returns {Promise<Object>} Translated result
 */
async function translateAnalysisResult(result, language) {
  try {
    const translatedTexts = await translateTexts(
      [result.undertone.explain, result.subseason.explain, result.description],
      language,
    );

    return {
      ...result,
      undertone: {
        ...result.undertone,
        explain: translatedTexts[0],
      },
      subseason: {
        ...result.subseason,
        explain: translatedTexts[1],
      },
      description: translatedTexts[2],
    };
  } catch (error) {
    console.error("Translation failed:", error);
    // Return result in original language if translation fails
    return result;
  }
}

/**
 * Get all available languages for translation
 * @returns {string[]} Array of language codes
 */
function getAvailableLanguages() {
  return Object.keys(AVAILABLE_LANGUAGES);
}

module.exports = {
  analyzePersonalColor,
  getAvailableLanguages,
  validateAnalysisResult,
};
