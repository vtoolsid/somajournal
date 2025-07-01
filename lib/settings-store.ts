import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'green' | 'blue' | 'purple';
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  
  // Privacy & Data
  locationSharing: boolean;
  dataRetention: '30days' | '1year' | 'forever';
  analyticsOptOut: boolean;
  shareAnonymousData: boolean;
  journalVisibility: 'private' | 'selected' | 'public';
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'never';
  reminderTime: string; // HH:MM format
  insightNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  
  // Journal & Analysis
  autoSave: boolean;
  analysisLevel: 'basic' | 'detailed' | 'comprehensive';
  defaultLocation: string;
  emotionAnalysisEnabled: boolean;
  psychosomaticAnalysisEnabled: boolean;
  
  // Advanced
  betaFeatures: boolean;
  developerMode: boolean;
  exportFormat: 'json' | 'csv' | 'pdf';
  
  // Actions
  updateAppearance: (settings: Partial<Pick<SettingsState, 'theme' | 'fontSize' | 'colorScheme' | 'layoutDensity'>>) => void;
  updatePrivacy: (settings: Partial<Pick<SettingsState, 'locationSharing' | 'dataRetention' | 'analyticsOptOut' | 'shareAnonymousData' | 'journalVisibility'>>) => void;
  updateNotifications: (settings: Partial<Pick<SettingsState, 'emailNotifications' | 'pushNotifications' | 'reminderFrequency' | 'reminderTime' | 'insightNotifications' | 'quietHoursEnabled' | 'quietHoursStart' | 'quietHoursEnd'>>) => void;
  updateJournal: (settings: Partial<Pick<SettingsState, 'autoSave' | 'analysisLevel' | 'defaultLocation' | 'emotionAnalysisEnabled' | 'psychosomaticAnalysisEnabled'>>) => void;
  updateAdvanced: (settings: Partial<Pick<SettingsState, 'betaFeatures' | 'developerMode' | 'exportFormat'>>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

const defaultSettings = {
  // Appearance defaults
  theme: 'light' as const,
  fontSize: 'medium' as const,
  colorScheme: 'green' as const,
  layoutDensity: 'comfortable' as const,
  
  // Privacy defaults (privacy-first approach)
  locationSharing: false,
  dataRetention: '1year' as const,
  analyticsOptOut: true,
  shareAnonymousData: false,
  journalVisibility: 'private' as const,
  
  // Notification defaults
  emailNotifications: true,
  pushNotifications: false, // Default off for privacy
  reminderFrequency: 'never' as const,
  reminderTime: '19:00',
  insightNotifications: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  
  // Journal defaults
  autoSave: true,
  analysisLevel: 'detailed' as const,
  defaultLocation: '',
  emotionAnalysisEnabled: true,
  psychosomaticAnalysisEnabled: true,
  
  // Advanced defaults
  betaFeatures: false,
  developerMode: false,
  exportFormat: 'json' as const,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      // Actions
      updateAppearance: (settings) => {
        set((state) => ({ ...state, ...settings }));
      },
      
      updatePrivacy: (settings) => {
        set((state) => ({ ...state, ...settings }));
      },
      
      updateNotifications: (settings) => {
        set((state) => ({ ...state, ...settings }));
      },
      
      updateJournal: (settings) => {
        set((state) => ({ ...state, ...settings }));
      },
      
      updateAdvanced: (settings) => {
        set((state) => ({ ...state, ...settings }));
      },
      
      resetToDefaults: () => {
        set(defaultSettings);
      },
      
      exportSettings: () => {
        const currentSettings = get();
        const exportData = {
          ...currentSettings,
          // Remove functions from export
          updateAppearance: undefined,
          updatePrivacy: undefined,
          updateNotifications: undefined,
          updateJournal: undefined,
          updateAdvanced: undefined,
          resetToDefaults: undefined,
          exportSettings: undefined,
          importSettings: undefined,
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importSettings: (settingsJson: string) => {
        try {
          const importedSettings = JSON.parse(settingsJson);
          // Validate and merge with current settings
          const validatedSettings = {
            ...defaultSettings,
            ...importedSettings,
          };
          set(validatedSettings);
          return true;
        } catch (error) {
          console.error('Failed to import settings:', error);
          return false;
        }
      },
    }),
    {
      name: 'wellness-app-settings',
      version: 1,
      // Only persist the settings data, not the functions
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        colorScheme: state.colorScheme,
        layoutDensity: state.layoutDensity,
        locationSharing: state.locationSharing,
        dataRetention: state.dataRetention,
        analyticsOptOut: state.analyticsOptOut,
        shareAnonymousData: state.shareAnonymousData,
        journalVisibility: state.journalVisibility,
        emailNotifications: state.emailNotifications,
        pushNotifications: state.pushNotifications,
        reminderFrequency: state.reminderFrequency,
        reminderTime: state.reminderTime,
        insightNotifications: state.insightNotifications,
        quietHoursEnabled: state.quietHoursEnabled,
        quietHoursStart: state.quietHoursStart,
        quietHoursEnd: state.quietHoursEnd,
        autoSave: state.autoSave,
        analysisLevel: state.analysisLevel,
        defaultLocation: state.defaultLocation,
        emotionAnalysisEnabled: state.emotionAnalysisEnabled,
        psychosomaticAnalysisEnabled: state.psychosomaticAnalysisEnabled,
        betaFeatures: state.betaFeatures,
        developerMode: state.developerMode,
        exportFormat: state.exportFormat,
      }),
      migrate: (persistedState: any, version: number) => {
        // Handle future version migrations
        if (version === 0) {
          // Migrate from version 0 to 1
          return {
            ...defaultSettings,
            ...persistedState,
          };
        }
        return persistedState;
      },
    }
  )
);