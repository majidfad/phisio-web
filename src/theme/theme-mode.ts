export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'phisio-theme';

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

/** Stored preference wins; otherwise fall back to the system preference. */
export function resolveInitialTheme(stored: string | null, prefersDark: boolean): ThemeMode {
  if (isThemeMode(stored)) {
    return stored;
  }

  return prefersDark ? 'dark' : 'light';
}

function getLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readStoredTheme(): string | null {
  try {
    return getLocalStorage()?.getItem(THEME_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function persistTheme(mode: ThemeMode): void {
  try {
    getLocalStorage()?.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Theme preference simply won't survive a reload when storage is unavailable.
  }
}

export function getInitialTheme(): ThemeMode {
  const prefersDark =
    typeof globalThis.matchMedia === 'function'
      ? globalThis.matchMedia('(prefers-color-scheme: dark)').matches
      : true;

  return resolveInitialTheme(readStoredTheme(), prefersDark);
}

export function applyThemeToDocument(mode: ThemeMode): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme', mode);
}
