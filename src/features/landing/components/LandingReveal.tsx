import type { CSSProperties, ElementType, ReactNode } from 'react';

import { useLandingReveal } from '@/features/landing/hooks/useLandingReveal';

interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  id?: string;
  'aria-labelledby'?: string;
  /** Extra delay before the section itself fades in (ms). */
  delayMs?: number;
  /** Softer / shorter motion for nested blocks. */
  tone?: 'section' | 'soft';
}

export function LandingReveal({
  as: Tag = 'div',
  className = '',
  children,
  style,
  id,
  'aria-labelledby': ariaLabelledBy,
  delayMs = 0,
  tone = 'section',
}: RevealProps) {
  const ref = useLandingReveal<HTMLElement>();

  const mergedStyle: CSSProperties = {
    ...style,
    ...(delayMs > 0 ? { ['--reveal-section-delay' as string]: `${delayMs}ms` } : null),
  };

  return (
    <Tag
      ref={ref}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`landing-reveal landing-reveal--${tone} ${className}`.trim()}
      style={mergedStyle}
    >
      {children}
    </Tag>
  );
}
