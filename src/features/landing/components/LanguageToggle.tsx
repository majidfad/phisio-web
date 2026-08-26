import { useTranslation } from 'react-i18next';

import type { SupportedLanguage } from '@/i18n/config';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const active = (i18n.language.startsWith('fa') ? 'fa' : 'en') as SupportedLanguage;

  return (
    <div className="landing-lang" role="group" aria-label="Language">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          className={`landing-lang__btn${active === lang ? ' is-active' : ''}`}
          onClick={() => {
            void i18n.changeLanguage(lang);
          }}
          aria-pressed={active === lang}
        >
          {lang === 'fa' ? 'FA' : 'EN'}
        </button>
      ))}
    </div>
  );
}
