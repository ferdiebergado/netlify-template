import { useEffect, useState } from 'react';
import { ThemeProviderContext, type Theme, type ThemeProviderProps } from '../provider';

export default function DarkModeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (resolved: 'light' | 'dark') => {
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    };

    if (theme !== 'system') {
      applyTheme(theme);
      return;
    }

    const media = globalThis.matchMedia('(prefers-color-scheme: dark)');

    const resolve = () => applyTheme(media.matches ? 'dark' : 'light');

    resolve();

    media.addEventListener('change', resolve);
    return () => media.removeEventListener('change', resolve);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
