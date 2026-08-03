import { Activity, BarChart3, LayoutDashboard, type LucideIcon, Stethoscope } from 'lucide-react';
import type { ReactNode } from 'react';

import { EnergyWaveBg } from '@/components/illustrations';
import { ExerciseProgressRing } from '@/components/ui/ExerciseProgressRing';

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

  return (
    <section
      className="hero-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--phisio-radius-lg)',
        padding: '18px 20px',
        backgroundColor: 'var(--phisio-surface)',
        border: '1px solid var(--phisio-border)',
        boxShadow: 'var(--phisio-shadow-sm)',
      }}
      aria-label={title}
    >
      <EnergyWaveBg
        className="hero-card__wave"
        idSuffix={illustration}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ minWidth: 0 }}>
          {badge ? (
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--phisio-primary)',
                backgroundColor: 'var(--phisio-primary-soft)',
                borderRadius: 'var(--phisio-radius-sm)',
                marginBottom: '8px',
              }}
            >
              {badge}
            </span>
          ) : null}
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--phisio-text)',
              marginBottom: '4px',
              marginTop: 0,
              lineHeight: 1.35,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: 'var(--phisio-font-meta)',
              fontWeight: 500,
              color: 'var(--phisio-text-secondary)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {description}
          </p>
          {children ? <div style={{ marginTop: '12px' }}>{children}</div> : null}
        </div>

        {progressPercent !== undefined ? (
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ExerciseProgressRing percent={progressPercent} size={96} strokeWidth={8} />
          </div>
        ) : (
          <div
            style={{
              flexShrink: 0,
              padding: '12px',
              borderRadius: 'var(--phisio-radius-md)',
              backgroundColor: 'var(--phisio-primary-soft)',
              color: 'var(--phisio-primary)',
            }}
            aria-hidden="true"
          >
            <Icon size={32} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </section>
  );
}
