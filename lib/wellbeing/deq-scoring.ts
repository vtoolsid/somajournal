import { EmotionCategory } from '@/lib/store';

// DEQ Scoring Matrix based on validated research
const scoringWeights = {
  // Q1: How you've been feeling
  "q1_feeling_1": { happiness: 0.9, relaxation: 0.4 }, // Mostly happy and content
  "q1_feeling_2": {}, // Neutral
  "q1_feeling_3": { anxiety: 0.9, fear: 0.3 }, // Worried or anxious
  "q1_feeling_4": { sadness: 0.9, anxiety: 0.4 }, // Sad or down
  "q1_feeling_5": { anger: 0.9, anxiety: 0.3 }, // Frustrated or irritated

  // Q2: Response to stress/challenges
  "q2_stress_response_1": { anger: 0.9, desire: 0.5 }, // Get fired up and fight back
  "q2_stress_response_2": { fear: 0.9, anxiety: 0.6 }, // Feel scared and avoid
  "q2_stress_response_3": { desire: 0.9, happiness: 0.4 }, // Get motivated and tackle
  "q2_stress_response_4": { anxiety: 0.9, fear: 0.4 }, // Feel overwhelmed and anxious
  "q2_stress_response_5": { sadness: 0.9, anxiety: 0.5 }, // Feel defeated or hopeless

  // Q3: Physical sensations (multiple selection)
  "q3_physical_sensations_1": { anger: 0.4, anxiety: 0.6 }, // Muscle tension
  "q3_physical_sensations_2": { disgust: 0.9 }, // Nausea or stomach discomfort
  "q3_physical_sensations_3": { anxiety: 0.8, fear: 0.3 }, // Racing heart or on edge
  "q3_physical_sensations_4": { relaxation: 0.9, happiness: 0.3 }, // Calm and relaxed
  "q3_physical_sensations_5": { desire: 0.6, anger: 0.3 }, // High energy and restlessness
  "q3_physical_sensations_6": { sadness: 0.6, relaxation: 0.4 }, // Fatigue or low energy

  // Q4: At ease in daily life
  "q4_ease_1": { relaxation: 1.0 }, // Very relaxed and at peace
  "q4_ease_2": { relaxation: 0.7 }, // Generally comfortable
  "q4_ease_3": { anxiety: 0.5 }, // Somewhat tense or unsettled
  "q4_ease_4": { anxiety: 0.8 }, // Often stressed or on edge
  "q4_ease_5": { anxiety: 1.0 }, // Constantly anxious

  // Q5: What you're drawn to/wanting
  "q5_desires_1": { desire: 0.9, anger: 0.2 }, // Strongly motivated to pursue goals
  "q5_desires_2": { happiness: 0.7, relaxation: 0.3 }, // Content with what I have
  "q5_desires_3": { sadness: 0.7 }, // Not wanting much of anything
  "q5_desires_4": { disgust: 0.8 }, // Wanting to avoid things/people
  "q5_desires_5": { anger: 0.9 }, // Wanting to confront or change
};

// Maximum possible scores for normalization
const maxScores = {
  happiness: 1.8, // 0.9 + 0.9
  sadness: 2.2, // 0.9 + 0.9 + 0.4 (multiple sources)
  anger: 2.1, // 0.9 + 0.9 + 0.3
  fear: 1.3, // 0.9 + 0.4
  anxiety: 4.1, // 0.9 + 0.6 + 0.9 + 0.8 + 1.0
  disgust: 1.7, // 0.9 + 0.8
  relaxation: 2.4, // 0.4 + 1.0 + 0.7 + 0.3
  desire: 2.4, // 0.5 + 0.9 + 0.6 + 0.4
};

export interface DEQResponses {
  q1_feeling: 1 | 2 | 3 | 4 | 5;
  q2_stress_response: 1 | 2 | 3 | 4 | 5;
  q3_physical_sensations: number[];
  q4_ease: 1 | 2 | 3 | 4 | 5;
  q5_desires: 1 | 2 | 3 | 4 | 5;
}

export interface EmotionScores {
  happiness: number;
  sadness: number;
  anger: number;
  fear: number;
  anxiety: number;
  disgust: number;
  relaxation: number;
  desire: number;
}

export function calculateDEQScores(responses: DEQResponses): EmotionScores {
  // Initialize raw scores
  const rawScores: EmotionScores = {
    happiness: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    anxiety: 0,
    disgust: 0,
    relaxation: 0,
    desire: 0,
  };

  // Process Q1: How you've been feeling
  const q1Key = `q1_feeling_${responses.q1_feeling}`;
  const q1Weights = scoringWeights[q1Key as keyof typeof scoringWeights] || {};
  Object.entries(q1Weights).forEach(([emotion, weight]) => {
    rawScores[emotion as keyof EmotionScores] += weight;
  });

  // Process Q2: Response to stress/challenges
  const q2Key = `q2_stress_response_${responses.q2_stress_response}`;
  const q2Weights = scoringWeights[q2Key as keyof typeof scoringWeights] || {};
  Object.entries(q2Weights).forEach(([emotion, weight]) => {
    rawScores[emotion as keyof EmotionScores] += weight;
  });

  // Process Q3: Physical sensations (multiple selection)
  responses.q3_physical_sensations.forEach(sensation => {
    const q3Key = `q3_physical_sensations_${sensation}`;
    const q3Weights = scoringWeights[q3Key as keyof typeof scoringWeights] || {};
    Object.entries(q3Weights).forEach(([emotion, weight]) => {
      rawScores[emotion as keyof EmotionScores] += weight;
    });
  });

  // Process Q4: At ease in daily life
  const q4Key = `q4_ease_${responses.q4_ease}`;
  const q4Weights = scoringWeights[q4Key as keyof typeof scoringWeights] || {};
  Object.entries(q4Weights).forEach(([emotion, weight]) => {
    rawScores[emotion as keyof EmotionScores] += weight;
  });

  // Process Q5: What you're drawn to/wanting
  const q5Key = `q5_desires_${responses.q5_desires}`;
  const q5Weights = scoringWeights[q5Key as keyof typeof scoringWeights] || {};
  Object.entries(q5Weights).forEach(([emotion, weight]) => {
    rawScores[emotion as keyof EmotionScores] += weight;
  });

  // Normalize to 0-100 scale
  const normalizedScores: EmotionScores = {
    happiness: Math.round((rawScores.happiness / maxScores.happiness) * 100),
    sadness: Math.round((rawScores.sadness / maxScores.sadness) * 100),
    anger: Math.round((rawScores.anger / maxScores.anger) * 100),
    fear: Math.round((rawScores.fear / maxScores.fear) * 100),
    anxiety: Math.round((rawScores.anxiety / maxScores.anxiety) * 100),
    disgust: Math.round((rawScores.disgust / maxScores.disgust) * 100),
    relaxation: Math.round((rawScores.relaxation / maxScores.relaxation) * 100),
    desire: Math.round((rawScores.desire / maxScores.desire) * 100),
  };

  return normalizedScores;
}

export function categorizeEmotionScore(score: number): EmotionCategory {
  if (score <= 20) return 'very_low';
  if (score <= 40) return 'low';
  if (score <= 60) return 'moderate';
  if (score <= 80) return 'high';
  return 'very_high';
}

export function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    happiness: '😃',
    sadness: '😢',
    anger: '😠',
    fear: '😱',
    anxiety: '😰',
    disgust: '🤢',
    relaxation: '😌',
    desire: '🎯',
  };
  return emojiMap[emotion] || '😐';
}

export function getTopEmotions(emotionScores: EmotionScores, count: number = 2): Array<{
  emotion: string;
  score: number;
  category: EmotionCategory;
}> {
  return Object.entries(emotionScores)
    .map(([emotion, score]) => ({
      emotion,
      score,
      category: categorizeEmotionScore(score),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}