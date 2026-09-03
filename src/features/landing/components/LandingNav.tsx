import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AppLink } from '@/components/SiteLink';
import { ZivanLogo } from '@/components/ui';
import { LanguageToggle } from '@/features/landing/components/LanguageToggle';
import { useLandingScrollSpy } from '@/features/landing/hooks/useLandingScrollSpy';
import { handleLandingSectionClick } from '@/features/landing/utils/section-nav';
import { routes } from '@/routes/routes';

const LANDING_SECTION_IDS = ['how', 'features', 'trust', 'ai', 'about'] as const;
const NO_SECTIONS: readonly string[] = [];

interface LandingNavProps {
  /** When true, feature/how anchors point to landing hash routes. */
  onLanding?: boolean;
}

export function LandingNav({ onLanding = true }: LandingNavProps) {
  const { t } = useTranslation();
  const activeId = useLandingScrollSpy(onLanding ? LANDING_SECTION_IDS : NO_SECTIONS);

  const sectionHref = (id: (typeof LANDING_SECTION_IDS)[number]) =>
    onLanding ? `#${id}` : `${routes.root}#${id}`;

  const sectionClass = (id: string) => `landing-nav__link${activeId === id ? ' is-active' : ''}`;

  return (
    <header className="landing-nav">
      <div className="landing-nav__inner">
        <Link to={routes.root} className="landing-nav__brand" aria-label={t('app.name')}>
          <ZivanLogo size={32} />
          <span className="landing-nav__brand-name">{t('app.name')}</span>
        </Link>

        <nav className="landing-nav__links" aria-label={t('landing.nav.aria')}>
          <a
            href={sectionHref('how')}
            className={sectionClass('how')}
            onClick={onLanding ? (e) => handleLandingSectionClick(e, 'how') : undefined}
          >
            {t('landing.nav.how')}
          </a>
          <a
            href={sectionHref('features')}
            className={sectionClass('features')}
            onClick={onLanding ? (e) => handleLandingSectionClick(e, 'features') : undefined}
          >
            {t('landing.nav.features')}
          </a>
          <a
            href={sectionHref('trust')}
            className={sectionClass('trust')}
            onClick={onLanding ? (e) => handleLandingSectionClick(e, 'trust') : undefined}
          >
            {t('landing.nav.trust')}
          </a>
          <a
            href={sectionHref('ai')}
            className={sectionClass('ai')}
            onClick={onLanding ? (e) => handleLandingSectionClick(e, 'ai') : undefined}
          >
            {t('landing.nav.ai')}
          </a>
          <Link to={routes.download} className="landing-nav__link">
            {t('landing.nav.download')}
          </Link>
          {onLanding ? (
            <a
              href="#about"
              className={sectionClass('about')}
              onClick={(e) => handleLandingSectionClick(e, 'about')}
            >
              {t('landing.nav.about')}
            </a>
          ) : (
            <Link to={routes.about} className="landing-nav__link">
              {t('landing.nav.about')}
            </Link>
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
