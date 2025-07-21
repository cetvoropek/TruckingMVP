import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

export function ThemeToggle() {
  const { theme, isDark, setTheme } = useDarkMode();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light mode' },
    { value: 'dark' as const, icon: Moon, label: 'Dark mode' },
    { value: 'system' as const, icon: Monitor, label: 'System preference' }
  ];

  return (
    <div className="relative">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors duration-200">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              dark:focus:ring-offset-gray-800
              ${theme === value 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }
            `}
            aria-label={label}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function SimpleThemeToggle() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-full transition-all duration-200
        bg-gray-100 dark:bg-gray-800 
        text-gray-600 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform duration-200 rotate-0" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-200 rotate-0" />
      )}
    </button>
  );
}