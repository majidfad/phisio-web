import type { MouseEvent } from 'react';

import { scrollToLandingSection } from '@/features/landing/utils/smooth-scroll';

/** Intercept same-page hash clicks for smooth scroll without jumping. */
export function handleLandingSectionClick(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }

  const target = document.getElementById(sectionId);
  if (!target) {
    return;
  }

  event.preventDefault();
  const nextHash = `#${sectionId}`;
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, '', nextHash);
  }
  scrollToLandingSection(sectionId);
}
