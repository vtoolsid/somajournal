'use client';

import Image from 'next/image';

interface ChakraSymbolProps {
  chakraId: string;
  size: number;
  color: string;
  isHovered?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Image file mapping for each chakra
const chakraImages: Record<string, string> = {
  crown: '/images/chakras/crown.png',
  'third-eye': '/images/chakras/third-eye.png',
  throat: '/images/chakras/throat.png',
  heart: '/images/chakras/heart.png',
  solar: '/images/chakras/solar.png',
  sacral: '/images/chakras/sacral.png',
  root: '/images/chakras/root.png'
};

export const ChakraSymbol = ({
  chakraId,
  size,
  color,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave
}: ChakraSymbolProps) => {
  const imagePath = chakraImages[chakraId];

  return (
    <div
      className="relative cursor-pointer transition-all duration-500 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Outer glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          transform: 'scale(1.5)',
          opacity: isHovered ? 0.6 : 0
        }}
      />
      
      {/* Chakra image */}
      <div className="relative w-full h-full">
        <Image
          src={imagePath}
          alt={`${chakraId} chakra symbol`}
          width={size}
          height={size}
          className="transition-all duration-500"
          style={{
            filter: `saturate(${isHovered ? 1.2 : 1}) brightness(${isHovered ? 1.1 : 1})`,
            opacity: isHovered ? 1 : 0.9
          }}
        />
      </div>
    </div>
  );
};

