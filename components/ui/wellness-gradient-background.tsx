'use client';

import { useEffect, useRef, useState } from 'react';

interface ColorScheme {
  name: string;
  colors: [string, string, string];
}

const colorSchemes: ColorScheme[] = [
  {
    name: 'wellness-primary',
    colors: ['#22c55e', '#10b981', '#059669'], // Primary green tones
  },
  {
    name: 'wellness-teal',
    colors: ['#10b981', '#06b6d4', '#0891b2'], // Green to teal blend
  },
  {
    name: 'wellness-emerald',
    colors: ['#059669', '#22c55e', '#10b981'], // Emerald variations
  },
];

interface WellnessGradientBackgroundProps {
  cycleDuration?: number; // Duration in seconds for each color scheme
  intensity?: 'subtle' | 'moderate' | 'vibrant';
}

export function WellnessGradientBackground({ 
  cycleDuration = 12, 
  intensity = 'vibrant' 
}: WellnessGradientBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (backgroundRef.current) {
      observer.observe(backgroundRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!backgroundRef.current || !isVisible || prefersReducedMotion) return;

    let currentSchemeIndex = 0;
    
    const updateGradient = () => {
      if (!backgroundRef.current) return;
      
      const scheme = colorSchemes[currentSchemeIndex];
      const [colorA, colorB, colorC] = scheme.colors;
      
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        if (!backgroundRef.current) return;
        backgroundRef.current.style.setProperty('--gradient-color-a', colorA);
        backgroundRef.current.style.setProperty('--gradient-color-b', colorB);
        backgroundRef.current.style.setProperty('--gradient-color-c', colorC);
      });
      
      currentSchemeIndex = (currentSchemeIndex + 1) % colorSchemes.length;
    };

    // Set initial colors
    updateGradient();

    // Cycle through color schemes only if motion is allowed and component is visible
    const interval = setInterval(updateGradient, cycleDuration * 1000);

    return () => clearInterval(interval);
  }, [cycleDuration, isVisible, prefersReducedMotion]);

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
        '--gradient-color-a': '#22c55e',
        '--gradient-color-b': '#10b981',
        '--gradient-color-c': '#059669',
        willChange: prefersReducedMotion ? 'auto' : 'background-color',
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}