import { useEffect, useState } from 'react';

export function useScrollPosition(throttleMs: number = 60) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let lastTime = 0;

    const handleScroll = () => {
      const now = Date.now();
      
      if (now - lastTime >= throttleMs) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        
        rafId = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          lastTime = now;
        });
      }
    };

    // Set initial position
    setScrollY(window.scrollY);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [throttleMs]);

  return scrollY;
}

export function useRange(
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const mappedValue = ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  const largest = Math.max(outMin, outMax);
  const smallest = Math.min(outMin, outMax);
  return Math.min(Math.max(mappedValue, smallest), largest);
}