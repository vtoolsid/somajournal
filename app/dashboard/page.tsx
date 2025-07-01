'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { useAppStore } from '@/lib/store';
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

  // Combine user entries with mock data for richer analytics
  const allEntries = [...journalEntries, ...mockJournalEntries];

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
    return (
      <div className="min-h-screen wellness-container flex items-center justify-center">
        <FloatingParticles count={20} />
        <div className="glass-card p-8 text-center max-w-md relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to SomaJournal</h2>
          <p className="text-gray-600 mb-6">Connect with your inner wisdom through mindful journaling and emotion analysis.</p>
          <Button 
            onClick={() => router.push('/auth/login')} 
            className="wellness-button w-full"
          >
            Begin Your Journey
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen wellness-container">
        <FloatingParticles count={12} />
        
        <div className="relative z-10 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Section - Welcome & Status */}
            <div className="dashboard-hero p-8 mb-8 relative z-10">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center breathing-element">
                    <Flower2 className="w-6 h-6 text-white" />
                  </div>
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

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Card 1: Emotional Trends */}
              <Card className={`glass-card-primary animate-fadeInUp cursor-pointer transition-all duration-300 ${
                selectedCard === 'emotions' ? 'scale-105' : ''
              }`} onClick={() => setSelectedCard(selectedCard === 'emotions' ? null : 'emotions')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        Emotional Trends
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-white/60 text-green-700">
                      30 days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {emotionalTrends.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-48 emotion-chart">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendChartData}>
                            <defs>
                              <linearGradient id="emotionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <Area 
                              type="monotone" 
                              dataKey="frequency" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              fill="url(#emotionGradient)" 
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Top Emotions</h4>
                        {emotionalTrends.slice(0, 3).map((trend, index) => (
                          <div key={trend.emotion} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: chakraColors[trend.chakra] }}
                              />
                              <span className="text-sm capitalize text-gray-700">{trend.emotion}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-800">{trend.frequency}x</span>
                              {trend.physicalManifestations.length > 0 && (
                                <p className="text-xs text-gray-500">{trend.physicalManifestations[0]}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Start journaling to see your emotional patterns</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card 2: Chakra Alignment */}
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

              {/* Card 3: Journal Rhythm */}
              <Card className={`glass-card animate-fadeInUp animate-delay-400 cursor-pointer transition-all duration-300 ${
                selectedCard === 'rhythm' ? 'scale-105' : ''
              }`} onClick={() => setSelectedCard(selectedCard === 'rhythm' ? null : 'rhythm')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      Journal Rhythm
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {journalRhythm ? (
                    <div className="space-y-4">
                      {/* Weekly Pattern Chart */}
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={rhythmChartData}>
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis hide />
                            <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Rhythm Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">{journalRhythm.writingStreak}</div>
                          <div className="text-xs text-gray-500">Day Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">{journalRhythm.consistencyScore}%</div>
                          <div className="text-xs text-gray-500">Consistency</div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          Most active during <span className="font-medium text-emerald-600">{journalRhythm.mostActiveTime}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Average {journalRhythm.averageWordsPerEntry} words per entry
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Create entries to see your rhythm</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card 4: Wellness Insights */}
              <Card className="glass-card-warning animate-fadeInUp animate-delay-600 col-span-1 lg:col-span-2 xl:col-span-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      Wellness Insights
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {wellnessInsights.length > 0 ? (
                    <div className="space-y-3">
                      {wellnessInsights.slice(0, 3).map((insight, index) => (
                        <div 
                          key={index}
                          className={`insight-card priority-${insight.priority} p-3 rounded-lg border-l-4`}
                        >
                          <div className="flex items-start space-x-2">
                            {insight.priority === 'high' && <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />}
                            {insight.priority === 'medium' && <Star className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />}
                            {insight.priority === 'low' && <Heart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />}
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-800">{insight.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                              <p className="text-xs text-gray-500 mt-1 italic">{insight.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Insights will appear as you journal</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card 5: Today's Reflection */}
              <Card className="glass-card-primary animate-fadeInUp animate-delay-800 border-2 border-green-200 hover:border-green-300">
                <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="mb-6">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center breathing-element shadow-lg">
                        <Edit3 className="w-8 h-8 text-green-600" />
                      </div>
                      
                      {/* Floating sparkles */}
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-60"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
                      <div className="absolute top-0 left-0 w-2 h-2 bg-teal-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '2s'}}></div>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                      What's on your mind?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Take a moment to reflect and connect with your inner wisdom through mindful journaling
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => router.push('/journal')}
                    className="wellness-button w-full py-4 text-lg font-medium transform transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-5 h-5 mr-2 animate-pulse" />
                    Begin Reflection
                  </Button>
                </CardContent>
              </Card>

              {/* Card 6: Quick Stats */}
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