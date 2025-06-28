'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KarmicAura } from '@/components/ui/karmic-aura';
import { MandalaProgress } from '@/components/ui/mandala-progress';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { mockJournalEntries } from '@/lib/mock-data';
import { Heart, BookOpen, Sparkles, Plus, Calendar, Bot as Lotus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAppStore();
  const router = useRouter();

  const averageKarma = mockJournalEntries.reduce((sum, entry) => sum + entry.karmicValue, 0) / mockJournalEntries.length;
  const recentEntry = mockJournalEntries[0];

  const getKarmaMessage = (karma: number) => {
    if (karma > 0.5) return { 
      text: "Your energy radiates pure light ✨", 
      color: "text-emerald-600",
      icon: Sparkles 
    };
    if (karma > 0.2) return { 
      text: "Gentle harmony flows through you 🌸", 
      color: "text-indigo-600",
      icon: Heart 
    };
    if (karma > -0.2) return { 
      text: "Finding your balance 🌱", 
      color: "text-slate-600",
      icon: Lotus 
    };
    return { 
      text: "Healing energy surrounds you 🌿", 
      color: "text-amber-600",
      icon: Heart 
    };
  };

  const karmaMessage = getKarmaMessage(averageKarma);
  const KarmaIcon = karmaMessage.icon;

  return (
    <AppLayout>
      <div className="min-h-screen wellness-container">
        <FloatingParticles count={12} />
        
        <div className="relative z-10 p-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Welcome */}
            <div className="text-center space-y-6 fade-enter">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6 breathing-element">
                <Heart className="w-10 h-10 text-indigo-600" />
              </div>
              
              <div className="space-y-3">
                <h1 className="text-5xl font-semibold text-slate-800">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
                  How is your wellness feeling in this moment?
                </p>
              </div>
            </div>

            {/* Karmic Balance */}
            <KarmicAura karma={averageKarma} intensity="strong" className="fade-enter">
              <Card className="wellness-card">
                <CardContent className="p-12 text-center">
                  <div className="space-y-8">
                    <div className="flex justify-center">
                      <MandalaProgress 
                        value={(averageKarma + 1) * 50} 
                        size={140}
                        className="energy-pulse"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3">
                        <KarmaIcon className={`w-8 h-8 ${karmaMessage.color}`} />
                        <h3 className="text-3xl font-semibold text-slate-800">
                          Your Karmic Balance
                        </h3>
                      </div>
                      
                      <p className={`text-xl font-medium ${karmaMessage.color}`}>
                        {karmaMessage.text}
                      </p>
                      
                      <div className="flex justify-center space-x-1 mt-6">
                        {['root', 'sacral', 'solar', 'heart', 'throat', 'third-eye', 'crown'].map((chakra, index) => (
                          <div
                            key={chakra}
                            className={`w-3 h-3 rounded-full chakra-${chakra} breathing-element`}
                            style={{ animationDelay: `${index * 0.3}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </KarmicAura>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-8">
              <KarmicAura karma={0.6} className="fade-enter">
                <Card 
                  className="wellness-card cursor-pointer group" 
                  onClick={() => router.push('/journal')}
                >
                  <CardContent className="p-10">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                          Journal
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          Pour your heart onto the digital page
                        </p>
                      </div>
                      <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </KarmicAura>

              <KarmicAura karma={0.4} className="fade-enter">
                <Card 
                  className="wellness-card cursor-pointer group" 
                  onClick={() => router.push('/karma')}
                >
                  <CardContent className="p-10">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                          Insights
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          Discover the patterns of your journey
                        </p>
                      </div>
                      <Sparkles className="w-6 h-6 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </KarmicAura>
            </div>

            {/* Recent Entry */}
            {recentEntry && (
              <KarmicAura karma={recentEntry.karmicValue} className="fade-enter">
                <Card className="wellness-card">
                  <CardContent className="p-10">
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0 breathing-element">
                        <Calendar className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-semibold text-slate-800">
                            Recent Reflection
                          </h3>
                          <span className="text-sm text-slate-500 bg-white/50 px-3 py-1 rounded-full">
                            {recentEntry.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg line-clamp-3">
                          {recentEntry.content}
                        </p>
                        <Button 
                          variant="ghost" 
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 text-lg"
                          onClick={() => router.push('/journal')}
                        >
                          Continue reading →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </KarmicAura>
            )}

            {/* Invitation */}
            <div className="text-center py-12 fade-enter">
              <div className="space-y-6">
                <p className="text-xl text-slate-500 font-light">
                  Take a moment to pause and reflect
                </p>
                <Button 
                  className="wellness-button text-lg px-12 py-4"
                  onClick={() => router.push('/journal')}
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Begin Writing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}