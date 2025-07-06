'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionSummaryTable } from '@/components/wellbeing/emotion-summary-table';
import { SymptomSummaryTable } from '@/components/wellbeing/symptom-summary-table';
import { PsychosomaticRecommendations } from '@/components/wellbeing/psychosomatic-recommendations';
import { ArrowRight, Download, RefreshCw } from 'lucide-react';

export default function AssessmentResultsPage() {
  const router = useRouter();
  const { wellbeingAssessment, resetWellbeingAssessment } = useAppStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!wellbeingAssessment) {
      router.push('/wellbeing-assessment');
      return;
    }

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [wellbeingAssessment, router]);

  if (!wellbeingAssessment) {
    return null;
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(wellbeingAssessment, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wellbeing-assessment-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRetake = () => {
    resetWellbeingAssessment();
    router.push('/wellbeing-assessment');
  };

  return (
    <div className="space-y-8">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-10 left-1/4 text-4xl animate-bounce">🎉</div>
          <div className="absolute top-20 right-1/4 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute top-16 left-1/2 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🌟</div>
          <div className="absolute top-24 left-1/3 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>💫</div>
          <div className="absolute top-12 right-1/3 text-2xl animate-bounce" style={{ animationDelay: '2s' }}>🎊</div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-3xl font-bold text-gray-800">Your Wellbeing Assessment Results</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {wellbeingAssessment.skipped 
            ? "You skipped the assessment, but you can retake it anytime."
            : "Here's a comprehensive analysis of your current emotional and physical wellbeing state."
          }
        </p>
        <div className="text-sm text-gray-500">
          Completed on {wellbeingAssessment.completedAt.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {!wellbeingAssessment.skipped && (
        <>
          {/* Summary Tables */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Emotional State Table */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">🧠</span>
                  <span>Emotional State Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmotionSummaryTable emotionScores={wellbeingAssessment.emotionScores} />
              </CardContent>
            </Card>

            {/* Physical Symptoms Table */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">🏥</span>
                  <span>Physical Symptoms Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SymptomSummaryTable 
                  physicalSymptoms={wellbeingAssessment.physicalSymptoms}
                  physicalBurden={wellbeingAssessment.physicalBurden}
                />
              </CardContent>
            </Card>
          </div>

          {/* Psychosomatic Recommendations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">💡</span>
                <span>Personalized Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PsychosomaticRecommendations 
                emotionScores={wellbeingAssessment.emotionScores}
                physicalBurden={wellbeingAssessment.physicalBurden}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={() => router.push('/dashboard')}
          className="wellness-button px-8 py-3 flex items-center space-x-2"
        >
          <span>Continue to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <div className="flex gap-2">
          {!wellbeingAssessment.skipped && (
            <Button
              onClick={handleExportData}
              variant="outline"
              className="px-6 py-3 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
          )}
          
          <Button
            onClick={handleRetake}
            variant="outline"
            className="px-6 py-3 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </Button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
        <p>
          This assessment provides insights for self-reflection and is not a substitute for professional medical advice. 
          If you're experiencing persistent symptoms, please consult with a healthcare provider.
        </p>
      </div>
    </div>
  );
}