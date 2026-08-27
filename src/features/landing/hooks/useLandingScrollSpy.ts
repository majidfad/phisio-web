import { useEffect, useState } from 'react';

import { prefersReducedMotion } from '@/features/landing/utils/smooth-scroll';

/** Highlights the nav link for the section currently in view. */
export function useLandingScrollSpy(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0 || prefersReducedMotion()) {
      return;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        setActiveId(bestRatio > 0.08 ? bestId : null);
      },
      {
        root: null,
        // Prefer the section sitting in the middle band of the viewport.
        rootMargin: '-28% 0px -48% 0px',
        threshold: [0, 0.12, 0.28, 0.45, 0.65],
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
