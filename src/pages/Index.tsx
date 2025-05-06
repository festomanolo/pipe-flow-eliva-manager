
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply transitions to document
    document.documentElement.classList.add('transition-colors', 'duration-300');
    
    setMounted(true);
    
    // Check for user preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, []);

  if (!mounted) return null;
  
  // Redirect to dashboard
  return <Navigate to="/" replace />;
};

export default Index;
