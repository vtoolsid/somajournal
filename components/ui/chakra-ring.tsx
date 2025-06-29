'use client';

import { useState } from 'react';
import { chakraData, ChakraInfo } from '@/lib/chakra-data';
import { ChakraDetail } from './chakra-detail';
import { Crown, Eye, MessageCircle, Heart, Sun, Waves, Mountain } from 'lucide-react';

interface ChakraRingProps {
  className?: string;
}

export const ChakraRing = ({ className = '' }: ChakraRingProps) => {
  const [selectedChakra, setSelectedChakra] = useState<ChakraInfo | null>(null);
  const [hoveredChakra, setHoveredChakra] = useState<string | null>(null);

  // Positions for each chakra starting with crown (purple) at bottom going clockwise
  // Very tight spacing going to the right side - crown to root order
  const chakraPositions = [
    { id: 'crown', distance: 210, angle: 270, size: 28, icon: Crown }, // Bottom - Purple
    { id: 'third-eye', distance: 212, angle: 290, size: 30, icon: Eye }, // Bottom-right - Indigo
    { id: 'throat', distance: 214, angle: 310, size: 32, icon: MessageCircle }, // Right - Blue
    { id: 'heart', distance: 216, angle: 330, size: 34, icon: Heart }, // Right - Green
    { id: 'solar', distance: 218, angle: 350, size: 36, icon: Sun }, // Right - Yellow
    { id: 'sacral', distance: 220, angle: 10, size: 38, icon: Waves }, // Right-top - Orange
    { id: 'root', distance: 222, angle: 30, size: 40, icon: Mountain }, // Top-right - Red
  ];

  const handleChakraClick = (chakraId: string) => {
    const chakra = chakraData.find(c => c.id === chakraId);
    if (chakra) {
      setSelectedChakra(chakra);
    }
  };

  const getChakraStyle = (position: typeof chakraPositions[0]) => {
    const radiansAngle = (position.angle * Math.PI) / 180;
    const x = Math.cos(radiansAngle) * position.distance;
    const y = Math.sin(radiansAngle) * position.distance;
    
    return {
      position: 'absolute' as const,
      left: `calc(50% + ${x}px - ${position.size / 2}px)`,
      top: `calc(50% + ${y}px - ${position.size / 2}px)`,
      width: `${position.size}px`,
      height: `${position.size}px`,
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Instructional hint */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
          <p className="text-sm text-slate-700 font-medium flex items-center">
            <span className="mr-2">✨</span>
            Explore chakras to learn about your energy centers
          </p>
        </div>
      </div>
      
      {/* Container with proper centering */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Central gradient orb - restored to original structure */}
        <div className="relative">
          <div 
            className="w-96 h-96 rounded-full opacity-80"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #22c55e 0%, #10b981 25%, #14b8a6 50%, #0ea5e9 75%, #059669 100%)'
            }}
          />
          {/* Overlay for softer effect */}
          <div 
            className="absolute inset-0 w-96 h-96 rounded-full opacity-60"
            style={{
              background: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3) 0%, transparent 50%)'
            }}
          />
        </div>
        
        {/* Chakras positioned around the orb */}
        {chakraPositions.map((position) => {
          const chakra = chakraData.find(c => c.id === position.id);
          if (!chakra) return null;
          
          const isHovered = hoveredChakra === chakra.id;
          const IconComponent = position.icon;
          
          return (
            <div key={chakra.id}>
              <button
                className={`
                  absolute rounded-full border-2 border-white/30 cursor-pointer
                  transition-all duration-300 ease-out flex items-center justify-center
                  hover:scale-110 hover:border-white/60 hover:shadow-lg
                  ${isHovered ? 'scale-110 border-white/60 shadow-lg animate-pulse' : 'animate-pulse'}
                  focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2
                `}
                style={{
                  ...getChakraStyle(position),
                  backgroundColor: chakra.color,
                  boxShadow: isHovered 
                    ? `0 0 20px ${chakra.color}40, 0 4px 12px rgba(0,0,0,0.15)` 
                    : `0 0 8px ${chakra.color}20`,
                  animationDuration: '2s',
                  animationDelay: `${chakraPositions.indexOf(position) * 0.3}s`
                }}
                onClick={() => handleChakraClick(chakra.id)}
                onMouseEnter={() => setHoveredChakra(chakra.id)}
                onMouseLeave={() => setHoveredChakra(null)}
                aria-label={`Learn about ${chakra.name}`}
              >
                <IconComponent 
                  className={`text-white transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}
                  size={Math.max(12, position.size * 0.4)}
                  strokeWidth={2.5}
                />
              </button>
              
              {/* Enhanced tooltip on hover */}
              {isHovered && (
                <div 
                  className="absolute z-10 px-3 py-2 text-xs font-medium text-white rounded-lg shadow-xl whitespace-nowrap pointer-events-none chakra-tooltip"
                  style={{
                    left: `calc(50% + ${Math.cos((position.angle * Math.PI) / 180) * position.distance}px)`,
                    top: `calc(50% + ${Math.sin((position.angle * Math.PI) / 180) * position.distance - 45}px)`,
                    transform: 'translateX(-50%)',
                    backgroundColor: chakra.color,
                    boxShadow: `0 4px 12px ${chakra.color}40`
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <IconComponent size={12} strokeWidth={2.5} />
                    <span>{chakra.name}</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-1">Click to explore</div>
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                    style={{ borderTopColor: chakra.color }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Chakra detail modal */}
      {selectedChakra && (
        <ChakraDetail
          chakra={selectedChakra}
          isOpen={!!selectedChakra}
          onClose={() => setSelectedChakra(null)}
        />
      )}
    </div>
  );
};