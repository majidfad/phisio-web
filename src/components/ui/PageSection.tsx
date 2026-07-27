import type { ReactNode } from 'react';

interface PageSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function PageSection({ title, description, action, children }: PageSectionProps) {
  return (
    <section className="page-section">
      <div className="page-section__header">
        <div>
          <h2 className="page-section__title">{title}</h2>
          {description ? <p className="page-section__description">{description}</p> : null}
        </div>
        {action ? <div className="page-section__action">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
