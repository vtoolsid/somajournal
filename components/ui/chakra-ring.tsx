'use client';

import { useState } from 'react';
import { chakraData, ChakraInfo } from '@/lib/chakra-data';
import { ChakraDetail } from './chakra-detail';
import { ChakraSymbol } from './chakra-symbol';

interface ChakraRingProps {
  className?: string;
}

export const ChakraRing = ({ className = '' }: ChakraRingProps) => {
  const [selectedChakra, setSelectedChakra] = useState<ChakraInfo | null>(null);
  const [hoveredChakra, setHoveredChakra] = useState<string | null>(null);

  // Positions for each chakra starting with crown (purple) at bottom going clockwise
  // Very tight spacing going to the right side - crown to root order
  const chakraPositions = [
    { id: 'crown', distance: 210, angle: 270, size: 33 }, // Bottom - Purple
    { id: 'third-eye', distance: 214, angle: 290, size: 40 }, // Bottom-right - Indigo (smaller than crown)
    { id: 'throat', distance: 218, angle: 310, size: 38 }, // Right - Blue
    { id: 'heart', distance: 222, angle: 330, size: 40 }, // Right - Green
    { id: 'solar', distance: 226, angle: 350, size: 42 }, // Right - Yellow
    { id: 'sacral', distance: 230, angle: 10, size: 44 }, // Right-top - Orange
    { id: 'root', distance: 234, angle: 30, size: 46 }, // Top-right - Red (largest)
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
      {/* Subtle guidance text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-sm text-slate-600/70 font-light tracking-wide">
          Click any chakra to explore its wisdom
        </p>
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
          return (
            <div key={chakra.id} style={getChakraStyle(position)}>
              <ChakraSymbol
                chakraId={chakra.id}
                size={position.size}
                color={chakra.color}
                isHovered={isHovered}
                onClick={() => handleChakraClick(chakra.id)}
                onMouseEnter={() => setHoveredChakra(chakra.id)}
                onMouseLeave={() => setHoveredChakra(null)}
              />
              
              {/* Elegant tooltip on hover */}
              {isHovered && (
                <div 
                  className="absolute z-10 px-4 py-3 text-xs font-light text-white rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
                  style={{
                    left: '50%',
                    top: `-${position.size + 35}px`,
                    transform: 'translateX(-50%)',
                    backgroundColor: `${chakra.color}dd`,
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${chakra.color}40`,
                    minWidth: '140px'
                  }}
                >
                  <div className="text-center">
                    <div className="font-semibold mb-1">{chakra.name}</div>
                    <div className="text-[10px] opacity-90 mb-1">{chakra.sanskritName}</div>
                    <div className="text-[10px] opacity-80 font-medium">Mantra: {chakra.beejMantra}</div>
                    <div className="text-[9px] opacity-70 mt-1">{chakra.location}</div>
                  </div>
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