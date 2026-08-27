import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LANDING_FOUNDERS } from '@/features/landing/landing-content';

interface AboutFoundersProps {
  /** Larger layout + full bio for dedicated /about page */
  expanded?: boolean;
}

export function AboutFounders({ expanded = false }: AboutFoundersProps) {
  const { t } = useTranslation();

  return (
    <div className={`landing-founders${expanded ? ' landing-founders--expanded' : ''}`}>
      {LANDING_FOUNDERS.map((founder, index) => (
        <article
          key={founder.id}
          className="landing-founder landing-reveal__item"
          style={{ ['--reveal-delay' as string]: `${80 + index * 100}ms` }}
        >
          <div className="landing-founder__media">
            <img
              src={founder.imageSrc}
              alt={t(founder.nameKey)}
              width={expanded ? 160 : 120}
              height={expanded ? 160 : 120}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="landing-founder__body">
            <h3>{t(founder.nameKey)}</h3>
            <p className="landing-founder__role">{t(founder.roleKey)}</p>
            <p className="landing-founder__bio">{t(founder.shortBioKey)}</p>
            <a
              className="landing-founder__linkedin"
              href={founder.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} aria-hidden />
              {t('landing.founders.linkedin')}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
