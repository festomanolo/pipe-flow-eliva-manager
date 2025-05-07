
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
        "glass-card relative overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-lg shadow-lg transition-all duration-300",
        glow && "group glow-effect hover:border-white/20 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-eliva-accent/20 via-transparent to-eliva-purple/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100 blur-xl"></div>
      )}
      <div className="glass-card-inner relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
