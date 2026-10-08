import hi from './hi.json';
import mr from './mr.json';
import en from './en.json';
import type { LanguageCode } from '../types';

const translations: Record<LanguageCode, Record<string, string>> = {
  hi,
  mr,
  en
};

export function getTranslation(lang: LanguageCode, key: string, fallback?: string): string {
  const table = translations[lang] || translations.hi;
  return table[key] || fallback || key;
}
