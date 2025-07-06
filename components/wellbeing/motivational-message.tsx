'use client';

import { useEffect, useState } from 'react';

interface MotivationalMessageProps {
  message: string;
  duration?: number; // milliseconds
}

export function MotivationalMessage({ message, duration = 1500 }: MotivationalMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 300); // Start fade out 300ms before duration ends

    return () => clearTimeout(timer);
  }, [duration]);

  const motivationalEmojis = ['✨', '🌟', '💫', '⭐', '🎉', '💪', '🔥', '🚀'];
  const randomEmoji = motivationalEmojis[Math.floor(Math.random() * motivationalEmojis.length)];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-fade-in-scale">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-full shadow-2xl border-2 border-white">
          <div className="flex items-center space-x-3">
            <span className="text-2xl animate-bounce">{randomEmoji}</span>
            <span className="text-lg font-semibold">{message}</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>{randomEmoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
}