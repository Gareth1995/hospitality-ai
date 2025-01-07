'use client';
import { useTheme } from '../context/theme-context';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Left label appears when the theme is light */}
      <span className={`text-sm transition-opacity duration-300 text-black ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`}>
        Light
      </span>
      
      <label htmlFor="theme-toggle" className="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          id="theme-toggle"
          className="hidden"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <span className="slider absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300"></span>
        <span className={`ball absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></span>
      </label>
      
      {/* Right label appears when the theme is dark */}
      <span className={`text-sm transition-opacity duration-300 ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`}>
        Dark
      </span>
    </div>
  );
}
