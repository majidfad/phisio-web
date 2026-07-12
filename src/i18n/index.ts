import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '@/locales/en/common.json';
import faCommon from '@/locales/fa/common.json';

import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  getLanguageDirection,
  I18N_NAMESPACE,
  SUPPORTED_LANGUAGES,
} from './config';

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
  lng: DEFAULT_LANGUAGE,
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

i18n.on('languageChanged', applyDocumentLanguage);

export default i18n;
