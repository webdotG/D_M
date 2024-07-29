import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { changeCssVariables } from '../hooks/changeCssVariables';

type ThemeContextType = {
  theme: string;
  change: (name: string) => void;
};

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';
export const THEME_MORDOR = 'mordor';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

const getStoredTheme = () => {
  return localStorage.getItem('theme') || THEME_LIGHT;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(getStoredTheme);

  const change = (name: string) => {
    setTheme(name);
    localStorage.setItem('theme', name);
    changeCssVariables(name);
  };

  useEffect(() => {
    changeCssVariables(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, change }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
