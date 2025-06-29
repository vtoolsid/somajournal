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
  karmicValue: number; // -1.0 to 1.0
  emotions: Record<string, number>;
  symptoms: Record<string, boolean>;
  mediaUrl?: string;
  location?: string;
  weather?: string;
  tags?: string[];
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

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  
  // Journal
  journalEntries: JournalEntry[];
  currentEntry: string;
  
  // Mood & Emotions
  moodEntries: MoodEntry[];
  
  // Theme
  isDarkMode: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCurrentEntry: (content: string) => void;
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  toggleTheme: () => void;
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
    }),
    {
      name: 'karmic-wellness-storage',
    }
  )
);