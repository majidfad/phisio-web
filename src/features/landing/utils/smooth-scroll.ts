const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches;
}

/** Smooth-scroll to a landing section id, accounting for sticky nav via CSS scroll-margin. */
export function scrollToLandingSection(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id);
  if (!el) {
    return false;
  }

  const resolved: ScrollBehavior = prefersReducedMotion() ? 'auto' : behavior;
  el.scrollIntoView({ behavior: resolved, block: 'start' });
  return true;
}

export function parseLandingHash(hash: string): string | null {
  const id = hash.replace(/^#/, '').trim();
  return id.length > 0 ? id : null;
}
