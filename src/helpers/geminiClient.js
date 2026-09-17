const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");

const gemini = new GoogleGenerativeAI(config.gemini.apiKey);

const analysisModel = gemini.getGenerativeModel({
  model: config.gemini.analysisModel,
  generationConfig: {
    temperature: 0.4,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 32768,
  },
});

const translationModel = gemini.getGenerativeModel({
  model: config.gemini.translationModel,
  generationConfig: {
    temperature: 0.2,
    topP: 0.95,
    topK: 40,
    responseMimeType: "application/json",
  },
});

const requestOptions = { timeout: config.gemini.timeoutMs };

/**
 * Trích JSON object từ text trả về của Gemini (có thể bọc trong ```json)
 * @param {string} content
 * @returns {Object}
 */
function extractJson(content) {
  const cleanContent = content
    .replace(/```json\s*/, "")
    .replace(/```\s*$/, "")
    .trim();

  const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { rawResponse: cleanContent };
  }
  return JSON.parse(jsonMatch[0]);
}

/**
 * Phân tích ảnh bằng Gemini với prompt cho trước, trả về JSON đã parse
 * @param {Buffer} imageBuffer
 * @param {string} prompt
 * @param {string} [mimeType="image/jpeg"]
 * @returns {Promise<Object>}
 */
async function analyzeImage(imageBuffer, prompt, mimeType = "image/jpeg") {
  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };

  const result = await analysisModel.generateContent(
    [prompt, imagePart],
    requestOptions,
  );
  return extractJson(result.response.text());
}

/**
 * Gọi Gemini với prompt text, trả về JSON đã parse
 * @param {string} prompt
 * @returns {Promise<Object>}
 */
async function generateJson(prompt) {
  const result = await translationModel.generateContent(prompt, requestOptions);
  return extractJson(result.response.text());
}

module.exports = {
  analyzeImage,
  generateJson,
};
