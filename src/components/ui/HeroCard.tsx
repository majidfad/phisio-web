import { Activity, BarChart3, LayoutDashboard, type LucideIcon, Stethoscope } from 'lucide-react';
import type { ReactNode } from 'react';

import { EnergyWaveBg } from '@/components/illustrations';

export type HeroIllustrationVariant = 'recovery' | 'care' | 'progress' | 'admin';

const HERO_ICONS: Record<HeroIllustrationVariant, LucideIcon> = {
  recovery: Activity,
  care: Stethoscope,
  progress: BarChart3,
  admin: LayoutDashboard,
};

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
  const Icon = HERO_ICONS[illustration];

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
        <Icon size={40} strokeWidth={1.5} className="energy-hero__lucide" />
      </div>
    </section>
  );
}
