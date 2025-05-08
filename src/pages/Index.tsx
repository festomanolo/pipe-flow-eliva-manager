
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

const Index = () => {
  const [redirectNow, setRedirectNow] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Delay redirect to show the animation
    const timer = setTimeout(() => {
      setRedirectNow(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (redirectNow) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-eliva-blue dark:to-black">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-eliva-accent via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Eliva Hardware
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-t-eliva-accent border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
            <div className="absolute inset-1 rounded-full border-4 border-r-eliva-purple border-t-transparent border-b-transparent border-l-transparent animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
            <div className="absolute inset-2 rounded-full border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent animate-spin-slow" style={{ animationDuration: '7s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-eliva-accent"></div>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">
            Launching dashboard...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
