import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string | number;
  to?: string;
  suffix?: ReactNode;
  accent?: 'mint' | 'peach' | 'default';
}

export function StatCard({ label, value, to, suffix, accent = 'default' }: StatCardProps) {
  const accentClass =
    accent === 'mint' || accent === 'default'
      ? 'energy-stat-card--primary'
      : accent === 'peach'
        ? 'energy-stat-card--accent'
        : '';

  const card = (
    <Card className={`energy-stat-card ${accentClass}`.trim()}>
      <Statistic title={label} value={value} suffix={suffix} />
    </Card>
  );

  if (to) {
    return (
      <Link to={to} className="energy-stat-card__link">
        {card}
      </Link>
    );
  }

  return card;
}
