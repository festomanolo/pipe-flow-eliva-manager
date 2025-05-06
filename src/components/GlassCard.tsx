
import React from 'react';
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
  return (
    <div
      className={cn(
        "glass-card transition-all duration-300",
        glow && "group glow-effect",
        reveal && "animate-fade-in",
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
