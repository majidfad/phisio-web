import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { appUrl } from '@/constants/site';
import { LANDING_STORES } from '@/features/landing/landing-content';
import { routes } from '@/routes/routes';

interface LandingDownloadSectionProps {
  compact?: boolean;
  id?: string;
}

export function LandingStoreBadges() {
  const { t } = useTranslation();

  return (
    <ul className="landing-store-badges">
      <li className="landing-store-badge">
        <img
          src={LANDING_STORES.cafeBazaarLogo}
          alt={t('landing.download.cafeBazaarAlt')}
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
        />
        <span>
          <small>{t('landing.download.storesBadge')}</small>
          <strong>{t('landing.download.cafeBazaarAlt')}</strong>
        </span>
      </li>
      <li className="landing-store-badge">
        <img
          src={LANDING_STORES.sibAppLogo}
          alt={t('landing.download.sibAppAlt')}
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
        />
        <span>
          <small>{t('landing.download.storesBadge')}</small>
          <strong>{t('landing.download.sibAppAlt')}</strong>
        </span>
      </li>
    </ul>
  );
}

export function LandingDownloadSection({
  compact = false,
  id = 'download',
}: LandingDownloadSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      id={id}
      className={`landing-section landing-download-band${compact ? ' landing-download-band--compact' : ''}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="landing-section__inner landing-download-band__inner">
        <div className="landing-download-band__copy">
          <span className="landing-pill">{t('landing.download.storesBadge')}</span>
          <h2 id={`${id}-title`}>{t('landing.download.sectionTitle')}</h2>
          <p className="landing-section__lead">{t('landing.download.sectionLead')}</p>
        </div>

        <div className="landing-download-band__actions">
          <a href={appUrl('/login')} className="landing-btn landing-btn--primary">
            <Download size={18} aria-hidden />
            {t('landing.download.openAppCta')}
          </a>
          <Link to={routes.download} className="landing-btn landing-btn--ghost">
            {t('landing.download.more')}
          </Link>
        </div>

        <LandingStoreBadges />
      </div>
    </section>
  );
}
