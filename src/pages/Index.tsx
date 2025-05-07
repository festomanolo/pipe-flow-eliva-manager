
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Apply transitions to document
    document.documentElement.classList.add('transition-colors', 'duration-300');
    
    // Check for user preference and authentication
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const auth = localStorage.getItem('elivaAuth') === 'true';
    
    if (storedTheme) {
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    setIsAuthenticated(auth);
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  // Redirect to dashboard if authenticated, otherwise to login
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
};

export default Index;
