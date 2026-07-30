import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';
interface ThemeApi { theme: Theme; toggle: () => void; }

const ThemeContext = createContext<ThemeApi>({ theme: 'light', toggle: () => {} });

const STORAGE_KEY = 'hi-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  // Reflect onto <html> and notify the canvases (which read CSS vars live).
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const dark = theme === 'dark';
    window.__cineTheme?.(dark);
    // hive reads computed styles; let the variables flip first
    const t = setTimeout(() => window.__hiveTheme?.(), 60);
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, theme);
    return () => clearTimeout(t);
  }, [theme]);

  const toggle = useCallback(() => setTheme((p) => (p === 'dark' ? 'light' : 'dark')), []);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
