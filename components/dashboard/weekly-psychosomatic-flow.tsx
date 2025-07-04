'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  ArrowDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  Info,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  format,
  addWeeks,
  subWeeks
} from 'date-fns';
import { JournalEntry } from '@/lib/store';

interface WeeklyPsychosomaticFlowProps {
  entries: JournalEntry[];
  currentWeek?: Date;
  onWeekChange?: (direction: 'prev' | 'next') => void;
}

interface EmotionNode {
  emotion: string;
  intensity: number;
  frequency: number;
  connectedSymptoms: string[];
  dayPattern: boolean[]; // 7 days
  color: string;
}

interface SymptomNode {
  symptom: string;
  severity: number;
  frequency: number;
  connectedEmotions: string[];
  dayPattern: boolean[]; // 7 days
  bodyRegion: string;
}

interface FlowConnection {
  emotion: string;
  symptom: string;
  strength: number;
  dayPattern: boolean[];
  bodyRegion: string;
  insights: string[];
}

// Enhanced emotion categorization with body mapping
const EMOTION_BODY_MAPPING = {
  // Head emotions
  anger: { region: 'head', color: '#DC2626', symptoms: ['headache', 'tension', 'jaw_clenching'] },
  stress: { region: 'head', color: '#EF4444', symptoms: ['headache', 'pressure', 'brain_fog'] },
  anxiety: { region: 'chest', color: '#F59E0B', symptoms: ['chest_tightness', 'heart_palpitations', 'shallow_breathing'] },
  fear: { region: 'stomach', color: '#D97706', symptoms: ['nausea', 'butterflies', 'digestive_issues'] },
  
  // Heart emotions
  love: { region: 'chest', color: '#10B981', symptoms: ['warmth', 'expansion', 'openness'] },
  joy: { region: 'chest', color: '#059669', symptoms: ['lightness', 'energy', 'vitality'] },
  sadness: { region: 'chest', color: '#3B82F6', symptoms: ['heaviness', 'chest_tightness', 'breathing_difficulty'] },
  grief: { region: 'chest', color: '#1D4ED8', symptoms: ['chest_pain', 'emptiness', 'fatigue'] },
  
  // Throat emotions
  suppressed_anger: { region: 'throat', color: '#7C2D12', symptoms: ['throat_tightness', 'voice_changes', 'swallowing_difficulty'] },
  shame: { region: 'throat', color: '#92400E', symptoms: ['throat_constriction', 'voice_loss', 'neck_tension'] },
  
  // Shoulders/Back
  burden: { region: 'shoulders', color: '#374151', symptoms: ['shoulder_tension', 'upper_back_pain', 'neck_stiffness'] },
  overwhelm: { region: 'shoulders', color: '#4B5563', symptoms: ['muscle_knots', 'shoulder_blade_pain', 'tension'] },
  
  // Core emotions
  excitement: { region: 'stomach', color: '#F97316', symptoms: ['butterflies', 'energy_surge', 'tingling'] },
  nervousness: { region: 'stomach', color: '#EA580C', symptoms: ['stomach_knots', 'nausea', 'restlessness'] }
};

const SYMPTOM_SEVERITY_COLORS = {
  mild: '#10B981',      // green
  moderate: '#F59E0B',  // amber  
  severe: '#EF4444'     // red
};

export function WeeklyPsychosomaticFlow({ 
  entries, 
  currentWeek = new Date(),
  onWeekChange 
}: WeeklyPsychosomaticFlowProps) {
  const [selectedConnection, setSelectedConnection] = useState<FlowConnection | null>(null);
  const [viewMode, setViewMode] = useState<'flow' | 'timeline'>('flow');

  // Analyze weekly psychosomatic patterns
  const weeklyAnalysis = useMemo(() => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weekEntries = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const emotionNodes: Record<string, EmotionNode> = {};
    const symptomNodes: Record<string, SymptomNode> = {};
    const connections: FlowConnection[] = [];

    // Initialize day patterns
    const initDayPattern = () => new Array(7).fill(false);

    // Analyze each entry
    weekEntries.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      const dayIndex = daysInWeek.findIndex(day => isSameDay(day, entryDate));
      
      if (dayIndex === -1) return;

      const entryEmotions = Object.entries(entry.emotions).filter(([_, intensity]) => intensity > 0.3);
      const entrySymptoms = Object.entries(entry.symptoms)
        .filter(([_, hasSymptom]) => hasSymptom)
        .map(([symptom]) => symptom);

      // Process emotions
      entryEmotions.forEach(([emotion, intensity]) => {
        if (!emotionNodes[emotion]) {
          const mapping = EMOTION_BODY_MAPPING[emotion as keyof typeof EMOTION_BODY_MAPPING] || 
            { region: 'unknown', color: '#6B7280', symptoms: [] };
          
          emotionNodes[emotion] = {
            emotion,
            intensity: 0,
            frequency: 0,
            connectedSymptoms: [],
            dayPattern: initDayPattern(),
            color: mapping.color
          };
        }

        const node = emotionNodes[emotion];
        node.intensity = Math.max(node.intensity, intensity);
        node.frequency++;
        node.dayPattern[dayIndex] = true;
      });

      // Process symptoms
      entrySymptoms.forEach(symptom => {
        if (!symptomNodes[symptom]) {
          // Determine body region and severity
          const relatedEmotion = Object.keys(EMOTION_BODY_MAPPING).find(emotion =>
            EMOTION_BODY_MAPPING[emotion as keyof typeof EMOTION_BODY_MAPPING].symptoms.includes(symptom)
          );
          const bodyRegion = relatedEmotion ? 
            EMOTION_BODY_MAPPING[relatedEmotion as keyof typeof EMOTION_BODY_MAPPING].region : 'unknown';

          symptomNodes[symptom] = {
            symptom,
            severity: 0,
            frequency: 0,
            connectedEmotions: [],
            dayPattern: initDayPattern(),
            bodyRegion
          };
        }

        const node = symptomNodes[symptom];
        node.frequency++;
        node.dayPattern[dayIndex] = true;
        // Calculate severity based on co-occurring emotions
        const avgEmotionIntensity = entryEmotions.reduce((sum, [_, intensity]) => sum + intensity, 0) / entryEmotions.length;
        node.severity = Math.max(node.severity, avgEmotionIntensity);
      });

      // Create connections
      entryEmotions.forEach(([emotion, intensity]) => {
        entrySymptoms.forEach(symptom => {
          let connection = connections.find(c => c.emotion === emotion && c.symptom === symptom);
          
          if (!connection) {
            const mapping = EMOTION_BODY_MAPPING[emotion as keyof typeof EMOTION_BODY_MAPPING] || 
              { region: 'unknown', color: '#6B7280', symptoms: [] };
            
            connection = {
              emotion,
              symptom,
              strength: 0,
              dayPattern: initDayPattern(),
              bodyRegion: mapping.region,
              insights: []
            };
            connections.push(connection);
          }

          connection.strength = Math.max(connection.strength, intensity * 100);
          connection.dayPattern[dayIndex] = true;

          // Add to cross-references
          if (!emotionNodes[emotion].connectedSymptoms.includes(symptom)) {
            emotionNodes[emotion].connectedSymptoms.push(symptom);
          }
          if (!symptomNodes[symptom].connectedEmotions.includes(emotion)) {
            symptomNodes[symptom].connectedEmotions.push(emotion);
          }
        });
      });
    });

    // Generate insights for connections
    connections.forEach(connection => {
      const activeDays = connection.dayPattern.filter(Boolean).length;
      const consecutiveDays = getConsecutiveDays(connection.dayPattern);
      
      if (activeDays >= 3) {
        connection.insights.push(`Consistent pattern: appears ${activeDays}/7 days`);
      }
      if (consecutiveDays >= 2) {
        connection.insights.push(`Clustered: ${consecutiveDays} consecutive days`);
      }
      if (connection.strength > 70) {
        connection.insights.push(`High intensity correlation detected`);
      }
    });

    // Sort by strength
    connections.sort((a, b) => b.strength - a.strength);

    return {
      weekStart,
      weekEnd,
      emotions: Object.values(emotionNodes).sort((a, b) => b.intensity - a.intensity),
      symptoms: Object.values(symptomNodes).sort((a, b) => b.severity - a.severity),
      connections: connections.slice(0, 12), // Top 12 connections
      weekPattern: {
        totalDays: daysInWeek.length,
        activeDays: weekEntries.length,
        strongestDay: findStrongestDay(daysInWeek, weekEntries),
        patternInsight: generateWeekInsight(connections, daysInWeek)
      }
    };
  }, [entries, currentWeek]);

  function getConsecutiveDays(dayPattern: boolean[]): number {
    let maxConsecutive = 0;
    let current = 0;
    
    dayPattern.forEach(active => {
      if (active) {
        current++;
        maxConsecutive = Math.max(maxConsecutive, current);
      } else {
        current = 0;
      }
    });
    
    return maxConsecutive;
  }

  function findStrongestDay(days: Date[], weekEntries: JournalEntry[]): string {
    const dayCounts = new Array(7).fill(0);
    
    weekEntries.forEach(entry => {
      const dayIndex = days.findIndex(day => isSameDay(new Date(entry.createdAt), day));
      if (dayIndex !== -1) {
        dayCounts[dayIndex]++;
      }
    });
    
    const maxIndex = dayCounts.indexOf(Math.max(...dayCounts));
    return maxIndex !== -1 ? format(days[maxIndex], 'EEEE') : 'None';
  }

  function generateWeekInsight(connections: FlowConnection[], days: Date[]): string {
    if (connections.length === 0) return "No patterns detected this week.";
    
    const strongConnections = connections.filter(c => c.strength > 50);
    const bodyRegions = Array.from(new Set(connections.map(c => c.bodyRegion)));
    
    if (strongConnections.length >= 3) {
      return `Strong mind-body patterns detected across ${bodyRegions.length} body regions.`;
    } else if (strongConnections.length === 0) {
      return "Mild correlations observed. Consider more detailed journaling.";
    } else {
      return `${strongConnections.length} significant pattern${strongConnections.length > 1 ? 's' : ''} identified.`;
    }
  }

  function getSeverityColor(severity: number): string {
    if (severity < 0.3) return SYMPTOM_SEVERITY_COLORS.mild;
    if (severity < 0.7) return SYMPTOM_SEVERITY_COLORS.moderate;
    return SYMPTOM_SEVERITY_COLORS.severe;
  }

  const ConnectionLine = ({ connection, index }: { connection: FlowConnection; index: number }) => {
    const isSelected = selectedConnection?.emotion === connection.emotion && 
                      selectedConnection?.symptom === connection.symptom;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`relative cursor-pointer transition-all duration-300 ${
          isSelected ? 'scale-105 z-10' : ''
        }`}
        onClick={() => setSelectedConnection(isSelected ? null : connection)}
      >
        <svg width="100%" height="80" className="overflow-visible">
          <defs>
            <linearGradient id={`connection-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={EMOTION_BODY_MAPPING[connection.emotion as keyof typeof EMOTION_BODY_MAPPING]?.color || '#6B7280'} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={getSeverityColor(connection.strength / 100)} stopOpacity="0.8"/>
            </linearGradient>
          </defs>
          
          <path
            d={`M 20 20 Q 50 ${isSelected ? 10 : 40} 80 60`}
            stroke={`url(#connection-${index})`}
            strokeWidth={Math.max(2, connection.strength / 20)}
            fill="none"
            className={`transition-all duration-300 ${isSelected ? 'animate-pulse' : ''}`}
          />
          
          {/* Strength indicator */}
          <circle
            cx="50"
            cy={isSelected ? 10 : 40}
            r="3"
            fill={EMOTION_BODY_MAPPING[connection.emotion as keyof typeof EMOTION_BODY_MAPPING]?.color || '#6B7280'}
            className="animate-pulse"
          />
        </svg>
        
        {/* Connection info */}
        <div className="absolute top-0 left-0 right-0 flex justify-between text-xs">
          <span className="bg-white/80 px-2 py-1 rounded capitalize font-medium">
            {connection.emotion}
          </span>
          <span className="bg-white/80 px-2 py-1 rounded capitalize">
            {connection.symptom.replace('_', ' ')}
          </span>
        </div>
        
        {/* Day pattern dots */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {connection.dayPattern.map((active, dayIndex) => (
            <div
              key={dayIndex}
              className={`w-2 h-2 rounded-full ${
                active ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="psychosomatic-flow glass-card w-full animate-fadeInUp animate-delay-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Weekly Psychosomatic Flow
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Emotion-to-body correlation patterns over 7 days
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
              {format(weeklyAnalysis.weekStart, 'MMM d')} - {format(weeklyAnalysis.weekEnd, 'MMM d, yyyy')}
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
          {/* Week insight */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-gray-800">Weekly Pattern Analysis</h5>
                <p className="text-sm text-gray-600 mt-1">
                  {weeklyAnalysis.weekPattern.patternInsight} 
                  {weeklyAnalysis.weekPattern.strongestDay !== 'None' && 
                    ` Peak activity: ${weeklyAnalysis.weekPattern.strongestDay}.`
                  }
                </p>
              </div>
            </div>
          </div>

          {weeklyAnalysis.connections.length > 0 ? (
            <>
              {/* Emotion-to-symptom flow */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Mind-Body Connections
                  </h4>
                  <Badge variant="outline">
                    {weeklyAnalysis.connections.length} patterns
                  </Badge>
                </div>
                
                <div className="grid gap-3">
                  {weeklyAnalysis.connections.map((connection, index) => (
                    <ConnectionLine key={`${connection.emotion}-${connection.symptom}`} connection={connection} index={index} />
                  ))}
                </div>
              </div>

              {/* Selected connection details */}
              <AnimatePresence>
                {selectedConnection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200"
                  >
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 capitalize">
                          {selectedConnection.emotion} → {selectedConnection.symptom.replace('_', ' ')}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Body region: <span className="capitalize font-medium">{selectedConnection.bodyRegion}</span> • 
                          Correlation strength: <span className="font-medium">{Math.round(selectedConnection.strength)}%</span>
                        </p>
                        {selectedConnection.insights.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700">Pattern Insights:</p>
                            <ul className="text-xs text-gray-600 mt-1">
                              {selectedConnection.insights.map((insight, index) => (
                                <li key={index} className="flex items-center space-x-1">
                                  <span>•</span>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/60 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyAnalysis.emotions.length}
                  </div>
                  <div className="text-xs text-gray-600">Emotions Tracked</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyAnalysis.symptoms.length}
                  </div>
                  <div className="text-xs text-gray-600">Body Symptoms</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyAnalysis.weekPattern.activeDays}
                  </div>
                  <div className="text-xs text-gray-600">Active Days</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                No Patterns This Week
              </h4>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Continue journaling with both emotions and physical symptoms to discover your mind-body connections.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}