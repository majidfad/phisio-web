import type { ReactNode } from 'react';

import { EmptyRestSvg } from '@/components/illustrations';

interface WarmEmptyStateProps {
  title?: string;
  description: string;
  icon?: ReactNode;
}

export function WarmEmptyState({ title, description, icon }: WarmEmptyStateProps) {
  return (
    <div className="energy-empty">
      <div className="energy-empty__art" aria-hidden="true">
        {icon ?? <EmptyRestSvg size={96} />}
      </div>
      {title ? <span className="energy-empty__title">{title}</span> : null}
      <p className="energy-empty__description">{description}</p>
    </div>
  );
}
