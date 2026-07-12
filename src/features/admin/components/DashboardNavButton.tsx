import { CalendarOutlined, FileTextOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const ICONS: Record<string, ReactNode> = {
  'manage-doctors': <TeamOutlined />,
  'manage-patients': <UserOutlined />,
  'manage-exercises': <FileTextOutlined />,
  'assign-exercises': <CalendarOutlined />,
  'my-patients': <UserOutlined />,
  exercises: <FileTextOutlined />,
};

interface DashboardNavButtonProps {
  label: string;
  to: string;
  id?: string;
}

export function DashboardNavButton({ label, to, id }: DashboardNavButtonProps) {
  return (
    <Link to={to} className="action-card touch-target">
      <span className="action-card__icon">{id ? ICONS[id] : <FileTextOutlined />}</span>
      <span className="action-card__label">{label}</span>
    </Link>
  );
}
