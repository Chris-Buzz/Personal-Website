import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';
interface ThemeApi {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeApi>({ theme: 'light', toggle: () => {} });

// index.html reads the same key before first paint, so a saved dark theme never flashes light.
const STORAGE_KEY = 'hi-theme';

function readSaved(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage blocked: fall back to light */
  }
  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readSaved);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage blocked: the choice lasts for this visit only */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    const update = () => flushSync(() => setTheme((p) => (p === 'dark' ? 'light' : 'dark')));
    // A view transition swaps the whole palette at once instead of fading surfaces one by one.
    const doc = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void> };
    };
    if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update();
      return;
    }
    doc.startViewTransition(update).finished.catch(() => {});
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
