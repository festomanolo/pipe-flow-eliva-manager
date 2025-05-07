
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LockIcon, UserIcon } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus username input after splash screen
    if (splashComplete && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [splashComplete]);
  
  // Show splash screen initially
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashComplete(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // @ts-ignore: Electron API not in types
      const authenticated = await window.api.authenticate(username, password);
      
      if (authenticated) {
        toast({
          title: "Login successful",
          description: "Welcome to Eliva Hardware Manager!",
        });
        
        // Store auth state in localStorage
        localStorage.setItem('elivaAuth', 'true');
        
        // Navigate to dashboard
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "There was a problem connecting to the database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!splashComplete) {
    // Splash Screen
    return (
      <div className="h-screen w-full bg-gradient-to-br from-eliva-purple-dark to-eliva-card flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4"
          >
            <img src="/logo.png" alt="Eliva Hardware" className="w-24 h-24 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white">Eliva Hardware</h1>
            <p className="text-xl text-white/80 mt-2">Inventory Management System</p>
          </motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1 }}
            className="h-1 bg-gradient-to-r from-eliva-accent via-eliva-purple to-eliva-accent/30 rounded-full mb-6"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-white/60 text-sm"
          >
            Loading...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-eliva-purple-dark to-eliva-card flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard glow className="p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <img src="/logo.png" alt="Eliva Hardware" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Login to access your dashboard</p>
          </motion.div>
          
          <form onSubmit={handleLogin}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4 mb-6"
            >
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    ref={inputRef}
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-eliva-accent to-eliva-purple hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </motion.div>
          </form>
        </GlassCard>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center text-white/70 text-sm mt-6"
        >
          <p>For any complaints or software assistance,<br />please contact the developer at +255784953866</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
