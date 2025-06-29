'use client';

import { useState } from 'react';
import { chakraData, ChakraInfo } from '@/lib/chakra-data';
import { ChakraDetail } from './chakra-detail';

interface ChakraRingProps {
  className?: string;
}

export const ChakraRing = ({ className = '' }: ChakraRingProps) => {
  const [selectedChakra, setSelectedChakra] = useState<ChakraInfo | null>(null);
  const [hoveredChakra, setHoveredChakra] = useState<string | null>(null);

  // Positions for each chakra starting with crown (purple) at bottom going clockwise
  // Very tight spacing going to the right side - crown to root order
  const chakraPositions = [
    { id: 'crown', distance: 210, angle: 270, size: 28 }, // Bottom - Purple
    { id: 'third-eye', distance: 212, angle: 290, size: 30 }, // Bottom-right - Indigo
    { id: 'throat', distance: 214, angle: 310, size: 32 }, // Right - Blue
    { id: 'heart', distance: 216, angle: 330, size: 34 }, // Right - Green
    { id: 'solar', distance: 218, angle: 350, size: 36 }, // Right - Yellow
    { id: 'sacral', distance: 220, angle: 10, size: 38 }, // Right-top - Orange
    { id: 'root', distance: 222, angle: 30, size: 40 }, // Top-right - Red
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
          
          return (
            <div key={chakra.id}>
              <button
                style={getChakraStyle(position)}
                className={`
                  absolute rounded-full border-2 border-white/30 cursor-pointer
                  transition-all duration-300 ease-out
                  hover:scale-110 hover:border-white/60 hover:shadow-lg
                  ${isHovered ? 'scale-110 border-white/60 shadow-lg' : ''}
                  focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2
                `}
                style={{
                  ...getChakraStyle(position),
                  backgroundColor: chakra.color,
                  boxShadow: isHovered 
                    ? `0 0 20px ${chakra.color}40, 0 4px 12px rgba(0,0,0,0.15)` 
                    : `0 0 8px ${chakra.color}20`
                }}
                onClick={() => handleChakraClick(chakra.id)}
                onMouseEnter={() => setHoveredChakra(chakra.id)}
                onMouseLeave={() => setHoveredChakra(null)}
                aria-label={`Learn about ${chakra.name}`}
              />
              
              {/* Tooltip on hover */}
              {isHovered && (
                <div 
                  className="absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
                  style={{
                    left: `calc(50% + ${Math.cos((position.angle * Math.PI) / 180) * position.distance}px)`,
                    top: `calc(50% + ${Math.sin((position.angle * Math.PI) / 180) * position.distance - 40}px)`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {chakra.name}
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
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