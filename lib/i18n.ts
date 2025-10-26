import en from "@/public/locales/en.json"
import hi from "@/public/locales/hi.json"
import ta from "@/public/locales/ta.json"

type Language = "en" | "hi" | "ta" | "te" | "bn"

const translations: Record<Language, any> = {
  en,
  hi,
  ta,
  te: en, // Placeholder - add Telugu translations
  bn: en, // Placeholder - add Bengali translations
}

export const getTranslation = (language: Language, key: string, defaultValue = ""): string => {
  const keys = key.split(".")
  let value: any = translations[language] || translations.en

  for (const k of keys) {
    value = value?.[k]
  }

  return value || defaultValue || key
}

export const getLanguageName = (code: Language): string => {
  const names: Record<Language, string> = {
    en: "English",
    hi: "हिन्दी",
    ta: "தமிழ்",
    te: "తెలుగు",
    bn: "বাংলা",
  }
  return names[code]
}

export const getLanguageFlag = (code: Language): string => {
  const flags: Record<Language, string> = {
    en: "🇬🇧",
    hi: "🇮🇳",
    ta: "🇮🇳",
    te: "🇮🇳",
    bn: "🇧🇩",
  }
  return flags[code]
}
