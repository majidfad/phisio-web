import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AppLink } from '@/components/SiteLink';
import { ZivanLogo } from '@/components/ui';
import { LANDING_CONTACT } from '@/features/landing/landing-content';
import { routes } from '@/routes/routes';

export function LandingFooter() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language.startsWith('fa');
  const phoneLabel = isFa ? LANDING_CONTACT.phoneDisplayFa : LANDING_CONTACT.phoneDisplayEn;
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        <div className="landing-footer__brand-block">
          <div className="landing-footer__brand">
            <ZivanLogo size={32} />
            <div>
              <strong>{t('app.name')}</strong>
              <p>{t('app.tagline')}</p>
            </div>
          </div>
          <a href={`tel:${LANDING_CONTACT.phoneTel}`} className="landing-footer__support-btn">
            <Phone size={16} aria-hidden />
            {t('landing.footer.support24')}
          </a>
        </div>

        <nav className="landing-footer__col" aria-label={t('landing.footer.productNav')}>
          <h3>{t('landing.footer.product')}</h3>
          <Link to={routes.root}>{t('landing.nav.home')}</Link>
          <a href={`${routes.root}#features`}>{t('landing.nav.features')}</a>
          <a href={`${routes.root}#how`}>{t('landing.nav.how')}</a>
          <Link to={routes.download}>{t('landing.nav.download')}</Link>
          <Link to={routes.about}>{t('landing.nav.about')}</Link>
        </nav>

        <nav className="landing-footer__col" aria-label={t('landing.footer.accountNav')}>
          <h3>{t('landing.footer.account')}</h3>
          <AppLink to={routes.login}>{t('landing.nav.login')}</AppLink>
          <AppLink to={`${routes.register}?role=patient`}>{t('landing.hero.ctaPatient')}</AppLink>
          <AppLink to={`${routes.register}?role=doctor`}>{t('landing.hero.ctaClinic')}</AppLink>
        </nav>

        <div className="landing-footer__col landing-footer__contact">
          <h3>{t('landing.footer.contact')}</h3>
          <a href={`tel:${LANDING_CONTACT.phoneTel}`} dir="ltr">
            <Phone size={16} aria-hidden />
            <span>{phoneLabel}</span>
          </a>
        </div>

        <nav className="landing-footer__col" aria-label={t('landing.footer.legalNav')}>
          <h3>{t('landing.footer.legal')}</h3>
          <Link to={routes.privacy}>{t('landing.footer.privacy')}</Link>
          <Link to={routes.terms}>{t('landing.footer.terms')}</Link>
        </nav>
      </div>

      <div className="landing-footer__bottom">
        <p className="landing-footer__copy">{t('landing.footer.copyright', { year })}</p>
        <p className="landing-footer__rights">{t('landing.footer.rights')}</p>
      </div>
    </footer>
  );
}
