import { JournalEntry, MoodEntry, Emotion } from './store';

export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    content: 'Had a wonderful morning meditation today. Felt really connected to my breath and noticed how peaceful I felt afterward. The tension in my shoulders seemed to melt away.',
    userId: 'user-1',
    karmicValue: 0.8,
    emotions: { 'peace': 0.9, 'gratitude': 0.7, 'calm': 0.8 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
  },
  {
    id: '2',
    createdAt: new Date('2024-01-14T16:45:00'),
    updatedAt: new Date('2024-01-14T16:45:00'),
    content: 'Feeling frustrated with work today. My manager dismissed my ideas again and I can feel the anger building up. Getting a headache from all the stress.',
    userId: 'user-1',
    karmicValue: -0.6,
    emotions: { 'anger': 0.8, 'frustration': 0.9, 'stress': 0.7 },
    symptoms: { 'tension': true, 'headache': true, 'fatigue': true },
  },
  {
    id: '3',
    createdAt: new Date('2024-01-13T20:15:00'),
    updatedAt: new Date('2024-01-13T20:15:00'),
    content: 'Spent quality time with my family tonight. We played board games and laughed so much. I feel grateful for these simple moments of joy.',
    userId: 'user-1',
    karmicValue: 0.9,
    emotions: { 'joy': 0.9, 'love': 0.8, 'gratitude': 0.9 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
  },
];

export const mockMoodEntries: MoodEntry[] = [
  { id: '1', date: '2024-01-15', mood: 4, emotions: ['peaceful', 'grateful'], notes: 'Great meditation session' },
  { id: '2', date: '2024-01-14', mood: 2, emotions: ['frustrated', 'angry'], notes: 'Difficult day at work' },
  { id: '3', date: '2024-01-13', mood: 5, emotions: ['joyful', 'loving'], notes: 'Family time' },
  { id: '4', date: '2024-01-12', mood: 3, emotions: ['neutral'], notes: 'Regular day' },
  { id: '5', date: '2024-01-11', mood: 4, emotions: ['creative', 'motivated'], notes: 'Started new project' },
];

export const emotionChakraMapping: Record<string, 'root' | 'sacral' | 'solar' | 'heart' | 'throat' | 'third-eye' | 'crown'> = {
  'anger': 'root',
  'fear': 'root',
  'frustration': 'root',
  'creative': 'sacral',
  'desire': 'sacral',
  'pleasure': 'sacral',
  'confidence': 'solar',
  'power': 'solar',
  'motivation': 'solar',
  'love': 'heart',
  'compassion': 'heart',
  'gratitude': 'heart',
  'joy': 'heart',
  'communication': 'throat',
  'truth': 'throat',
  'expression': 'throat',
  'intuition': 'third-eye',
  'wisdom': 'third-eye',
  'clarity': 'third-eye',
  'peace': 'crown',
  'spiritual': 'crown',
  'connected': 'crown',
};

export const chakraColors = {
  root: '#E53935',
  sacral: '#FB8C00',
  solar: '#FDD835',
  heart: '#43A047',
  throat: '#1E88E5',
  'third-eye': '#3949AB',
  crown: '#8E24AA',
};

export const physicalSymptoms = [
  'headache',
  'tension',
  'fatigue',
  'stomach_issues',
  'back_pain',
  'neck_pain',
  'insomnia',
  'anxiety_symptoms',
  'digestive_issues',
  'muscle_tension',
];

// Mock NLP Analysis Function
export const analyzeJournalEntry = (content: string) => {
  // Simple keyword-based analysis for demo
  const words = content.toLowerCase().split(' ');
  
  let karmicValue = 0;
  const emotions: Record<string, number> = {};
  const symptoms: Record<string, boolean> = {};
  
  // Positive keywords
  const positiveWords = ['happy', 'joy', 'love', 'peace', 'grateful', 'wonderful', 'amazing', 'beautiful', 'calm', 'serene', 'blissful'];
  const negativeWords = ['angry', 'sad', 'frustrated', 'annoyed', 'upset', 'terrible', 'awful', 'stressed', 'anxious', 'worried'];
  
  positiveWords.forEach(word => {
    if (words.includes(word)) {
      karmicValue += 0.2;
      emotions[word] = Math.random() * 0.5 + 0.5; // 0.5-1.0
    }
  });
  
  negativeWords.forEach(word => {
    if (words.includes(word)) {
      karmicValue -= 0.2;
      emotions[word] = Math.random() * 0.5 + 0.5; // 0.5-1.0
    }
  });
  
  // Physical symptoms detection
  const symptomWords = ['headache', 'pain', 'tired', 'fatigue', 'tension', 'stress', 'ache'];
  symptomWords.forEach(symptom => {
    symptoms[symptom] = words.some(word => word.includes(symptom));
  });
  
  // Normalize karmic value
  karmicValue = Math.max(-1, Math.min(1, karmicValue));
  
  return {
    karmicValue,
    emotions,
    symptoms,
  };
};