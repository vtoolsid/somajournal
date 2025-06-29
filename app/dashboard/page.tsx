'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  mockJournalEntries, 
  analyzePsychosomaticConnection,
  calculateWellnessMetrics,
  getTopEmotions,
  generateInsightMessage,
  chakraColors
} from '@/lib/mock-data';
import { 
  Heart, 
  Brain, 
  BarChart3, 
  Edit3,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen
} from 'lucide-react';
import { RadialBarChart, RadialBar, AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function DashboardPage() {
  const { user } = useAppStore();
  const router = useRouter();

  // Data analysis - objective wellness metrics
  const psychosomaticData = analyzePsychosomaticConnection(mockJournalEntries);
  const wellnessMetrics = calculateWellnessMetrics(mockJournalEntries);
  const topEmotions = getTopEmotions(mockJournalEntries, 4);
  const insightMessage = generateInsightMessage(psychosomaticData);

  // Helper function to get chakra color
  const getChakraColor = (chakra: string) => {
    return chakraColors[chakra as keyof typeof chakraColors] || chakraColors.heart;
  };

  // Helper function to format insight message with bold text
  const formatInsightMessage = (message: string) => {
    return message.split('**').map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-semibold text-gray-800">{part}</strong> : part
    );
  };

  // Chart configurations - objective wellness metrics
  const wellnessChartData = [
    {
      name: 'Writing Consistency',
      value: wellnessMetrics.writingConsistency,
      fill: '#10B981'
    },
    {
      name: 'Emotion Balance',
      value: Math.max(0, wellnessMetrics.emotionBalance + 10), // Normalize for display
      fill: '#3B82F6'
    }
  ];

  const emotionChartData = topEmotions.map(emotion => ({
    emotion: emotion.emotion,
    count: emotion.count,
    fill: getChakraColor(emotion.chakra)
  }));

  const chartConfig = {
    count: {
      label: "Frequency",
    },
    value: {
      label: "Balance",
    },
  };

  return (
    <AppLayout>
      <div className="min-h-screen wellness-container">
        <FloatingParticles count={8} />
        
        <div className="relative z-10 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="text-center mb-8 lg:mb-12 fade-enter">
              <h1 className="text-3xl lg:text-4xl font-semibold text-slate-800 mb-2">
                Welcome back, <span className="text-green-600">{user?.name || 'Friend'}</span>
              </h1>
              <p className="text-xl text-slate-600">
                Your wellness journey at a glance
              </p>
              
              {/* Subtle wellness metrics */}
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Connected</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span>Balanced</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span>Growing</span>
                </div>
              </div>
            </div>

            {/* 2x2 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Card 1: Mind-Body Insight (Top-Left, PRIMARY) */}
              <Card className="wellness-card animate-fadeInUp relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center breathing-element">
                      <Brain className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800">
                      Mind-Body Connection
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  {/* Body Outline with Highlighted Areas */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-1">
                      <p className="text-slate-600 leading-relaxed text-base mb-3">
                        {formatInsightMessage(insightMessage.message)}
                      </p>
                      {psychosomaticData.detectedSymptoms.length > 0 && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-sm text-amber-800">
                            <strong>Physical symptoms detected:</strong> {psychosomaticData.detectedSymptoms.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Body Silhouette with Symptom Mapping */}
                    <div className="relative flex-shrink-0">
                      <svg 
                        width="80" 
                        height="120" 
                        viewBox="0 0 80 120" 
                        className="opacity-60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#E5E7EB" stopOpacity="0.8"/>
                            <stop offset="100%" stopColor="#D1D5DB" stopOpacity="0.6"/>
                          </linearGradient>
                          <linearGradient id="symptomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7"/>
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Head */}
                        <ellipse cx="40" cy="15" rx="12" ry="15" fill="url(#bodyGradient)" stroke="#D1D5DB" strokeWidth="1"/>
                        
                        {/* Neck */}
                        <rect x="35" y="28" width="10" height="8" fill="url(#bodyGradient)" stroke="#D1D5DB" strokeWidth="1"/>
                        
                        {/* Torso */}
                        <ellipse cx="40" cy="60" rx="18" ry="25" fill="url(#bodyGradient)" stroke="#D1D5DB" strokeWidth="1"/>
                        
                        {/* Arms */}
                        <ellipse cx="20" cy="50" rx="8" ry="20" fill="url(#bodyGradient)" stroke="#D1D5DB" strokeWidth="1"/>
                        <ellipse cx="60" cy="50" rx="8" ry="20" fill="url(#bodyGradient)" stroke="#D1D5DB" strokeWidth="1"/>
                        
                        {/* Pelvis */}
                        <ellipse cx="40" cy="85" rx="12" ry="8" fill="url(#bodyGradient)" stroke="#D1D5DB" strokeWidth="1"/>
                        
                        {/* Legs */}
                        <ellipse cx="33" cy="105" rx="6" ry="15" fill="url(#bodyGradient)" stroke="#D1D5DB" strokeWidth="1"/>
                        <ellipse cx="47" cy="105" rx="6" ry="15" fill="url(#bodyGradient)" stroke="#D1D5DB" strokeWidth="1"/>
                        
                        {/* Symptom Highlights */}
                        {psychosomaticData.detectedSymptoms.includes('headache') && (
                          <>
                            <ellipse cx="40" cy="15" rx="14" ry="17" fill="url(#symptomGradient)" opacity="0.4"/>
                            <circle cx="45" cy="12" r="2" fill="#F59E0B" className="animate-pulse"/>
                          </>
                        )}
                        {psychosomaticData.detectedSymptoms.includes('tension') && (
                          <>
                            <rect x="33" y="45" width="14" height="15" rx="7" fill="url(#symptomGradient)" opacity="0.4"/>
                            <circle cx="40" cy="52" r="2" fill="#EF4444" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
                          </>
                        )}
                        {psychosomaticData.detectedSymptoms.includes('fatigue') && (
                          <>
                            <ellipse cx="40" cy="85" rx="14" ry="10" fill="url(#symptomGradient)" opacity="0.4"/>
                            <circle cx="40" cy="85" r="2" fill="#F59E0B" className="animate-pulse" style={{animationDelay: '1s'}}/>
                          </>
                        )}
                      </svg>
                      
                      {/* Gentle Energy Waves */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-20 h-20 border border-green-300 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 border border-green-400 rounded-full animate-ping opacity-30" style={{animationDelay: '1s'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-green-600 hover:text-green-700 font-medium"
                    onClick={() => router.push('/journal')}
                  >
                    Explore in Body Map <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Card 2: Wellness Metrics (Top-Right) */}
              <Card className="wellness-card animate-fadeInUp animate-delay-200 relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                      Wellness Patterns
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-sm text-slate-500">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span>Objective tracking</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48">
                      {/* Mandala Background Layers */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-44 h-44 rounded-full border border-green-100 animate-pulse opacity-40"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 rounded-full border border-green-200 animate-pulse opacity-30" style={{animationDelay: '0.5s'}}></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-36 h-36 rounded-full border border-green-300 animate-pulse opacity-20" style={{animationDelay: '1s'}}></div>
                      </div>
                      
                      {/* Chakra Petals - Decorative elements around the circle */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-48 h-48">
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
                            <div
                              key={index}
                              className="absolute w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-60"
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-90px)`,
                                animationDelay: `${index * 0.2}s`
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Main Chart with Enhanced Styling */}
                      <ChartContainer config={chartConfig} className="w-full h-full">
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="50%" 
                          outerRadius="70%" 
                          data={wellnessChartData}
                          startAngle={90}
                          endAngle={450}
                        >
                          <defs>
                            <linearGradient id="wellnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8"/>
                              <stop offset="50%" stopColor="#059669" stopOpacity="0.9"/>
                              <stop offset="100%" stopColor="#047857" stopOpacity="1"/>
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                              <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          <RadialBar 
                            dataKey="value" 
                            cornerRadius={8}
                            fill="url(#wellnessGradient)"
                            className="drop-shadow-lg"
                            style={{filter: 'url(#glow)'}}
                          />
                        </RadialBarChart>
                      </ChartContainer>
                      
                      {/* Center Content with Enhanced Design */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mb-3 mx-auto border-2 border-green-200 shadow-lg">
                            <Heart className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-emerald-600">
                            {wellnessMetrics.writingConsistency}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 font-medium">
                            Writing consistency
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Emotional Landscape (Bottom-Left) */}
              <Card className="wellness-card animate-fadeInUp animate-delay-400 relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center breathing-element">
                      <Heart className="w-5 h-5 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800">
                      Emotional Flow
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Emotion Bubbles Layout */}
                    <div className="h-48 relative flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {emotionChartData.map((emotion, index) => {
                          const maxCount = Math.max(...emotionChartData.map(e => e.count));
                          const size = 40 + (emotion.count / maxCount) * 60; // Dynamic sizing
                          const positions = [
                            { top: '15%', left: '20%' },
                            { top: '60%', left: '10%' },
                            { top: '25%', left: '70%' },
                            { top: '70%', left: '75%' }
                          ];
                          
                          return (
                            <div
                              key={emotion.emotion}
                              className="absolute rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer group"
                              style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                backgroundColor: emotion.fill,
                                ...positions[index % positions.length],
                                opacity: 0.8,
                                transform: `translate(-50%, -50%)`,
                                animation: `float 3s ease-in-out infinite`,
                                animationDelay: `${index * 0.5}s`
                              }}
                            >
                              {/* Emotion Label */}
                              <div className="text-center text-white">
                                <div className="text-xs font-medium">
                                  {emotion.emotion}
                                </div>
                                <div className="text-sm font-bold">
                                  {emotion.count}
                                </div>
                              </div>
                              
                              {/* Hover Tooltip */}
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                {emotion.emotion}: {emotion.count} occurrences
                              </div>
                              
                              {/* Gentle Pulse Animation */}
                              <div 
                                className="absolute inset-0 rounded-full animate-ping opacity-20"
                                style={{ backgroundColor: emotion.fill }}
                              />
                            </div>
                          );
                        })}
                        
                        {/* Ambient Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-radial from-green-200 to-transparent rounded-full animate-pulse"></div>
                          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-radial from-emerald-200 to-transparent rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {emotionChartData.map((emotion, index) => (
                        <div key={emotion.emotion} className="flex items-center space-x-1 text-xs">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: emotion.fill }}
                          />
                          <span className="text-slate-600 font-medium">{emotion.emotion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Invitation to Reflect (Bottom-Right) */}
              <Card className="wellness-card border-2 border-green-200 hover:border-green-300 animate-fadeInUp animate-delay-600 relative overflow-hidden group">
                {/* Soft background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center relative z-10">
                  <div className="mb-6">
                    {/* Enhanced icon with floating particles */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center breathing-element shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Edit3 className="w-8 h-8 text-green-600" />
                      </div>
                      
                      {/* Floating sparkles around the icon */}
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0s'}}></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
                      <div className="absolute top-0 left-0 w-2 h-2 bg-teal-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '2s'}}></div>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-slate-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                      What&apos;s on your mind?
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Take a moment to reflect and connect with your inner wisdom through mindful journaling
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => router.push('/journal')}
                    className="wellness-button w-full py-4 text-lg font-medium transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg group-hover:shadow-green-200"
                  >
                    <Heart className="w-5 h-5 mr-2 animate-pulse" />
                    Begin Reflection
                  </Button>
                  
                  {/* Ambient particles */}
                  <div className="absolute top-4 right-4 w-1 h-1 bg-green-300 rounded-full animate-ping opacity-40"></div>
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-emerald-300 rounded-full animate-ping opacity-40" style={{animationDelay: '1s'}}></div>
                </CardContent>
              </Card>

            </div>

            {/* Optional: Recent Activity Summary */}
            <div className="mt-8 lg:mt-12 text-center fade-enter">
              <p className="text-sm text-slate-500">
                Last updated: {new Date().toLocaleDateString()} • 
                <span className="ml-1">{mockJournalEntries.length} journal entries analyzed</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}