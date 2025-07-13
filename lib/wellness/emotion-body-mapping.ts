/**
 * Emotion to Body Region Mapping System
 * Based on psychosomatic research and body-emotion correlations
 */

export interface EmotionIntensity {
  emotion: string;
  intensity: number; // 0-1 scale
  confidence: number; // 0-1 scale from BERT analysis
}

export interface BodyRegionData {
  region: string;
  intensity: number;
  primaryEmotions: string[];
  symptoms: string[];
  colorHex: string;
  description: string;
}

// Research-backed emotion to body part mapping
export const EMOTION_BODY_MAPPING = {
  // Stress & Anxiety Cluster
  stress: {
    regions: ['neck', 'shoulders', 'upper-back', 'jaw', 'forehead'],
    intensity_multiplier: 1.2,
    color_base: [255, 107, 107] // Warm red
  },
  anxiety: {
    regions: ['chest', 'stomach', 'throat', 'heart'],
    intensity_multiplier: 1.1,
    color_base: [255, 193, 7] // Amber yellow
  },
  worry: {
    regions: ['forehead', 'temples', 'neck', 'shoulders'],
    intensity_multiplier: 0.9,
    color_base: [255, 152, 0] // Orange
  },
  overwhelm: {
    regions: ['head', 'chest', 'shoulders', 'stomach'],
    intensity_multiplier: 1.3,
    color_base: [244, 67, 54] // Strong red
  },

  // Sadness & Depression Cluster  
  sadness: {
    regions: ['chest', 'heart', 'upper-back', 'shoulders'],
    intensity_multiplier: 1.0,
    color_base: [63, 81, 181] // Indigo blue
  },
  depression: {
    regions: ['chest', 'lower-back', 'neck', 'head'],
    intensity_multiplier: 1.1,
    color_base: [103, 58, 183] // Deep purple
  },
  grief: {
    regions: ['chest', 'heart', 'throat', 'stomach'],
    intensity_multiplier: 1.2,
    color_base: [33, 150, 243] // Blue
  },
  loneliness: {
    regions: ['chest', 'heart', 'arms'],
    intensity_multiplier: 0.8,
    color_base: [156, 39, 176] // Purple
  },

  // Anger & Frustration Cluster
  anger: {
    regions: ['jaw', 'neck', 'shoulders', 'fists', 'chest'],
    intensity_multiplier: 1.4,
    color_base: [244, 67, 54] // Red
  },
  frustration: {
    regions: ['temples', 'jaw', 'neck', 'shoulders'],
    intensity_multiplier: 1.1,
    color_base: [255, 87, 34] // Deep orange
  },
  irritation: {
    regions: ['forehead', 'jaw', 'neck'],
    intensity_multiplier: 0.9,
    color_base: [255, 152, 0] // Orange
  },
  rage: {
    regions: ['jaw', 'fists', 'chest', 'neck'],
    intensity_multiplier: 1.5,
    color_base: [183, 28, 28] // Dark red
  },

  // Fear & Panic Cluster
  fear: {
    regions: ['stomach', 'chest', 'heart', 'throat'],
    intensity_multiplier: 1.2,
    color_base: [158, 158, 158] // Gray
  },
  panic: {
    regions: ['chest', 'heart', 'stomach', 'throat'],
    intensity_multiplier: 1.4,
    color_base: [96, 125, 139] // Blue gray
  },

  // Positive Emotions Cluster
  joy: {
    regions: ['heart', 'chest', 'face'],
    intensity_multiplier: 0.7,
    color_base: [76, 175, 80] // Green
  },
  love: {
    regions: ['heart', 'chest', 'arms'],
    intensity_multiplier: 0.8,
    color_base: [233, 30, 99] // Pink
  },
  excitement: {
    regions: ['chest', 'stomach', 'heart'],
    intensity_multiplier: 0.9,
    color_base: [255, 193, 7] // Bright yellow
  },
  contentment: {
    regions: ['chest', 'heart'],
    intensity_multiplier: 0.6,
    color_base: [139, 195, 74] // Light green
  },
  pride: {
    regions: ['chest', 'shoulders', 'head'],
    intensity_multiplier: 0.8,
    color_base: [255, 152, 0] // Orange
  }
};

/**
 * Convert emotion analysis to body region intensity mapping
 */
export function mapEmotionsToBody(emotions: Record<string, number>): Record<string, BodyRegionData> {
  const bodyRegions: Record<string, BodyRegionData> = {};
  
  // Initialize all possible body regions
  const allRegions = new Set<string>();
  Object.values(EMOTION_BODY_MAPPING).forEach(mapping => {
    mapping.regions.forEach(region => allRegions.add(region));
  });
  
  allRegions.forEach(region => {
    bodyRegions[region] = {
      region,
      intensity: 0,
      primaryEmotions: [],
      symptoms: [],
      colorHex: '#E5E7EB', // Default gray
      description: ''
    };
  });

  // Process each detected emotion
  Object.entries(emotions).forEach(([emotion, confidence]) => {
    const emotionKey = emotion.toLowerCase().replace(/[^a-z]/g, '');
    const mapping = EMOTION_BODY_MAPPING[emotionKey as keyof typeof EMOTION_BODY_MAPPING];
    
    if (!mapping) return;
    
    const adjustedIntensity = confidence * mapping.intensity_multiplier;
    
    mapping.regions.forEach(region => {
      if (!bodyRegions[region]) return;
      
      // Use maximum intensity for overlapping regions
      if (adjustedIntensity > bodyRegions[region].intensity) {
        bodyRegions[region].intensity = Math.min(adjustedIntensity, 1.0);
        bodyRegions[region].primaryEmotions = [emotion, ...bodyRegions[region].primaryEmotions.slice(0, 2)];
        
        // Generate color based on emotion and intensity
        const [r, g, b] = mapping.color_base;
        const alpha = Math.min(adjustedIntensity * 0.8, 0.8);
        bodyRegions[region].colorHex = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        
        // Add contextual description
        bodyRegions[region].description = generateRegionDescription(region, emotion, adjustedIntensity);
      }
    });
  });

  return bodyRegions;
}

/**
 * Generate wellness-focused description for body regions
 */
function generateRegionDescription(region: string, emotion: string, intensity: number): string {
  const intensityLevel = intensity > 0.7 ? 'strong' : intensity > 0.4 ? 'moderate' : 'mild';
  
  const regionDescriptions: Record<string, string> = {
    'head': `${intensityLevel} mental tension from ${emotion}`,
    'neck': `${intensityLevel} neck tension, often from stress or worry`,
    'shoulders': `${intensityLevel} shoulder tension, carrying emotional weight`,
    'chest': `${intensityLevel} chest sensation, heart-centered emotions`,
    'stomach': `${intensityLevel} gut feeling, core emotional processing`,
    'heart': `${intensityLevel} heart-centered emotion`,
    'throat': `${intensityLevel} throat sensation, expression and communication`,
    'upper-back': `${intensityLevel} upper back tension, emotional support`,
    'lower-back': `${intensityLevel} lower back sensation, foundational support`,
    'jaw': `${intensityLevel} jaw tension, often from stress or anger`,
    'forehead': `${intensityLevel} forehead tension, mental stress`,
    'temples': `${intensityLevel} temple pressure, mental overwhelm`,
    'arms': `${intensityLevel} arm sensation, reaching and connection`,
    'fists': `${intensityLevel} hand tension, action and control`
  };
  
  return regionDescriptions[region] || `${intensityLevel} sensation in ${region}`;
}

/**
 * Generate symptom suggestions based on emotional body mapping
 */
export function generateSymptomSuggestions(bodyData: Record<string, BodyRegionData>): Record<string, boolean> {
  const symptoms: Record<string, boolean> = {};
  
  Object.values(bodyData).forEach(regionData => {
    if (regionData.intensity < 0.2) return; // Skip low intensity regions
    
    const region = regionData.region;
    const intensity = regionData.intensity;
    
    // Map body regions to common psychosomatic symptoms
    const regionSymptoms: Record<string, string[]> = {
      'head': ['headache', 'mental_fog', 'concentration_difficulty'],
      'neck': ['neck_stiffness', 'tension_headache', 'throat_tightness'],
      'shoulders': ['shoulder_tension', 'knots', 'upper_back_pain'],
      'chest': ['chest_tightness', 'rapid_heartbeat', 'shallow_breathing'],
      'stomach': ['stomach_butterflies', 'nausea', 'digestive_upset'],
      'heart': ['palpitations', 'chest_pressure', 'emotional_heaviness'],
      'throat': ['throat_constriction', 'difficulty_swallowing', 'voice_changes'],
      'jaw': ['jaw_clenching', 'teeth_grinding', 'facial_tension'],
      'back': ['back_tension', 'muscle_knots', 'posture_changes']
    };
    
    const applicableSymptoms = regionSymptoms[region] || [];
    applicableSymptoms.forEach(symptom => {
      // Higher intensity = higher likelihood of symptom
      symptoms[symptom] = intensity > 0.4;
    });
  });
  
  return symptoms;
}

/**
 * Color utility functions for wellness visualization
 */
export const ColorUtils = {
  /**
   * Convert intensity to wellness-appropriate color
   */
  intensityToColor(intensity: number, emotionType: 'positive' | 'negative' | 'neutral' = 'neutral'): string {
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    
    const colorPalettes = {
      positive: {
        low: [139, 195, 74], // Light green
        high: [76, 175, 80]  // Green
      },
      negative: {
        low: [255, 193, 7],  // Yellow
        high: [244, 67, 54]  // Red
      },
      neutral: {
        low: [158, 158, 158], // Light gray
        high: [96, 125, 139]  // Blue gray
      }
    };
    
    const palette = colorPalettes[emotionType];
    const [r1, g1, b1] = palette.low;
    const [r2, g2, b2] = palette.high;
    
    // Interpolate between low and high intensity colors
    const r = Math.round(r1 + (r2 - r1) * clampedIntensity);
    const g = Math.round(g1 + (g2 - g1) * clampedIntensity);
    const b = Math.round(b1 + (b2 - b1) * clampedIntensity);
    
    const alpha = Math.min(clampedIntensity * 0.8 + 0.2, 0.9);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * Get chakra-based color for holistic wellness visualization
   */
  getChakraColor(region: string): string {
    const chakraColors: Record<string, string> = {
      'head': '#9C27B0',      // Crown - Purple
      'forehead': '#673AB7',   // Third Eye - Indigo  
      'throat': '#2196F3',     // Throat - Blue
      'chest': '#4CAF50',      // Heart - Green
      'stomach': '#FF9800',    // Solar Plexus - Orange
      'lower-back': '#FF5722', // Sacral - Orange-Red
      'base': '#F44336'        // Root - Red
    };
    
    return chakraColors[region] || '#78909C'; // Blue gray default
  }
};