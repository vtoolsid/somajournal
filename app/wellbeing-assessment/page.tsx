'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/wellbeing/progress-bar';
import { SkipButton } from '@/components/wellbeing/skip-button';
import { DEQQuestion } from '@/components/wellbeing/deq-question';
import { SSSTable } from '@/components/wellbeing/sss-table';
import { calculateDEQScores } from '@/lib/wellbeing/deq-scoring';
import { calculateSSSScores } from '@/lib/wellbeing/sss-scoring';
import { WellbeingAssessment } from '@/lib/store';
import { Sparkles, Heart, ChevronLeft, ChevronRight, Brain, Target, Zap, ArrowRight } from 'lucide-react';

interface AssessmentAnswers {
  q1_feeling?: 1 | 2 | 3 | 4 | 5;
  q2_stress_response?: 1 | 2 | 3 | 4 | 5;
  q3_physical_sensations?: number[];
  q4_ease?: 1 | 2 | 3 | 4 | 5;
  q5_desires?: 1 | 2 | 3 | 4 | 5;
  physicalSymptoms?: {
    trouble_sleeping: 1 | 2 | 3 | 4 | 5;
    low_energy: 1 | 2 | 3 | 4 | 5;
    headaches: 1 | 2 | 3 | 4 | 5;
    chest_pain_breath: 1 | 2 | 3 | 4 | 5;
    digestive_problems: 1 | 2 | 3 | 4 | 5;
  };
}

export default function WellbeingAssessmentPage() {
  const router = useRouter();
  const { setWellbeingAssessment } = useAppStore();
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = 6;
  const progress = (currentQuestion - 1) / totalQuestions * 100;

  const handleAnswer = (questionKey: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value
    }));
    // Answer selection only - no auto-advance
    // User must click "Next" button to proceed (industry standard)
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions && canProceed()) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleBeginAssessment = () => {
    setShowWelcome(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate DEQ scores
      const emotionScores = calculateDEQScores({
        q1_feeling: answers.q1_feeling!,
        q2_stress_response: answers.q2_stress_response!,
        q3_physical_sensations: answers.q3_physical_sensations!,
        q4_ease: answers.q4_ease!,
        q5_desires: answers.q5_desires!,
      });

      // Calculate SSS-8 scores
      const physicalBurden = calculateSSSScores(answers.physicalSymptoms!);

      // Create assessment object
      const assessment: WellbeingAssessment = {
        emotionalResponses: {
          q1_feeling: answers.q1_feeling!,
          q2_stress_response: answers.q2_stress_response!,
          q3_physical_sensations: answers.q3_physical_sensations!,
          q4_ease: answers.q4_ease!,
          q5_desires: answers.q5_desires!,
        },
        physicalSymptoms: answers.physicalSymptoms!,
        emotionScores,
        physicalBurden,
        completedAt: new Date(),
        skipped: false,
        version: '1.0'
      };

      // Save to store
      setWellbeingAssessment(assessment);

      // Navigate to results
      router.push('/wellbeing-assessment/results');
    } catch (error) {
      console.error('Assessment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentQuestion) {
      case 1: return answers.q1_feeling !== undefined;
      case 2: return answers.q2_stress_response !== undefined;
      case 3: return answers.q3_physical_sensations !== undefined;
      case 4: return answers.q4_ease !== undefined;
      case 5: return answers.q5_desires !== undefined;
      case 6: return answers.physicalSymptoms !== undefined;
      default: return false;
    }
  };

  const isComplete = currentQuestion > totalQuestions;

  // Show welcome screen first
  if (showWelcome) {
    return (
      <div className="space-y-8">
        {/* Glassmorphic Welcome Hero */}
        <div className="relative overflow-hidden">
          {/* Main Welcome Card */}
          <div className="glass-card p-12 text-center relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
            {/* Floating Elements Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-4 left-8 w-3 h-3 bg-green-400/20 rounded-full animate-pulse"></div>
              <div className="absolute top-16 right-12 w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-8 left-16 w-4 h-4 bg-teal-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-16 right-8 w-3 h-3 bg-cyan-400/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-8">
              {/* Icon & Title */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent leading-tight">
                    Welcome to Your Initial
                    <br />
                    <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Mind-Body Scan
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Discover the hidden connections between your emotions and physical well-being through our scientifically-backed assessment.
                  </p>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="flex items-start space-x-4 text-left">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Map Your Emotional Landscape</h3>
                    <p className="text-gray-600 text-sm">Understand your current emotional patterns and triggers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 text-left">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Identify Physical Patterns</h3>
                    <p className="text-gray-600 text-sm">Discover how emotions manifest in your body</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 text-left">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Personalized Insights</h3>
                    <p className="text-gray-600 text-sm">Receive tailored recommendations for your wellness journey</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 text-left">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Create Your Baseline</h3>
                    <p className="text-gray-600 text-sm">Establish your starting point for tracking progress</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-4 flex flex-col items-center">
                <p className="text-gray-500 text-sm">
                  ⏱️ Takes just 3-4 minutes • 📊 Scientifically validated • 🔒 Completely private
                </p>
                
                <Button
                  onClick={handleBeginAssessment}
                  className="wellness-button text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center space-x-3"
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Skip Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Wellbeing Assessment</h1>
            <p className="text-sm text-gray-600">Help us understand your current state</p>
          </div>
        </div>
        <SkipButton />
      </div>

      {/* Progress Bar */}
      <ProgressBar progress={progress} currentStep={currentQuestion} totalSteps={totalQuestions} />

      {/* Question Content */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Question {Math.min(currentQuestion, totalQuestions)} of {totalQuestions}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion === 1 && (
            <DEQQuestion
              questionNumber={1}
              question="Right now, which of these best describes how you've been feeling?"
              options={[
                { value: 1, label: "Mostly happy and content", emoji: "😊" },
                { value: 2, label: "Neutral, neither good nor bad", emoji: "😐" },
                { value: 3, label: "Worried or anxious about things", emoji: "😟" },
                { value: 4, label: "Sad or down", emoji: "😢" },
                { value: 5, label: "Frustrated or irritated", emoji: "😤" }
              ]}
              onAnswer={(value) => handleAnswer('q1_feeling', value)}
              selectedValue={answers.q1_feeling}
            />
          )}

          {currentQuestion === 2 && (
            <DEQQuestion
              questionNumber={2}
              question="When something stressful or challenging happens, you typically:"
              options={[
                { value: 1, label: "Get fired up and want to fight back", emoji: "💪" },
                { value: 2, label: "Feel scared and want to avoid it", emoji: "😨" },
                { value: 3, label: "Get motivated and want to tackle it", emoji: "🎯" },
                { value: 4, label: "Feel overwhelmed and anxious", emoji: "😰" },
                { value: 5, label: "Feel defeated or hopeless", emoji: "😞" }
              ]}
              onAnswer={(value) => handleAnswer('q2_stress_response', value)}
              selectedValue={answers.q2_stress_response}
            />
          )}

          {currentQuestion === 3 && (
            <DEQQuestion
              questionNumber={3}
              question="Which physical sensations have you noticed recently? (Select all that apply)"
              options={[
                { value: 1, label: "Muscle tension or tightness", emoji: "💤" },
                { value: 2, label: "Nausea or stomach discomfort", emoji: "🤢" },
                { value: 3, label: "Racing heart or feeling on edge", emoji: "❤️" },
                { value: 4, label: "Feeling calm and relaxed", emoji: "😌" },
                { value: 5, label: "High energy and restlessness", emoji: "⚡" },
                { value: 6, label: "Fatigue or low energy", emoji: "😴" }
              ]}
              onAnswer={(value) => handleAnswer('q3_physical_sensations', value)}
              selectedValue={answers.q3_physical_sensations}
              multiple={true}
            />
          )}

          {currentQuestion === 4 && (
            <DEQQuestion
              questionNumber={4}
              question="How at ease do you feel in your daily life right now?"
              options={[
                { value: 1, label: "Very relaxed and at peace", emoji: "🧘‍♀️" },
                { value: 2, label: "Generally comfortable", emoji: "🙂" },
                { value: 3, label: "Somewhat tense or unsettled", emoji: "😐" },
                { value: 4, label: "Often stressed or on edge", emoji: "😣" },
                { value: 5, label: "Constantly anxious or uncomfortable", emoji: "😫" }
              ]}
              onAnswer={(value) => handleAnswer('q4_ease', value)}
              selectedValue={answers.q4_ease}
            />
          )}

          {currentQuestion === 5 && (
            <DEQQuestion
              questionNumber={5}
              question="What best describes what you're feeling drawn to or wanting right now?"
              options={[
                { value: 1, label: "Strongly motivated to pursue specific goals", emoji: "🎯" },
                { value: 2, label: "Content with what I have", emoji: "😊" },
                { value: 3, label: "Not really wanting much of anything", emoji: "😞" },
                { value: 4, label: "Wanting to avoid certain things/people", emoji: "🤮" },
                { value: 5, label: "Wanting to confront or change situations", emoji: "😡" }
              ]}
              onAnswer={(value) => handleAnswer('q5_desires', value)}
              selectedValue={answers.q5_desires}
            />
          )}

          {currentQuestion === 6 && (
            <SSSTable
              onAnswer={(symptoms) => handleAnswer('physicalSymptoms', symptoms)}
              selectedSymptoms={answers.physicalSymptoms}
            />
          )}

          {isComplete && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-800">Assessment Complete!</h3>
              <p className="text-gray-600">Thank you for sharing your experiences with us.</p>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="wellness-button px-8 py-3"
              >
                {isSubmitting ? 'Analyzing...' : 'View My Results'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {!isComplete && (
        <div className="flex justify-between items-center">
          {/* Previous Button */}
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            variant="outline"
            className="px-6 py-2 flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="wellness-button px-6 py-2 flex items-center space-x-2"
          >
            <span>{currentQuestion === totalQuestions ? 'Complete Assessment' : 'Next Question'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}