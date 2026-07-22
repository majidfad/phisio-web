import { Calendar, FileText, Users, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';

const ICONS: Record<string, ReactNode> = {
  'manage-doctors': <Users {...appIconProps} />,
  'manage-patients': <User {...appIconProps} />,
  'manage-exercises': <FileText {...appIconProps} />,
  'assign-exercises': <Calendar {...appIconProps} />,
  'my-patients': <User {...appIconProps} />,
  exercises: <FileText {...appIconProps} />,
};

interface DashboardNavButtonProps {
  label: string;
  to: string;
  id?: string;
}

export function DashboardNavButton({ label, to, id }: DashboardNavButtonProps) {
  return (
    <Link to={to} className="action-card touch-target">
      <span className="action-card__icon">{id ? ICONS[id] : <FileText {...appIconProps} />}</span>
      <span className="action-card__label">{label}</span>
    </Link>
  );
}
