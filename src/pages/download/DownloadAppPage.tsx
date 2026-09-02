import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { appUrl } from '@/constants/site';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingStoreBadges } from '@/features/landing/components/LandingDownloadSection';
import { LandingNav } from '@/features/landing/components/LandingNav';
import { LandingReveal } from '@/features/landing/components/LandingReveal';
import { LandingSeo } from '@/features/landing/components/LandingSeo';
import { useLandingDocumentScroll } from '@/features/landing/hooks/useLandingDocumentScroll';
import { routes } from '@/routes/routes';

export function DownloadAppPage() {
  const { t } = useTranslation();
  useLandingDocumentScroll();

  return (
    <div className="landing-page landing-page--download">
      <LandingSeo
        title={t('landing.seo.downloadTitle')}
        description={t('landing.seo.downloadDescription')}
        path={routes.download}
      />
      <LandingNav onLanding={false} />

      <main className="landing-download">
        <LandingReveal as="header" className="landing-download__hero" tone="soft">
          <p className="landing-hero__eyebrow landing-reveal__item">
            {t('landing.download.eyebrow')}
          </p>
          <h1 className="landing-reveal__title">{t('landing.download.title')}</h1>
          <p className="landing-section__lead landing-reveal__lead">{t('landing.download.lead')}</p>
        </LandingReveal>

        <LandingReveal as="section" className="landing-download__pwa" aria-labelledby="pwa-title">
          <div className="landing-download__pwa-card landing-reveal__item">
            <img
              src="/brand/zivan-mark.png"
              alt=""
              width={56}
              height={56}
              loading="eager"
              decoding="async"
            />
            <div className="landing-download__pwa-copy">
              <h2 id="pwa-title">{t('landing.download.pwaTitle')}</h2>
              <p>{t('landing.download.pwaBody')}</p>
            </div>

            <a href={appUrl('/login')} className="landing-btn landing-btn--primary">
              <Download size={18} aria-hidden />
              {t('landing.download.openAppCta')}
            </a>
            <p className="landing-download__hint">{t('landing.download.appInstallHint')}</p>
          </div>
        </LandingReveal>

        <LandingReveal
          as="section"
          className="landing-download__stores"
          aria-labelledby="stores-title"
          tone="soft"
        >
          <div className="landing-download__stores-head landing-reveal__item">
            <span className="landing-pill">{t('landing.download.storesBadge')}</span>
            <h2 id="stores-title">{t('landing.download.storesTitle')}</h2>
          </div>
          <div className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '90ms' }}>
            <LandingStoreBadges />
          </div>
        </LandingReveal>
      </main>

      <LandingFooter />
    </div>
  );
}
