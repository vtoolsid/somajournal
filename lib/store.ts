import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  userId: string;
  emotions: Record<string, number>;
  symptoms: Record<string, boolean>;
  mediaUrl?: string;
  location?: string;
  tags?: string[];
  // Analysis fields
  analysis?: any;
  characteristics?: any;
  adaptive_info?: any;
  fallback?: boolean;
  psychosomatic?: any;
  personalized_insights?: any;
  psychosomatic_analysis?: any;
  wellness_recommendations?: any;
  prototype_mode?: boolean;
}

export interface Emotion {
  name: string;
  intensity: number;
  chakra: 'root' | 'sacral' | 'solar' | 'heart' | 'throat' | 'third-eye' | 'crown';
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  emotions: string[];
  notes?: string;
}

// Wellbeing Assessment Types
export interface WellbeingAssessment {
  // Emotional DEQ Responses (5 questions)
  emotionalResponses: {
    q1_feeling: 1 | 2 | 3 | 4 | 5; // How you've been feeling
    q2_stress_response: 1 | 2 | 3 | 4 | 5; // Response to stress/challenges
    q3_physical_sensations: number[]; // Multiple selection array
    q4_ease: 1 | 2 | 3 | 4 | 5; // At ease in daily life
    q5_desires: 1 | 2 | 3 | 4 | 5; // What you're drawn to/wanting
  };
  
  // Physical SSS-8 Responses (1-5 scale: Not at all → Very much)
  physicalSymptoms: {
    trouble_sleeping: 1 | 2 | 3 | 4 | 5;
    low_energy: 1 | 2 | 3 | 4 | 5;
    headaches: 1 | 2 | 3 | 4 | 5;
    chest_pain_breath: 1 | 2 | 3 | 4 | 5;
    digestive_problems: 1 | 2 | 3 | 4 | 5;
  };
  
  // Calculated Emotional Scores (0-100 scale)
  emotionScores: {
    happiness: number;
    sadness: number;
    anger: number;
    fear: number;
    anxiety: number;
    disgust: number;
    relaxation: number;
    desire: number;
  };
  
  // Physical Burden Assessment
  physicalBurden: {
    totalScore: number; // 5-25 range
    category: 'minimal' | 'low' | 'medium' | 'high' | 'very_high';
    flaggedSymptoms: string[]; // Symptoms with score ≥3
  };
  
  // Metadata
  completedAt: Date;
  skipped: boolean;
  version: string; // Assessment version for future updates
}

export type EmotionCategory = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';

export interface EmotionResult {
  emotion: string;
  score: number;
  category: EmotionCategory;
  emoji: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  
  // Journal
  journalEntries: JournalEntry[];
  currentEntry: string;
  
  // Mood & Emotions
  moodEntries: MoodEntry[];
  
  // Wellbeing Assessment
  hasCompletedWellbeingAssessment: boolean;
  wellbeingAssessment: WellbeingAssessment | null;
  
  // Theme
  isDarkMode: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addJournalEntryWithoutClear: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCurrentEntry: (content: string) => void;
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  toggleTheme: () => void;
  
  // Wellbeing Assessment Actions
  setWellbeingAssessment: (assessment: WellbeingAssessment) => void;
  skipWellbeingAssessment: () => void;
  resetWellbeingAssessment: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      journalEntries: [],
      currentEntry: '',
      moodEntries: [],
      
      // Wellbeing Assessment Initial State
      hasCompletedWellbeingAssessment: false,
      wellbeingAssessment: null,
      
      isDarkMode: false,
      
      // Actions
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null, journalEntries: [], moodEntries: [] }),
      
      addJournalEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          journalEntries: [newEntry, ...state.journalEntries],
          currentEntry: '',
        }));
      },

      addJournalEntryWithoutClear: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          journalEntries: [newEntry, ...state.journalEntries],
        }));
      },
      
      updateCurrentEntry: (content) => set({ currentEntry: content }),
      
      addMoodEntry: (entry) => {
        const newEntry: MoodEntry = {
          ...entry,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          moodEntries: [newEntry, ...state.moodEntries],
        }));
      },
      
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Wellbeing Assessment Actions
      setWellbeingAssessment: (assessment) => set({ 
        wellbeingAssessment: assessment,
        hasCompletedWellbeingAssessment: true 
      }),
      
      skipWellbeingAssessment: () => set({ 
        hasCompletedWellbeingAssessment: true,
        wellbeingAssessment: {
          emotionalResponses: { q1_feeling: 1, q2_stress_response: 1, q3_physical_sensations: [], q4_ease: 1, q5_desires: 1 },
          physicalSymptoms: { trouble_sleeping: 1, low_energy: 1, headaches: 1, chest_pain_breath: 1, digestive_problems: 1 },
          emotionScores: { happiness: 0, sadness: 0, anger: 0, fear: 0, anxiety: 0, disgust: 0, relaxation: 0, desire: 0 },
          physicalBurden: { totalScore: 5, category: 'minimal', flaggedSymptoms: [] },
          completedAt: new Date(),
          skipped: true,
          version: '1.0'
        }
      }),
      
      resetWellbeingAssessment: () => set({ 
        hasCompletedWellbeingAssessment: false,
        wellbeingAssessment: null 
      }),
    }),
    {
      name: 'karmic-wellness-storage',
      partialize: (state) => ({
        ...state,
        currentEntry: '', // Always start with empty currentEntry
      }),
    }
  )
);