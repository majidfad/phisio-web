import { useEffect } from 'react';

import {
  parseLandingHash,
  prefersReducedMotion,
  scrollToLandingSection,
} from '@/features/landing/utils/smooth-scroll';

const LANDING_SCROLL_CLASS = 'landing-scroll';

/** Enables scoped smooth scroll + scroll-padding on marketing pages. */
export function useLandingDocumentScroll() {
  useEffect(() => {
    document.documentElement.classList.add(LANDING_SCROLL_CLASS);
    return () => {
      document.documentElement.classList.remove(LANDING_SCROLL_CLASS);
    };
  }, []);
}

/**
 * On mount / hashchange, smoothly scroll to `#section` (e.g. `/#features` from footer).
 */
export function useLandingHashScroll() {
  useEffect(() => {
    const scrollFromHash = () => {
      const id = parseLandingHash(window.location.hash);
      if (!id) {
        return;
      }
      // Wait a frame so layout / images settle before scrolling.
      window.requestAnimationFrame(() => {
        scrollToLandingSection(id, prefersReducedMotion() ? 'auto' : 'smooth');
      });
    };

    scrollFromHash();
    window.addEventListener('hashchange', scrollFromHash);
    return () => window.removeEventListener('hashchange', scrollFromHash);
  }, []);
}
