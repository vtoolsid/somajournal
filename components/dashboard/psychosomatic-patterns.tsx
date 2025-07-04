'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Heart,
  AlertTriangle,
  User,
  TrendingUp,
  Info,
  Eye,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalEntry } from '@/lib/store';

interface PsychosomaticPatternsProps {
  entries: JournalEntry[];
}

interface BodyRegion {
  id: string;
  name: string;
  emotions: string[];
  symptoms: string[];
  correlationScore: number;
  occurrences: number;
  x: number; // SVG position
  y: number; // SVG position
}

interface SymptomCorrelation {
  symptom: string;
  emotions: string[];
  frequency: number;
  intensity: number;
  bodyRegions: string[];
}

// Based on Nummenmaa et al. research on bodily sensation maps
const BODY_EMOTION_MAP = {
  head: {
    emotions: ['anger', 'fear', 'sadness', 'anxiety', 'stress', 'confusion'],
    symptoms: ['headache', 'tension', 'pressure'],
    position: { x: 150, y: 30 }
  },
  chest: {
    emotions: ['love', 'joy', 'excitement', 'anxiety', 'sadness', 'grief'],
    symptoms: ['tightness', 'heart_palpitations', 'breathing_difficulty'],
    position: { x: 150, y: 80 }
  },
  stomach: {
    emotions: ['anxiety', 'fear', 'nervousness', 'disgust', 'excitement'],
    symptoms: ['nausea', 'butterflies', 'digestive_issues'],
    position: { x: 150, y: 120 }
  },
  shoulders: {
    emotions: ['stress', 'tension', 'burden', 'responsibility', 'overwhelm'],
    symptoms: ['muscle_tension', 'stiffness', 'knots'],
    position: { x: 110, y: 70 }
  },
  throat: {
    emotions: ['suppressed_anger', 'unexpressed_feelings', 'communication_anxiety'],
    symptoms: ['tightness', 'lump_sensation', 'voice_changes'],
    position: { x: 150, y: 60 }
  },
  back: {
    emotions: ['support_issues', 'burden', 'lack_of_support', 'stress'],
    symptoms: ['pain', 'tension', 'stiffness'],
    position: { x: 150, y: 100 }
  }
};

export function PsychosomaticPatterns({ entries }: PsychosomaticPatternsProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Analyze correlations between emotions and symptoms
  const correlationData = useMemo(() => {
    const regionData: Record<string, BodyRegion> = {};
    const symptomCorrelations: Record<string, SymptomCorrelation> = {};

    // Initialize body regions
    Object.entries(BODY_EMOTION_MAP).forEach(([regionId, regionInfo]) => {
      regionData[regionId] = {
        id: regionId,
        name: regionId.charAt(0).toUpperCase() + regionId.slice(1),
        emotions: [],
        symptoms: [],
        correlationScore: 0,
        occurrences: 0,
        x: regionInfo.position.x,
        y: regionInfo.position.y
      };
    });

    // Analyze entries for correlations
    entries.forEach(entry => {
      const entryEmotions = Object.keys(entry.emotions);
      const entrySymptoms = Object.entries(entry.symptoms)
        .filter(([_, hasSymptom]) => hasSymptom)
        .map(([symptom]) => symptom);

      // Check each body region for correlations
      Object.entries(BODY_EMOTION_MAP).forEach(([regionId, regionInfo]) => {
        const emotionMatches = entryEmotions.filter(emotion => 
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
          region.emotions = Array.from(new Set([...region.emotions, ...emotionMatches]));
          region.symptoms = Array.from(new Set([...region.symptoms, ...symptomMatches]));
          
          // Calculate correlation score based on frequency and co-occurrence
          region.correlationScore = Math.min(100, region.occurrences * 15);
        }

        // Track symptom correlations
        symptomMatches.forEach(symptom => {
          if (!symptomCorrelations[symptom]) {
            symptomCorrelations[symptom] = {
              symptom,
              emotions: [],
              frequency: 0,
              intensity: 0,
              bodyRegions: []
            };
          }

          const correlation = symptomCorrelations[symptom];
          correlation.frequency++;
          correlation.emotions = Array.from(new Set([...correlation.emotions, ...emotionMatches]));
          correlation.bodyRegions = Array.from(new Set([...correlation.bodyRegions, regionId]));
          
          // Calculate average intensity from emotions
          const emotionIntensities = emotionMatches.map(emotion => entry.emotions[emotion] || 0);
          correlation.intensity = emotionIntensities.reduce((sum, intensity) => sum + intensity, 0) / emotionIntensities.length;
        });
      });
    });

    return {
      regions: Object.values(regionData).filter(region => region.occurrences > 0),
      symptoms: Object.values(symptomCorrelations).sort((a, b) => b.frequency - a.frequency)
    };
  }, [entries]);

  // Body silhouette SVG component
  const BodySilhouette = () => (
    <svg 
      width="300" 
      height="400" 
      viewBox="0 0 300 400" 
      className="mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F3F4F6" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#E5E7EB" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      
      {/* Body outline */}
      <path
        d="M150 20 C160 20 170 30 170 45 L175 60 C180 65 185 70 185 80 L190 120 C190 130 185 140 175 150 L170 200 C170 220 165 240 160 260 L155 320 C155 340 150 360 145 380 L155 380 C155 385 150 390 145 390 L135 390 C130 390 125 385 125 380 L135 380 C135 360 130 340 125 320 L120 260 C115 240 110 220 110 200 L105 150 C95 140 90 130 90 120 L95 80 C95 70 100 65 105 60 L110 45 C110 30 120 20 130 20 Z"
        fill="url(#bodyGradient)"
        stroke="#D1D5DB"
        strokeWidth="2"
      />
      
      {/* Head */}
      <circle
        cx="150"
        cy="35"
        r="15"
        fill="url(#bodyGradient)"
        stroke="#D1D5DB"
        strokeWidth="2"
      />

      {/* Render body regions as interactive areas */}
      {correlationData.regions.map(region => {
        const isSelected = selectedRegion === region.id;
        const isHovered = hoveredRegion === region.id;
        const opacity = Math.max(0.3, region.correlationScore / 100);
        
        return (
          <g key={region.id}>
            <circle
              cx={region.x}
              cy={region.y}
              r={isSelected || isHovered ? 20 : 15}
              fill={`rgba(239, 68, 68, ${opacity})`}
              stroke={isSelected ? "#DC2626" : "#EF4444"}
              strokeWidth={isSelected ? 3 : 2}
              className="cursor-pointer transition-all duration-300 hover:stroke-red-600"
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => setSelectedRegion(isSelected ? null : region.id)}
            />
            <text
              x={region.x}
              y={region.y + 35}
              textAnchor="middle"
              fontSize="12"
              fill="#374151"
              className="pointer-events-none"
            >
              {region.correlationScore}%
            </text>
          </g>
        );
      })}
    </svg>
  );

  const selectedRegionData = selectedRegion ? 
    correlationData.regions.find(r => r.id === selectedRegion) : null;

  return (
    <Card className="glass-card-secondary animate-fadeInUp animate-delay-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Psychosomatic Patterns
              </CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                Mind-body emotion correlations
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/60 text-red-700">
            {correlationData.regions.length} regions
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {correlationData.regions.length > 0 ? (
            <>
              {/* Body visualization */}
              <div className="relative">
                <div className="text-center mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Body Sensation Map
                  </h4>
                  <p className="text-xs text-gray-500">
                    Click regions to explore correlations
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                  <BodySilhouette />
                </div>
              </div>

              {/* Selected region details */}
              <AnimatePresence>
                {selectedRegionData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 rounded-lg p-4 border border-red-200"
                  >
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 capitalize">
                          {selectedRegionData.name} Region
                        </h5>
                        <div className="mt-2 space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-700">Associated Emotions:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedRegionData.emotions.map(emotion => (
                                <Badge key={emotion} variant="outline" className="text-xs capitalize">
                                  {emotion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700">Physical Symptoms:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedRegionData.symptoms.map(symptom => (
                                <Badge key={symptom} variant="outline" className="text-xs capitalize">
                                  {symptom.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-red-200">
                            <span className="text-xs text-gray-600">Correlation Strength:</span>
                            <span className="text-sm font-semibold text-red-700">
                              {selectedRegionData.correlationScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top symptom correlations */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-600" />
                  Most Common Patterns
                </h4>
                {correlationData.symptoms.slice(0, 3).map((correlation, index) => (
                  <div key={correlation.symptom} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800 capitalize">
                        {correlation.symptom.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-gray-600">
                        with {correlation.emotions.slice(0, 2).join(', ')}
                        {correlation.emotions.length > 2 && ` +${correlation.emotions.length - 2} more`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-800">
                        {correlation.frequency}x
                      </span>
                      <p className="text-xs text-gray-500">
                        {Math.round(correlation.intensity * 100)}% intensity
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">Research Insight</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      Based on Nummenmaa et al. bodily sensation mapping research. 
                      Your patterns show strongest correlations in {correlationData.regions[0]?.name?.toLowerCase()} region.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Journal more entries to discover your mind-body patterns
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}