import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavCardProps {
  to: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export function NavCard({
  to,
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: NavCardProps) {
  return (
    <Link
      to={to}
      className={`nav-card${active ? ' nav-card--active' : ''}${collapsed ? ' nav-card--collapsed' : ''}`}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
    >
      <span className="nav-card__icon">{icon}</span>
      {!collapsed ? <span className="nav-card__label">{label}</span> : null}
    </Link>
  );
}
