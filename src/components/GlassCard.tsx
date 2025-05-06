
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  glow = false,
  ...props 
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass-card transition-all duration-300",
        glow && "group glow-effect",
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
