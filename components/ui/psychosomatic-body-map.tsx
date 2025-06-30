'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Brain, 
  Info,
  Zap,
  Wind,
  Sparkles,
  Activity
} from 'lucide-react';

interface BodyRegion {
  id: string;
  name: string;
  path: string;
  intensity: 'none' | 'low' | 'moderate' | 'high' | 'very_high';
  description: string;
}

interface PsychosomaticBodyMapProps {
  emotions: Array<{
    emotion: string;
    confidence: number;
  }>;
  psychosomaticData?: {
    psychosomatic_analysis?: {
      primary_regions?: string[];
      intensity?: string;
      sensation_type?: string;
      bodily_sensations?: string;
    };
    personalized_insights?: {
      personalized_psychosomatic?: string;
    };
  };
  className?: string;
}

// Body regions mapping based on Nummenmaa research
const BODY_REGIONS: Record<string, BodyRegion> = {
  head: {
    id: 'head',
    name: 'Head & Brain',
    path: 'M150,50 C170,40 180,40 200,50 C210,60 210,80 200,100 C180,110 170,110 150,100 C140,80 140,60 150,50Z',
    intensity: 'none',
    description: 'Cognitive processing, alertness, mental sensations'
  },
  face: {
    id: 'face',
    name: 'Face & Expression',
    path: 'M155,60 C175,55 185,55 195,60 C200,70 200,85 195,95 C185,100 175,100 155,95 C150,85 150,70 155,60Z',
    intensity: 'none',
    description: 'Facial expressions, heat, blushing, tension'
  },
  throat: {
    id: 'throat',
    name: 'Throat & Neck',
    path: 'M160,100 C180,95 190,95 190,105 C190,115 180,120 175,125 C165,125 155,120 160,105Z',
    intensity: 'none',
    description: 'Throat sensations, swallowing, communication'
  },
  chest: {
    id: 'chest',
    name: 'Chest & Heart',
    path: 'M135,125 C155,120 195,120 215,125 C220,140 220,160 215,175 C195,180 155,180 135,175 C130,160 130,140 135,125Z',
    intensity: 'none',
    description: 'Heart area, breathing, emotional center'
  },
  upper_chest: {
    id: 'upper_chest',
    name: 'Upper Chest',
    path: 'M140,125 C160,122 190,122 210,125 C212,135 212,145 210,155 C190,158 160,158 140,155 C138,145 138,135 140,125Z',
    intensity: 'none',
    description: 'Upper respiratory area, heart sensations'
  },
  stomach: {
    id: 'stomach',
    name: 'Stomach & Abdomen',
    path: 'M145,175 C165,170 185,170 205,175 C210,190 210,210 205,225 C185,230 165,230 145,225 C140,210 140,190 145,175Z',
    intensity: 'none',
    description: 'Digestive system, butterflies, gut feelings'
  },
  digestive_system: {
    id: 'digestive_system',
    name: 'Digestive System',
    path: 'M150,185 C170,182 180,182 200,185 C205,200 205,215 200,220 C180,223 170,223 150,220 C145,215 145,200 150,185Z',
    intensity: 'none',
    description: 'Intestinal sensations, digestive responses'
  },
  arms: {
    id: 'arms',
    name: 'Arms & Shoulders',
    path: 'M90,125 C110,120 130,130 135,150 C135,170 130,180 110,185 C90,180 85,170 85,150 C85,130 90,125 90,125Z M215,125 C235,120 255,130 260,150 C260,170 255,180 235,185 C215,180 210,170 210,150 C210,130 215,125 215,125Z',
    intensity: 'none',
    description: 'Arm activation, shoulder tension, reaching energy'
  },
  hands: {
    id: 'hands',
    name: 'Hands & Fists',
    path: 'M75,180 C85,175 95,180 100,190 C100,200 95,205 85,210 C75,205 70,200 70,190 C70,180 75,180 75,180Z M250,180 C260,175 270,180 275,190 C275,200 270,205 260,210 C250,205 245,200 245,190 C245,180 250,180 250,180Z',
    intensity: 'none',
    description: 'Hand sensations, gripping, trembling'
  },
  limbs: {
    id: 'limbs',
    name: 'Arms & Legs',
    path: 'M90,125 C110,120 130,130 135,150 C135,220 130,280 110,320 C90,315 85,305 85,280 C85,220 90,125 90,125Z M215,125 C235,120 255,130 260,150 C260,220 255,280 235,320 C215,315 210,305 210,280 C210,220 215,125 215,125Z M140,225 C160,220 190,220 210,225 C212,250 212,280 210,320 C190,325 160,325 140,320 C138,280 138,250 140,225Z',
    intensity: 'none',
    description: 'Overall limb sensations, energy levels'
  },
  full_body: {
    id: 'full_body',
    name: 'Whole Body',
    path: 'M150,50 C200,40 250,60 270,120 C275,180 270,240 250,300 C230,330 200,340 175,340 C150,340 120,330 100,300 C80,240 75,180 80,120 C100,60 150,40 150,50Z',
    intensity: 'none',
    description: 'Full-body activation, overall energy'
  },
  heart: {
    id: 'heart',
    name: 'Heart Center',
    path: 'M165,135 C170,130 180,130 185,135 C185,145 180,155 175,160 C170,155 165,145 165,135Z',
    intensity: 'none',
    description: 'Heart center, love, warmth, connection'
  },
  lungs: {
    id: 'lungs',
    name: 'Lungs & Breathing',
    path: 'M145,130 C155,125 165,130 165,140 C165,150 155,155 145,150 C140,145 140,135 145,130Z M185,130 C195,125 205,130 205,140 C205,150 195,155 185,150 C180,145 180,135 185,130Z',
    intensity: 'none',
    description: 'Breathing patterns, respiratory sensations'
  },
  spine: {
    id: 'spine',
    name: 'Spine & Posture',
    path: 'M175,100 C177,120 177,140 175,160 C175,180 177,200 175,220 C175,240 177,260 175,280 C175,300 177,320 175,340',
    intensity: 'none',
    description: 'Spinal alignment, posture, backbone strength'
  },
  shoulders: {
    id: 'shoulders',
    name: 'Shoulders',
    path: 'M125,125 C140,120 155,125 165,130 C155,135 140,135 125,130Z M185,130 C195,125 210,120 225,125 C225,130 210,135 195,135 C185,135 185,130 185,130Z',
    intensity: 'none',
    description: 'Shoulder tension, carrying weight, relief'
  }
};

// Emotion to body region mapping
const EMOTION_BODY_MAPPING: Record<string, string[]> = {
  anger: ['chest', 'head', 'arms', 'hands'],
  fear: ['chest', 'heart', 'lungs', 'upper_chest'],
  disgust: ['throat', 'stomach', 'digestive_system'],
  joy: ['full_body', 'head', 'chest', 'heart'],
  sadness: ['chest', 'head', 'limbs'],
  surprise: ['head', 'upper_chest'],
  excitement: ['full_body', 'chest', 'heart'],
  love: ['chest', 'heart', 'full_body'],
  nervousness: ['chest', 'stomach', 'hands'],
  embarrassment: ['face', 'head', 'stomach'],
  curiosity: ['head', 'chest'],
  confusion: ['head'],
  desire: ['chest', 'stomach'],
  neutral: []
};

// Intensity color mapping
const INTENSITY_COLORS = {
  none: 'transparent',
  low: 'rgba(59, 130, 246, 0.2)',      // Blue with low opacity
  moderate: 'rgba(59, 130, 246, 0.4)',  // Blue with moderate opacity  
  high: 'rgba(239, 68, 68, 0.6)',       // Red with high opacity
  very_high: 'rgba(239, 68, 68, 0.8)'   // Red with very high opacity
};

const INTENSITY_DESCRIPTIONS = {
  none: 'No significant sensation',
  low: 'Subtle awareness',
  moderate: 'Noticeable sensations',
  high: 'Strong sensations',
  very_high: 'Intense sensations'
};

export function PsychosomaticBodyMap({ 
  emotions, 
  psychosomaticData, 
  className = '' 
}: PsychosomaticBodyMapProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [bodyRegions, setBodyRegions] = useState<Record<string, BodyRegion>>(BODY_REGIONS);
  const [showLegend, setShowLegend] = useState(true);

  // Update body regions based on emotions and psychosomatic data
  useEffect(() => {
    if (!emotions || emotions.length === 0) {
      setBodyRegions(BODY_REGIONS);
      return;
    }

    const updatedRegions = { ...BODY_REGIONS };

    // Reset all regions
    Object.keys(updatedRegions).forEach(regionId => {
      updatedRegions[regionId].intensity = 'none';
    });

    // Apply emotions to regions
    emotions.forEach(({ emotion, confidence }) => {
      const regions = EMOTION_BODY_MAPPING[emotion.toLowerCase()] || [];
      
      regions.forEach(regionId => {
        if (updatedRegions[regionId]) {
          // Map confidence to intensity
          let intensity: 'none' | 'low' | 'moderate' | 'high' | 'very_high' = 'none';
          
          if (confidence >= 0.8) intensity = 'very_high';
          else if (confidence >= 0.6) intensity = 'high';
          else if (confidence >= 0.4) intensity = 'moderate';
          else if (confidence >= 0.2) intensity = 'low';

          // Take the highest intensity for each region
          const currentIntensity = updatedRegions[regionId].intensity;
          const intensityLevels = ['none', 'low', 'moderate', 'high', 'very_high'];
          const currentLevel = intensityLevels.indexOf(currentIntensity);
          const newLevel = intensityLevels.indexOf(intensity);
          
          if (newLevel > currentLevel) {
            updatedRegions[regionId].intensity = intensity;
          }
        }
      });
    });

    // Override with specific psychosomatic data if available
    if (psychosomaticData?.psychosomatic_analysis?.primary_regions) {
      const primaryRegions = psychosomaticData.psychosomatic_analysis.primary_regions;
      const overallIntensity = psychosomaticData.psychosomatic_analysis.intensity || 'moderate';
      
      primaryRegions.forEach(regionName => {
        const regionId = regionName.toLowerCase().replace(/[^a-z_]/g, '_');
        if (updatedRegions[regionId]) {
          updatedRegions[regionId].intensity = overallIntensity as any;
        }
      });
    }

    setBodyRegions(updatedRegions);
  }, [emotions, psychosomaticData]);

  const primaryEmotion = emotions && emotions.length > 0 ? emotions[0].emotion : 'neutral';
  const researchBasis = psychosomaticData?.psychosomatic_analysis ? 'Nummenmaa et al. 2014' : 'General patterns';

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-800">Psychosomatic Body Map</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                  Evidence-based
                </Badge>
                <span className="text-xs text-slate-500">{researchBasis}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
            className="text-slate-600"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
        
        {psychosomaticData?.psychosomatic_analysis?.bodily_sensations && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-slate-700">
              <strong>Primary Pattern:</strong> {psychosomaticData.psychosomatic_analysis.bodily_sensations}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Interactive Body Diagram */}
        <div className="relative">
          <svg
            viewBox="0 0 350 400" 
            className="w-full h-64 border border-slate-200 rounded-lg bg-gradient-to-b from-slate-50 to-white"
          >
            {/* Body outline */}
            <path
              d="M175,50 C200,40 230,50 250,80 C260,120 255,160 250,200 C245,240 240,280 235,320 C230,340 220,350 200,360 C180,365 170,365 150,360 C130,350 120,340 115,320 C110,280 105,240 100,200 C95,160 90,120 100,80 C120,50 150,40 175,50Z"
              fill="rgba(203, 213, 225, 0.1)"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="1"
            />
            
            {/* Render active body regions */}
            {Object.entries(bodyRegions).map(([regionId, region]) => (
              <g key={regionId}>
                <path
                  d={region.path}
                  fill={INTENSITY_COLORS[region.intensity]}
                  stroke={region.intensity !== 'none' ? 'rgba(59, 130, 246, 0.6)' : 'transparent'}
                  strokeWidth={region.intensity !== 'none' ? '1' : '0'}
                  className="cursor-pointer transition-all duration-300 hover:opacity-80"
                  onMouseEnter={() => setActiveRegion(regionId)}
                  onMouseLeave={() => setActiveRegion(null)}
                />
                
                {/* Region labels for active areas */}
                {region.intensity !== 'none' && (
                  <circle
                    cx="175"
                    cy="200"
                    r="2"
                    fill="rgba(59, 130, 246, 0.8)"
                    className="animate-pulse"
                  />
                )}
              </g>
            ))}

            {/* Central heart icon for heart-centered emotions */}
            {['love', 'gratitude', 'caring'].includes(primaryEmotion) && (
              <g>
                <Heart 
                  x="170" 
                  y="145" 
                  width="10" 
                  height="10" 
                  className="text-red-500 animate-pulse"
                />
              </g>
            )}
          </svg>
          
          {/* Active region tooltip */}
          {activeRegion && (
            <div className="absolute top-2 left-2 bg-white rounded-lg shadow-lg border border-slate-200 p-3 max-w-xs z-10">
              <h4 className="font-semibold text-slate-800 text-sm">
                {bodyRegions[activeRegion].name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {bodyRegions[activeRegion].description}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ 
                    backgroundColor: INTENSITY_COLORS[bodyRegions[activeRegion].intensity],
                    borderColor: 'rgba(148, 163, 184, 0.5)'
                  }}
                />
                <span className="text-xs text-slate-500">
                  {INTENSITY_DESCRIPTIONS[bodyRegions[activeRegion].intensity]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Intensity Legend */}
        {showLegend && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Sensation Intensity</h4>
              <div className="space-y-1">
                {Object.entries(INTENSITY_COLORS).map(([intensity, color]) => (
                  <div key={intensity} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-slate-600 capitalize">
                      {intensity.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Research Foundation</h4>
              <p className="text-slate-600 leading-relaxed">
                Based on Nummenmaa et al. "Bodily maps of emotions" research, 
                showing where emotions are commonly felt in the body.
              </p>
            </div>
          </div>
        )}

        {/* Personalized insights */}
        {psychosomaticData?.personalized_insights?.personalized_psychosomatic && (
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-purple-800 text-sm mb-1">
                  Personalized Insight
                </h4>
                <p className="text-sm text-purple-700">
                  {psychosomaticData.personalized_insights.personalized_psychosomatic}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}