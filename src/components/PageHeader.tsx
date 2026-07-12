import { Button } from 'antd';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div
      className="page-header"
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}
    >
      <div>
        <h1 className="page-header__title">{title}</h1>
        {description ? <span className="page-header__description">{description}</span> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

interface PageHeaderButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
}

export function PageHeaderButton({ label, onClick, loading }: PageHeaderButtonProps) {
  return (
    <Button
      type="primary"
      size="large"
      onClick={onClick}
      loading={loading}
      className="touch-target"
    >
      {label}
    </Button>
  );
}
