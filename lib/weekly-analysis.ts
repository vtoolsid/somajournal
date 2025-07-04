import { JournalEntry } from './store';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  format,
  differenceInDays,
  subWeeks
} from 'date-fns';

// Emotion categorization for high/low analysis
export const POSITIVE_EMOTIONS = [
  'joy', 'happiness', 'excitement', 'gratitude', 'love', 'peace', 
  'contentment', 'satisfaction', 'enthusiasm', 'optimism', 'pride',
  'amusement', 'relief', 'admiration', 'awe', 'caring', 'calm',
  'centered', 'motivated', 'peaceful', 'connected', 'wise', 'resilient',
  'transformative', 'grateful', 'nostalgic'
];

export const NEGATIVE_EMOTIONS = [
  'sadness', 'anger', 'fear', 'anxiety', 'frustration', 'disappointment',
  'disgust', 'embarrassment', 'grief', 'guilt', 'nervousness', 'remorse',
  'shame', 'confusion', 'annoyance', 'disapproval', 'stress', 'regret',
  'distant', 'sad', 'uncomfortable'
];

export interface EmotionalHighLow {
  type: 'high' | 'low';
  emotion: string;
  intensity: number;
  date: Date;
  context: string;
  triggers?: string[];
  bodyRegions?: string[];
}

export interface WeeklyEmotionalAnalysis {
  weekStart: Date;
  weekEnd: Date;
  emotionalHighs: EmotionalHighLow[];
  emotionalLows: EmotionalHighLow[];
  volatilityScore: number;
  trendDirection: 'improving' | 'declining' | 'stable';
  dominantPatterns: {
    highPattern: string;
    lowPattern: string;
    peakDay: string;
    valleyDay: string;
  };
  recommendations: string[];
  psychosomaticCorrelations: {
    emotion: string;
    symptoms: string[];
    frequency: number;
  }[];
}

export class WeeklyTrendAnalyzer {
  private entries: JournalEntry[];

  constructor(entries: JournalEntry[]) {
    this.entries = entries;
  }

  /**
   * Analyze a specific week for emotional highs and lows
   */
  analyzeWeek(weekDate: Date): WeeklyEmotionalAnalysis {
    const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });
    
    const weekEntries = this.entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    // Extract highs and lows
    const { highs, lows } = this.extractHighsAndLows(weekEntries);
    
    // Calculate volatility
    const volatilityScore = this.calculateVolatility(weekEntries);
    
    // Determine trend
    const trendDirection = this.calculateTrend(weekDate);
    
    // Identify patterns
    const dominantPatterns = this.identifyPatterns(highs, lows);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(highs, lows, volatilityScore);
    
    // Analyze psychosomatic correlations
    const psychosomaticCorrelations = this.analyzePsychosomaticCorrelations(weekEntries);

    return {
      weekStart,
      weekEnd,
      emotionalHighs: highs,
      emotionalLows: lows,
      volatilityScore,
      trendDirection,
      dominantPatterns,
      recommendations,
      psychosomaticCorrelations
    };
  }

  /**
   * Extract emotional highs and lows from entries
   */
  private extractHighsAndLows(entries: JournalEntry[]): { highs: EmotionalHighLow[], lows: EmotionalHighLow[] } {
    const highs: EmotionalHighLow[] = [];
    const lows: EmotionalHighLow[] = [];

    entries.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      
      // Find highest positive emotion
      const positiveEmotions = Object.entries(entry.emotions)
        .filter(([emotion]) => POSITIVE_EMOTIONS.includes(emotion))
        .sort(([,a], [,b]) => b - a);

      if (positiveEmotions.length > 0) {
        const [emotion, intensity] = positiveEmotions[0];
        if (intensity > 0.5) { // Only include significant emotions
          highs.push({
            type: 'high',
            emotion,
            intensity,
            date: entryDate,
            context: this.extractContext(entry.content, emotion),
            triggers: this.extractTriggers(entry.content, emotion),
            bodyRegions: this.getAffectedBodyRegions(emotion, entry.symptoms)
          });
        }
      }

      // Find highest negative emotion
      const negativeEmotions = Object.entries(entry.emotions)
        .filter(([emotion]) => NEGATIVE_EMOTIONS.includes(emotion))
        .sort(([,a], [,b]) => b - a);

      if (negativeEmotions.length > 0) {
        const [emotion, intensity] = negativeEmotions[0];
        if (intensity > 0.5) { // Only include significant emotions
          lows.push({
            type: 'low',
            emotion,
            intensity,
            date: entryDate,
            context: this.extractContext(entry.content, emotion),
            triggers: this.extractTriggers(entry.content, emotion),
            bodyRegions: this.getAffectedBodyRegions(emotion, entry.symptoms)
          });
        }
      }
    });

    // Sort by intensity
    highs.sort((a, b) => b.intensity - a.intensity);
    lows.sort((a, b) => b.intensity - a.intensity);

    return { highs: highs.slice(0, 5), lows: lows.slice(0, 5) };
  }

  /**
   * Calculate emotional volatility for the week
   */
  private calculateVolatility(entries: JournalEntry[]): number {
    if (entries.length === 0) return 0;

    const dailyScores: number[] = [];
    
    // Calculate daily emotional scores
    entries.forEach(entry => {
      const positiveScore = Object.entries(entry.emotions)
        .filter(([emotion]) => POSITIVE_EMOTIONS.includes(emotion))
        .reduce((sum, [, intensity]) => sum + intensity, 0);
      
      const negativeScore = Object.entries(entry.emotions)
        .filter(([emotion]) => NEGATIVE_EMOTIONS.includes(emotion))
        .reduce((sum, [, intensity]) => sum + intensity, 0);
      
      // Net emotional score (-1 to 1)
      const netScore = positiveScore - negativeScore;
      dailyScores.push(netScore);
    });

    // Calculate standard deviation as volatility measure
    const mean = dailyScores.reduce((sum, score) => sum + score, 0) / dailyScores.length;
    const variance = dailyScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / dailyScores.length;
    const volatility = Math.sqrt(variance);

    return Math.round(volatility * 100); // Return as percentage
  }

  /**
   * Calculate trend direction compared to previous week
   */
  private calculateTrend(currentWeekDate: Date): 'improving' | 'declining' | 'stable' {
    const currentWeek = this.analyzeWeekVolatility(currentWeekDate);
    const previousWeek = this.analyzeWeekVolatility(subWeeks(currentWeekDate, 1));

    const difference = currentWeek - previousWeek;
    
    if (difference < -10) return 'improving'; // Lower volatility is better
    if (difference > 10) return 'declining';
    return 'stable';
  }

  /**
   * Helper to analyze volatility for a specific week
   */
  private analyzeWeekVolatility(weekDate: Date): number {
    const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });
    
    const weekEntries = this.entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    return this.calculateVolatility(weekEntries);
  }

  /**
   * Identify dominant emotional patterns
   */
  private identifyPatterns(highs: EmotionalHighLow[], lows: EmotionalHighLow[]): {
    highPattern: string;
    lowPattern: string;
    peakDay: string;
    valleyDay: string;
  } {
    // Find most common emotions
    const highEmotions = highs.map(h => h.emotion);
    const lowEmotions = lows.map(l => l.emotion);
    
    const highPattern = this.getMostFrequent(highEmotions) || 'varied';
    const lowPattern = this.getMostFrequent(lowEmotions) || 'varied';
    
    // Find peak and valley days
    const peakDay = highs.length > 0 ? format(highs[0].date, 'EEEE') : 'none';
    const valleyDay = lows.length > 0 ? format(lows[0].date, 'EEEE') : 'none';

    return { highPattern, lowPattern, peakDay, valleyDay };
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    highs: EmotionalHighLow[], 
    lows: EmotionalHighLow[], 
    volatility: number
  ): string[] {
    const recommendations: string[] = [];

    // Volatility-based recommendations
    if (volatility > 60) {
      recommendations.push("High emotional volatility detected. Consider stress-reduction practices like meditation or deep breathing.");
    } else if (volatility < 20) {
      recommendations.push("Your emotional stability is excellent this week. Continue your current wellness practices.");
    }

    // High-based recommendations
    if (highs.length > 0) {
      const dominantHigh = highs[0].emotion;
      if (dominantHigh === 'gratitude') {
        recommendations.push("Your gratitude practice is strong. Consider keeping a gratitude journal to maintain this positive pattern.");
      } else if (dominantHigh === 'joy') {
        recommendations.push("Joy is your dominant positive emotion. Share these moments with loved ones to amplify the effect.");
      }
    }

    // Low-based recommendations
    if (lows.length > 0) {
      const dominantLow = lows[0].emotion;
      if (dominantLow === 'stress') {
        recommendations.push("Stress appears frequently. Try progressive muscle relaxation or time-blocking techniques.");
      } else if (dominantLow === 'anxiety') {
        recommendations.push("Anxiety patterns detected. Consider grounding techniques: 5 things you see, 4 you hear, 3 you touch.");
      }
    }

    // Pattern-based recommendations
    if (highs.length === 0) {
      recommendations.push("Consider activities that typically bring you joy, such as nature walks or creative pursuits.");
    }

    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  }

  /**
   * Analyze correlations between emotions and physical symptoms
   */
  private analyzePsychosomaticCorrelations(entries: JournalEntry[]): {
    emotion: string;
    symptoms: string[];
    frequency: number;
  }[] {
    const correlations: Record<string, { symptoms: Set<string>; frequency: number }> = {};

    entries.forEach(entry => {
      const activeSymptoms = Object.entries(entry.symptoms)
        .filter(([, hasSymptom]) => hasSymptom)
        .map(([symptom]) => symptom);

      Object.keys(entry.emotions).forEach(emotion => {
        if (!correlations[emotion]) {
          correlations[emotion] = { symptoms: new Set(), frequency: 0 };
        }
        
        correlations[emotion].frequency++;
        activeSymptoms.forEach(symptom => {
          correlations[emotion].symptoms.add(symptom);
        });
      });
    });

    return Object.entries(correlations)
      .map(([emotion, data]) => ({
        emotion,
        symptoms: Array.from(data.symptoms),
        frequency: data.frequency
      }))
      .filter(correlation => correlation.symptoms.length > 0)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }

  /**
   * Helper methods
   */
  private extractContext(content: string, emotion: string): string {
    // Extract a sentence containing the emotion context
    const sentences = content.split(/[.!?]+/);
    const relevantSentence = sentences.find(sentence => 
      sentence.toLowerCase().includes(emotion) ||
      this.hasEmotionalKeywords(sentence, emotion)
    );
    
    return relevantSentence?.trim().slice(0, 100) + (relevantSentence && relevantSentence.length > 100 ? '...' : '') || content.slice(0, 100) + '...';
  }

  private extractTriggers(content: string, emotion: string): string[] {
    // Simple trigger detection based on common emotional trigger words
    const triggerKeywords = {
      work: ['work', 'job', 'boss', 'manager', 'meeting', 'deadline'],
      relationship: ['partner', 'friend', 'family', 'relationship', 'conversation'],
      health: ['tired', 'sick', 'pain', 'sleep', 'energy'],
      achievement: ['accomplished', 'success', 'goal', 'achievement', 'proud']
    };

    const detectedTriggers: string[] = [];
    const lowerContent = content.toLowerCase();

    Object.entries(triggerKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        detectedTriggers.push(category);
      }
    });

    return detectedTriggers;
  }

  private getAffectedBodyRegions(emotion: string, symptoms: Record<string, boolean>): string[] {
    // Map emotions to likely body regions based on psychosomatic research
    const emotionBodyMap: Record<string, string[]> = {
      anger: ['head', 'jaw', 'shoulders'],
      stress: ['head', 'shoulders', 'stomach'],
      anxiety: ['chest', 'stomach', 'throat'],
      sadness: ['chest', 'eyes'],
      joy: ['chest', 'face'],
      fear: ['stomach', 'chest']
    };

    const activeSymptoms = Object.entries(symptoms)
      .filter(([, hasSymptom]) => hasSymptom)
      .map(([symptom]) => symptom);

    const emotionRegions = emotionBodyMap[emotion] || [];
    
    // Return regions that correlate with both emotion and active symptoms
    return emotionRegions.filter(region => 
      activeSymptoms.some(symptom => 
        this.symptomCorrelatesWithRegion(symptom, region)
      )
    );
  }

  private symptomCorrelatesWithRegion(symptom: string, region: string): boolean {
    const correlations: Record<string, string[]> = {
      head: ['headache', 'tension', 'pressure'],
      chest: ['tightness', 'heart_palpitations', 'breathing'],
      stomach: ['nausea', 'digestive', 'butterflies'],
      shoulders: ['tension', 'stiffness', 'knots']
    };

    return correlations[region]?.some(regionSymptom => 
      symptom.toLowerCase().includes(regionSymptom) ||
      regionSymptom.includes(symptom.toLowerCase())
    ) || false;
  }

  private hasEmotionalKeywords(sentence: string, emotion: string): boolean {
    // Check if sentence contains emotional context keywords
    const emotionalKeywords: Record<string, string[]> = {
      joy: ['happy', 'wonderful', 'amazing', 'great', 'love'],
      stress: ['pressure', 'overwhelmed', 'busy', 'deadline', 'worried'],
      calm: ['peaceful', 'quiet', 'serene', 'relaxed', 'tranquil']
    };

    const keywords = emotionalKeywords[emotion] || [];
    return keywords.some(keyword => sentence.toLowerCase().includes(keyword));
  }

  private getMostFrequent<T>(array: T[]): T | null {
    if (array.length === 0) return null;
    
    const frequency: Record<string, number> = {};
    array.forEach(item => {
      const key = String(item);
      frequency[key] = (frequency[key] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)[0]?.[0] as T || null;
  }
}

/**
 * Factory function to create analyzer instance
 */
export function createWeeklyAnalyzer(entries: JournalEntry[]): WeeklyTrendAnalyzer {
  return new WeeklyTrendAnalyzer(entries);
}