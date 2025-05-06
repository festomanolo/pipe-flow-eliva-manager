
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    setIsTransitioning(true);
    const newTheme = !isDark;
    
    // Small delay to allow transition effects to play
    setTimeout(() => {
      setIsDark(newTheme);
      updateTheme(newTheme);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 50);
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
      className="p-2 rounded-lg transition-all duration-300 hover:bg-sidebar-accent relative overflow-hidden"
      aria-label="Toggle theme"
      disabled={isTransitioning}
    >
      <div className={`transition-all duration-300 transform ${isTransitioning ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}>
        {isDark ? (
          <Sun size={20} className="text-yellow-300" />
        ) : (
          <Moon size={20} className="text-slate-600" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
