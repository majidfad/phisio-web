import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AppLink } from '@/components/SiteLink';
import { AboutFounders } from '@/features/landing/components/AboutFounders';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingNav } from '@/features/landing/components/LandingNav';
import { LandingSeo } from '@/features/landing/components/LandingSeo';
import { LANDING_CONTACT } from '@/features/landing/landing-content';
import { routes } from '@/routes/routes';

export function AboutPage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language.startsWith('fa');
  const phoneLabel = isFa ? LANDING_CONTACT.phoneDisplayFa : LANDING_CONTACT.phoneDisplayEn;

  return (
    <div className="landing-page landing-page--about">
      <LandingSeo
        title={t('landing.seo.aboutTitle')}
        description={t('landing.seo.aboutDescription')}
        path={routes.about}
      />
      <LandingNav onLanding={false} />

      <main className="landing-about-page">
        <header className="landing-about-page__hero">
          <p className="landing-hero__eyebrow">{t('landing.aboutPage.eyebrow')}</p>
          <h1>{t('landing.aboutPage.title')}</h1>
          <p className="landing-section__lead">{t('landing.aboutPage.lead')}</p>
        </header>

        <section className="landing-about-page__story" aria-labelledby="mission-title">
          <h2 id="mission-title">{t('landing.aboutPage.missionTitle')}</h2>
          <p>{t('landing.aboutPage.missionBody')}</p>
          <p>{t('landing.aboutPage.storyBody')}</p>
        </section>

        <section className="landing-about-page__founders" aria-labelledby="team-title">
          <h2 id="team-title">{t('landing.aboutPage.teamTitle')}</h2>
          <p className="landing-section__lead">{t('landing.aboutPage.teamLead')}</p>
          <AboutFounders expanded />
        </section>

        <section className="landing-about-page__contact" aria-labelledby="contact-title">
          <h2 id="contact-title">{t('landing.aboutPage.contactTitle')}</h2>
          <p>{t('landing.aboutPage.contactLead')}</p>
          <div className="landing-about-page__contact-rows">
            <a href={`tel:${LANDING_CONTACT.phoneTel}`} dir="ltr">
              <Phone size={18} aria-hidden />
              {phoneLabel}
            </a>
          </div>
          <AppLink to={routes.register} className="landing-btn landing-btn--primary">
            {t('landing.aboutPage.cta')}
          </AppLink>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
