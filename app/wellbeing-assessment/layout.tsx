'use client';

import { FloatingParticles } from '@/components/ui/floating-particles';

interface WellbeingAssessmentLayoutProps {
  children: React.ReactNode;
}

export default function WellbeingAssessmentLayout({ children }: WellbeingAssessmentLayoutProps) {
  return (
    <div className="min-h-screen wellness-container relative">
      <FloatingParticles count={8} />
      
      {/* Scrollable Modal Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50/90 via-emerald-50/90 to-teal-50/90 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="flex justify-center min-h-screen p-4 py-8">
          <div className="relative z-10 w-full max-w-4xl my-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}