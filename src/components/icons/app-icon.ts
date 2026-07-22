import type { LucideProps } from 'lucide-react';

/** Shared Lucide defaults for a minimal UI look. */
export const appIconProps: Pick<LucideProps, 'size' | 'strokeWidth'> = {
  size: 18,
  strokeWidth: 1.75,
};

export const denseIconProps: Pick<LucideProps, 'size' | 'strokeWidth'> = {
  size: 16,
  strokeWidth: 1.75,
};
