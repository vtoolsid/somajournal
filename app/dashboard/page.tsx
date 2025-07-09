'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { SomaLogo } from '@/components/ui/soma-logo';
import { WeeklyEmotionalJourney } from '@/components/dashboard/weekly-emotional-journey';
import { PsychosomaticPatterns } from '@/components/dashboard/psychosomatic-patterns';
import { PsychosomaticBodyMapHero } from '@/components/dashboard/psychosomatic-body-map-hero';
import { WeeklyPsychosomaticFlow } from '@/components/dashboard/weekly-psychosomatic-flow';
import { QuickSymptomEntry } from '@/components/dashboard/quick-symptom-entry';
import { useAppStore } from '@/lib/store';
import { addWeeks, subWeeks } from 'date-fns';
import { 
  mockJournalEntries,
  analyzeEmotionalTrends,
  analyzeChakraActivity,
  analyzeJournalRhythm,
  generateWellnessInsights,
  chakraColors,
  type EmotionalTrend,
  type ChakraActivity,
  type JournalRhythm,
  type WellnessInsight
} from '@/lib/mock-data';
import { 
  Heart, 
  Brain, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Calendar,
  Edit3,
  Target,
  ArrowRight,
  BarChart3,
  Clock,
  Flower2,
  Star,
  AlertTriangle,
  Zap,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function DashboardPage() {
  const { user, journalEntries } = useAppStore();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [allEntries, setAllEntries] = useState([...journalEntries, ...mockJournalEntries]);

  // Analytics data
  const [emotionalTrends, setEmotionalTrends] = useState<EmotionalTrend[]>([]);
  const [chakraActivity, setChakraActivity] = useState<ChakraActivity[]>([]);
  const [journalRhythm, setJournalRhythm] = useState<JournalRhythm | null>(null);
  const [wellnessInsights, setWellnessInsights] = useState<WellnessInsight[]>([]);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update combined entries when journalEntries changes
  useEffect(() => {
    setAllEntries([...journalEntries, ...mockJournalEntries]);
  }, [journalEntries]);

  // Calculate analytics
  useEffect(() => {
    if (allEntries.length > 0) {
      const trends = analyzeEmotionalTrends(allEntries);
      const chakras = analyzeChakraActivity(allEntries);
      const rhythm = analyzeJournalRhythm(allEntries);
      const insights = generateWellnessInsights(trends, chakras, rhythm);

      setEmotionalTrends(trends);
      setChakraActivity(chakras);
      setJournalRhythm(rhythm);
      setWellnessInsights(insights);
    }
  }, [allEntries]);

  // Wisdom quotes for cycling
  const quotes = [
    {
      text: "Every mental knot has a corresponding physical, muscular knot.",
      author: "- Satyananda Saraswati"
    },
    {
      text: "The body is precious. It is our vehicle for awakening.",
      author: "- Buddha"
    },
    {
      text: "Your body holds deep wisdom. Trust in that wisdom.",
      author: "- Anonymous"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(quoteTimer);
  }, [quotes.length]);

  // Handle week navigation
  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
  };

  // Emotional trend chart data
  const trendChartData = emotionalTrends.slice(0, 5).map((trend, index) => ({
    emotion: trend.emotion,
    frequency: trend.frequency,
    intensity: Math.round(trend.intensity * 100),
    fill: Object.values(chakraColors)[index % Object.values(chakraColors).length]
  }));

  // Journal rhythm chart data
  const rhythmChartData = journalRhythm?.weeklyPattern.map(day => ({
    day: day.day.slice(0, 3),
    count: day.count
  })) || [];

  if (!user) {
    // Let AppLayout handle authentication redirects - don't render custom screen
    return null;
  }

  return (
    <AppLayout>
      <div className="min-h-screen wellness-container">
        <FloatingParticles count={12} />
        
        <div className="relative z-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto psychosomatic-grid">
            
            {/* Hero Section - Welcome & Status */}
            <div className="dashboard-hero p-4 mb-4 relative z-1">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-4 mb-2">
                  <SomaLogo size="md" className="breathing-element" />
                  <div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                      Welcome back, <span className="text-green-600">{user.name}</span>
                    </h1>
                    <p className="text-gray-600">{currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                {/* Live Wisdom Quote */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuote}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mx-auto"
                  >
                    <blockquote className="text-xl text-gray-700 italic mb-2">
                      "{quotes[currentQuote].text}"
                    </blockquote>
                    <cite className="text-sm text-gray-500">{quotes[currentQuote].author}</cite>
                  </motion.div>
                </AnimatePresence>

                {/* Wellness Status Indicators */}
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Connected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>Balanced</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Growing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRIMARY: Psychosomatic Body Map Hero (60% of dashboard) */}
            <PsychosomaticBodyMapHero entries={allEntries} />

            {/* SECONDARY: Weekly Psychosomatic Flow (25% of dashboard) */}
            <div>
              <WeeklyPsychosomaticFlow 
                entries={allEntries}
                currentWeek={currentWeek}
                onWeekChange={handleWeekChange}
              />
            </div>

            {/* TERTIARY: Quick Entry & Supporting Elements (15% of dashboard) */}
            <div>
              <QuickSymptomEntry onEntryAdded={() => {/* Refresh analysis */}} />
            </div>

            {/* Collapsed/Expandable Supporting Analytics */}
            <details>
              <summary className="cursor-pointer p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Additional Wellness Tracking</h3>
                  <span className="text-sm text-gray-600">Click to expand</span>
                </div>
              </summary>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mt-6">
              {/* Removed: Generic Emotional Trends - replaced by psychosomatic focus */}

              {/* Card 1: Chakra Alignment */}
              <Card className={`glass-card-secondary animate-fadeInUp animate-delay-200 cursor-pointer transition-all duration-300 ${
                selectedCard === 'chakras' ? 'scale-105' : ''
              }`} onClick={() => setSelectedCard(selectedCard === 'chakras' ? null : 'chakras')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      Chakra Alignment
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {chakraActivity.length > 0 ? (
                    <div className="space-y-4">
                      {/* Chakra Wheel Visualization */}
                      <div className="relative w-48 h-48 mx-auto chakra-wheel">
                        <div className="absolute inset-0 rounded-full border-2 border-gray-200 opacity-20"></div>
                        {chakraActivity.slice(0, 7).map((chakra, index) => {
                          const angle = (index * 360) / 7;
                          const radius = 80;
                          const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                          const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                          
                          return (
                            <div
                              key={chakra.chakra}
                              className={`chakra-point absolute w-6 h-6 rounded-full ${
                                chakra.balanceState === 'balanced' ? 'chakra-point active' : ''
                              }`}
                              style={{
                                backgroundColor: chakraColors[chakra.chakra],
                                left: `calc(50% + ${x}px - 12px)`,
                                top: `calc(50% + ${y}px - 12px)`,
                                opacity: chakra.activationLevel / 100
                              }}
                              title={`${chakra.chakra} chakra - ${chakra.activationLevel}%`}
                            />
                          );
                        })}
                        
                        {/* Center point */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <Flower2 className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>

                      {/* Top Chakras */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Energy Centers</h4>
                        {chakraActivity.slice(0, 3).map((chakra) => (
                          <div key={chakra.chakra} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: chakraColors[chakra.chakra] }}
                              />
                              <span className="text-sm capitalize text-gray-700">{chakra.chakra}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-800">{chakra.activationLevel}%</span>
                              <p className="text-xs text-gray-500">{chakra.balanceState}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Flower2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Build your energy profile through journaling</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Psychosomatic-Focused Insights */}
              <Card className="glass-card-warning animate-fadeInUp animate-delay-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      Mind-Body Insights
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Psychosomatic Focus Insights */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 mb-4">
                      <div className="flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-semibold text-gray-800">Body Wisdom</h5>
                          <p className="text-xs text-gray-600">
                            Your body shows the strongest mind-body correlations in stress → shoulder tension patterns.
                            Consider gentle stretches during high-stress periods.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pattern Strength */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-semibold text-gray-800">Pattern Strength</h5>
                          <p className="text-xs text-gray-600">
                            {allEntries.length > 5 ? 
                              `Strong correlations detected across ${allEntries.length} entries. Your patterns are becoming clear.` :
                              'Continue journaling to strengthen pattern detection. More entries = better insights.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Rhythm */}
                    {journalRhythm && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-800">Tracking Rhythm</span>
                          </div>
                          <span className="text-sm font-bold text-purple-600">{journalRhythm.writingStreak} days</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Quick Reflection */}
              <Card className="glass-card-primary animate-fadeInUp animate-delay-800 border-2 border-green-200 hover:border-green-300">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="mb-4">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center breathing-element shadow-lg">
                        <Edit3 className="w-6 h-6 text-green-600" />
                      </div>
                      
                      {/* Floating sparkles */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60"></div>
                      <div className="absolute -bottom-0 -left-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Continue Your Journey
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Add today's reflection to enhance your weekly patterns
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => router.push('/journal')}
                    className="wellness-button w-full py-3 text-sm font-medium transform transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-4 h-4 mr-2 animate-pulse" />
                    Begin Reflection
                  </Button>
                </CardContent>
              </Card>

              {/* Card 3: Journey Stats */}
              <Card className="glass-card animate-fadeInUp animate-delay-1000">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      Your Journey
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{allEntries.length}</div>
                        <div className="text-xs text-gray-500">Total Entries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{emotionalTrends.length}</div>
                        <div className="text-xs text-gray-500">Emotions Tracked</div>
                      </div>
                    </div>
                    
                    <div className="text-center pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push('/journal')}
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      View All Entries
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            </details>
            

            {/* Footer Stats */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Last updated: {currentTime.toLocaleTimeString()} • 
                <span className="ml-1">{allEntries.length} journal entries analyzed</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}