export const DEFAULT_LANGUAGE = 'fa' as const;
export const FALLBACK_LANGUAGE = 'en' as const;

export const SUPPORTED_LANGUAGES = [DEFAULT_LANGUAGE, FALLBACK_LANGUAGE] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const I18N_NAMESPACE = 'common' as const;

export function getLanguageDirection(language: string): 'rtl' | 'ltr' {
  return language === 'fa' ? 'rtl' : 'ltr';
}
