'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { KarmicAura } from '@/components/ui/karmic-aura';
import { BreathingLoader } from '@/components/ui/breathing-loader';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { useAppStore } from '@/lib/store';
import { mockJournalEntries, analyzeJournalEntry } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Heart,
  Sparkles,
  Calendar,
  Feather
} from 'lucide-react';

export default function JournalPage() {
  const { currentEntry, updateCurrentEntry, addJournalEntry, user } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [showCeremony, setShowCeremony] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEntry.trim()) return;

    setIsAnalyzing(true);
    setShowCeremony(true);

    setTimeout(() => {
      const analysisResult = analyzeJournalEntry(currentEntry);
      setAnalysis(analysisResult);
      
      addJournalEntry({
        content: currentEntry,
        userId: user?.id || '',
        ...analysisResult,
      });
      
      setIsAnalyzing(false);
      setShowCeremony(false);
    }, 3000);
  };

  const getKarmaColor = (value: number) => {
    if (value > 0.3) return 'karma-positive';
    if (value < -0.3) return 'karma-negative';
    return 'karma-neutral';
  };

  if (showCeremony) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center wellness-container">
          <FloatingParticles count={20} />
          <div className="relative z-10">
            <BreathingLoader message="Your words are being analyzed with care..." />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen wellness-container">
        <FloatingParticles count={8} />
        
        <div className="relative z-10 p-8">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-6 fade-enter">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6 breathing-element">
                <Feather className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h1 className="text-5xl font-semibold text-slate-800">Your Journal</h1>
                <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Let your thoughts flow like a gentle stream, carrying wisdom from your heart
                </p>
              </div>
            </div>

            {/* Writing Space */}
            <KarmicAura karma={currentEntry.length > 0 ? 0.5 : 0} intensity="medium" className="fade-enter">
              <Card className="wellness-card">
                <CardContent className="p-12">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative">
                      <Textarea
                        placeholder="In this space, let your thoughts flow freely... There are no judgments here, only understanding for your journey."
                        value={currentEntry}
                        onChange={(e) => updateCurrentEntry(e.target.value)}
                        className="wellness-input min-h-[400px] text-lg leading-relaxed resize-none border-0 focus:ring-0 bg-transparent text-slate-700 placeholder:text-slate-400"
                      />
                      
                      {/* Live karma indicator */}
                      {currentEntry.length > 50 && (
                        <div className="absolute top-4 right-4">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 breathing-element" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-slate-500">
                          {currentEntry.length} characters
                        </p>
                        {currentEntry.length > 0 && (
                          <div className="flex space-x-1">
                            {[...Array(Math.min(5, Math.floor(currentEntry.length / 100)))].map((_, i) => (
                              <div key={i} className="w-2 h-2 rounded-full bg-indigo-300 breathing-element" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={!currentEntry.trim() || isAnalyzing}
                        className="wellness-button text-lg px-8 py-4"
                      >
                        {isAnalyzing ? (
                          <>
                            <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5 mr-3" />
                            Analyze & Save
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Analysis Results */}
                  {analysis && (
                    <div className="mt-12 fade-enter">
                      <KarmicAura karma={analysis.karmicValue} intensity="strong">
                        <div className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100">
                          <div className="text-center space-y-6">
                            <div className="flex items-center justify-center space-x-3">
                              <Sparkles className="w-6 h-6 text-indigo-600 breathing-element" />
                              <h3 className="text-2xl font-semibold text-slate-800">
                                Reflection Insights
                              </h3>
                              <Sparkles className="w-6 h-6 text-indigo-600 breathing-element" />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                              <div className="text-center space-y-4">
                                <p className="text-sm text-slate-600 uppercase tracking-wide">Karmic Resonance</p>
                                <div className="relative">
                                  <div className={`text-4xl font-bold ${getKarmaColor(analysis.karmicValue)} breathing-element`}>
                                    {(analysis.karmicValue * 100).toFixed(0)}%
                                  </div>
                                  <div className="mt-4 w-full bg-white/50 rounded-full h-3">
                                    <div 
                                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-2000 energy-pulse"
                                      style={{ width: `${Math.max(10, (analysis.karmicValue + 1) * 50)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <p className="text-sm text-slate-600 uppercase tracking-wide">Emotional Essence</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {Object.entries(analysis.emotions).map(([emotion, intensity]) => (
                                    <Badge 
                                      key={emotion} 
                                      variant="secondary" 
                                      className="bg-white/70 text-slate-700 px-3 py-1 rounded-full breathing-element"
                                    >
                                      {emotion}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-6 border-t border-white/30">
                              <p className="text-slate-600 italic">
                                "Your words carry the wisdom of your journey. Honor this moment of self-reflection."
                              </p>
                            </div>
                          </div>
                        </div>
                      </KarmicAura>
                    </div>
                  )}
                </CardContent>
              </Card>
            </KarmicAura>

            {/* Recent Entries */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-semibold text-slate-800 mb-2">Recent Reflections</h3>
                <p className="text-slate-600">Your journey of words and wisdom</p>
              </div>
              
              <div className="space-y-6">
                {mockJournalEntries.slice(0, 3).map((entry, index) => (
                  <KarmicAura key={entry.id} karma={entry.karmicValue} className="fade-enter" style={{ animationDelay: `${index * 0.2}s` }}>
                    <Card className="wellness-card">
                      <CardContent className="p-8">
                        <div className="flex items-start space-x-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0 breathing-element">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500 bg-white/50 px-3 py-1 rounded-full">
                                {entry.createdAt.toLocaleDateString()}
                              </span>
                              <span className={`text-sm font-medium ${getKarmaColor(entry.karmicValue)} bg-white/50 px-3 py-1 rounded-full`}>
                                {(entry.karmicValue * 100).toFixed(0)}% energy
                              </span>
                            </div>
                            <p className="text-slate-700 leading-relaxed text-lg">
                              {entry.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </KarmicAura>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}