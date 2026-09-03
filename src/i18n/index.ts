import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { setPushNotificationLanguage } from '@/features/notifications/utils/push-language-store';
import enCommon from '@/locales/en/common.json';
import faCommon from '@/locales/fa/common.json';

import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  getLanguageDirection,
  I18N_NAMESPACE,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './config';

const LANGUAGE_STORAGE_KEY = 'phisio.language';

function normalizeLanguage(language: string): SupportedLanguage {
  return language.startsWith('fa') ? 'fa' : 'en';
}

function readStoredLanguage(): SupportedLanguage {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'fa' || stored === 'en') {
      return stored;
    }
  } catch {
    /* keep default */
  }

  return DEFAULT_LANGUAGE;
}

function persistLanguage(language: string): void {
  const normalized = normalizeLanguage(language);

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
    } catch {
      /* ignore quota / privacy mode */
    }
  }

  void setPushNotificationLanguage(normalized);
}

function applyDocumentLanguage(language: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.lang = language;
  document.documentElement.dir = getLanguageDirection(language);
}

void i18n.use(initReactI18next).init({
  resources: {
    fa: { [I18N_NAMESPACE]: faCommon },
    en: { [I18N_NAMESPACE]: enCommon },
  },
  lng: readStoredLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  defaultNS: I18N_NAMESPACE,
  ns: [I18N_NAMESPACE],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

applyDocumentLanguage(i18n.language);
persistLanguage(i18n.language);

i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language);
  persistLanguage(language);
});

export default i18n;
