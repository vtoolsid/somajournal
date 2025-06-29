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
  calculateKarmicBalance,
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
  Minus
} from 'lucide-react';
import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { user } = useAppStore();
  const router = useRouter();

  // Data analysis
  const psychosomaticData = analyzePsychosomaticConnection(mockJournalEntries);
  const karmicBalance = calculateKarmicBalance(mockJournalEntries);
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

  // Chart configurations
  const karmicChartData = [
    {
      name: 'Karmic Balance',
      value: karmicBalance.percentage,
      fill: karmicBalance.score > 0 ? '#10B981' : karmicBalance.score < 0 ? '#EF4444' : '#6B7280'
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6 breathing-element">
                <Heart className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-slate-800 mb-2">
                Welcome back, {user?.name || 'Friend'}
              </h1>
              <p className="text-xl text-slate-600">
                Your wellness journey at a glance
              </p>
            </div>

            {/* 2x2 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Card 1: Mind-Body Insight (Top-Left, PRIMARY) */}
              <Card className="wellness-card animate-fadeInUp">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center breathing-element">
                      <Brain className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800">
                      Today's Mind-Body Connection
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-slate-600 leading-relaxed text-base">
                    {formatInsightMessage(insightMessage.message)}
                  </p>
                  {psychosomaticData.detectedSymptoms.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>Physical symptoms detected:</strong> {psychosomaticData.detectedSymptoms.join(', ')}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-green-600 hover:text-green-700 font-medium"
                    onClick={() => router.push('/karma')}
                  >
                    Explore in Body Map <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Card 2: Karmic Balance Mandala (Top-Right) */}
              <Card className="wellness-card animate-fadeInUp animate-delay-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                      Karmic Balance
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-sm text-slate-500">
                      {karmicBalance.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                      {karmicBalance.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {karmicBalance.trend === 'stable' && <Minus className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48">
                      <ChartContainer config={chartConfig} className="w-full h-full">
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="60%" 
                          outerRadius="80%" 
                          data={karmicChartData}
                          startAngle={90}
                          endAngle={450}
                        >
                          <RadialBar 
                            dataKey="value" 
                            cornerRadius={10}
                            className="energy-pulse"
                          />
                        </RadialBarChart>
                      </ChartContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${karmicBalance.score > 0 ? 'text-emerald-600' : karmicBalance.score < 0 ? 'text-amber-600' : 'text-slate-600'}`}>
                            {karmicBalance.score > 0 ? '+' : ''}{karmicBalance.score}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            {karmicBalance.percentage}% positive
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Emotional Landscape (Bottom-Left) */}
              <Card className="wellness-card animate-fadeInUp animate-delay-400">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center breathing-element">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800">
                      Emotional Landscape
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-48">
                    <BarChart data={emotionChartData}>
                      <XAxis 
                        dataKey="emotion" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        cursor={{ opacity: 0.3 }}
                      />
                      <Bar 
                        dataKey="count" 
                        radius={[4, 4, 0, 0]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Card 4: Invitation to Reflect (Bottom-Right) */}
              <Card className="wellness-card border-2 border-green-200 hover:border-green-300 animate-fadeInUp animate-delay-600">
                <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto breathing-element">
                      <Edit3 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                      What's on your mind?
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Take a moment to reflect and connect with your inner wisdom
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => router.push('/journal')}
                    className="wellness-button w-full py-4 text-lg font-medium transform transition-transform hover:scale-105 active:scale-95"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Reflect Now
                  </Button>
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