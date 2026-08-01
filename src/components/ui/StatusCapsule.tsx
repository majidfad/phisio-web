import type { ReactNode } from 'react';

export type StatusVariant = 'active' | 'pending' | 'completed' | 'cancelled' | 'review' | 'info';

interface StatusCapsuleProps {
  status: StatusVariant;
  label?: string;
  icon?: ReactNode;
  showDot?: boolean;
  className?: string;
}

const STATUS_STYLES: Record<
  StatusVariant,
  { bg: string; text: string; border: string; dot: string }
> = {
  active: {
    bg: 'var(--phisio-accent-soft)',
    text: 'var(--phisio-teal)',
    border: 'color-mix(in srgb, var(--phisio-teal) 28%, transparent)',
    dot: 'var(--phisio-teal)',
  },
  completed: {
    bg: 'var(--phisio-primary-soft)',
    text: 'var(--phisio-primary)',
    border: 'color-mix(in srgb, var(--phisio-primary) 28%, transparent)',
    dot: 'var(--phisio-primary)',
  },
  pending: {
    bg: 'rgba(245, 158, 11, 0.12)',
    text: 'var(--phisio-warning)',
    border: 'rgba(245, 158, 11, 0.25)',
    dot: 'var(--phisio-warning)',
  },
  review: {
    bg: 'rgba(245, 158, 11, 0.12)',
    text: 'var(--phisio-warning)',
    border: 'rgba(245, 158, 11, 0.25)',
    dot: 'var(--phisio-warning)',
  },
  cancelled: {
    bg: 'rgba(239, 68, 68, 0.12)',
    text: 'var(--phisio-danger)',
    border: 'rgba(239, 68, 68, 0.25)',
    dot: 'var(--phisio-danger)',
  },
  info: {
    bg: 'var(--phisio-primary-soft)',
    text: 'var(--phisio-primary)',
    border: 'color-mix(in srgb, var(--phisio-primary) 28%, transparent)',
    dot: 'var(--phisio-primary)',
  },
};

export function StatusCapsule({
  status,
  label,
  icon,
  showDot = true,
  className = '',
}: StatusCapsuleProps) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.info;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        borderRadius: 'var(--phisio-radius-pill)',
        border: `1px solid ${style.border}`,
        backgroundColor: style.bg,
        color: style.text,
        whiteSpace: 'nowrap',
      }}
    >
      {showDot ? (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: style.dot,
            display: 'inline-block',
          }}
        />
      ) : null}
      {icon}
      <span>{label ?? status.toUpperCase()}</span>
    </span>
  );
}
