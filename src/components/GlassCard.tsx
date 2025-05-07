
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  reveal?: boolean;
  revealDelay?: number;
}

const GlassCard = ({ 
  children, 
  className, 
  glow = false,
  reveal = false,
  revealDelay = 0,
  ...props 
}: GlassCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Add hover effect to glow cards
  useEffect(() => {
    if (!glow || !cardRef.current) return;
    
    const card = cardRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element
      
      // Calculate the position for the highlight effect (in percentage)
      const highlightX = (x / rect.width) * 100;
      const highlightY = (y / rect.height) * 100;
      
      // Update the position of the highlight effect
      card.style.setProperty('--highlight-x', `${highlightX}%`);
      card.style.setProperty('--highlight-y', `${highlightY}%`);
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [glow]);
  
  // Render with animation if reveal is true, otherwise render normally
  if (reveal) {
    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1],
          delay: revealDelay
        }}
        className={cn(
          "glass-card relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg transition-all duration-300",
          glow && "group glow-effect hover:border-white/30 hover:shadow-xl",
          className
        )}
        style={{ 
          "--highlight-x": "50%", 
          "--highlight-y": "50%" 
        } as React.CSSProperties}
        {...props as HTMLMotionProps<"div">}
      >
        {glow && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-eliva-accent/30 via-transparent to-eliva-purple/30 opacity-0 transition-opacity duration-700 group-hover:opacity-100 blur-xl"></div>
        )}
        
        {glow && (
          <div 
            className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle at var(--highlight-x) var(--highlight-y), rgba(255, 255, 255, 0.25), transparent 80%)"
            }}
          />
        )}
        
        <div className="glass-card-inner relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
  
  // Non-animated version
  return (
    <div
      ref={cardRef}
      className={cn(
        "glass-card relative overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg transition-all duration-300",
        glow && "group glow-effect hover:border-white/30 hover:shadow-xl",
        className
      )}
      style={{ 
        "--highlight-x": "50%", 
        "--highlight-y": "50%" 
      } as React.CSSProperties}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-eliva-accent/30 via-transparent to-eliva-purple/30 opacity-0 transition-opacity duration-700 group-hover:opacity-100 blur-xl"></div>
      )}
      
      {glow && (
        <div 
          className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at var(--highlight-x) var(--highlight-y), rgba(255, 255, 255, 0.25), transparent 80%)"
          }}
        />
      )}
      
      <div className="glass-card-inner relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
