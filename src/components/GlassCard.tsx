import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow }: GlassCardProps) {
  return (
    <div className={cn(
      'glass-card p-6',
      glow && 'glow-primary',
      className
    )}>
      {children}
    </div>
  );
}
