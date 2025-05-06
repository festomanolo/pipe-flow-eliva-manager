
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  text: string;
  animated?: boolean;
  className?: string;
}

const StatusBadge = ({ status, text, animated = false, className }: StatusBadgeProps) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center transition-all duration-300";
  
  const statusClasses = {
    success: "bg-eliva-success/20 text-eliva-success border border-eliva-success/30 hover:bg-eliva-success/30",
    warning: "bg-eliva-warning/20 text-eliva-warning border border-eliva-warning/30 hover:bg-eliva-warning/30",
    danger: "bg-eliva-danger/20 text-eliva-danger border border-eliva-danger/30 hover:bg-eliva-danger/30",
    info: "bg-blue-500/20 text-blue-500 border border-blue-500/30 hover:bg-blue-500/30",
    neutral: "bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30"
  };
  
  return (
    <span 
      className={cn(
        baseClasses, 
        statusClasses[status], 
        animated && "animate-pulse-slow",
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full mr-1.5 transition-transform duration-300", 
        status === 'success' && "bg-eliva-success",
        status === 'warning' && "bg-eliva-warning",
        status === 'danger' && "bg-eliva-danger",
        status === 'info' && "bg-blue-500",
        status === 'neutral' && "bg-gray-400"
      )}></span>
      {text}
    </span>
  );
};

export default StatusBadge;
