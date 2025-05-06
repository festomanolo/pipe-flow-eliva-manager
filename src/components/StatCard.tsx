
import React from 'react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <h4 className="text-2xl font-bold mt-1">{value}</h4>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.isPositive ? "text-eliva-success" : "text-eliva-danger"
                )}
              >
                {trend.isPositive ? (
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5L19 12L12 19M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 19L5 12L12 5M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs. last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-lg bg-eliva-highlight/50">
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default StatCard;
