import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LANDING_CONTACT } from '@/features/landing/landing-content';

/** Floating support CTA — opens the phone dialer. */
export function LandingSupportFab() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language.startsWith('fa');
  const phoneLabel = isFa ? LANDING_CONTACT.phoneDisplayFa : LANDING_CONTACT.phoneDisplayEn;

  return (
    <a
      href={`tel:${LANDING_CONTACT.phoneTel}`}
      className="landing-support-fab"
      aria-label={`${t('landing.support.fabLabel')} — ${phoneLabel}`}
    >
      <Phone size={18} aria-hidden />
      <span>{t('landing.support.fabLabel')}</span>
    </a>
  );
}
