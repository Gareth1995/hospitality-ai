'use client';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the type for the context value
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void; // Explicitly define setTheme type
}

// Create the context with an initial value matching ThemeContextType
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light', // Default theme
  setTheme: () => {}, // Placeholder function (will be replaced in provider)
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');

  // Sync with user's system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.setAttribute('theme', storedTheme);
  }, []);

  // Update the `html` attribute and localStorage when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
