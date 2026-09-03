import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AppLink } from '@/components/SiteLink';
import { AboutFounders } from '@/features/landing/components/AboutFounders';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingNav } from '@/features/landing/components/LandingNav';
import { LandingReveal } from '@/features/landing/components/LandingReveal';
import { LandingSeo } from '@/features/landing/components/LandingSeo';
import { useLandingDocumentScroll } from '@/features/landing/hooks/useLandingDocumentScroll';
import { LANDING_CONTACT } from '@/features/landing/landing-content';
import { routes } from '@/routes/routes';

export function AboutPage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language.startsWith('fa');
  const phoneLabel = isFa ? LANDING_CONTACT.phoneDisplayFa : LANDING_CONTACT.phoneDisplayEn;
  useLandingDocumentScroll();

  return (
    <div className="landing-page landing-page--about">
      <LandingSeo
        title={t('landing.seo.aboutTitle')}
        description={t('landing.seo.aboutDescription')}
        path={routes.about}
      />
      <LandingNav onLanding={false} />

      <main className="landing-about-page">
        <LandingReveal as="header" className="landing-about-page__hero" tone="soft">
          <p className="landing-hero__eyebrow landing-reveal__item">
            {t('landing.aboutPage.eyebrow')}
          </p>
          <h1 className="landing-reveal__title">{t('landing.aboutPage.title')}</h1>
          <p className="landing-section__lead landing-reveal__lead">
            {t('landing.aboutPage.lead')}
          </p>
        </LandingReveal>

        <LandingReveal
          as="section"
          className="landing-about-page__story"
          aria-labelledby="mission-title"
        >
          <h2 id="mission-title" className="landing-reveal__title">
            {t('landing.aboutPage.missionTitle')}
          </h2>
          <p className="landing-reveal__item">{t('landing.aboutPage.missionBody')}</p>
          <p className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '80ms' }}>
            {t('landing.aboutPage.storyBody')}
          </p>
        </LandingReveal>

        <LandingReveal
          as="section"
          className="landing-about-page__founders"
          aria-labelledby="team-title"
        >
          <h2 id="team-title" className="landing-reveal__title">
            {t('landing.aboutPage.teamTitle')}
          </h2>
          <p className="landing-section__lead landing-reveal__lead">
            {t('landing.aboutPage.teamLead')}
          </p>
          <AboutFounders expanded />
        </LandingReveal>

        <LandingReveal
          as="section"
          className="landing-about-page__contact"
          aria-labelledby="contact-title"
          tone="soft"
        >
          <h2 id="contact-title" className="landing-reveal__title">
            {t('landing.aboutPage.contactTitle')}
          </h2>
          <p className="landing-reveal__lead">{t('landing.aboutPage.contactLead')}</p>
          <div className="landing-about-page__contact-rows landing-reveal__item">
            <a href={`tel:${LANDING_CONTACT.phoneTel}`} dir="ltr">
              <Phone size={18} aria-hidden />
              {phoneLabel}
            </a>
          </div>
          <AppLink
            to={routes.register}
            className="landing-btn landing-btn--primary landing-reveal__item"
            style={{ ['--reveal-delay' as string]: '100ms' }}
          >
            {t('landing.aboutPage.cta')}
          </AppLink>
        </LandingReveal>
      </main>

      <LandingFooter />
    </div>
  );
}
