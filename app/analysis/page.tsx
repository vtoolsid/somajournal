'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { PsychosomaticInsights } from '@/components/ui/psychosomatic-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  mockJournalEntries, 
  analyzePsychosomaticConnection,
  calculateWellnessMetrics,
  getTopEmotions
} from '@/lib/mock-data';
import { 
  Brain, 
  Sparkles, 
  TrendingUp,
  BookOpen,
  ArrowRight,
  BarChart3,
  Heart
} from 'lucide-react';

export default function AnalysisPage() {
  const { user } = useAppStore();
  const router = useRouter();

  // Get the most recent journal entry for analysis
  const { journalEntries } = useAppStore();
  const recentEntry = journalEntries[0] || mockJournalEntries[0];
  const emotions = Object.entries(recentEntry?.emotions || {}).map(([emotion, confidence]) => ({
    emotion,
    confidence: confidence as number
  }));

  // Get comprehensive psychosomatic analysis
  const entriesForAnalysis = journalEntries.length > 0 ? journalEntries : mockJournalEntries;
  const psychosomaticData = analyzePsychosomaticConnection(entriesForAnalysis);
  const wellnessMetrics = calculateWellnessMetrics(entriesForAnalysis);
  const topEmotions = getTopEmotions(entriesForAnalysis, 6);

  return (
    <AppLayout>
      <div className="min-h-screen wellness-container">
        <FloatingParticles count={12} />
        
        <div className="relative z-10 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section with Enhanced Glassmorphic Design */}
            <div className="relative text-center mb-8 lg:mb-12 fade-enter">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/15 via-emerald-400/8 to-green-500/15 rounded-3xl blur-2xl"></div>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4 breathing-element">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-semibold text-slate-800 mb-2">
                  Comprehensive Analysis
                </h1>
                <p className="text-xl text-slate-600 mb-4">
                  Industry-standard insights into your mental and physical wellness patterns
                </p>
                
                {/* Analysis Status Cards - Enhanced Glassmorphic */}
                <div className="relative flex flex-wrap items-center justify-center gap-4 mt-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-300/10 via-emerald-300/5 to-green-400/10 rounded-2xl blur-lg"></div>
                  <div className="relative bg-white/70 backdrop-blur-md border border-green-200/50 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {entriesForAnalysis.length} Entries Analyzed
                      </span>
                    </div>
                  </div>
                  <div className="relative bg-white/70 backdrop-blur-md border border-emerald-200/50 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {topEmotions.length} Emotion Patterns
                      </span>
                    </div>
                  </div>
                  <div className="relative bg-white/70 backdrop-blur-md border border-teal-200/50 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {psychosomaticData.detectedSymptoms.length} Physical Connections
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Main Analysis Section - Enhanced Glassmorphic */}
            {recentEntry ? (
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-green-300/10 via-emerald-300/5 to-green-400/10 rounded-3xl blur-xl"></div>
                <PsychosomaticInsights 
                  emotions={emotions}
                  psychosomaticData={recentEntry.psychosomatic || {
                    psychosomatic_analysis: recentEntry.psychosomatic_analysis,
                    personalized_insights: recentEntry.personalized_insights,
                    wellness_recommendations: recentEntry.wellness_recommendations
                  }}
                />
              </div>
            ) : (
              /* No Data State - Enhanced Glassmorphic */
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-300/15 via-emerald-300/8 to-green-400/15 rounded-3xl blur-xl"></div>
                <Card className="relative wellness-card bg-white/60 backdrop-blur-md border-2 border-green-200/50 hover:border-green-300/60 transition-all duration-300 rounded-2xl shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 breathing-element">
                      <BookOpen className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                      Start Your Analysis Journey
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                      Begin by creating your first journal entry to unlock comprehensive 
                      psychosomatic analysis and wellness insights
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => router.push('/journal')}
                    className="wellness-button px-8 py-4 text-lg font-medium transform transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create First Entry
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
                </Card>
              </div>
            )}

            {/* Additional Analysis Tools - Enhanced Glassmorphic */}
            <div className="relative mt-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-300/10 via-gray-300/5 to-slate-400/10 rounded-2xl blur-lg"></div>
              <div className="relative bg-white/50 backdrop-blur-md border border-gray-200/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <p className="text-sm text-slate-500 mb-2">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Powered by advanced BERT emotion analysis and evidence-based psychosomatic research
                </p>
                <p className="text-xs text-slate-400">
                  Analysis updated: {new Date().toLocaleDateString()} • 
                  <span className="ml-1">Professional-grade wellness insights</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}