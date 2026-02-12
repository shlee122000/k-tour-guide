import { defineRouting } from 'next-intl/routing';

export const locales = [
  'ko', 'en', 'ja', 'zh', 'es', 'fr', 'th', 'vi', 'id', 'de'
] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  th: 'ภาษาไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  de: 'Deutsch',
};

export const localeFlags: Record<Locale, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  th: '🇹🇭',
  vi: '🇻🇳',
  id: '🇮🇩',
  de: '🇩🇪',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
});
