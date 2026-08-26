import type { CSSProperties, ElementType, ReactNode } from 'react';

import { useLandingReveal } from '@/features/landing/hooks/useLandingReveal';

interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  id?: string;
  'aria-labelledby'?: string;
}

export function LandingReveal({
  as: Tag = 'div',
  className = '',
  children,
  style,
  id,
  'aria-labelledby': ariaLabelledBy,
}: RevealProps) {
  const ref = useLandingReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`landing-reveal ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
