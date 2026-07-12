import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavCardProps {
  to: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavCard({ to, icon, label, active = false, onClick }: NavCardProps) {
  return (
    <Link
      to={to}
      className={`nav-card${active ? ' nav-card--active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      <span className="nav-card__icon">{icon}</span>
      <span className="nav-card__label">{label}</span>
    </Link>
  );
}
