'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionSummaryTable } from '@/components/wellbeing/emotion-summary-table';
import { SymptomSummaryTable } from '@/components/wellbeing/symptom-summary-table';
import { PsychosomaticRecommendations } from '@/components/wellbeing/psychosomatic-recommendations';
import { ArrowRight, Download } from 'lucide-react';

export default function AssessmentResultsPage() {
  const router = useRouter();
  const { wellbeingAssessment } = useAppStore();

  useEffect(() => {
    window.console.log('🎆 Assessment Results Page loaded');
    window.console.log('📋 Assessment data:', wellbeingAssessment ? 'Present' : 'Missing');
    
    if (!wellbeingAssessment) {
      window.console.log('⚠️ No assessment data found, redirecting to assessment page');
      router.push('/wellbeing-assessment');
      return;
    }
    
    if (wellbeingAssessment.skipped) {
      window.console.log('⏭️ User skipped assessment - showing skipped results');
    } else {
      window.console.log('✅ User completed assessment - showing full results');
    }

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


  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="text-center space-y-4">
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