import { createContext, useState, ReactNode, useContext } from 'react';
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

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(THEME_LIGHT);

  const change = (name: string) => {
    setTheme(name);
    changeCssVariables(name);
  };

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
