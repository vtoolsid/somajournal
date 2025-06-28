'use client';

interface MandalaProgressProps {
  value: number; // 0-100
  size?: number;
  className?: string;
}

export function MandalaProgress({ value, size = 120, className }: MandalaProgressProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={`mandala-progress ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="karma-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(99 102 241)" />
            <stop offset="50%" stopColor="rgb(147 51 234)" />
            <stop offset="100%" stopColor="rgb(34 197 94)" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          className="progress-ring progress-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={strokeDasharray}
        />
        
        {/* Progress circle */}
        <circle
          className="progress-ring progress-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
        
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-slate-800"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        >
          {Math.round(value)}%
        </text>
      </svg>
    </div>
  );
}