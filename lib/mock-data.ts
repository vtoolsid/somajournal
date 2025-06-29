import { JournalEntry, MoodEntry, Emotion } from './store';

export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    createdAt: new Date('2024-06-29T10:30:00'),
    updatedAt: new Date('2024-06-29T10:30:00'),
    content: 'Had a wonderful morning meditation today. Felt really connected to my breath and noticed how peaceful I felt afterward. The tension in my shoulders seemed to melt away.',
    userId: 'user-1',
    karmicValue: 0.8,
    emotions: { 'peace': 0.9, 'gratitude': 0.7, 'calm': 0.8 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
    location: 'San Francisco, CA',
    weather: '☀️ 72°F',
    tags: ['meditation', 'morning', 'peace'],
  },
  {
    id: '2',
    createdAt: new Date('2024-06-28T16:45:00'),
    updatedAt: new Date('2024-06-28T16:45:00'),
    content: 'Feeling frustrated with work today. My manager dismissed my ideas again and I can feel the anger building up. Getting a headache from all the stress.',
    userId: 'user-1',
    karmicValue: -0.6,
    emotions: { 'anger': 0.8, 'frustration': 0.9, 'stress': 0.7 },
    symptoms: { 'tension': true, 'headache': true, 'fatigue': true },
    location: 'San Francisco, CA',
    weather: '☁️ 65°F',
    tags: ['work', 'stress', 'frustration'],
  },
  {
    id: '3',
    createdAt: new Date('2024-06-27T20:15:00'),
    updatedAt: new Date('2024-06-27T20:15:00'),
    content: 'Spent quality time with my family tonight. We played board games and laughed so much. I feel grateful for these simple moments of joy.',
    userId: 'user-1',
    karmicValue: 0.9,
    emotions: { 'joy': 0.9, 'love': 0.8, 'gratitude': 0.9 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
    location: 'San Francisco, CA',
    weather: '🌤️ 68°F',
    tags: ['family', 'joy', 'gratitude'],
  },
  {
    id: '4',
    createdAt: new Date('2024-06-26T08:20:00'),
    updatedAt: new Date('2024-06-26T08:20:00'),
    content: 'Started my day with yoga and journaling. There\'s something magical about the quiet morning hours. I feel centered and ready to embrace whatever comes my way.',
    userId: 'user-1',
    karmicValue: 0.7,
    emotions: { 'centered': 0.8, 'motivated': 0.7, 'peaceful': 0.9 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
    location: 'San Francisco, CA',
    weather: '🌅 70°F',
    tags: ['yoga', 'morning routine', 'mindfulness'],
  },
  {
    id: '5',
    createdAt: new Date('2024-06-25T22:30:00'),
    updatedAt: new Date('2024-06-25T22:30:00'),
    content: 'Difficult conversation with a friend today about boundaries. It was uncomfortable but necessary. I\'m learning that speaking my truth, even when it\'s hard, feels more authentic.',
    userId: 'user-1',
    karmicValue: 0.3,
    emotions: { 'uncomfortable': 0.6, 'authentic': 0.8, 'growth': 0.7 },
    symptoms: { 'tension': true, 'headache': false, 'fatigue': false },
    location: 'San Francisco, CA',
    weather: '🌙 62°F',
    tags: ['boundaries', 'friendship', 'growth'],
  },
  {
    id: '6',
    createdAt: new Date('2024-06-24T15:10:00'),
    updatedAt: new Date('2024-06-24T15:10:00'),
    content: 'Took a long walk in the park today. Nature has this incredible way of putting things into perspective. The trees seem to whisper wisdom about patience and growth.',
    userId: 'user-1',
    karmicValue: 0.6,
    emotions: { 'peaceful': 0.8, 'connected': 0.7, 'wise': 0.6 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
    location: 'Golden Gate Park, SF',
    weather: '🌳 74°F',
    tags: ['nature', 'walking', 'perspective'],
  },
  {
    id: '7',
    createdAt: new Date('2024-06-23T19:45:00'),
    updatedAt: new Date('2024-06-23T19:45:00'),
    content: 'Cooked a new recipe today and it turned out terribly! But somehow I found myself laughing instead of getting upset. Maybe I\'m learning to find joy even in the small failures.',
    userId: 'user-1',
    karmicValue: 0.4,
    emotions: { 'amused': 0.7, 'resilient': 0.6, 'learning': 0.8 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
    location: 'San Francisco, CA',
    weather: '🍳 69°F',
    tags: ['cooking', 'resilience', 'humor'],
  },
  {
    id: '8',
    createdAt: new Date('2024-06-22T11:20:00'),
    updatedAt: new Date('2024-06-22T11:20:00'),
    content: 'Had an argument with my partner this morning. We both said things we didn\'t mean. The silence afterward felt heavy. I hate how conflict creates this distance between us.',
    userId: 'user-1',
    karmicValue: -0.7,
    emotions: { 'regret': 0.8, 'distant': 0.7, 'sad': 0.6 },
    symptoms: { 'tension': true, 'headache': true, 'fatigue': false },
    location: 'San Francisco, CA',
    weather: '⛅ 66°F',
    tags: ['relationship', 'conflict', 'communication'],
  },
  {
    id: '9',
    createdAt: new Date('2023-06-29T14:30:00'),
    updatedAt: new Date('2023-06-29T14:30:00'),
    content: 'One year ago today: Had my first meditation retreat experience. It was challenging but transformative. I remember feeling so resistant at first, but by the end, I didn\'t want to leave.',
    userId: 'user-1',
    karmicValue: 0.8,
    emotions: { 'transformative': 0.9, 'grateful': 0.8, 'nostalgic': 0.6 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
    location: 'Sonoma, CA',
    weather: '🧘‍♀️ 78°F',
    tags: ['meditation', 'retreat', 'transformation'],
  },
  {
    id: '10',
    createdAt: new Date('2024-06-21T07:15:00'),
    updatedAt: new Date('2024-06-21T07:15:00'),
    content: 'Summer solstice today. There\'s something powerful about marking the longest day of the year. I set intentions for the season ahead and feel hopeful about what\'s to come.',
    userId: 'user-1',
    karmicValue: 0.7,
    emotions: { 'hopeful': 0.8, 'intentional': 0.7, 'connected': 0.6 },
    symptoms: { 'tension': false, 'headache': false, 'fatigue': false },
    location: 'San Francisco, CA',
    weather: '☀️ 75°F',
    tags: ['solstice', 'intentions', 'seasons'],
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