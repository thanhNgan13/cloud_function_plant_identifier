const { AVAILABLE_LANGUAGES } = require("../utils/constant");
const { generateJson } = require("./geminiClient");

/**
 * Dịch một mảng chuỗi sang ngôn ngữ đích, giữ nguyên thứ tự
 * @param {string[]} texts - Các đoạn văn bản tiếng Anh
 * @param {string} targetLanguage - Mã ngôn ngữ đích (ISO 639-1)
 * @returns {Promise<string[]>} - Các đoạn đã dịch, cùng độ dài với input
 */
async function translateTexts(texts, targetLanguage) {
  const language = AVAILABLE_LANGUAGES[targetLanguage];
  if (!language || targetLanguage === "en") {
    return texts;
  }

  const prompt = `You are a professional translator specializing in fashion, beauty and personal color analysis.
Translate every string in the "texts" array below from English to ${language.name}.

REQUIREMENTS:
- Keep the same number of items and the same order.
- Keep season/subseason names understandable; you may add the English term in parentheses, e.g. "Mùa Thu Ấm (Warm Autumn)".
- Keep percentages and numbers unchanged.
- Respond ONLY with JSON in the form: {"texts": ["...", "..."]}

INPUT:
${JSON.stringify({ texts })}`;

  const result = await generateJson(prompt);

  if (
    !Array.isArray(result.texts) ||
    result.texts.length !== texts.length ||
    result.texts.some((t) => typeof t !== "string")
  ) {
    throw new Error("Translation response has invalid structure");
  }

  return result.texts;
}

module.exports = { translateTexts };
