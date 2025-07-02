'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SomaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

export function SomaLogo({ size = 'md', className, priority = false }: SomaLogoProps) {
  return (
    <div className={cn("flex items-center justify-center", sizeClasses[size], className)}>
      <Image
        src="/images/chakras/somajournalicon_transparent_512x512.png"
        alt="SomaJournal - Mind-Body Wellness Journaling"
        width={size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 80}
        height={size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 80}
        priority={priority}
        className="object-contain w-full h-full"
      />
    </div>
  );
}