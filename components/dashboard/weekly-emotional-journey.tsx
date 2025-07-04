'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Dot
} from 'recharts';
import { JournalEntry } from '@/lib/store';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

interface WeeklyEmotionalJourneyProps {
  entries: JournalEntry[];
  currentWeek?: Date;
  onWeekChange?: (direction: 'prev' | 'next') => void;
}

interface EmotionalDataPoint {
  date: string;
  dayOfWeek: string;
  highScore: number;
  lowScore: number;
  volatility: number;
  dominantHigh?: string;
  dominantLow?: string;
  entries: JournalEntry[];
}

interface WeeklySummary {
  emotionalHighs: { emotion: string; score: number; date: Date }[];
  emotionalLows: { emotion: string; score: number; date: Date }[];
  averageVolatility: number;
  trend: 'improving' | 'declining' | 'stable';
  peakDay: string;
  valleyDay: string;
}

// Positive emotions that contribute to highs
const POSITIVE_EMOTIONS = [
  'joy', 'happiness', 'excitement', 'gratitude', 'love', 'peace', 
  'contentment', 'satisfaction', 'enthusiasm', 'optimism', 'pride',
  'amusement', 'relief', 'admiration', 'awe', 'caring'
];

// Negative emotions that contribute to lows
const NEGATIVE_EMOTIONS = [
  'sadness', 'anger', 'fear', 'anxiety', 'frustration', 'disappointment',
  'disgust', 'embarrassment', 'grief', 'guilt', 'nervousness', 'remorse',
  'shame', 'confusion', 'annoyance', 'disapproval'
];

export function WeeklyEmotionalJourney({ 
  entries, 
  currentWeek = new Date(),
  onWeekChange 
}: WeeklyEmotionalJourneyProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  // Calculate weekly data
  const weeklyData = useMemo(() => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const dataPoints: EmotionalDataPoint[] = daysInWeek.map(day => {
      const dayEntries = entries.filter(entry => 
        isSameDay(new Date(entry.createdAt), day)
      );

      let highScore = 0;
      let lowScore = 0;
      let dominantHigh = '';
      let dominantLow = '';

      dayEntries.forEach(entry => {
        // Calculate high score (positive emotions)
        const positiveScores = Object.entries(entry.emotions)
          .filter(([emotion]) => POSITIVE_EMOTIONS.includes(emotion))
          .map(([emotion, score]) => ({ emotion, score }));
        
        const maxPositive = positiveScores.reduce((max, curr) => 
          curr.score > max.score ? curr : max, 
          { emotion: '', score: 0 }
        );

        if (maxPositive.score > highScore) {
          highScore = maxPositive.score;
          dominantHigh = maxPositive.emotion;
        }

        // Calculate low score (negative emotions)
        const negativeScores = Object.entries(entry.emotions)
          .filter(([emotion]) => NEGATIVE_EMOTIONS.includes(emotion))
          .map(([emotion, score]) => ({ emotion, score }));
        
        const maxNegative = negativeScores.reduce((max, curr) => 
          curr.score > max.score ? curr : max, 
          { emotion: '', score: 0 }
        );

        if (maxNegative.score > lowScore) {
          lowScore = maxNegative.score;
          dominantLow = maxNegative.emotion;
        }
      });

      // Calculate volatility (difference between high and low)
      const volatility = Math.abs(highScore - lowScore);

      return {
        date: format(day, 'yyyy-MM-dd'),
        dayOfWeek: format(day, 'EEE'),
        highScore: Math.round(highScore * 100),
        lowScore: Math.round(lowScore * 100),
        volatility: Math.round(volatility * 100),
        dominantHigh,
        dominantLow,
        entries: dayEntries
      };
    });

    return dataPoints;
  }, [entries, currentWeek]);

  // Calculate weekly summary
  const weeklySummary = useMemo((): WeeklySummary => {
    const highs = weeklyData
      .filter(d => d.highScore > 0)
      .map(d => ({
        emotion: d.dominantHigh || '',
        score: d.highScore,
        date: new Date(d.date)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const lows = weeklyData
      .filter(d => d.lowScore > 0)
      .map(d => ({
        emotion: d.dominantLow || '',
        score: d.lowScore,
        date: new Date(d.date)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const avgVolatility = weeklyData.reduce((sum, d) => sum + d.volatility, 0) / weeklyData.length;

    // Determine trend based on volatility change
    const firstHalf = weeklyData.slice(0, 3);
    const secondHalf = weeklyData.slice(4);
    const firstVolatility = firstHalf.reduce((sum, d) => sum + d.volatility, 0) / firstHalf.length;
    const secondVolatility = secondHalf.reduce((sum, d) => sum + d.volatility, 0) / secondHalf.length;
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (secondVolatility < firstVolatility - 10) trend = 'improving';
    else if (secondVolatility > firstVolatility + 10) trend = 'declining';

    const peakDay = weeklyData.reduce((peak, curr) => 
      curr.highScore > peak.highScore ? curr : peak
    );

    const valleyDay = weeklyData.reduce((valley, curr) => 
      curr.lowScore > valley.lowScore ? curr : valley
    );

    return {
      emotionalHighs: highs,
      emotionalLows: lows,
      averageVolatility: Math.round(avgVolatility),
      trend,
      peakDay: peakDay.dayOfWeek,
      valleyDay: valleyDay.dayOfWeek
    };
  }, [weeklyData]);

  // Custom dot for interactive points
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isSelected = selectedDay === payload.date;
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? 8 : 5}
          fill={props.dataKey === 'highScore' ? '#10B981' : '#F59E0B'}
          stroke="#fff"
          strokeWidth={2}
          className="cursor-pointer transition-all hover:r-8"
          onClick={() => setSelectedDay(payload.date)}
        />
        {isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r={12}
            fill="none"
            stroke={props.dataKey === 'highScore' ? '#10B981' : '#F59E0B'}
            strokeWidth={2}
            strokeOpacity={0.5}
            className="animate-pulse"
          />
        )}
      </g>
    );
  };

  return (
    <Card className="glass-card-primary col-span-full animate-fadeInUp">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Weekly Emotional Journey
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Track your emotional highs and lows throughout the week
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onWeekChange?.('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <Badge variant="secondary" className="bg-white/60 text-gray-700 px-4">
              <Calendar className="w-4 h-4 mr-2" />
              {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d')} - 
              {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d, yyyy')}
            </Badge>
            
            <button
              onClick={() => onWeekChange?.('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Chart Area */}
          <div className="h-64 emotion-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="dayOfWeek" 
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
                          <p className="font-semibold text-gray-800">{data.dayOfWeek}</p>
                          {data.dominantHigh && (
                            <p className="text-sm text-green-600">
                              High: {data.dominantHigh} ({data.highScore}%)
                            </p>
                          )}
                          {data.dominantLow && (
                            <p className="text-sm text-amber-600">
                              Low: {data.dominantLow} ({data.lowScore}%)
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Volatility: {data.volatility}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                <Area
                  type="monotone"
                  dataKey="highScore"
                  stroke="#10B981"
                  strokeWidth={0}
                  fill="url(#highGradient)"
                />
                
                <Area
                  type="monotone"
                  dataKey="lowScore"
                  stroke="#F59E0B"
                  strokeWidth={0}
                  fill="url(#lowGradient)"
                />
                
                <Line
                  type="monotone"
                  dataKey="highScore"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={<CustomDot dataKey="highScore" />}
                />
                
                <Line
                  type="monotone"
                  dataKey="lowScore"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={<CustomDot dataKey="lowScore" />}
                />
                
                {/* Average line */}
                <ReferenceLine
                  y={50}
                  stroke="#6B7280"
                  strokeDasharray="3 3"
                  label={{ value: "Baseline", position: "right", fontSize: 12 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Emotional Highs */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-green-800">Emotional Highs</h4>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-2">
                {weeklySummary.emotionalHighs.map((high, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-green-700">{high.emotion}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-green-800">{high.score}%</span>
                      <p className="text-xs text-green-600">{format(high.date, 'EEE')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional Lows */}
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-amber-800">Emotional Lows</h4>
                <TrendingDown className="w-5 h-5 text-amber-600" />
              </div>
              <div className="space-y-2">
                {weeklySummary.emotionalLows.map((low, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-amber-700">{low.emotion}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-amber-800">{low.score}%</span>
                      <p className="text-xs text-amber-600">{format(low.date, 'EEE')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volatility & Trend */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-purple-800">Weekly Pattern</h4>
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">Avg Volatility</span>
                  <span className="text-sm font-medium text-purple-800">
                    {weeklySummary.averageVolatility}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">Trend</span>
                  <span className={`text-sm font-medium capitalize ${
                    weeklySummary.trend === 'improving' ? 'text-green-600' :
                    weeklySummary.trend === 'declining' ? 'text-amber-600' :
                    'text-purple-800'
                  }`}>
                    {weeklySummary.trend}
                  </span>
                </div>
                <div className="pt-2 border-t border-purple-200">
                  <p className="text-xs text-purple-600">
                    Peak: {weeklySummary.peakDay} • Valley: {weeklySummary.valleyDay}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Toggle */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>{showInsights ? 'Hide' : 'Show'} Weekly Insights</span>
            </button>
          </div>

          {/* Weekly Insights */}
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1">Weekly Analysis</h5>
                      <p className="text-sm text-gray-600">
                        Your emotional volatility is {weeklySummary.averageVolatility < 30 ? 'low' : 
                        weeklySummary.averageVolatility < 60 ? 'moderate' : 'high'} this week, 
                        indicating {weeklySummary.averageVolatility < 30 ? 'emotional stability' : 
                        weeklySummary.averageVolatility < 60 ? 'normal emotional variation' : 
                        'significant emotional fluctuations'}. 
                        {weeklySummary.trend === 'improving' && ' The decreasing volatility suggests improving emotional regulation.'}
                        {weeklySummary.trend === 'declining' && ' The increasing volatility may indicate rising stress levels.'}
                      </p>
                    </div>
                  </div>
                </div>

                {weeklySummary.averageVolatility > 60 && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-1">Attention Needed</h5>
                        <p className="text-sm text-gray-600">
                          High emotional volatility detected. Consider incorporating stress-reduction 
                          practices like meditation, deep breathing, or gentle exercise to help 
                          stabilize your emotional landscape.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}