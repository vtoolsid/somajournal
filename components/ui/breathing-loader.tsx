'use client';

interface BreathingLoaderProps {
  message?: string;
}

export function BreathingLoader({ message = "Taking a moment to reflect..." }: BreathingLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-12">
      {/* Breathing Circle */}
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full breathing-element flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full breathing-element" style={{ animationDelay: '0.5s' }}>
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full breathing-element" style={{ animationDelay: '1s' }} />
          </div>
        </div>
        
        {/* Floating dots */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-300 rounded-full breathing-element" style={{ animationDelay: '0.2s' }} />
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-300 rounded-full breathing-element" style={{ animationDelay: '0.7s' }} />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full breathing-element" style={{ animationDelay: '1.2s' }} />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full breathing-element" style={{ animationDelay: '1.7s' }} />
      </div>
      
      {/* Message */}
      <div className="text-center space-y-3">
        <p className="text-xl text-slate-700 font-medium">{message}</p>
        <p className="text-slate-500">Breathe in... breathe out...</p>
      </div>
      
      {/* Breathing guide dots */}
      <div className="flex space-x-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-green-300 rounded-full breathing-element"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
}