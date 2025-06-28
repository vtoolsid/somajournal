'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KarmicAuraProps {
  children: ReactNode;
  karma: number; // -1 to 1
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
  style?: React.CSSProperties;
}

export function KarmicAura({ 
  children, 
  karma, 
  intensity = 'medium', 
  className,
  style 
}: KarmicAuraProps) {
  const getAuraClass = () => {
    if (karma > 0.3) return 'positive';
    if (karma < -0.3) return 'negative';
    return 'neutral';
  };

  const getIntensityClass = () => {
    switch (intensity) {
      case 'subtle': return 'opacity-40';
      case 'strong': return 'opacity-80';
      default: return 'opacity-60';
    }
  };

  return (
    <div 
      className={cn(
        'karmic-aura',
        getAuraClass(),
        getIntensityClass(),
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}