'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress: number; // 0-100
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ progress, currentStep, totalSteps }: ProgressBarProps) {
  const getProgressEmoji = (progress: number) => {
    if (progress === 0) return '🏃‍♀️';
    if (progress < 25) return '🌱';
    if (progress < 50) return '🌿';
    if (progress < 75) return '🌸';
    if (progress < 100) return '🌟';
    return '🎉';
  };

  const getMotivationalText = (step: number, total: number) => {
    const percentage = (step / total) * 100;
    
    if (percentage === 0) return "Let's begin your wellness journey! 🚀";
    if (percentage <= 20) return "Great start! Keep going! 💪";
    if (percentage <= 40) return "You're doing amazing! 🌟";
    if (percentage <= 60) return "Halfway there! Stay strong! 🔥";
    if (percentage <= 80) return "Almost done! You've got this! ⭐";
    if (percentage < 100) return "Final stretch! Excellence ahead! 🏆";
    return "Congratulations! Assessment complete! 🎉";
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-3 bg-gray-200 overflow-hidden rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-white drop-shadow-sm">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getProgressEmoji(progress)}</span>
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        
        <div className="text-sm text-gray-600">
          {getMotivationalText(currentStep - 1, totalSteps)}
        </div>
      </div>

      {/* Step Dots */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div
              key={stepNumber}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-500 scale-110' 
                  : isCurrent 
                  ? 'bg-blue-500 scale-125 ring-2 ring-blue-200' 
                  : 'bg-gray-300'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}