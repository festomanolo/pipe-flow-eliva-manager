
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full transition-all duration-300",
        theme === 'dark' 
          ? "bg-sidebar-accent text-white hover:bg-sidebar-accent/80"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="animate-reveal-right" />
      ) : (
        <Moon size={18} className="animate-reveal-left" />
      )}
    </button>
  );
};

export default ThemeToggle;
