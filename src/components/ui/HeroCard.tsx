import type { ReactNode } from 'react';

import { EnergyWaveBg, RecoveryPulseSvg } from '@/components/illustrations';

export type HeroIllustrationVariant = 'recovery' | 'care' | 'progress' | 'admin';

interface HeroCardProps {
  badge?: string;
  title: string;
  description: string;
  illustration?: HeroIllustrationVariant;
  children?: ReactNode;
}

export function HeroCard({
  badge,
  title,
  description,
  illustration = 'recovery',
  children,
}: HeroCardProps) {
  return (
    <section className="energy-hero" aria-label={title}>
      <EnergyWaveBg className="energy-hero__wave" idSuffix={illustration} />
      <div className="energy-hero__content">
        {badge ? <span className="energy-hero__badge">{badge}</span> : null}
        <h2 className="energy-hero__title">{title}</h2>
        <p className="energy-hero__description">{description}</p>
        {children}
      </div>
      <div className="energy-hero__art" aria-hidden="true">
        <RecoveryPulseSvg variant={illustration} size={72} />
      </div>
    </section>
  );
}
