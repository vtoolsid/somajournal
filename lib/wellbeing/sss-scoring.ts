// SSS-8 Physical Symptoms Scoring Logic
// Based on Somatic Symptom Scale (SSS-8) with 1-5 Likert scale

export interface SSSSymptoms {
  trouble_sleeping: 1 | 2 | 3 | 4 | 5;
  low_energy: 1 | 2 | 3 | 4 | 5;
  headaches: 1 | 2 | 3 | 4 | 5;
  chest_pain_breath: 1 | 2 | 3 | 4 | 5;
  digestive_problems: 1 | 2 | 3 | 4 | 5;
}

export interface PhysicalBurden {
  totalScore: number; // 5-25 range
  category: 'minimal' | 'low' | 'medium' | 'high' | 'very_high';
  flaggedSymptoms: string[]; // Symptoms with score ≥3
}

// Symptom labels for display and flagging
export const symptomLabels: Record<keyof SSSSymptoms, string> = {
  trouble_sleeping: 'Trouble sleeping',
  low_energy: 'Low energy or fatigue',
  headaches: 'Headaches',
  chest_pain_breath: 'Chest pain or shortness of breath',
  digestive_problems: 'Digestive problems',
};

// Scale labels for UI display
export const scaleLabels = {
  1: 'Not at all',
  2: 'A little bit',
  3: 'Somewhat',
  4: 'Quite a bit',
  5: 'Very much'
};

// Burden category thresholds based on total score (5-25 range)
export function categorizeBurden(totalScore: number): PhysicalBurden['category'] {
  if (totalScore >= 22) return 'very_high';
  if (totalScore >= 17) return 'high';
  if (totalScore >= 12) return 'medium';
  if (totalScore >= 8) return 'low';
  return 'minimal';
}

// Category descriptions for user understanding
export const categoryDescriptions: Record<PhysicalBurden['category'], string> = {
  minimal: 'Very low physical symptom burden',
  low: 'Mild physical symptoms present',
  medium: 'Moderate physical symptom burden',
  high: 'Significant physical symptom burden',
  very_high: 'Very high physical symptom burden - consider professional consultation'
};

// Emoji indicators for categories
export const categoryEmojis: Record<PhysicalBurden['category'], string> = {
  minimal: '💚',
  low: '💛',
  medium: '🧡',
  high: '❤️',
  very_high: '🚨'
};

export function calculateSSSScores(symptoms: SSSSymptoms): PhysicalBurden {
  // Calculate total score (sum of all symptom ratings)
  const totalScore = Object.values(symptoms).reduce((sum, score) => sum + score, 0);
  
  // Categorize burden level
  const category = categorizeBurden(totalScore);
  
  // Flag symptoms with score ≥3 (Somewhat to Very much)
  const flaggedSymptoms = Object.entries(symptoms)
    .filter(([_, score]) => score >= 3)
    .map(([symptom, _]) => symptomLabels[symptom as keyof SSSSymptoms]);
  
  return {
    totalScore,
    category,
    flaggedSymptoms,
  };
}

// Get symptom severity for individual symptoms
export function getSymptomSeverity(score: 1 | 2 | 3 | 4 | 5): 'minimal' | 'mild' | 'moderate' | 'significant' | 'severe' {
  switch (score) {
    case 1: return 'minimal';
    case 2: return 'mild';
    case 3: return 'moderate';
    case 4: return 'significant';
    case 5: return 'severe';
  }
}

// Get emoji for symptom severity
export function getSymptomEmoji(score: 1 | 2 | 3 | 4 | 5): string {
  const emojiMap = {
    1: '💚', // Not at all
    2: '💛', // A little bit
    3: '🧡', // Somewhat
    4: '❤️', // Quite a bit
    5: '🚨'  // Very much
  };
  return emojiMap[score];
}

// Generate recommendations based on physical burden
export function getPhysicalRecommendations(physicalBurden: PhysicalBurden): string[] {
  const recommendations: string[] = [];
  
  switch (physicalBurden.category) {
    case 'minimal':
      recommendations.push('✅ Your physical symptoms are minimal - great job maintaining your health!');
      recommendations.push('🏃‍♀️ Continue with regular exercise and healthy lifestyle practices');
      break;
      
    case 'low':
      recommendations.push('💊 Consider stress management techniques like meditation or yoga');
      recommendations.push('😴 Prioritize good sleep hygiene and regular sleep schedule');
      break;
      
    case 'medium':
      recommendations.push('🏥 Consider discussing these symptoms with a healthcare provider');
      recommendations.push('💆‍♀️ Explore stress reduction activities and relaxation techniques');
      recommendations.push('🥗 Review your diet and ensure proper nutrition');
      break;
      
    case 'high':
      recommendations.push('⚠️ We recommend consulting with a healthcare professional');
      recommendations.push('🧘‍♀️ Consider stress management counseling or therapy');
      recommendations.push('📝 Keep a symptom diary to track patterns');
      break;
      
    case 'very_high':
      recommendations.push('🚨 Please consider seeking medical attention for these symptoms');
      recommendations.push('👩‍⚕️ A healthcare provider can help evaluate and address these concerns');
      recommendations.push('📞 Don\'t hesitate to reach out for professional support');
      break;
  }
  
  // Add specific recommendations for flagged symptoms
  if (physicalBurden.flaggedSymptoms.length > 0) {
    recommendations.push(`🎯 Focus areas: ${physicalBurden.flaggedSymptoms.join(', ')}`);
  }
  
  return recommendations;
}

// Export symptom analysis for detailed breakdown
export function analyzeSymptoms(symptoms: SSSSymptoms) {
  return Object.entries(symptoms).map(([symptom, score]) => ({
    symptom: symptomLabels[symptom as keyof SSSSymptoms],
    score,
    severity: getSymptomSeverity(score),
    emoji: getSymptomEmoji(score),
    flagged: score >= 3,
  }));
}