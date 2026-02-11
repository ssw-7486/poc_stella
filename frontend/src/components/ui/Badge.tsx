import { memo } from 'react';
import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: ReactNode;
}

export const Badge = memo(function Badge({ variant = 'neutral', children }: BadgeProps) {
  const variantStyles = {
    success: 'bg-green/10 text-green border-green/20',
    warning: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-700 border-red-500/20',
    info: 'bg-blue/10 text-blue border-blue/20',
    neutral: 'bg-navy/10 text-navy border-navy/20',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
});
