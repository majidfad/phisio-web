import { Card, Statistic } from 'antd';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string | number;
  to?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  trend?: {
    value: string;
    isUp?: boolean;
  };
  accent?: 'mint' | 'blue' | 'peach' | 'default';
  /** Decorative sparkline — off by default (pro density). */
  showSparkline?: boolean;
}

export function StatCard({
  label,
  value,
  to,
  icon,
  suffix,
  trend,
  accent = 'default',
  showSparkline = false,
}: StatCardProps) {
  const iconBg =
    accent === 'mint'
      ? { bg: 'var(--phisio-accent-soft)', color: 'var(--phisio-teal)' }
      : accent === 'peach'
        ? { bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--phisio-warning)' }
        : { bg: 'var(--phisio-primary-soft)', color: 'var(--phisio-primary)' };

  const card = (
    <Card
      className="hover-lift"
      style={{ borderRadius: 'var(--phisio-radius-md)', boxShadow: 'var(--phisio-shadow-sm)' }}
      styles={{ body: { padding: '16px' } }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        {icon ? (
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--phisio-radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: iconBg.bg,
              color: iconBg.color,
            }}
          >
            {icon}
          </div>
        ) : null}
        {trend ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 'var(--phisio-radius-sm)',
              backgroundColor:
                trend.isUp !== false ? 'var(--phisio-accent-soft)' : 'rgba(239, 68, 68, 0.12)',
              color: trend.isUp !== false ? 'var(--phisio-teal)' : 'var(--phisio-danger)',
            }}
          >
            {trend.isUp !== false ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend.value}
          </span>
        ) : null}
      </div>

      <Statistic
        title={
          <span
            style={{
              fontSize: 'var(--phisio-font-meta)',
              fontWeight: 500,
              color: 'var(--phisio-text-secondary)',
            }}
          >
            {label}
          </span>
        }
        value={value}
        suffix={suffix}
        styles={{
          content: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--phisio-text)',
            letterSpacing: '-0.02em',
          },
        }}
      />

      {showSparkline ? (
        <div style={{ marginTop: '10px', height: '28px', width: '100%', opacity: 0.5 }}>
          <svg
            style={{ width: '100%', height: '100%' }}
            viewBox="0 0 100 25"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M 0 20 Q 25 5, 50 15 T 100 8"
              fill="none"
              stroke={accent === 'mint' ? 'var(--phisio-teal)' : 'var(--phisio-primary)'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : null}
    </Card>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
        {card}
      </Link>
    );
  }

  return card;
}
