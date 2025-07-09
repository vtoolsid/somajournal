'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Heart,
  AlertTriangle,
  Sparkles,
  Info,
  Target,
  Zap,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalEntry } from '@/lib/store';

interface PsychosomaticBodyMapHeroProps {
  entries: JournalEntry[];
}

interface BodyRegion {
  id: string;
  name: string;
  displayName: string;
  emotions: string[];
  symptoms: string[];
  correlationScore: number;
  occurrences: number;
  recentPattern?: string;
  intensity: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EmotionSymptomConnection {
  emotion: string;
  symptom: string;
  bodyRegion: string;
  strength: number;
  frequency: number;
  lastOccurrence: Date;
}

// Enhanced body-emotion mapping based on Nummenmaa et al. research
const ENHANCED_BODY_MAP = {
  head: {
    displayName: 'Head & Brain',
    emotions: ['anger', 'fear', 'sadness', 'anxiety', 'stress', 'confusion', 'overwhelm', 'frustration'],
    symptoms: ['headache', 'tension', 'pressure', 'migraine', 'brain_fog', 'dizziness'],
    position: { x: 40, y: 15, width: 20, height: 25 },
    chakra: 'crown'
  },
  throat: {
    displayName: 'Throat & Voice',
    emotions: ['suppressed_anger', 'unexpressed_feelings', 'communication_anxiety', 'fear', 'shame'],
    symptoms: ['tightness', 'lump_sensation', 'voice_changes', 'throat_tension', 'difficulty_swallowing'],
    position: { x: 42, y: 45, width: 16, height: 12 },
    chakra: 'throat'
  },
  chest: {
    displayName: 'Heart & Lungs',
    emotions: ['love', 'joy', 'excitement', 'anxiety', 'sadness', 'grief', 'heartbreak', 'panic'],
    symptoms: ['tightness', 'heart_palpitations', 'breathing_difficulty', 'chest_pain', 'shallow_breathing'],
    position: { x: 35, y: 60, width: 30, height: 30 },
    chakra: 'heart'
  },
  stomach: {
    displayName: 'Gut & Digestion',
    emotions: ['anxiety', 'fear', 'nervousness', 'disgust', 'excitement', 'worry', 'intuition'],
    symptoms: ['nausea', 'butterflies', 'digestive_issues', 'stomach_knots', 'gut_instinct'],
    position: { x: 40, y: 95, width: 20, height: 25 },
    chakra: 'solar'
  },
  shoulders: {
    displayName: 'Shoulders & Burden',
    emotions: ['stress', 'tension', 'burden', 'responsibility', 'overwhelm', 'carrying_weight'],
    symptoms: ['muscle_tension', 'stiffness', 'knots', 'shoulder_pain', 'neck_strain'],
    position: { x: 20, y: 55, width: 15, height: 25 },
    chakra: 'heart'
  },
  back: {
    displayName: 'Back & Support',
    emotions: ['support_issues', 'burden', 'lack_of_support', 'stress', 'carrying_others'],
    symptoms: ['pain', 'tension', 'stiffness', 'lower_back_pain', 'spine_issues'],
    position: { x: 42, y: 70, width: 16, height: 40 },
    chakra: 'root'
  },
  pelvis: {
    displayName: 'Pelvis & Foundation',
    emotions: ['security', 'grounding', 'sexuality', 'creativity', 'survival_fears', 'stability'],
    symptoms: ['tension', 'reproductive_issues', 'lower_abdomen_pain', 'pelvic_floor_tension'],
    position: { x: 38, y: 115, width: 24, height: 20 },
    chakra: 'sacral'
  }
};

// Chakra colors for body regions
const CHAKRA_COLORS = {
  crown: '#9333EA',    // purple
  throat: '#3B82F6',   // blue  
  heart: '#10B981',    // green
  solar: '#F59E0B',    // yellow
  sacral: '#F97316',   // orange
  root: '#DC2626'      // red
};

export function PsychosomaticBodyMapHero({ entries }: PsychosomaticBodyMapHeroProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(true);

  // Analyze psychosomatic patterns
  const analysisData = useMemo(() => {
    const regionData: Record<string, BodyRegion> = {};
    const connections: EmotionSymptomConnection[] = [];

    // Initialize body regions
    Object.entries(ENHANCED_BODY_MAP).forEach(([regionId, regionInfo]) => {
      regionData[regionId] = {
        id: regionId,
        name: regionId,
        displayName: regionInfo.displayName,
        emotions: [],
        symptoms: [],
        correlationScore: 0,
        occurrences: 0,
        intensity: 0,
        x: regionInfo.position.x,
        y: regionInfo.position.y,
        width: regionInfo.position.width,
        height: regionInfo.position.height
      };
    });

    // Analyze entries for patterns
    entries.forEach(entry => {
      const entryEmotions = Object.entries(entry.emotions).filter(([_, intensity]) => intensity > 0.3);
      const entrySymptoms = Object.entries(entry.symptoms)
        .filter(([_, hasSymptom]) => hasSymptom)
        .map(([symptom]) => symptom);

      // Check each body region for correlations
      Object.entries(ENHANCED_BODY_MAP).forEach(([regionId, regionInfo]) => {
        const emotionMatches = entryEmotions.filter(([emotion]) => 
          regionInfo.emotions.some(regionEmotion => 
            emotion.toLowerCase().includes(regionEmotion) || 
            regionEmotion.includes(emotion.toLowerCase())
          )
        );

        const symptomMatches = entrySymptoms.filter(symptom =>
          regionInfo.symptoms.some(regionSymptom =>
            symptom.toLowerCase().includes(regionSymptom) ||
            regionSymptom.includes(symptom.toLowerCase())
          )
        );

        if (emotionMatches.length > 0 && symptomMatches.length > 0) {
          const region = regionData[regionId];
          region.occurrences++;
          
          // Track unique emotions and symptoms
          emotionMatches.forEach(([emotion, intensity]) => {
            if (!region.emotions.includes(emotion)) {
              region.emotions.push(emotion);
            }
            region.intensity = Math.max(region.intensity, intensity);
          });
          
          symptomMatches.forEach(symptom => {
            if (!region.symptoms.includes(symptom)) {
              region.symptoms.push(symptom);
            }
          });
          
          // Calculate correlation score
          region.correlationScore = Math.min(100, region.occurrences * 12 + region.intensity * 20);

          // Create connections
          emotionMatches.forEach(([emotion, intensity]) => {
            symptomMatches.forEach(symptom => {
              const existingConnection = connections.find(c => 
                c.emotion === emotion && c.symptom === symptom && c.bodyRegion === regionId
              );
              
              if (existingConnection) {
                existingConnection.frequency++;
                existingConnection.strength = Math.min(100, existingConnection.strength + intensity * 10);
                existingConnection.lastOccurrence = new Date(entry.createdAt);
              } else {
                connections.push({
                  emotion,
                  symptom,
                  bodyRegion: regionId,
                  strength: intensity * 50,
                  frequency: 1,
                  lastOccurrence: new Date(entry.createdAt)
                });
              }
            });
          });
        }
      });
    });

    // Generate recent patterns
    Object.values(regionData).forEach(region => {
      if (region.emotions.length > 0 && region.symptoms.length > 0) {
        const topEmotion = region.emotions[0];
        const topSymptom = region.symptoms[0].replace('_', ' ');
        region.recentPattern = `${topEmotion} → ${topSymptom}`;
      }
    });

    // Sort connections by strength
    connections.sort((a, b) => b.strength - a.strength);

    return {
      regions: Object.values(regionData).filter(region => region.occurrences > 0),
      connections: connections.slice(0, 10), // Top 10 connections
      topInsights: generateBodyInsights(Object.values(regionData), connections)
    };
  }, [entries]);

  // Generate insights based on patterns
  function generateBodyInsights(regions: BodyRegion[], connections: EmotionSymptomConnection[]) {
    const insights: string[] = [];
    
    if (connections.length === 0) {
      return ["Your body is ready to share its wisdom. Continue journaling to discover patterns."];
    }

    // Primary insight
    const strongestConnection = connections[0];
    if (strongestConnection) {
      const region = regions.find(r => r.id === strongestConnection.bodyRegion);
      insights.push(
        `Your body is telling you: ${strongestConnection.emotion} consistently manifests as ${strongestConnection.symptom.replace('_', ' ')} in your ${region?.displayName.toLowerCase()}.`
      );
    }

    // Pattern insight
    const regionWithMostCorrelations = regions.reduce((prev, current) => 
      current.correlationScore > prev.correlationScore ? current : prev
    );
    
    if (regionWithMostCorrelations.correlationScore > 30) {
      insights.push(
        `Your ${regionWithMostCorrelations.displayName.toLowerCase()} holds the most emotional tension, showing ${regionWithMostCorrelations.occurrences} significant patterns.`
      );
    }

    // Frequency insight
    const frequentConnections = connections.filter(c => c.frequency >= 3);
    if (frequentConnections.length > 0) {
      insights.push(
        `Recurring pattern detected: You have ${frequentConnections.length} consistent emotion-body connections that appear regularly.`
      );
    }

    return insights.slice(0, 3);
  }

  // SVG Body silhouette with enhanced detail
  const BodySilhouette = () => (
    <svg 
      width="100%" 
      height="400" 
      viewBox="0 0 100 160" 
      className="mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.9"/>
        </linearGradient>
        
        {/* Chakra color gradients */}
        {Object.entries(CHAKRA_COLORS).map(([chakra, color]) => (
          <radialGradient key={chakra} id={`${chakra}Gradient`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
          </radialGradient>
        ))}
      </defs>
      
      {/* Body outline */}
      <path
        d="M50 10 
           C45 10 40 15 40 20
           L38 30
           C36 35 35 40 35 45
           L32 50
           C28 55 25 60 25 65
           L25 85
           C25 90 28 95 32 100
           L35 110
           C35 115 38 120 40 125
           L42 135
           C42 140 45 145 48 150
           L50 155
           L52 150
           C55 145 58 140 58 135
           L60 125
           C62 120 65 115 65 110
           L68 100
           C72 95 75 90 75 85
           L75 65
           C75 60 72 55 68 50
           L65 45
           C65 40 64 35 62 30
           L60 20
           C60 15 55 10 50 10 Z"
        fill="url(#bodyGradient)"
        stroke="#CBD5E1"
        strokeWidth="0.5"
        className="transition-all duration-300"
      />

      {/* Render active body regions */}
      {analysisData.regions.map(region => {
        const isSelected = selectedRegion === region.id;
        const isHovered = hoveredRegion === region.id;
        const chakra = (ENHANCED_BODY_MAP as any)[region.id]?.chakra || 'heart';
        const intensity = Math.max(0.3, region.correlationScore / 100);
        
        return (
          <g key={region.id}>
            {/* Region highlight */}
            <ellipse
              cx={region.x}
              cy={region.y}
              rx={region.width / 2}
              ry={region.height / 2}
              fill={`url(#${chakra}Gradient)`}
              stroke={CHAKRA_COLORS[chakra as keyof typeof CHAKRA_COLORS]}
              strokeWidth={isSelected || isHovered ? 2 : 1}
              opacity={intensity}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected || isHovered ? 'animate-pulse' : ''
              }`}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => setSelectedRegion(isSelected ? null : region.id)}
            />
            
            {/* Correlation strength indicator */}
            <circle
              cx={region.x}
              cy={region.y - region.height / 2 - 3}
              r="2"
              fill={CHAKRA_COLORS[chakra as keyof typeof CHAKRA_COLORS]}
              opacity={intensity}
              className="animate-pulse"
            />
            
            {/* Region label on hover */}
            {isHovered && (
              <g>
                <rect
                  x={region.x - 15}
                  y={region.y + region.height / 2 + 2}
                  width="30"
                  height="8"
                  fill="rgba(0,0,0,0.8)"
                  rx="2"
                />
                <text
                  x={region.x}
                  y={region.y + region.height / 2 + 7}
                  textAnchor="middle"
                  fontSize="3"
                  fill="white"
                >
                  {region.correlationScore}%
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Connection lines when enabled */}
      {showConnections && analysisData.connections.slice(0, 5).map((connection, index) => {
        const region = analysisData.regions.find(r => r.id === connection.bodyRegion);
        if (!region) return null;
        
        const startX = 5 + index * 8;
        const startY = 20;
        const endX = region.x;
        const endY = region.y;
        
        return (
          <motion.path
            key={`${connection.emotion}-${connection.symptom}-${connection.bodyRegion}-${index}`}
            d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 - 10} ${endX} ${endY}`}
            stroke={CHAKRA_COLORS[(ENHANCED_BODY_MAP as any)[region.id]?.chakra as keyof typeof CHAKRA_COLORS] || '#10B981'}
            strokeWidth={Math.max(0.5, connection.strength / 50)}
            fill="none"
            opacity={0.6}
            className="animate-pulse"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: index * 0.2 }}
          />
        );
      })}
    </svg>
  );

  const selectedRegionData = selectedRegion ? 
    analysisData.regions.find(r => r.id === selectedRegion) : null;

  return (
    <Card className="psychosomatic-hero glass-card-primary w-full animate-fadeInUp">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Header with insights */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Your Body's Wisdom
                </h2>
                <p className="text-gray-600">
                  Real-time mind-body correlation analysis
                </p>
              </div>
            </div>

            {/* Primary insights */}
            <div className="max-w-4xl mx-auto">
              {analysisData.topInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3 }}
                  className={`insight-psychosomatic p-4 rounded-lg border-l-4 mb-3 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500' 
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Sparkles className={`w-5 h-5 mt-0.5 ${
                      index === 0 ? 'text-purple-600' : 'text-blue-600'
                    }`} />
                    <p className="text-gray-800 font-medium text-lg">
                      {insight}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Body map and details grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Body map - takes up 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  Interactive Body Map
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowConnections(!showConnections)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      showConnections 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {showConnections ? 'Hide' : 'Show'} Connections
                  </button>
                  <Badge variant="secondary" className="bg-white/60">
                    {analysisData.regions.length} active regions
                  </Badge>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
                <BodySilhouette />
              </div>
            </div>

            {/* Details panel */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Pattern Details
              </h3>
              
              {selectedRegionData ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-white/60 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {selectedRegionData.displayName}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Emotions:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRegionData.emotions.map(emotion => (
                            <Badge key={emotion} variant="outline" className="text-xs capitalize">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Symptoms:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRegionData.symptoms.map(symptom => (
                            <Badge key={symptom} variant="outline" className="text-xs">
                              {symptom.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Correlation Strength:</span>
                        <span className="text-lg font-bold text-purple-700">
                          {selectedRegionData.correlationScore}%
                        </span>
                      </div>
                      {selectedRegionData.recentPattern && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                          <p className="text-sm font-medium text-purple-800">
                            Recent Pattern:
                          </p>
                          <p className="text-sm text-purple-700">
                            {selectedRegionData.recentPattern}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white/40 rounded-lg p-6 text-center border border-gray-200">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">
                    Click on a highlighted body region to explore specific mind-body correlations
                  </p>
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysisData.connections.length}
                  </div>
                  <div className="text-xs text-gray-600">Total Connections</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(analysisData.regions.reduce((sum, r) => sum + r.correlationScore, 0) / analysisData.regions.length) || 0}%
                  </div>
                  <div className="text-xs text-gray-600">Avg Correlation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}