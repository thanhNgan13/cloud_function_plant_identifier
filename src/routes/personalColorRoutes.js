const express = require("express");
const router = express.Router();
const {
  analyzePersonalColorHandler,
  getAvailableLanguagesHandler,
} = require("../controllers/personalColorController");
const { faceImageUpload } = require("../middlewares/upload");
const { analyzeRateLimit } = require("../middlewares/security");

/**
 * @swagger
 * /personal-color-service/analyze:
 *   post:
 *     summary: Analyze personal color from face image
 *     description: |
 *       Analyzes a person's personal color characteristics (undertone, subseason, skin tone) based on a face image.
 *       Returns comprehensive color analysis results suitable for personal color styling recommendations.
 *     tags:
 *       - Personal Color Analysis
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file of person's face (clear frontal view required)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Alternative field name for image file
 *               language:
 *                 type: string
 *                 default: en
 *                 description: |
 *                   ISO 639-1 language code for translating response descriptions.
 *                   Omit or use `en` for English (default).
 *                   Supported codes: en, vi, zh, fr, de, ja, ko, es, ru, pt, it, ar, hi, bn, th, id, ms, nl, tr, pl, sv, uk, ro, cs, hu, el, da, fi, no, he, bg
 *                 enum:
 *                   - en
 *                   - vi
 *                   - zh
 *                   - fr
 *                   - de
 *                   - ja
 *                   - ko
 *                   - es
 *                   - ru
 *                   - pt
 *                   - it
 *                   - ar
 *                   - hi
 *                   - bn
 *                   - th
 *                   - id
 *                   - ms
 *                   - nl
 *                   - tr
 *                   - pl
 *                   - sv
 *                   - uk
 *                   - ro
 *                   - cs
 *                   - hu
 *                   - el
 *                   - da
 *                   - fi
 *                   - no
 *                   - he
 *                   - bg
 *     responses:
 *       200:
 *         description: Personal color analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     analysis:
 *                       type: object
 *                       properties:
 *                         undertone:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: string
 *                               enum: [warm, cool, neutral, neutral_warm, neutral_cool]
 *                               description: Primary color undertone
 *                             explain:
 *                               type: string
 *                               description: 2-3 sentence explanation of undertone determination
 *                         subseason:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: string
 *                               enum: [bright_spring, light_spring, warm_spring, soft_summer, light_summer, cool_summer, soft_autumn, warm_autumn, deep_autumn, cool_winter, bright_winter, deep_winter]
 *                               description: Primary seasonal color classification
 *                             explain:
 *                               type: string
 *                               description: 2-3 sentence explanation of subseason determination
 *                         skintone:
 *                           type: string
 *                           enum: [fair, light, light_medium, medium, medium_tan, tan, deep]
 *                           description: Skin tone depth level
 *                         detail:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               season:
 *                                 type: string
 *                                 description: Subseason value
 *                               percentage:
 *                                 type: integer
 *                                 minimum: 0
 *                                 maximum: 100
 *                                 description: Percentage match (should sum to ~100)
 *                           description: Array of potential subseason matches with percentages
 *                         description:
 *                           type: string
 *                           description: Comprehensive explanation of why detail percentages are distributed this way
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         language:
 *                           type: string
 *                           description: Language code used for response
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                           description: When analysis was performed
 *       400:
 *         description: Bad Request - Invalid image or language parameter
 *       401:
 *         description: Unauthorized - Missing or invalid x-api-key (only when API_KEY is set)
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *       500:
 *         description: Internal Server Error - Analysis failed
 */
router.post(
  "/analyze",
  analyzeRateLimit,
  faceImageUpload,
  analyzePersonalColorHandler,
);

/**
 * @swagger
 * /personal-color-service/languages:
 *   get:
 *     summary: Get available languages for personal color analysis
 *     description: Returns list of supported language codes for response translation
 *     tags:
 *       - Personal Color Analysis
 *     responses:
 *       200:
 *         description: Available languages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     languages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [en, vi, zh, fr, de, ja, ko, es, ru, pt, it, ar, hi, bn, th, id, ms, nl, tr, pl, sv, uk, ro, cs, hu, el, da, fi, no, he, bg]
 *                     count:
 *                       type: integer
 *                       description: Number of supported languages
 *                     defaultLanguage:
 *                       type: string
 *                       example: en
 */
router.get("/languages", getAvailableLanguagesHandler);

module.exports = router;
