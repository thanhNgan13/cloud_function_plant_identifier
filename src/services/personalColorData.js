/**
 * Personal Color Analysis Data
 * Standard 12-season color analysis framework for personal color recommendation
 */

const COLOR_PALETTES = {
  undertones: {
    warm: {
      name: "Warm",
      description: "Golden, peachy, or orange undertones",
      characteristics: [
        "Golden or peachy reflection in skin",
        "Warm appearance in natural lighting",
        "Gold jewelry looks more flattering than silver",
      ],
    },
    cool: {
      name: "Cool",
      description: "Pink, red, or blue undertones",
      characteristics: [
        "Rosy or pinkish reflection in skin",
        "Cool appearance in natural lighting",
        "Silver jewelry looks more flattering than gold",
      ],
    },
    neutral: {
      name: "Neutral",
      description: "Balanced undertones without clear warm or cool preference",
      characteristics: [
        "Both gold and silver jewelry look equally good",
        "Balanced coloring without strong warm or cool tones",
        "Can wear both warm and cool colors effectively",
      ],
    },
    neutral_warm: {
      name: "Neutral-Warm",
      description: "Slightly more warm-leaning neutral undertones",
      characteristics: [
        "Balanced undertones with slight warmth",
        "Gold jewelry slightly preferred over silver",
        "Can wear both warm and cool colors with slight preference for warm",
      ],
    },
    neutral_cool: {
      name: "Neutral-Cool",
      description: "Slightly more cool-leaning neutral undertones",
      characteristics: [
        "Balanced undertones with slight coolness",
        "Silver jewelry slightly preferred over gold",
        "Can wear both cool and warm colors with slight preference for cool",
      ],
    },
  },

  subseasons: {
    // Spring group
    bright_spring: {
      season: "Spring",
      name: "Bright Spring",
      undertone: "warm",
      depth: "light to medium",
      saturation: "bright",
      characteristics: [
        "Clear, bright coloring with warm undertones",
        "Medium to bright saturation",
        "Radiant and vibrant appearance",
        "Looks good in: clear bright colors, warm saturated hues, crisp whites",
      ],
    },
    light_spring: {
      season: "Spring",
      name: "Light Spring",
      undertone: "warm",
      depth: "light",
      saturation: "soft to bright",
      characteristics: [
        "Light, delicate coloring with warm undertones",
        "Soft to bright saturation",
        "Fresh and youthful appearance",
        "Looks good in: soft warm colors, pastels, warm neutrals",
      ],
    },
    warm_spring: {
      season: "Spring",
      name: "Warm Spring",
      undertone: "warm",
      depth: "medium",
      saturation: "warm",
      characteristics: [
        "Warm, earthy coloring with golden undertones",
        "Warm saturation with natural warmth",
        "Cozy and approachable appearance",
        "Looks good in: warm earthy tones, gold accents, terracotta",
      ],
    },

    // Summer group
    light_summer: {
      season: "Summer",
      name: "Light Summer",
      undertone: "cool",
      depth: "light",
      saturation: "soft",
      characteristics: [
        "Light, delicate coloring with cool undertones",
        "Soft, muted saturation",
        "Ethereal and gentle appearance",
        "Looks good in: soft cool pastels, light neutrals, cool grays",
      ],
    },
    soft_summer: {
      season: "Summer",
      name: "Soft Summer",
      undertone: "cool",
      depth: "medium",
      saturation: "muted",
      characteristics: [
        "Medium coloring with subtle cool undertones",
        "Soft, muted saturation",
        "Calm and soothing appearance",
        "Looks good in: muted cool tones, dusty colors, soft neutrals",
      ],
    },
    cool_summer: {
      season: "Summer",
      name: "Cool Summer",
      undertone: "cool",
      depth: "medium to deep",
      saturation: "cool",
      characteristics: [
        "Cool, clear coloring with strong cool undertones",
        "Cool saturation without warmth",
        "Sophisticated and poised appearance",
        "Looks good in: clear cool colors, jewel tones, cool neutrals",
      ],
    },

    // Autumn group
    warm_autumn: {
      season: "Autumn",
      name: "Warm Autumn",
      undertone: "warm",
      depth: "deep",
      saturation: "warm muted",
      characteristics: [
        "Deep, warm coloring with golden undertones",
        "Warm, earthy saturation",
        "Rich and grounded appearance",
        "Looks good in: warm deep tones, rust, gold, warm browns",
      ],
    },
    soft_autumn: {
      season: "Autumn",
      name: "Soft Autumn",
      undertone: "warm",
      depth: "medium to deep",
      saturation: "soft warm",
      characteristics: [
        "Medium to deep coloring with warm undertones",
        "Soft, warm saturation",
        "Mellow and approachable appearance",
        "Looks good in: warm muted tones, olive, warm browns, camel",
      ],
    },
    deep_autumn: {
      season: "Autumn",
      name: "Deep Autumn",
      undertone: "warm",
      depth: "deep",
      saturation: "deep warm",
      characteristics: [
        "Deep, rich coloring with warm undertones",
        "Deep, saturated warm tones",
        "Dramatic and striking appearance",
        "Looks good in: deep warm colors, burgundy, forest green, gold",
      ],
    },

    // Winter group
    cool_winter: {
      season: "Winter",
      name: "Cool Winter",
      undertone: "cool",
      depth: "deep",
      saturation: "cool",
      characteristics: [
        "Deep, cool coloring with strong cool undertones",
        "Cool, clear saturation",
        "Striking and elegant appearance",
        "Looks good in: cool jewel tones, black, white, cool burgundy",
      ],
    },
    deep_winter: {
      season: "Winter",
      name: "Deep Winter",
      undertone: "cool",
      depth: "very deep",
      saturation: "deep cool",
      characteristics: [
        "Very deep, dark coloring with cool undertones",
        "Deep, rich cool saturation",
        "Dramatic and powerful appearance",
        "Looks good in: deep cool tones, true black, true white, jewel tones",
      ],
    },
    bright_winter: {
      season: "Winter",
      name: "Bright Winter",
      undertone: "cool",
      depth: "light to medium",
      saturation: "bright",
      characteristics: [
        "Clear, bright coloring with cool undertones",
        "Bright, vivid saturation",
        "Vibrant and striking appearance",
        "Looks good in: bright clear colors, true white, black, primary colors",
      ],
    },
  },

  skintones: [
    "fair",
    "light",
    "light_medium",
    "medium",
    "medium_tan",
    "tan",
    "deep",
  ],

  undertoneValues: ["warm", "cool", "neutral", "neutral_warm", "neutral_cool"],

  subseasonValues: [
    "bright_spring",
    "light_spring",
    "warm_spring",
    "soft_summer",
    "light_summer",
    "cool_summer",
    "soft_autumn",
    "warm_autumn",
    "deep_autumn",
    "cool_winter",
    "bright_winter",
    "deep_winter",
  ],
};

/**
 * Get characteristics for a specific undertone
 * @param {string} undertone - Undertone value
 * @returns {Object} Undertone characteristics
 */
function getUndertoneInfo(undertone) {
  return COLOR_PALETTES.undertones[undertone] || null;
}

/**
 * Get characteristics for a specific subseason
 * @param {string} subseason - Subseason value
 * @returns {Object} Subseason characteristics
 */
function getSubseasonInfo(subseason) {
  return COLOR_PALETTES.subseasons[subseason] || null;
}

/**
 * Get all subseasons within a specific season
 * @param {string} season - Season name (Spring, Summer, Autumn, Winter)
 * @returns {Array} Array of subseason values for that season
 */
function getSeasonSubseasons(season) {
  return Object.entries(COLOR_PALETTES.subseasons)
    .filter(([_, info]) => info.season === season)
    .map(([key]) => key);
}

/**
 * Validate if undertone value is valid
 * @param {string} value - Undertone value to validate
 * @returns {boolean}
 */
function isValidUndertone(value) {
  return COLOR_PALETTES.undertoneValues.includes(value);
}

/**
 * Validate if subseason value is valid
 * @param {string} value - Subseason value to validate
 * @returns {boolean}
 */
function isValidSubseason(value) {
  return COLOR_PALETTES.subseasonValues.includes(value);
}

/**
 * Validate if skintone value is valid
 * @param {string} value - Skintone value to validate
 * @returns {boolean}
 */
function isValidSkintone(value) {
  return COLOR_PALETTES.skintones.includes(value);
}

module.exports = {
  COLOR_PALETTES,
  getUndertoneInfo,
  getSubseasonInfo,
  getSeasonSubseasons,
  isValidUndertone,
  isValidSubseason,
  isValidSkintone,
};
