import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingNav } from '@/features/landing/components/LandingNav';
import { LandingReveal } from '@/features/landing/components/LandingReveal';
import { LandingSeo } from '@/features/landing/components/LandingSeo';
import { useLandingDocumentScroll } from '@/features/landing/hooks/useLandingDocumentScroll';
import { LANDING_CONTACT } from '@/features/landing/landing-content';
import { routes } from '@/routes/routes';

function TermsList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TermsPage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language.startsWith('fa');
  const phoneLabel = isFa ? LANDING_CONTACT.phoneDisplayFa : LANDING_CONTACT.phoneDisplayEn;
  const acceptItems = t('landing.legal.termsAcceptItems', { returnObjects: true });
  const prohibitedItems = t('landing.legal.termsProhibitedItems', { returnObjects: true });
  useLandingDocumentScroll();

  return (
    <div className="landing-page">
      <LandingSeo
        title={t('landing.seo.termsTitle')}
        description={t('landing.seo.termsDescription')}
        path={routes.terms}
      />
      <LandingNav onLanding={false} />
      <LandingReveal as="main" className="landing-legal" tone="soft">
        <h1 className="landing-reveal__title">{t('landing.legal.termsTitle')}</h1>
        <p className="landing-section__lead landing-reveal__lead">{t('landing.legal.termsLead')}</p>
        <p className="landing-reveal__item">{t('landing.legal.termsUpdated')}</p>

        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '40ms' }}>
          <h2>{t('landing.legal.termsServiceTitle')}</h2>
          <p>{t('landing.legal.termsServiceBody')}</p>
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '70ms' }}>
          <h2>{t('landing.legal.termsMedicalTitle')}</h2>
          <p>{t('landing.legal.termsMedicalBody')}</p>
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '100ms' }}>
          <h2>{t('landing.legal.termsAccountsTitle')}</h2>
          <p>{t('landing.legal.termsAccountsBody')}</p>
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '120ms' }}>
          <h2>{t('landing.legal.termsAcceptTitle')}</h2>
          <p>{t('landing.legal.termsAcceptBody')}</p>
          <TermsList items={Array.isArray(acceptItems) ? acceptItems.map(String) : []} />
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '140ms' }}>
          <h2>{t('landing.legal.termsRolesTitle')}</h2>
          <p>{t('landing.legal.termsRolesBody')}</p>
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '160ms' }}>
          <h2>{t('landing.legal.termsProhibitedTitle')}</h2>
          <p>{t('landing.legal.termsProhibitedBody')}</p>
          <TermsList items={Array.isArray(prohibitedItems) ? prohibitedItems.map(String) : []} />
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '180ms' }}>
          <h2>{t('landing.legal.termsIpTitle')}</h2>
          <p>{t('landing.legal.termsIpBody')}</p>
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '200ms' }}>
          <h2>{t('landing.legal.termsLiabilityTitle')}</h2>
          <p>{t('landing.legal.termsLiabilityBody')}</p>
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '220ms' }}>
          <h2>{t('landing.legal.termsChangesTitle')}</h2>
          <p>{t('landing.legal.termsChangesBody')}</p>
        </section>
        <section className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '240ms' }}>
          <h2>{t('landing.legal.termsContactTitle')}</h2>
          <p>
            {t('landing.legal.termsContactBody')}{' '}
            <a href={`tel:${LANDING_CONTACT.phoneTel}`} dir="ltr">
              {phoneLabel}
            </a>
          </p>
        </section>
        <p className="landing-reveal__item" style={{ ['--reveal-delay' as string]: '260ms' }}>
          <Link to={routes.root}>{t('landing.nav.home')}</Link>
        </p>
      </LandingReveal>
      <LandingFooter />
    </div>
  );
}
