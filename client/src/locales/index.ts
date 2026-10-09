import { hi } from './hi';
import { mr } from './mr';
import { en } from './en';
import type { LanguageCode } from '../types';

export const translations: Record<LanguageCode, Record<string, string>> = {
  hi,
  mr,
  en
};

export function t(lang: LanguageCode, key: string, fallback?: string): string {
  const table = translations[lang] || translations.hi;
  return table[key] || fallback || key;
}

export function getTranslation(lang: LanguageCode, key: string, fallback?: string): string {
  return t(lang, key, fallback);
}

export { hi, mr, en };
