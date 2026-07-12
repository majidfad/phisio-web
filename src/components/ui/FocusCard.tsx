import { Card } from 'antd';
import type { ReactNode } from 'react';

interface FocusCardProps {
  children: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export function FocusCard({ children, onClick, hoverable = false }: FocusCardProps) {
  return (
    <Card
      className="energy-focus-card touch-active"
      hoverable={hoverable}
      onClick={onClick}
      styles={{ body: { padding: 24 } }}
    >
      {children}
    </Card>
  );
}
