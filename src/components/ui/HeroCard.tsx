import { Activity, BarChart3, LayoutDashboard, type LucideIcon, Stethoscope } from 'lucide-react';
import type { ReactNode } from 'react';

import { ExerciseProgressRing } from '@/components/ui/ExerciseProgressRing';
import { formatPersianNumber } from '@/utils/persian-format';

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
  progressPercent?: number;
  children?: ReactNode;
}

export function HeroCard({
  badge,
  title,
  description,
  illustration = 'recovery',
  progressPercent,
  children,
}: HeroCardProps) {
  const Icon = HERO_ICONS[illustration];
  const percentLabel =
    progressPercent !== undefined
      ? `${formatPersianNumber(Math.round(progressPercent))}٪`
      : undefined;

  return (
    <section className="hero-card" aria-label={title}>
      <div className="hero-card__body">
        <div className="hero-card__copy">
          {badge ? <span className="hero-card__badge">{badge}</span> : null}
          <h2 className="hero-card__title">{title}</h2>
          <p className="hero-card__description">{description}</p>
          {children ? <div className="hero-card__actions">{children}</div> : null}
        </div>

        {progressPercent !== undefined ? (
          <div className="hero-card__ring">
            <ExerciseProgressRing
              percent={progressPercent}
              size={104}
              strokeWidth={9}
              label={percentLabel}
            />
          </div>
        ) : (
          <div className="hero-card__icon" aria-hidden="true">
            <Icon size={32} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </section>
  );
}
