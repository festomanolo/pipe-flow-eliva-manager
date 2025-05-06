
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  reveal?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  glow = false, 
  reveal = false,
  ...props 
}: GlassCardProps) => {
  const [isVisible, setIsVisible] = useState(!reveal);

  useEffect(() => {
    if (reveal) {
      // Short delay to ensure component is mounted before animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [reveal]);

  return (
    <div
      className={cn(
        "glass-card transition-all duration-300",
        glow && "group glow-effect",
        reveal && isVisible && "animate-fade-in",
        reveal && !isVisible && "opacity-0",
        className
      )}
      {...props}
    >
      <div className="glass-card-inner">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
