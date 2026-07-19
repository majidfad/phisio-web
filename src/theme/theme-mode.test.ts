import { afterEach, describe, expect, it } from 'vitest';

import {
  applyThemeToDocument,
  isThemeMode,
  resolveInitialTheme,
  THEME_STORAGE_KEY,
} from '@/theme/theme-mode';

describe('resolveInitialTheme', () => {
  it('uses the stored theme when it is valid', () => {
    expect(resolveInitialTheme('light', true)).toBe('light');
    expect(resolveInitialTheme('dark', false)).toBe('dark');
  });

  it('falls back to the system preference when nothing is stored', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark');
    expect(resolveInitialTheme(null, false)).toBe('light');
  });

  it('ignores invalid stored values', () => {
    expect(resolveInitialTheme('blue', true)).toBe('dark');
    expect(resolveInitialTheme('', false)).toBe('light');
  });
});

describe('isThemeMode', () => {
  it('accepts only light and dark', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('auto')).toBe(false);
    expect(isThemeMode(null)).toBe(false);
  });
});

describe('applyThemeToDocument', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  it('sets the data-theme attribute on the html element', () => {
    applyThemeToDocument('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    applyThemeToDocument('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
