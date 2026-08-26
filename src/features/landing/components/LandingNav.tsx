import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AppLink } from '@/components/SiteLink';
import { ZivanLogo } from '@/components/ui';
import { LanguageToggle } from '@/features/landing/components/LanguageToggle';
import { routes } from '@/routes/routes';

interface LandingNavProps {
  /** When true, feature/how anchors point to landing hash routes. */
  onLanding?: boolean;
}

export function LandingNav({ onLanding = true }: LandingNavProps) {
  const { t } = useTranslation();

  const featuresHref = onLanding ? '#features' : `${routes.root}#features`;
  const howHref = onLanding ? '#how' : `${routes.root}#how`;
  const aiHref = onLanding ? '#ai' : `${routes.root}#ai`;
  const trustHref = onLanding ? '#trust' : `${routes.root}#trust`;

  return (
    <header className="landing-nav">
      <div className="landing-nav__inner">
        <Link to={routes.root} className="landing-nav__brand" aria-label={t('app.name')}>
          <ZivanLogo size={32} />
          <span className="landing-nav__brand-name">{t('app.name')}</span>
        </Link>

        <nav className="landing-nav__links" aria-label={t('landing.nav.aria')}>
          <a href={howHref}>{t('landing.nav.how')}</a>
          <a href={featuresHref}>{t('landing.nav.features')}</a>
          <a href={trustHref}>{t('landing.nav.trust')}</a>
          <a href={aiHref}>{t('landing.nav.ai')}</a>
          <Link to={routes.download}>{t('landing.nav.download')}</Link>
          {onLanding ? (
            <a href="#about">{t('landing.nav.about')}</a>
          ) : (
            <Link to={routes.about}>{t('landing.nav.about')}</Link>
          )}
        </nav>

        <div className="landing-nav__actions">
          <LanguageToggle />
          <AppLink to={routes.login} className="landing-nav__login">
            {t('landing.nav.login')}
          </AppLink>
        </div>
      </div>
    </header>
  );
}
