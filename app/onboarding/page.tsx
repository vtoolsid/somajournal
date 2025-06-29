'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, ArrowRight, Brain, Zap } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    notifications: false,
    dailyReminders: false,
    weeklyInsights: false,
  });
  const [goals, setGoals] = useState<string[]>([]);
  
  const router = useRouter();

  const wellnessGoals = [
    { id: 'stress', label: 'Reduce stress and find calm', icon: Brain },
    { id: 'emotions', label: 'Better understand my emotions', icon: Heart },
    { id: 'energy', label: 'Increase daily energy', icon: Zap },
    { id: 'sleep', label: 'Improve sleep quality', icon: Brain },
    { id: 'relationships', label: 'Enhance relationships', icon: Heart },
    { id: 'mindfulness', label: 'Develop mindfulness practice', icon: Zap },
  ];

  const handleGoalToggle = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <div className="w-64 mx-auto bg-slate-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600">
              Step {step} of 3
            </p>
          </div>
        </div>

        <Card className="wellness-card">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="text-center space-y-8">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-800 mb-4">
                    Welcome to your wellness journey
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
                    SomaJournal helps you understand the beautiful connections between your thoughts, emotions, and wellbeing through mindful journaling.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto">
                      <Brain className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Gentle Analysis</p>
                      <p className="text-slate-600">Compassionate insights from your writing</p>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Emotion Awareness</p>
                      <p className="text-slate-600">Understand your inner landscape</p>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto">
                      <Zap className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Personal Growth</p>
                      <p className="text-slate-600">Celebrate your progress</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-slate-800 mb-4">
                    How can we support you?
                  </h2>
                  <p className="text-lg text-slate-600">
                    Choose the ways you&apos;d like to stay connected with your practice.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <Checkbox
                      checked={preferences.notifications}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, notifications: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-slate-800">Gentle Reminders</p>
                      <p className="text-sm text-slate-600">
                        Soft nudges to check in with yourself when you&apos;re ready
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <Checkbox
                      checked={preferences.dailyReminders}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, dailyReminders: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-slate-800">Daily Reflection</p>
                      <p className="text-sm text-slate-600">
                        A peaceful moment each day to connect with your thoughts
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <Checkbox
                      checked={preferences.weeklyInsights}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, weeklyInsights: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-slate-800">Weekly Insights</p>
                      <p className="text-sm text-slate-600">
                        Gentle observations about your emotional patterns and growth
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-slate-800 mb-4">
                    What brings you here?
                  </h2>
                  <p className="text-lg text-slate-600">
                    Select any intentions that resonate with you. You can always change these later.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {wellnessGoals.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = goals.includes(goal.id);
                    
                    return (
                      <div
                        key={goal.id}
                        className={`p-6 border rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
                            : 'border-slate-200 hover:border-green-200 hover:bg-slate-50'
                        }`}
                        onClick={() => handleGoalToggle(goal.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-green-600' : 'text-slate-500'}`} />
                          <span className={`font-medium ${isSelected ? 'text-green-800' : 'text-slate-700'}`}>
                            {goal.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
              {step > 1 && (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={nextStep}
                className={`wellness-button text-white ${step === 1 ? 'w-full' : 'ml-auto'}`}
              >
                {step === 3 ? 'Begin Your Journey' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}