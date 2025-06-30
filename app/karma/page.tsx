'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { mockJournalEntries } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Minus,
  Calendar,
  Target,
  Award,
  Zap,
  Heart,
  Brain,
  Sparkles
} from 'lucide-react';

export default function KarmaPage() {
  const { user, journalEntries } = useAppStore();

  // Calculate karma statistics
  const allEntries = [...mockJournalEntries, ...journalEntries];
  const currentKarma = allEntries.length > 0 
    ? allEntries.reduce((sum, entry) => sum + entry.karmicValue, 0) / allEntries.length 
    : 0;
  
  const previousKarma = allEntries.length > 1 
    ? allEntries.slice(1).reduce((sum, entry) => sum + entry.karmicValue, 0) / (allEntries.length - 1)
    : 0;
  
  const karmaChange = currentKarma - previousKarma;

  // Prepare chart data
  const karmaHistory = allEntries.map((entry, index) => ({
    date: entry.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    karma: (entry.karmicValue * 100).toFixed(1),
    rawKarma: entry.karmicValue,
    cumulativeKarma: allEntries.slice(0, index + 1).reduce((sum, e) => sum + e.karmicValue, 0) / (index + 1),
  })).reverse();

  // Karma distribution data
  const karmaDistribution = [
    { name: 'Very Positive', value: allEntries.filter(e => e.karmicValue > 0.5).length, color: '#10B981' },
    { name: 'Positive', value: allEntries.filter(e => e.karmicValue > 0.2 && e.karmicValue <= 0.5).length, color: '#34D399' },
    { name: 'Neutral', value: allEntries.filter(e => e.karmicValue >= -0.2 && e.karmicValue <= 0.2).length, color: '#A78BFA' },
    { name: 'Negative', value: allEntries.filter(e => e.karmicValue < -0.2 && e.karmicValue >= -0.5).length, color: '#F87171' },
    { name: 'Very Negative', value: allEntries.filter(e => e.karmicValue < -0.5).length, color: '#EF4444' },
  ];

  const getKarmaLevel = (value: number) => {
    if (value > 0.5) return { label: 'Enlightened', color: 'text-green-600', icon: Sparkles };
    if (value > 0.2) return { label: 'Positive', color: 'text-green-500', icon: TrendingUp };
    if (value > -0.2) return { label: 'Balanced', color: 'text-purple-500', icon: Minus };
    if (value > -0.5) return { label: 'Challenged', color: 'text-orange-500', icon: TrendingDown };
    return { label: 'Turbulent', color: 'text-red-500', icon: TrendingDown };
  };

  const karmaLevel = getKarmaLevel(currentKarma);
  const KarmaIcon = karmaLevel.icon;

  // Karma insights
  const insights = [
    {
      title: 'Meditation Impact',
      description: 'Your karma increases by 40% on days you meditate',
      icon: Brain,
      color: 'text-blue-600',
    },
    {
      title: 'Family Time',
      description: 'Family interactions consistently boost your karmic balance',
      icon: Heart,
      color: 'text-pink-600',
    },
    {
      title: 'Work Stress',
      description: 'Work-related stress tends to lower your karma by 25%',
      icon: TrendingDown,
      color: 'text-orange-600',
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-primary" />
              Karmic Balance
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your spiritual energy and life balance over time
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 days
            </Badge>
          </div>
        </div>

        {/* Current Karma Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Karma Level</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <KarmaIcon className={`w-8 h-8 ${karmaLevel.color}`} />
                    <div>
                      <p className={`text-2xl font-bold ${karmaLevel.color}`}>
                        {karmaLevel.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(currentKarma * 100).toFixed(1)}% balance
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Change</p>
                  <div className={`flex items-center space-x-1 ${
                    karmaChange > 0 ? 'text-green-600' : karmaChange < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {karmaChange > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : karmaChange < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {Math.abs(karmaChange * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <Progress 
                value={(currentKarma + 1) * 50} 
                className="h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Negative</span>
                <span>Neutral</span>
                <span>Positive</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">7 days</p>
                </div>
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Positive karma maintained
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Best Day</p>
                  <p className="text-2xl font-bold text-green-600">+85%</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Jan 13 - Family time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Karma Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Karma Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={karmaHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[-100, 100]} />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Karma']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="karma" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Karma Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={karmaDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {karmaDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {karmaDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Karma Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary" />
                Karma Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                    <div>
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Continue Meditation</h4>
                <p className="text-sm text-green-700">
                  Your meditation practice shows the strongest positive impact on your karma. 
                  Try to maintain daily sessions.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Schedule Family Time</h4>
                <p className="text-sm text-blue-700">
                  Family interactions consistently boost your karmic balance. 
                  Consider scheduling regular family activities.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">Manage Work Stress</h4>
                <p className="text-sm text-orange-700">
                  Work stress appears to negatively impact your karma. 
                  Try stress-reduction techniques during work hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}