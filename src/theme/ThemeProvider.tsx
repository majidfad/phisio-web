import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ThemeContext } from '@/theme/theme-context';
import {
  applyThemeToDocument,
  getInitialTheme,
  persistTheme,
  type ThemeMode,
} from '@/theme/theme-mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(mode);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    persistTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((current) => {
      const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, setMode, toggleTheme }), [mode, setMode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
