'use client';

import { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  count?: number;
}

export function FloatingParticles({ count = 15 }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random starting position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (20 + Math.random() * 10) + 's';
      
      // Random size
      const size = 1 + Math.random() * 3;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // Random opacity
      particle.style.opacity = (0.1 + Math.random() * 0.3).toString();
      
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