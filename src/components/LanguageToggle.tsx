import { useTranslation } from 'react-i18next';

import type { SupportedLanguage } from '@/i18n/config';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = 'landing-lang' }: LanguageToggleProps) {
  const { i18n, t } = useTranslation();
  const active = (i18n.language.startsWith('fa') ? 'fa' : 'en') as SupportedLanguage;

  return (
    <div className={className} role="group" aria-label={t('layout.language')}>
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
