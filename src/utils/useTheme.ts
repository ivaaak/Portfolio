import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

const readStoredTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const systemTheme = (): Theme => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light');

// Follows the system theme until the user picks one, then remembers that choice
export const useTheme = () => {
  const [storedTheme, setStoredTheme] = useState<Theme | null>(readStoredTheme);
  const [system, setSystem] = useState<Theme>(systemTheme);
  const theme = storedTheme ?? system;

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => setSystem(systemTheme());
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (storedTheme) {
      document.documentElement.dataset.theme = storedTheme;
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [storedTheme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setStoredTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode etc.) - the choice just won't persist
    }
  }, [theme]);

  return { theme, toggleTheme };
};
