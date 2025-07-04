'use client';

import { useEffect, useRef, useState } from 'react';

// Static gradient colors following industry standards (2-3 colors max)
const staticGradientColors = {
  colorA: '#22c55e', // Primary green
  colorB: '#10b981', // Mid transition
  colorC: '#0891b2', // Teal accent
};

interface WellnessGradientBackgroundProps {
  intensity?: 'subtle' | 'moderate' | 'vibrant';
}

export function WellnessGradientBackground({ 
  intensity = 'vibrant' 
}: WellnessGradientBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Adjust opacity based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case 'subtle': return 'opacity-60';
      case 'moderate': return 'opacity-80';
      case 'vibrant': return 'opacity-95';
      default: return 'opacity-80';
    }
  };

  return (
    <div
      ref={backgroundRef}
      className={`wellness-gradient-bg ${getOpacity()}`}
      style={{
        '--gradient-color-a': staticGradientColors.colorA,
        '--gradient-color-b': staticGradientColors.colorB,
        '--gradient-color-c': staticGradientColors.colorC,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}