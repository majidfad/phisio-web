import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface DockNavItem {
  key: string;
  icon: ReactNode;
  label: string;
}

interface DockNavProps {
  items: DockNavItem[];
  selectedKey: string;
  ariaLabel: string;
}

export function DockNav({ items, selectedKey, ariaLabel }: DockNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="dock-nav safe-area-bottom" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.key === selectedKey;
        return (
          <button
            key={item.key}
            type="button"
            className={`dock-nav__item touch-target${active ? ' dock-nav__item--active' : ''}`}
            onClick={() => void navigate(item.key)}
            aria-current={active ? 'page' : undefined}
          >
            <span className="dock-nav__icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
