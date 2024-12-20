'use client';
import { createContext, useState, useEffect, useContext } from 'react';

// Default value for the context
const ThemeContext = createContext({
    theme: 'light', // Default theme
    setTheme: () => {}, // Placeholder function
  });

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Sync with user's system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('theme', storedTheme || 'light'); // Set theme attribute to the html element
    setTheme(storedTheme || systemTheme);
  }, []);

  // Update the `html` class and localStorage when theme changes
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('theme', storedTheme || 'light'); // set theme attribute so that global.css can access change
  }, [theme]);

  return (
    // allows theme and setTheme to be present for all children no useTheme can be called by any component
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
