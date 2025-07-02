'use client';

import { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  count?: number;
}

export function FloatingParticles({ count = 15 }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Randomly choose color (green or blue)
      const isGreen = Math.random() > 0.5;
      particle.style.backgroundColor = isGreen ? '#43A047' : '#1E88E5';
      
      // Random starting position (spread across the width)
      particle.style.left = Math.random() * 100 + '%';
      
      // For first few particles, start them at different heights for immediate visibility
      if (i < 5) {
        particle.style.bottom = (Math.random() * 50 + 10) + 'vh'; // Start 10-60vh from bottom
      } else {
        particle.style.bottom = '-10px'; // Start below viewport
      }
      
      // Random size (8-14px for better visibility)
      const size = 8 + Math.random() * 6;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // Random opacity (20-40% for better visibility)
      particle.style.opacity = (0.2 + Math.random() * 0.2).toString();
      
      // Add custom animation with all properties
      const animationIndex = Math.floor(Math.random() * 3) + 1;
      const animationName = `floatUp${animationIndex}`;
      const duration = (i < 5) ? (8 + Math.random() * 7) + 's' : (15 + Math.random() * 15) + 's';
      const delay = (i < 5) ? (i * 1) + 's' : Math.random() * 10 + 's';
      
      particle.style.animation = `${animationName} ${duration} linear ${delay} infinite`;
      particle.style.willChange = 'transform, opacity';
      
      container.appendChild(particle);
      particles.push(particle);
    }

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [count]);

  return <div ref={containerRef} className="floating-particles" />;
}