
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = storedTheme 
      ? storedTheme === 'dark' 
      : systemPreference;
    
    setIsDark(initialTheme);
    updateTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    updateTheme(newTheme);
  };

  const updateTheme = (dark: boolean) => {
    // Update class on html element
    document.documentElement.classList.toggle('dark', dark);
    // Update localStorage
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-lg transition-colors duration-200 hover:bg-sidebar-accent"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-300" />
      ) : (
        <Moon size={20} className="text-slate-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
