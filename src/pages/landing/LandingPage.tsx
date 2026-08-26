import { useMemo, useState } from 'react';
import {
  Activity,
  BellRing,
  BookOpen,
  Bot,
  CalendarCheck2,
  ClipboardList,
  ClipboardPen,
  Headset,
  HeartPulse,
  History,
  Lock,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  UserRoundSearch,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LandingDownloadSection } from '@/features/landing/components/LandingDownloadSection';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingNav } from '@/features/landing/components/LandingNav';
import { LandingPhoneMock } from '@/features/landing/components/LandingPhoneMock';
import { LandingReveal } from '@/features/landing/components/LandingReveal';
import { LandingSeo } from '@/features/landing/components/LandingSeo';
import { LandingSupportFab } from '@/features/landing/components/LandingSupportFab';
import { LANDING_CONTACT, LANDING_SITE } from '@/features/landing/landing-content';
import { routes } from '@/routes/routes';

type FeatureAudience = 'patient' | 'doctor';

const HOW_STEPS: { icon: LucideIcon; tone: 'teal' | 'blue' | 'mint' }[] = [
  { icon: UserRoundSearch, tone: 'blue' },
  { icon: CalendarCheck2, tone: 'teal' },
  { icon: HeartPulse, tone: 'mint' },
];

const PATIENT_FEATURES: { icon: LucideIcon }[] = [
  { icon: Activity },
  { icon: BellRing },
  { icon: HeartPulse },
  { icon: Stethoscope },
  { icon: BookOpen },
];

const DOCTOR_FEATURES: { icon: LucideIcon }[] = [
  { icon: ClipboardList },
  { icon: History },
  { icon: Users },
  { icon: ClipboardPen },
  { icon: Sparkles },
];

const AI_ITEMS: { icon: LucideIcon }[] = [
  { icon: Sparkles },
  { icon: ClipboardPen },
  { icon: Bot },
  { icon: Timer },
  { icon: MessageCircleQuestion },
];

const TRUST_ITEMS: { icon: LucideIcon }[] = [
  { icon: Headset },
  { icon: Lock },
  { icon: ShieldCheck },
];

export function LandingPage() {
  const { t } = useTranslation();
  const [featureAudience, setFeatureAudience] = useState<FeatureAudience>('patient');

  const seoTitle = t('landing.seo.homeTitle');
  const seoDescription = t('landing.seo.homeDescription');
  const activeFeatures = featureAudience === 'patient' ? PATIENT_FEATURES : DOCTOR_FEATURES;
  const featureKeyPrefix =
    featureAudience === 'patient' ? 'landing.features.patient' : 'landing.features.doctor';

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: LANDING_SITE.name,
        alternateName: LANDING_SITE.nameFa,
        url: LANDING_SITE.origin,
        logo: `${LANDING_SITE.origin}/brand/zivan-mark.png`,
        telephone: LANDING_CONTACT.phoneTel,
        sameAs: [],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: LANDING_SITE.name,
        url: LANDING_SITE.origin,
        inLanguage: ['fa', 'en'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: LANDING_SITE.name,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web, Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'IRR',
        },
        description: seoDescription,
        url: LANDING_SITE.origin,
      },
    ],
    [seoDescription],
  );

  return (
    <div className="landing-page">
      <LandingSeo title={seoTitle} description={seoDescription} path="/" jsonLd={jsonLd} />
      <LandingNav onLanding />

      <main>
        <section className="landing-hero" aria-labelledby="landing-brand">
          <div className="landing-hero__media" aria-hidden>
            <picture>
              <source
                media="(max-width: 699px)"
                type="image/webp"
                srcSet="/brand/landing/hero-sm.webp"
              />
              <source media="(max-width: 699px)" srcSet="/brand/landing/hero-sm.jpg" />
              <source
                type="image/webp"
                srcSet="/brand/landing/hero-md.webp 900w, /brand/landing/hero-lg.webp 1600w"
                sizes="100vw"
              />
              <img
                src="/brand/landing/hero-lg.jpg"
                srcSet="/brand/landing/hero-sm.jpg 640w, /brand/landing/hero-md.jpg 900w, /brand/landing/hero-lg.jpg 1600w"
                sizes="100vw"
                width={1536}
                height={1024}
                alt=""
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <div className="landing-hero__veil" />
          </div>

          <div className="landing-hero__content">
            <div className="landing-hero__copy">
              <p className="landing-hero__eyebrow">{t('landing.hero.eyebrow')}</p>
              <h1 id="landing-brand" className="landing-hero__brand">
                {t('app.name')}
              </h1>
              <p className="landing-hero__tagline">{t('app.tagline')}</p>
              <div className="landing-hero__ctas">
                <Link
                  to={`${routes.register}?role=patient`}
                  className="landing-btn landing-btn--primary landing-hero__cta-primary"
                >
                  {t('landing.hero.ctaPatient')}
                </Link>
                <div className="landing-hero__cta-secondary">
                  <Link to={`${routes.register}?role=doctor`} className="landing-hero__text-link">
                    {t('landing.hero.ctaClinic')}
                  </Link>
                  <span className="landing-hero__cta-dot" aria-hidden>
                    ·
                  </span>
                  <Link to={routes.download} className="landing-hero__text-link">
                    {t('landing.hero.ctaDownload')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="landing-hero__phone">
              <LandingPhoneMock />
            </div>
          </div>
        </section>

        <LandingReveal
          as="section"
          id="how"
          className="landing-section landing-how"
          aria-labelledby="how-title"
        >
          <div className="landing-section__inner">
            <h2 id="how-title">{t('landing.how.title')}</h2>
            <p className="landing-section__lead">{t('landing.how.lead')}</p>
            <ol className="landing-how__steps">
              {HOW_STEPS.map(({ icon: Icon, tone }, index) => {
                const step = index + 1;
                return (
                  <li
                    key={step}
                    className={`landing-how__step landing-how__step--${tone}`}
                    style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
                  >
                    <div className="landing-how__badge">
                      <Icon size={22} strokeWidth={2.1} aria-hidden />
                    </div>
                    <span className="landing-how__num" aria-hidden>
                      {String(step).padStart(2, '0')}
                    </span>
                    <h3>{t(`landing.how.steps.${step}.title`)}</h3>
                    <p>{t(`landing.how.steps.${step}.body`)}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </LandingReveal>

        <LandingReveal
          as="section"
          id="features"
          className="landing-section landing-features"
          aria-labelledby="features-title"
        >
          <div className="landing-section__inner">
            <div className="landing-features__intro">
              <h2 id="features-title">{t('landing.features.title')}</h2>
              <p className="landing-section__lead">{t('landing.features.lead')}</p>
            </div>

            <div
              className="landing-features__tabs"
              role="tablist"
              aria-label={t('landing.features.title')}
            >
              <button
                type="button"
                role="tab"
                id="features-tab-patient"
                aria-selected={featureAudience === 'patient'}
                aria-controls="features-panel"
                className={`landing-features__tab${featureAudience === 'patient' ? ' is-active' : ''}`}
                onClick={() => setFeatureAudience('patient')}
              >
                {t('landing.features.patientBadge')}
              </button>
              <button
                type="button"
                role="tab"
                id="features-tab-doctor"
                aria-selected={featureAudience === 'doctor'}
                aria-controls="features-panel"
                className={`landing-features__tab${featureAudience === 'doctor' ? ' is-active' : ''}`}
                onClick={() => setFeatureAudience('doctor')}
              >
                {t('landing.features.doctorBadge')}
              </button>
            </div>

            <div
              id="features-panel"
              role="tabpanel"
              aria-labelledby={
                featureAudience === 'patient' ? 'features-tab-patient' : 'features-tab-doctor'
              }
              className="landing-features__panel"
            >
              <aside className="landing-features__aside">
                <p className="landing-features__aside-badge">
                  {t(
                    featureAudience === 'patient'
                      ? 'landing.features.patientBadge'
                      : 'landing.features.doctorBadge',
                  )}
                </p>
                <h3 className="landing-features__aside-title">
                  {t(
                    featureAudience === 'patient'
                      ? 'landing.features.patientTitle'
                      : 'landing.features.doctorTitle',
                  )}
                </h3>
                <p className="landing-features__panel-lead">
                  {t(
                    featureAudience === 'patient'
                      ? 'landing.features.patientLead'
                      : 'landing.features.doctorLead',
                  )}
                </p>
              </aside>

              <ul className="landing-features__grid landing-features__grid--audience">
                {activeFeatures.map(({ icon: Icon }, index) => {
                  const id = index + 1;
                  return (
                    <li key={`${featureAudience}-${id}`} className="landing-feature-card">
                      <span className="landing-feature-card__icon" aria-hidden>
                        <Icon size={20} strokeWidth={2.1} />
                      </span>
                      <h3>{t(`${featureKeyPrefix}.${id}.title`)}</h3>
                      <p>{t(`${featureKeyPrefix}.${id}.body`)}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </LandingReveal>

        <LandingReveal as="div">
          <LandingDownloadSection />
        </LandingReveal>

        <LandingReveal
          as="section"
          id="trust"
          className="landing-section landing-trust"
          aria-labelledby="trust-title"
        >
          <div className="landing-section__inner">
            <h2 id="trust-title">{t('landing.trust.title')}</h2>
            <p className="landing-section__lead">{t('landing.trust.lead')}</p>

            <ul className="landing-trust__grid">
              {TRUST_ITEMS.map(({ icon: Icon }, index) => {
                const id = index + 1;
                return (
                  <li
                    key={id}
                    className="landing-trust-card"
                    style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}
                  >
                    <span className="landing-trust-card__icon">
                      <Icon size={20} strokeWidth={2.1} aria-hidden />
                    </span>
                    <h3>{t(`landing.trust.items.${id}.title`)}</h3>
                    <p>{t(`landing.trust.items.${id}.body`)}</p>
                  </li>
                );
              })}
            </ul>

            <blockquote className="landing-trust__note">
              <p>{t('landing.trust.founderNote')}</p>
              <footer>{t('landing.trust.founderNoteBy')}</footer>
            </blockquote>
          </div>
        </LandingReveal>

        <LandingReveal
          as="section"
          id="ai"
          className="landing-section landing-ai"
          aria-labelledby="ai-title"
        >
          <div className="landing-section__inner">
            <div className="landing-ai__header">
              <span className="landing-pill">{t('landing.ai.badge')}</span>
              <h2 id="ai-title">{t('landing.ai.title')}</h2>
              <p className="landing-section__lead">{t('landing.ai.lead')}</p>
            </div>
            <ul className="landing-ai__grid">
              {AI_ITEMS.map(({ icon: Icon }, index) => {
                const id = index + 1;
                return (
                  <li
                    key={id}
                    className="landing-ai-card"
                    style={{ ['--reveal-delay' as string]: `${index * 60}ms` }}
                  >
                    <span className="landing-ai-card__icon">
                      <Icon size={18} strokeWidth={2.1} aria-hidden />
                    </span>
                    <div>
                      <h3>{t(`landing.ai.items.${id}.title`)}</h3>
                      <p>{t(`landing.ai.items.${id}.body`)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </LandingReveal>

        <LandingReveal
          as="section"
          id="about"
          className="landing-section landing-about"
          aria-labelledby="about-title"
        >
          <div className="landing-section__inner">
            <h2 id="about-title">{t('landing.about.title')}</h2>
            <p className="landing-section__lead">{t('landing.about.lead')}</p>
            <p className="landing-about__story">{t('landing.about.story')}</p>
            <p className="landing-about__team">{t('landing.about.team')}</p>
            <p className="landing-about__more">
              <Link to={routes.about}>{t('landing.about.readMore')}</Link>
            </p>
          </div>
        </LandingReveal>

        <section className="landing-cta-band" aria-labelledby="cta-title">
          <div className="landing-cta-band__inner">
            <h2 id="cta-title">{t('landing.cta.title')}</h2>
            <div className="landing-hero__ctas landing-cta-band__ctas">
              <Link
                to={`${routes.register}?role=patient`}
                className="landing-btn landing-btn--light"
              >
                {t('landing.cta.patient')}
              </Link>
              <Link to={routes.login} className="landing-btn landing-btn--dark">
                {t('landing.cta.login')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
      <LandingSupportFab />
    </div>
  );
}
