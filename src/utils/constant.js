// Available languages for AI analysis response
const AVAILABLE_LANGUAGES = {
  en: { code: "en", name: "English" },
  vi: { code: "vi", name: "Vietnamese (Tiếng Việt)" },
  zh: { code: "zh", name: "Chinese (中文)" },
  fr: { code: "fr", name: "French (Français)" },
  de: { code: "de", name: "German (Deutsch)" },
  ja: { code: "ja", name: "Japanese (日本語)" },
  ko: { code: "ko", name: "Korean (한국어)" },
  es: { code: "es", name: "Spanish (Español)" },
  ru: { code: "ru", name: "Russian (Русский)" },
  pt: { code: "pt", name: "Portuguese (Português)" },
  it: { code: "it", name: "Italian (Italiano)" },
  ar: { code: "ar", name: "Arabic (العربية)" },
  hi: { code: "hi", name: "Hindi (हिन्दी)" },
  bn: { code: "bn", name: "Bengali (বাংলা)" },
  th: { code: "th", name: "Thai (ไทย)" },
  id: { code: "id", name: "Indonesian (Bahasa Indonesia)" },
  ms: { code: "ms", name: "Malay (Bahasa Melayu)" },
  nl: { code: "nl", name: "Dutch (Nederlands)" },
  tr: { code: "tr", name: "Turkish (Türkçe)" },
  pl: { code: "pl", name: "Polish (Polski)" },
  sv: { code: "sv", name: "Swedish (Svenska)" },
  uk: { code: "uk", name: "Ukrainian (Українська)" },
  ro: { code: "ro", name: "Romanian (Română)" },
  cs: { code: "cs", name: "Czech (Čeština)" },
  hu: { code: "hu", name: "Hungarian (Magyar)" },
  el: { code: "el", name: "Greek (Ελληνικά)" },
  da: { code: "da", name: "Danish (Dansk)" },
  fi: { code: "fi", name: "Finnish (Suomi)" },
  no: { code: "no", name: "Norwegian (Norsk)" },
  he: { code: "he", name: "Hebrew (עברית)" },
  bg: { code: "bg", name: "Bulgarian (Български)" },
};

// Default language for AI analysis response
const DEFAULT_LANGUAGE = "en";

module.exports = {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE,
};
