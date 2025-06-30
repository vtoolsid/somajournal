'use client';

interface BreathingLoaderProps {
  message?: string;
}

export function BreathingLoader({ message = "Taking a moment to reflect..." }: BreathingLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-12">
      {/* Enhanced Breathing Circle */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full breathing-element blur-md" style={{ animationDelay: '0.2s' }}></div>
        
        {/* Main breathing circle */}
        <div className="relative w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full breathing-element flex items-center justify-center shadow-xl border border-green-200/50">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full breathing-element shadow-lg" style={{ animationDelay: '0.5s' }}>
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full breathing-element flex items-center justify-center" style={{ animationDelay: '1s' }}>
              <div className="w-8 h-8 bg-white/30 rounded-full breathing-element" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Enhanced floating particles */}
        <div className="absolute -top-3 -left-3 w-5 h-5 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full breathing-element shadow-lg" style={{ animationDelay: '0.3s' }} />
        <div className="absolute -top-2 -right-3 w-4 h-4 bg-gradient-to-br from-emerald-300 to-green-400 rounded-full breathing-element shadow-md" style={{ animationDelay: '0.8s' }} />
        <div className="absolute -bottom-3 -left-2 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full breathing-element shadow-md" style={{ animationDelay: '1.3s' }} />
        <div className="absolute -bottom-2 -right-3 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full breathing-element shadow-lg" style={{ animationDelay: '1.8s' }} />
        <div className="absolute top-1/2 -left-4 w-3 h-3 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full breathing-element shadow-sm" style={{ animationDelay: '2.1s' }} />
        <div className="absolute top-1/2 -right-4 w-3 h-3 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full breathing-element shadow-sm" style={{ animationDelay: '2.4s' }} />
      </div>
      
      {/* Enhanced Message */}
      <div className="text-center space-y-4">
        <p className="text-2xl text-slate-700 font-semibold tracking-wide">{message}</p>
        <p className="text-slate-500 text-lg font-light italic">Breathe in... breathe out...</p>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto breathing-element"></div>
      </div>
      
    </div>
  );
}