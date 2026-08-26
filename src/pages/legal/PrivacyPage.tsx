import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingNav } from '@/features/landing/components/LandingNav';
import { LandingSeo } from '@/features/landing/components/LandingSeo';
import { LANDING_CONTACT } from '@/features/landing/landing-content';
import { routes } from '@/routes/routes';

function PrivacyList({ items }: { items: string[] }) {
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

export function PrivacyPage() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language.startsWith('fa');
  const phoneLabel = isFa ? LANDING_CONTACT.phoneDisplayFa : LANDING_CONTACT.phoneDisplayEn;
  const whatItems = t('landing.legal.privacyWhatItems', { returnObjects: true });
  const useItems = t('landing.legal.privacyUseItems', { returnObjects: true });

  return (
    <div className="landing-page">
      <LandingSeo
        title={t('landing.seo.privacyTitle')}
        description={t('landing.seo.privacyDescription')}
        path={routes.privacy}
      />
      <LandingNav onLanding={false} />
      <main className="landing-legal">
        <h1>{t('landing.legal.privacyTitle')}</h1>
        <p className="landing-section__lead">{t('landing.legal.privacyLead')}</p>
        <p>{t('landing.legal.privacyUpdated')}</p>

        <section>
          <h2>{t('landing.legal.privacyControllerTitle')}</h2>
          <p>{t('landing.legal.privacyControllerBody')}</p>
        </section>
        <section>
          <h2>{t('landing.legal.privacyWhatTitle')}</h2>
          <p>{t('landing.legal.privacyWhatBody')}</p>
          <PrivacyList items={Array.isArray(whatItems) ? whatItems.map(String) : []} />
        </section>
        <section>
          <h2>{t('landing.legal.privacyUseTitle')}</h2>
          <p>{t('landing.legal.privacyUseBody')}</p>
          <PrivacyList items={Array.isArray(useItems) ? useItems.map(String) : []} />
        </section>
        <section>
          <h2>{t('landing.legal.privacyShareTitle')}</h2>
          <p>{t('landing.legal.privacyShareBody')}</p>
        </section>
        <section>
          <h2>{t('landing.legal.privacyRetentionTitle')}</h2>
          <p>{t('landing.legal.privacyRetentionBody')}</p>
        </section>
        <section>
          <h2>{t('landing.legal.privacyRightsTitle')}</h2>
          <p>{t('landing.legal.privacyRightsBody')}</p>
        </section>
        <section>
          <h2>{t('landing.legal.privacySecurityTitle')}</h2>
          <p>{t('landing.legal.privacySecurityBody')}</p>
        </section>
        <section>
          <h2>{t('landing.legal.privacyChildrenTitle')}</h2>
          <p>{t('landing.legal.privacyChildrenBody')}</p>
        </section>
        <section>
          <h2>{t('landing.legal.privacyChangesTitle')}</h2>
          <p>{t('landing.legal.privacyChangesBody')}</p>
        </section>
        <section>
          <h2>{t('landing.legal.privacyContactTitle')}</h2>
          <p>
            {t('landing.legal.privacyContactBody')}{' '}
            <a href={`tel:${LANDING_CONTACT.phoneTel}`} dir="ltr">
              {phoneLabel}
            </a>
          </p>
        </section>
        <p>
          <Link to={routes.root}>{t('landing.nav.home')}</Link>
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}
