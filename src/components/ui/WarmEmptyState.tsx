import { Inbox, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface WarmEmptyStateProps {
  title?: string;
  description: string;
  icon?: ReactNode;
  /** Used when `icon` is omitted — Lucide component for a minimal empty graphic. */
  lucideIcon?: LucideIcon;
  action?: ReactNode;
}

export function WarmEmptyState({
  title,
  description,
  icon,
  lucideIcon: LucideIcon = Inbox,
  action,
}: WarmEmptyStateProps) {
  return (
    <div className="energy-empty">
      <div className="energy-empty__art" aria-hidden="true">
        {icon ?? <LucideIcon size={48} strokeWidth={1.5} className="energy-empty__lucide" />}
      </div>
      {title ? <span className="energy-empty__title">{title}</span> : null}
      <p className="energy-empty__description">{description}</p>
      {action ? <div className="energy-empty__action">{action}</div> : null}
    </div>
  );
}
