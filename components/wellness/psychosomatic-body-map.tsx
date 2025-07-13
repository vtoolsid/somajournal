'use client';

import React, { useState, useEffect } from 'react';
import Model from 'react-body-highlighter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Activity } from 'lucide-react';

// Define body regions mapped to psychosomatic symptoms
export interface BodyRegion {
  muscle: string;
  label: string;
  emotions: string[];
  commonSymptoms: string[];
}

// Emotion to body region mapping based on research
export const EMOTION_BODY_MAP: Record<string, string[]> = {
  // Stress & Anxiety
  'stress': ['neck', 'shoulders', 'upperBack', 'jaw'],
  'anxiety': ['chest', 'stomach', 'heart', 'throat'],
  'worry': ['forehead', 'temples', 'neck', 'shoulders'],
  'nervousness': ['stomach', 'chest', 'hands'],
  
  // Sadness & Depression
  'sadness': ['chest', 'heart', 'upperBack', 'shoulders'],
  'depression': ['chest', 'lowerBack', 'neck', 'head'],
  'grief': ['chest', 'heart', 'throat', 'stomach'],
  'loneliness': ['chest', 'heart', 'arms'],
  
  // Anger & Frustration
  'anger': ['jaw', 'neck', 'shoulders', 'fists', 'chest'],
  'frustration': ['temples', 'jaw', 'neck', 'shoulders'],
  'irritation': ['forehead', 'jaw', 'neck'],
  'rage': ['jaw', 'fists', 'chest', 'neck'],
  
  // Fear & Panic
  'fear': ['stomach', 'chest', 'heart', 'throat'],
  'panic': ['chest', 'heart', 'stomach', 'throat'],
  'overwhelm': ['head', 'chest', 'shoulders', 'stomach'],
  
  // Positive Emotions
  'joy': ['heart', 'chest', 'face'],
  'love': ['heart', 'chest', 'arms'],
  'excitement': ['chest', 'stomach', 'heart'],
  'pride': ['chest', 'shoulders', 'head']
};

// Body region definitions with wellness-focused labeling
export const BODY_REGIONS: Record<string, BodyRegion> = {
  head: {
    muscle: 'head',
    label: 'Head & Mind',
    emotions: ['overwhelm', 'worry', 'concentration'],
    commonSymptoms: ['headaches', 'mental fog', 'tension']
  },
  neck: {
    muscle: 'neck',
    label: 'Neck & Throat',
    emotions: ['stress', 'communication', 'expression'],
    commonSymptoms: ['tension', 'stiffness', 'throat tightness']
  },
  shoulders: {
    muscle: 'shoulders',
    label: 'Shoulders',
    emotions: ['burden', 'responsibility', 'stress'],
    commonSymptoms: ['tension', 'knots', 'carrying weight']
  },
  chest: {
    muscle: 'chest',
    label: 'Heart & Chest',
    emotions: ['love', 'sadness', 'anxiety', 'breathing'],
    commonSymptoms: ['tightness', 'rapid heartbeat', 'shallow breathing']
  },
  stomach: {
    muscle: 'abs',
    label: 'Core & Stomach',
    emotions: ['fear', 'anxiety', 'gut feelings'],
    commonSymptoms: ['butterflies', 'nausea', 'digestive issues']
  },
  back: {
    muscle: 'upper-back',
    label: 'Upper Back',
    emotions: ['support', 'strength', 'carrying load'],
    commonSymptoms: ['tension', 'knots', 'stiffness']
  },
  lowerBack: {
    muscle: 'lower-back',
    label: 'Lower Back',
    emotions: ['support', 'foundation', 'stability'],
    commonSymptoms: ['pain', 'tension', 'weakness']
  }
};

interface PsychosomaticBodyMapProps {
  emotions?: Record<string, number>; // emotion name -> intensity (0-1)
  symptoms?: Record<string, boolean>; // symptom name -> present/absent
  onRegionClick?: (region: string, data: BodyRegion) => void;
  className?: string;
  interactive?: boolean;
}

export function PsychosomaticBodyMap({
  emotions = {},
  symptoms = {},
  onRegionClick,
  className = '',
  interactive = true
}: PsychosomaticBodyMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [highlightedMuscles, setHighlightedMuscles] = useState<Record<string, string>>({});

  // Calculate intensity for each body region based on emotions
  useEffect(() => {
    const muscleIntensities: Record<string, string> = {};
    
    // Process each emotion and map to body regions
    Object.entries(emotions).forEach(([emotion, intensity]) => {
      const bodyRegions = EMOTION_BODY_MAP[emotion.toLowerCase()] || [];
      
      bodyRegions.forEach(region => {
        const bodyRegion = Object.values(BODY_REGIONS).find(br => 
          br.muscle === region || br.label.toLowerCase().includes(region)
        );
        
        if (bodyRegion) {
          const currentIntensity = muscleIntensities[bodyRegion.muscle] 
            ? parseFloat(muscleIntensities[bodyRegion.muscle]) 
            : 0;
          
          // Use the highest intensity for overlapping regions
          const newIntensity = Math.max(currentIntensity, intensity);
          
          // Convert intensity to color (0-1 -> rgba)
          const alpha = Math.min(newIntensity * 0.8, 0.8); // Cap at 80% opacity
          muscleIntensities[bodyRegion.muscle] = `rgba(59, 130, 246, ${alpha})`; // Blue gradient
        }
      });
    });

    setHighlightedMuscles(muscleIntensities);
  }, [emotions]);

  const handleClick = (muscle: { name: string; pathData: string }) => {
    if (!interactive) return;
    
    const regionData = Object.values(BODY_REGIONS).find(region => 
      region.muscle === muscle.name
    );
    
    if (regionData) {
      setSelectedRegion(muscle.name);
      onRegionClick?.(muscle.name, regionData);
    }
  };

  const getIntensityLevel = (muscle: string): string => {
    const region = Object.values(BODY_REGIONS).find(r => r.muscle === muscle);
    if (!region) return 'none';
    
    const relatedEmotions = Object.entries(emotions).filter(([emotion]) => 
      EMOTION_BODY_MAP[emotion.toLowerCase()]?.includes(muscle)
    );
    
    if (relatedEmotions.length === 0) return 'none';
    
    const maxIntensity = Math.max(...relatedEmotions.map(([, intensity]) => intensity));
    
    if (maxIntensity > 0.7) return 'high';
    if (maxIntensity > 0.4) return 'medium';
    if (maxIntensity > 0.1) return 'low';
    return 'none';
  };

  const getActiveEmotions = (muscle: string): string[] => {
    return Object.entries(emotions)
      .filter(([emotion, intensity]) => 
        intensity > 0.1 && EMOTION_BODY_MAP[emotion.toLowerCase()]?.includes(muscle)
      )
      .map(([emotion]) => emotion);
  };

  return (
    <div className={`psychosomatic-body-map ${className}`}>
      {/* Body Map Visualization */}
      <Card className="border-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center space-x-2 text-lg">
            <Heart className="w-5 h-5 text-green-600" />
            <span>Mind-Body Connection Map</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex justify-center">
          <div className="relative">
            <Model
              data={Object.keys(highlightedMuscles).map(muscle => ({
                name: muscle,
                color: highlightedMuscles[muscle] || 'rgba(229, 231, 235, 0.3)'
              }))}
              onClick={handleClick}
              highlightedColors={highlightedMuscles}
              style={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto'
              }}
              aria-label="Interactive body map showing emotion-related physical sensations"
              role="img"
            />
            
            {/* Overlay for selected region info */}
            {selectedRegion && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-48">
                <h4 className="font-medium text-sm text-gray-800 mb-1">
                  {BODY_REGIONS[selectedRegion]?.label || selectedRegion}
                </h4>
                <div className="space-y-1">
                  {getActiveEmotions(selectedRegion).slice(0, 3).map(emotion => (
                    <Badge key={emotion} variant="secondary" className="text-xs">
                      {emotion}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {getIntensityLevel(selectedRegion)} intensity
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="mt-4 flex justify-center">
        <Card className="border-0 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span>Emotional Impact</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                  <span className="text-xs">Low</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-xs">High</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500" />
                <span className="text-xs">Click regions for details</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .psychosomatic-body-map .rbh-container {
          transition: all 0.3s ease;
        }
        
        .psychosomatic-body-map svg {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        .psychosomatic-body-map svg path:hover {
          stroke: rgba(59, 130, 246, 0.8);
          stroke-width: 2;
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}

export default PsychosomaticBodyMap;