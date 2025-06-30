import { JournalEntry, MoodEntry, Emotion } from './store';

export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    createdAt: new Date('2024-06-29T10:30:00'),
    updatedAt: new Date('2024-06-29T10:30:00'),
    content: 'Had a wonderful morning meditation today. Felt really connected to my breath and noticed how peaceful I felt afterward. The tension in my shoulders seemed to melt away.',
    userId: 'user-1',
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

import { config, isPrototypeMode, getMockDelay, debugLog } from './config';
import { generateMockAnalysisResponse } from './mock-psychosomatic-data';

// Real BERT Emotion Analysis Function - Powered by Adaptive Classifier
export const analyzeJournalEntry = async (content: string) => {
  console.log('🔍 analyzeJournalEntry called with content:', content.substring(0, 100) + '...');
  
  // Check if we're in prototype mode
  if (isPrototypeMode()) {
    console.log('🎭 PROTOTYPE MODE: Using mock psychosomatic analysis');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, getMockDelay()));
    
    // Extract emotions from text using simple keyword analysis
    const words = content.toLowerCase().split(' ');
    const detectedEmotions: Array<{ emotion: string; confidence: number }> = [];
    
    // Enhanced emotion detection for prototype mode
    const emotionPatterns = {
      joy: ['happy', 'joy', 'wonderful', 'amazing', 'great', 'awesome', 'fantastic', 'love', 'excited', 'grateful', 'blessed'],
      sadness: ['sad', 'down', 'depressed', 'awful', 'terrible', 'cry', 'upset', 'heartbroken', 'disappointed', 'lonely'],
      anger: ['angry', 'mad', 'frustrated', 'annoyed', 'furious', 'irritated', 'hate', 'rage', 'pissed'],
      nervousness: ['anxious', 'worried', 'nervous', 'stress', 'scared', 'fear', 'overwhelmed', 'tense', 'panic'],
      gratitude: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate'],
      excitement: ['excited', 'thrilled', 'eager', 'pumped', 'energized'],
      fear: ['afraid', 'frightened', 'terrified', 'scary', 'danger'],
      surprise: ['surprised', 'shocked', 'amazed', 'unexpected'],
      disgust: ['disgusted', 'gross', 'revolting', 'nasty'],
      confusion: ['confused', 'puzzled', 'unclear', 'lost'],
      disappointment: ['disappointed', 'letdown', 'failed', 'regret'],
      love: ['love', 'adore', 'cherish', 'affection'],
      pride: ['proud', 'accomplished', 'achievement', 'success'],
      embarrassment: ['embarrassed', 'ashamed', 'humiliated', 'awkward'],
      guilt: ['guilty', 'remorse', 'regret', 'sorry'],
      relief: ['relieved', 'relaxed', 'calm', 'peaceful'],
      admiration: ['admire', 'respect', 'inspire', 'look up to'],
      caring: ['care', 'concern', 'support', 'help'],
      approval: ['approve', 'agree', 'good', 'right', 'correct'],
      disapproval: ['disapprove', 'wrong', 'disagree', 'bad'],
      annoyance: ['annoyed', 'bothered', 'irritated', 'frustrated'],
      curiosity: ['curious', 'wonder', 'interested', 'intrigued'],
      desire: ['want', 'wish', 'desire', 'need', 'crave'],
      optimism: ['optimistic', 'hopeful', 'positive', 'bright'],
      amusement: ['funny', 'laugh', 'amusing', 'humor', 'hilarious'],
      grief: ['grief', 'loss', 'mourn', 'bereaved'],
      realization: ['realize', 'understand', 'discover', 'aware'],
    };
    
    // Detect emotions based on keywords
    for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
      const matches = keywords.filter(keyword => words.includes(keyword));
      if (matches.length > 0) {
        // Calculate confidence based on number of matches and text length
        const confidence = Math.min(0.9, 0.4 + (matches.length * 0.2));
        detectedEmotions.push({
          emotion,
          confidence: Math.round(confidence * 100) / 100
        });
      }
    }
    
    // Sort by confidence and limit based on text length
    detectedEmotions.sort((a, b) => b.confidence - a.confidence);
    const wordCount = words.length;
    const maxEmotions = wordCount < 10 ? 1 : wordCount < 50 ? 3 : 5;
    const limitedEmotions = detectedEmotions.slice(0, maxEmotions);
    
    // Default to neutral if no emotions detected
    if (limitedEmotions.length === 0) {
      limitedEmotions.push({ emotion: 'neutral', confidence: 0.65 });
    }
    
    // Generate complete mock response with psychosomatic analysis
    const mockResponse = generateMockAnalysisResponse(content, limitedEmotions);
    
    debugLog('Mock analysis generated:', {
      emotions: limitedEmotions,
      primaryEmotion: mockResponse.psychosomatic.primary_emotion
    });
    
    // Convert to the expected format
    const emotions: Record<string, number> = {};
    limitedEmotions.forEach(e => {
      emotions[e.emotion] = e.confidence;
    });
    
    const result = {
      emotions,
      symptoms: mockResponse.symptoms,
      analysis: mockResponse.analysis,
      characteristics: mockResponse.characteristics,
      adaptive_info: mockResponse.adaptive_info,
      fallback: false,
      psychosomatic: mockResponse.psychosomatic,
      personalized_insights: mockResponse.psychosomatic.personalized_insights,
      psychosomatic_analysis: mockResponse.psychosomatic.psychosomatic_analysis,
      prototype_mode: true
    };
    
    console.log('✅ Prototype analysis complete:', result);
    console.log('🎯 Psychosomatic data included:', !!result.psychosomatic);
    return result;
  }
  
  // Original API-based analysis code
  try {
    console.log('📡 Making API request to /api/analyze-emotion...');
    
    // Call the Next.js API route which proxies to Python BERT server
    const response = await fetch('/api/analyze-emotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: content,
        debug: true  // Enable debug mode for troubleshooting
      }),
    });

    console.log('📨 API response status:', response.status);
    console.log('📨 API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Emotion analysis API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const analysis = await response.json();
    console.log('📊 Raw API response:', analysis);
    
    if (analysis.status !== 'success') {
      console.error('❌ Analysis failed:', analysis.message);
      throw new Error(analysis.message || 'Analysis failed');
    }

    // Convert BERT analysis to SomaJournal format
    const emotions: Record<string, number> = {};
    if (analysis.emotions && Array.isArray(analysis.emotions)) {
      analysis.emotions.forEach((emotion: any) => {
        emotions[emotion.emotion] = emotion.confidence;
      });
      console.log('🎭 Processed emotions:', emotions);
    } else {
      console.warn('⚠️ No emotions array in response');
    }

    // Use symptoms from BERT analysis
    const symptoms = analysis.symptoms || {};
    console.log('🏥 Processed symptoms:', symptoms);

    const result = {
      emotions,
      symptoms,
      // Additional metadata from adaptive analysis
      analysis: analysis.analysis,
      characteristics: analysis.characteristics,
      adaptive_info: analysis.adaptive_info,
      fallback: analysis.fallback || false,
      // Include psychosomatic analysis if available
      psychosomatic: analysis.psychosomatic || null,
      // Include personalized insights if available from psychosomatic analysis
      personalized_insights: analysis.psychosomatic?.personalized_insights || null,
      psychosomatic_analysis: analysis.psychosomatic?.psychosomatic_analysis || null
    };
    
    console.log('✅ Final processed result:', result);
    console.log('🎯 Psychosomatic data included:', !!result.psychosomatic);
    return result;

  } catch (error) {
    console.error('❌ Failed to analyze journal entry:', error);
    console.error('🔄 Falling back to keyword analysis...');
    
    // Fallback to simple keyword analysis if BERT server is unavailable
    const fallbackResult = fallbackAnalysis(content);
    console.log('🔄 Fallback result:', fallbackResult);
    return fallbackResult;
  }
};

// Fallback analysis for when BERT server is unavailable
const fallbackAnalysis = (content: string) => {
  console.log('Using fallback keyword analysis');
  
  const words = content.toLowerCase().split(' ');
  const emotions: Record<string, number> = {};
  const symptoms: Record<string, boolean> = {};
  
  // Basic emotion detection
  const emotionWords = {
    'joy': ['happy', 'joy', 'wonderful', 'amazing', 'great', 'love'],
    'sadness': ['sad', 'down', 'depressed', 'awful', 'terrible'],
    'anger': ['angry', 'mad', 'frustrated', 'annoyed'],
    'peace': ['peaceful', 'calm', 'serene', 'tranquil'],
    'gratitude': ['grateful', 'thankful', 'appreciate'],
    'anxiety': ['anxious', 'worried', 'nervous', 'stress']
  };
  
  Object.entries(emotionWords).forEach(([emotion, keywords]) => {
    const matches = keywords.filter(keyword => words.includes(keyword));
    if (matches.length > 0) {
      emotions[emotion] = 0.7; // Default confidence for fallback
    }
  });
  
  // Basic symptom detection
  const symptomWords = ['headache', 'pain', 'tired', 'fatigue', 'tension', 'stress', 'ache'];
  symptomWords.forEach(symptom => {
    symptoms[symptom] = words.some(word => word.includes(symptom));
  });
  
  return {
    emotions,
    symptoms,
    analysis: {
      text_type: words.length < 20 ? 'short_entry' : 'medium_entry',
      emotional_richness: 'low',
      recommended_approach: 'Keyword fallback analysis'
    },
    fallback: true
  };
};

// Dashboard Analysis Functions
export const analyzePsychosomaticConnection = (entries: JournalEntry[]) => {
  const recentEntries = entries.slice(0, 5); // Last 5 entries
  const emotionSymptomMap: Record<string, string[]> = {
    'anxiety': ['stomach discomfort', 'shallow breathing', 'tension'],
    'stress': ['headache', 'muscle tension', 'fatigue'],
    'anger': ['jaw clenching', 'raised blood pressure', 'tension'],
    'sadness': ['heavy chest', 'low energy', 'sleep issues'],
    'fear': ['rapid heartbeat', 'sweating', 'nausea'],
    'frustration': ['headache', 'neck tension', 'irritability'],
    'worry': ['stomach upset', 'restlessness', 'insomnia'],
  };

  // Find dominant emotions from recent entries
  const emotionCounts: Record<string, number> = {};
  const symptomCounts: Record<string, boolean> = {};

  recentEntries.forEach(entry => {
    Object.keys(entry.emotions).forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    Object.entries(entry.symptoms).forEach(([symptom, present]) => {
      if (present) symptomCounts[symptom] = true;
    });
  });

  const dominantEmotion = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  const physicalManifestations = dominantEmotion ? emotionSymptomMap[dominantEmotion] || [] : [];
  const detectedSymptoms = Object.keys(symptomCounts);

  return {
    dominantEmotion,
    physicalManifestations,
    detectedSymptoms,
    connection: dominantEmotion && physicalManifestations.length > 0
  };
};

export const calculateWellnessMetrics = (entries: JournalEntry[]) => {
  if (entries.length === 0) return { writingConsistency: 0, emotionBalance: 0, symptomFrequency: 0 };
  
  // Calculate objective wellness metrics
  const writingConsistency = entries.length; // Number of entries
  
  // Count positive vs challenging emotions (objective count, not subjective rating)
  let positiveEmotions = 0;
  let challengingEmotions = 0;
  let totalSymptoms = 0;
  
  entries.forEach(entry => {
    Object.keys(entry.emotions).forEach(emotion => {
      if (['happy', 'joy', 'love', 'peace', 'grateful', 'wonderful', 'amazing', 'beautiful', 'calm', 'serene', 'blissful'].includes(emotion)) {
        positiveEmotions++;
      } else if (['angry', 'sad', 'frustrated', 'annoyed', 'upset', 'stressed', 'anxious', 'worried'].includes(emotion)) {
        challengingEmotions++;
      }
    });
    
    Object.values(entry.symptoms).forEach(hasSymptom => {
      if (hasSymptom) totalSymptoms++;
    });
  });
  
  return {
    writingConsistency,
    emotionBalance: positiveEmotions - challengingEmotions,
    symptomFrequency: totalSymptoms,
    totalEmotions: positiveEmotions + challengingEmotions
  };
};

export const getTopEmotions = (entries: JournalEntry[], limit: number = 4) => {
  const emotionCounts: Record<string, number> = {};
  const emotionIntensities: Record<string, number[]> = {};

  entries.forEach(entry => {
    Object.entries(entry.emotions).forEach(([emotion, intensity]) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      emotionIntensities[emotion] = emotionIntensities[emotion] || [];
      emotionIntensities[emotion].push(intensity);
    });
  });

  return Object.entries(emotionCounts)
    .map(([emotion, count]) => ({
      emotion,
      count,
      averageIntensity: emotionIntensities[emotion].reduce((a, b) => a + b, 0) / emotionIntensities[emotion].length,
      chakra: emotionChakraMapping[emotion] || 'heart'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const generateInsightMessage = (psychosomaticData: ReturnType<typeof analyzePsychosomaticConnection>) => {
  const { dominantEmotion, physicalManifestations, detectedSymptoms, connection } = psychosomaticData;

  if (!connection || !dominantEmotion) {
    return {
      message: "Your recent reflections show a balanced emotional state. Your body is feeling aligned.",
      type: 'positive' as const
    };
  }

  const symptomMatch = physicalManifestations.some(manifestation => 
    detectedSymptoms.some(symptom => 
      manifestation.toLowerCase().includes(symptom) || symptom.includes(manifestation.toLowerCase())
    )
  );

  if (symptomMatch) {
    return {
      message: `Your recent journals show a pattern of **${dominantEmotion}**. Research shows this often manifests as **${physicalManifestations[0]}** and **${physicalManifestations[1] || 'tension'}**.`,
      type: 'connection' as const
    };
  }

  return {
    message: `Your recent **${dominantEmotion}** may be affecting your body. Consider watching for **${physicalManifestations[0]}** or **${physicalManifestations[1] || 'muscle tension'}**.`,
    type: 'awareness' as const
  };
};