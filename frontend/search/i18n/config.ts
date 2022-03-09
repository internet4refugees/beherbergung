import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json'
import de from './de.json'

export const resources = {
  en: { translation: en },
  de: { translation: de }
} as const

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,

    //lng: "en",  /* we use LanguageDetector instead */
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  })
