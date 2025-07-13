'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BreathingLoader } from '@/components/ui/breathing-loader';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { PsychosomaticInsights } from '@/components/ui/psychosomatic-insights';
import { PsychosomaticBodyMap } from '@/components/wellness/psychosomatic-body-map';
import { useAppStore } from '@/lib/store';
import { useSettingsStore } from '@/lib/settings-store';
import { mockJournalEntries, analyzeJournalEntry } from '@/lib/mock-data';
import { mapEmotionsToBody, generateSymptomSuggestions } from '@/lib/wellness/emotion-body-mapping';
import { 
  BookOpen, 
  Heart,
  Sparkles,
  Calendar as CalendarIcon,
  List,
  MapPin,
  Tag,
  Paperclip,
  Clock,
  Feather,
  Star,
  Activity,
  Target,
  ArrowRight
} from 'lucide-react';

export default function JournalPage() {
  const { currentEntry, updateCurrentEntry, addJournalEntry, addJournalEntryWithoutClear, user, journalEntries } = useAppStore();
  const { locationSharing, updatePrivacy } = useSettingsStore();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [showCeremony, setShowCeremony] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<'analyzing' | 'processing' | 'preparing' | null>(null);
  const [previewEmotions, setPreviewEmotions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [emotionPreview, setEmotionPreview] = useState<any>(null);
  const [previewTimeout, setPreviewTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Location state management
  const [locationStatus, setLocationStatus] = useState<'initial' | 'loading' | 'granted' | 'denied' | 'unavailable' | 'error'>('initial');
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [locationError, setLocationError] = useState<string | null>(null);

  // ESC key handler for modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDetailModal) {
        setShowDetailModal(false);
      }
    };

    if (showDetailModal) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showDetailModal]);

  // Live timer effect - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Watch for changes in location sharing setting
  useEffect(() => {
    if (!locationSharing && locationStatus === 'granted') {
      // When user disables location sharing via settings, keep the granted status 
      // but hide the location data in the UI (handled by conditional rendering)
      console.log('Location sharing disabled via settings');
    }
  }, [locationSharing, locationStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Reflect button clicked!');
    console.log('📝 Current entry text:', currentEntry);
    
    if (!currentEntry.trim()) {
      console.log('❌ No text entered, aborting submission');
      return;
    }

    // Prevent submission for future dates
    const entryDate = selectedDate || new Date();
    if (entryDate > new Date()) {
      console.log('❌ Future date selected, aborting submission');
      return;
    }

    console.log('⏳ Starting analysis process...');
    setIsAnalyzing(true);
    setShowCeremony(true);
    setAnalysisPhase('analyzing');
    setPreviewEmotions([]);
    setAnalysisError(null);

    // Phase 1: Initial Analysis (2-3 seconds)
    setTimeout(() => {
      setAnalysisPhase('processing');
      console.log('📊 Moving to processing phase...');
    }, 2500);

    // Phase 2: Processing (show preview emotions)
    setTimeout(() => {
      // Extract some preview emotions from the text (simple keywords for preview)
      const possibleEmotions = ['joy', 'gratitude', 'peace', 'excitement', 'hope', 'love'];
      const textLower = currentEntry.toLowerCase();
      const detected = possibleEmotions.filter(emotion => 
        textLower.includes(emotion) || 
        (emotion === 'joy' && textLower.includes('happy')) ||
        (emotion === 'gratitude' && textLower.includes('grateful'))
      ).slice(0, 3);
      
      if (detected.length === 0) {
        // Default preview emotions based on positivity
        const hasPositiveWords = ['good', 'great', 'wonderful', 'amazing', 'love'].some(word => textLower.includes(word));
        detected.push(hasPositiveWords ? 'joy' : 'contemplation');
      }
      
      setPreviewEmotions(detected);
      console.log('🎭 Preview emotions:', detected);
    }, 3500);

    // Phase 3: Preparing Results
    setTimeout(() => {
      setAnalysisPhase('preparing');
      console.log('📋 Preparing results...');
    }, 5500);

    try {
      console.log('🧠 Calling BERT emotion analysis...');
      
      // Ensure minimum ceremony duration
      const startTime = Date.now();
      
      // Use real BERT emotion analysis
      const analysisResult = await analyzeJournalEntry(currentEntry);
      console.log('✅ Analysis completed:', analysisResult);
      
      // Calculate remaining wait time to ensure minimum 7 seconds total
      const elapsedTime = Date.now() - startTime;
      const remainingWait = Math.max(0, 7000 - elapsedTime);
      
      // Wait for remaining time if needed
      if (remainingWait > 0) {
        console.log(`⏱️ Waiting ${remainingWait}ms for ceremony completion...`);
        await new Promise(resolve => setTimeout(resolve, remainingWait));
      }
      
      setAnalysis(analysisResult);
      setShowResults(true);
      console.log('📊 Analysis state updated, showing results to user');
      
      const newEntry = {
        content: currentEntry,
        userId: user?.id || '',
        location: locationSharing && locationStatus === 'granted' ? currentLocation : undefined,
        tags: tags,
        ...analysisResult,
      };
      
      console.log('💾 Adding journal entry to store:', newEntry);
      addJournalEntryWithoutClear(newEntry);
      
      // Transition out of ceremony
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowCeremony(false);
        setAnalysisPhase(null);
        setTags([]);
        setEmotionPreview(null);
        console.log('🎉 Successfully completed journal entry submission - results displayed');
      }, 500);
      
    } catch (error) {
      console.error('❌ Analysis failed with error:', error);
      console.error('📍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'UnknownError'
      });
      setIsAnalyzing(false);
      setShowCeremony(false);
      setAnalysisPhase(null);
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
      console.log('💥 Error state set, user will see error message');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const startNewEntry = () => {
    console.log('🆕 Starting new journal entry');
    setShowResults(false);
    setAnalysis(null);
    setAnalysisError(null);
    setSelectedEntry(null);
    updateCurrentEntry('');
    setTags([]);
    setEmotionPreview(null);
    setAnalysisPhase(null);
    setPreviewEmotions([]);
  };

  // Real-time emotion preview as user types
  const updateEmotionPreview = async (text: string) => {
    if (!text.trim()) {
      setEmotionPreview(null);
      return;
    }

    // Clear previous timeout
    if (previewTimeout) {
      clearTimeout(previewTimeout);
    }

    // Set new timeout for debounced preview
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch('/api/preview-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        if (response.ok) {
          const preview = await response.json();
          setEmotionPreview(preview);
        }
      } catch (error) {
        console.error('Preview analysis failed:', error);
        // Simple fallback preview
        const wordCount = text.trim().split(' ').length;
        setEmotionPreview({
          emotion_count: wordCount < 10 ? 1 : wordCount < 50 ? 2 : 3,
          strategy: wordCount < 10 ? 'Focus on primary emotion' : 'Balanced analysis',
          text_type: wordCount < 10 ? 'Quick note' : 'Entry',
          word_count: wordCount
        });
      }
    }, 500); // 500ms debounce

    setPreviewTimeout(timeout);
  };

  // Update current entry and trigger preview
  const handleTextChange = (value: string) => {
    updateCurrentEntry(value);
    updateEmotionPreview(value);
  };

  const getEmotionColor = (emotions: Record<string, number>) => {
    const positiveEmotions = ['joy', 'gratitude', 'peace', 'love', 'contentment'];
    const hasPositive = Object.keys(emotions).some(emotion => positiveEmotions.includes(emotion.toLowerCase()));
    return hasPositive ? 'text-emerald-600' : 'text-slate-500';
  };

  const getEmotionDotColor = (emotions: Record<string, number>) => {
    const positiveEmotions = ['joy', 'gratitude', 'peace', 'love', 'contentment'];
    const hasPositive = Object.keys(emotions).some(emotion => positiveEmotions.includes(emotion.toLowerCase()));
    return hasPositive ? 'bg-emerald-400' : 'bg-blue-400';
  };

  // Geolocation functions
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using BigDataCloud's free API (no API key required)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      // Format as "City, State" or "City, Country"
      const city = data.city || data.locality || 'Unknown City';
      const region = data.principalSubdivision || data.countryName || 'Unknown Region';
      
      return `${city}, ${region}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown Location';
    }
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setLocationStatus('loading');
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLocationStatus('granted');
          const { latitude, longitude } = position.coords;
          
          // Get city-level location (not exact coordinates)
          const locationName = await reverseGeocode(latitude, longitude);
          setCurrentLocation(locationName);
          
          // Enable location sharing in settings when user grants permission
          updatePrivacy({ locationSharing: true });
        } catch (error) {
          console.error('Location processing error:', error);
          setLocationStatus('error');
          setLocationError('Failed to get location name');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus('denied');
            setLocationError('Location access denied by user');
            // Update settings store to reflect permission denial
            updatePrivacy({ locationSharing: false });
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus('unavailable');
            setLocationError('Location information unavailable');
            break;
          case error.TIMEOUT:
            setLocationStatus('error');
            setLocationError('Location request timed out');
            break;
          default:
            setLocationStatus('error');
            setLocationError('An unknown error occurred');
            break;
        }
      },
      {
        enableHighAccuracy: false, // Better for privacy and battery
        timeout: 10000, // 10 second timeout
        maximumAge: 300000 // 5 minute cache
      }
    );
  };

  const getOnThisDayEntry = () => {
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}-${today.getDate()}`;
    
    // Combine actual entries with mock entries for "on this day" feature
    const allEntries = [...journalEntries, ...mockJournalEntries];
    return allEntries.find(entry => {
      const entryDate = new Date(entry.createdAt);
      const entryStr = `${entryDate.getMonth() + 1}-${entryDate.getDate()}`;
      return entryStr === todayStr && entryDate.getFullYear() !== today.getFullYear();
    });
  };

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toDateString();
    // Combine actual entries with mock entries for calendar display
    const allEntries = [...journalEntries, ...mockJournalEntries];
    return allEntries.filter(entry => 
      new Date(entry.createdAt).toDateString() === dateStr
    );
  };

  const getDatesWithEntries = () => {
    // Combine actual entries with mock entries for calendar highlighting
    const allEntries = [...journalEntries, ...mockJournalEntries];
    return allEntries.map(entry => new Date(entry.createdAt));
  };

  const onThisDayEntry = getOnThisDayEntry();

  if (showCeremony) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <FloatingParticles count={analysisPhase === 'preparing' ? 40 : analysisPhase === 'processing' ? 30 : 20} />
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <BreathingLoader 
                message={
                  analysisPhase === 'analyzing' 
                    ? "Centering your thoughts..." 
                    : analysisPhase === 'processing'
                    ? "Discovering emotional patterns..."
                    : analysisPhase === 'preparing'
                    ? "Preparing your insights..."
                    : "Your words are being analyzed with care..."
                } 
              />
            </div>
            
            {/* Enhanced Progress Indicator with Wellness Themes */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              {/* Phase 1: Centering */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center ${
                  analysisPhase ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg scale-110' : 'bg-gray-300'
                }`}>
                  {analysisPhase && (
                    <div className="w-2 h-2 bg-white rounded-full breathing-element"></div>
                  )}
                </div>
                <span className={`text-xs font-medium transition-all duration-500 ${
                  analysisPhase ? 'text-green-700' : 'text-gray-400'
                }`}>Centering</span>
              </div>
              
              {/* Phase 2: Analyzing */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center ${
                  analysisPhase === 'processing' || analysisPhase === 'preparing' ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg scale-110' : 'bg-gray-300'
                }`}>
                  {(analysisPhase === 'processing' || analysisPhase === 'preparing') && (
                    <div className="w-2 h-2 bg-white rounded-full breathing-element"></div>
                  )}
                </div>
                <span className={`text-xs font-medium transition-all duration-500 ${
                  analysisPhase === 'processing' || analysisPhase === 'preparing' ? 'text-emerald-700' : 'text-gray-400'
                }`}>Patterns</span>
              </div>
              
              {/* Phase 3: Insights */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center ${
                  analysisPhase === 'preparing' ? 'bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg scale-110' : 'bg-gray-300'
                }`}>
                  {analysisPhase === 'preparing' && (
                    <div className="w-2 h-2 bg-white rounded-full breathing-element"></div>
                  )}
                </div>
                <span className={`text-xs font-medium transition-all duration-500 ${
                  analysisPhase === 'preparing' ? 'text-green-700' : 'text-gray-400'
                }`}>Insights</span>
              </div>
            </div>
            
            {/* Preview Emotions - Hidden during analysis to maintain professional appearance */}
            {false && previewEmotions.length > 0 && analysisPhase !== 'analyzing' && (
              <div className="mt-8 animate-fade-in">
                <p className="text-sm text-gray-600 mb-3">Detecting emotions...</p>
                <div className="flex justify-center space-x-2">
                  {previewEmotions.map((emotion, index) => (
                    <div
                      key={emotion}
                      className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-sm text-gray-700 animate-fade-in"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      {emotion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <FloatingParticles count={6} />
        
        <div className="relative z-10 flex flex-col lg:flex-row h-screen">
          {/* Left Pane - History & Navigation */}
          <div className="w-full lg:w-[22%] bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col max-h-96 lg:max-h-none">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <Feather className="w-4 h-4 text-green-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">Journal</h1>
              </div>
              
              {/* View Toggle */}
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => {
                setViewMode(value as 'list' | 'calendar');
                if (value === 'calendar') {
                  setSelectedEntry(null); // Clear selected entry when switching to calendar
                }
              }} className="hidden lg:flex">
                <ToggleGroupItem value="list" className="flex-1 data-[state=on]:bg-green-100 data-[state=on]:text-green-700 data-[state=on]:border-green-300">
                  <List className="w-4 h-4 mr-2" />
                  List
                </ToggleGroupItem>
                <ToggleGroupItem value="calendar" className="flex-1 data-[state=on]:bg-green-100 data-[state=on]:text-green-700 data-[state=on]:border-green-300">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendar
                </ToggleGroupItem>
              </ToggleGroup>
              
              {/* Mobile View Toggle */}
              <div className="flex lg:hidden space-x-2">
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setViewMode('list')}
                  className={`flex-1 ${viewMode === 'list' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button 
                  variant={viewMode === 'calendar' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => {
                    setViewMode('calendar');
                    setSelectedEntry(null); // Clear selected entry when switching to calendar
                  }}
                  className={`flex-1 ${viewMode === 'calendar' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
              </div>
            </div>

            {/* On This Day */}
            {onThisDayEntry && (
              <div className="p-4 border-b border-gray-100 hidden lg:block">
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-600" />
                      <CardTitle className="text-sm text-amber-800">On This Day</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-amber-700 mb-2">
                      {new Date(onThisDayEntry.createdAt).getFullYear()}
                    </p>
                    <p className="text-sm text-amber-800 line-clamp-2">
                      {onThisDayEntry.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {viewMode === 'list' ? (
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-3">
                    {/* Show actual journal entries first, then mock entries */}
                    {[...journalEntries, ...mockJournalEntries].map((entry) => (
                      <Card 
                        key={entry.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedEntry?.id === entry.id 
                            ? 'ring-2 ring-green-500 bg-green-50 hover:bg-green-100' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              selectedEntry?.id === entry.id 
                                ? 'text-green-700 bg-green-200' 
                                : 'text-gray-500 bg-gray-100'
                            }`}>
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                            <div className={`w-3 h-3 rounded-full ${getEmotionDotColor(entry.emotions)}`} />
                          </div>
                          <p className={`text-sm line-clamp-3 ${
                            selectedEntry?.id === entry.id 
                              ? 'text-green-800' 
                              : 'text-gray-700'
                          }`}>
                            {entry.content}
                          </p>
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {entry.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {entry.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{entry.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-8">
                    {/* Display 2 months: previous and current */}
                    {[-1, 0].map((monthOffset) => {
                      const currentMonth = new Date();
                      currentMonth.setMonth(currentMonth.getMonth() + monthOffset);
                      const monthEntries = getEntriesForDate(currentMonth);
                      
                      return (
                        <div key={monthOffset} className="space-y-4">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              // Only allow selection of dates up to today
                              if (date && date <= new Date()) {
                                setSelectedDate(date);
                              }
                            }}
                            month={currentMonth}
                            className="w-full dayone-calendar"
                            today={new Date()}
                            disabled={(date) => date > new Date()} // Disable future dates
                            modifiers={{
                              hasEntry: getDatesWithEntries(),
                            }}
                            modifiersClassNames={{
                              hasEntry: "has-journal-entry"
                            }}
                          />
                          
                          {/* Day One-inspired day view for selected date */}
                          {selectedDate && 
                           selectedDate.getMonth() === currentMonth.getMonth() && 
                           selectedDate.getFullYear() === currentMonth.getFullYear() && (
                            <div className="px-2 pb-4">
                              {(() => {
                                const dayEntries = getEntriesForDate(selectedDate);
                                const isToday = selectedDate.toDateString() === new Date().toDateString();
                                const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
                                const dateStr = selectedDate.toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric',
                                  year: 'numeric'
                                });

                                return (
                                  <div className="space-y-4">
                                    {/* Day Header - Day One Style */}
                                    <div className="border-b border-gray-100 pb-3">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h2 className="text-lg font-semibold text-gray-800">
                                            {isToday ? 'Today' : dayName}
                                          </h2>
                                          <p className="text-sm text-gray-500">
                                            {isToday ? dateStr : selectedDate.toLocaleDateString('en-US', { 
                                              month: 'long', 
                                              day: 'numeric',
                                              year: 'numeric'
                                            })}
                                          </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {dayEntries.length > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                              {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Entries or Empty State */}
                                    {dayEntries.length > 0 ? (
                                      <div className="space-y-3">
                                        {dayEntries.map((entry, index) => (
                                          <Card 
                                            key={entry.id}
                                            className={`cursor-pointer transition-all duration-200 border-l-4 ${
                                              selectedEntry?.id === entry.id 
                                                ? 'border-l-green-500 bg-green-50 hover:bg-green-100 shadow-md' 
                                                : 'border-l-gray-200 hover:border-l-green-300 hover:bg-gray-50 hover:shadow-sm'
                                            }`}
                                            onClick={() => setSelectedEntry(entry)}
                                          >
                                            <CardContent className="p-4">
                                              <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                  <div className={`w-2 h-2 rounded-full ${getEmotionDotColor(entry.emotions)}`} />
                                                  <span className="text-xs text-gray-500 font-medium">
                                                    {new Date(entry.createdAt).toLocaleTimeString('en-US', { 
                                                      hour: 'numeric', 
                                                      minute: '2-digit'
                                                    })}
                                                  </span>
                                                </div>
                                                {entry.tags && entry.tags.length > 0 && (
                                                  <div className="flex space-x-1">
                                                    {entry.tags.slice(0, 2).map((tag) => (
                                                      <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
                                                        {tag}
                                                      </Badge>
                                                    ))}
                                                    {entry.tags.length > 2 && (
                                                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                                        +{entry.tags.length - 2}
                                                      </Badge>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                              <p className={`text-sm leading-relaxed line-clamp-3 ${
                                                selectedEntry?.id === entry.id 
                                                  ? 'text-green-800' 
                                                  : 'text-gray-700'
                                              }`}>
                                                {entry.content}
                                              </p>
                                              {entry.location && (
                                                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                                                  <MapPin className="w-3 h-3" />
                                                  <span>{entry.location}</span>
                                                </div>
                                              )}
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    ) : (
                                      /* Empty State - Day One Style */
                                      <div className="text-center py-8 px-4">
                                        <div className="mb-4">
                                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Feather className="w-6 h-6 text-gray-400" />
                                          </div>
                                          <h3 className="text-sm font-medium text-gray-700 mb-1">
                                            No entries for this day
                                          </h3>
                                          <p className="text-xs text-gray-500 leading-relaxed">
                                            {isToday 
                                              ? "Start writing about your day, thoughts, or feelings." 
                                              : "No journal entries were created on this date."
                                            }
                                          </p>
                                        </div>
                                        
                                        {/* Add Entry Button - Only for today or past dates */}
                                        {selectedDate <= new Date() && (
                                          <Button
                                            onClick={() => {
                                              setSelectedEntry(null);
                                              setSelectedDate(selectedDate);
                                              setViewMode('list'); // Switch back to editor view
                                              updateCurrentEntry(''); // Clear any existing text
                                              console.log('📝 Starting new entry for selected date:', selectedDate);
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all hover:scale-105"
                                            size="sm"
                                          >
                                            <Feather className="w-4 h-4 mr-2" />
                                            {isToday ? 'Start Writing' : 'Add Entry'}
                                          </Button>
                                        )}
                                        
                                        {/* Future date message */}
                                        {selectedDate > new Date() && (
                                          <p className="text-xs text-amber-600 mt-2">
                                            You can only create entries for today or past dates.
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          {/* Right Pane - Editor/Detail View */}
          <div className="w-full lg:w-[78%] bg-white flex flex-col">
            {selectedEntry ? (
              /* Entry Detail View */
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedEntry(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ← Back to Editor
                    </Button>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(selectedEntry.createdAt).toLocaleString()}</span>
                      </div>
                      {selectedEntry.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedEntry.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="prose max-w-none mb-8">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {selectedEntry.content}
                    </p>
                  </div>

                  {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Psychosomatic Analysis */}
                  <div className="mt-8">
                    <div className="flex items-center space-x-2 mb-6">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Comprehensive Analysis</h3>
                      {selectedEntry.fallback && (
                        <Badge variant="secondary" className="text-xs">Fallback Mode</Badge>
                      )}
                      {selectedEntry.psychosomatic && (
                        <Badge className="bg-blue-600 text-white text-xs">Evidence-based</Badge>
                      )}
                    </div>
                    
                    <PsychosomaticInsights 
                      emotions={Object.entries(selectedEntry.emotions || {}).map(([emotion, confidence]) => ({
                        emotion,
                        confidence: typeof confidence === 'number' ? confidence : 0.5
                      }))}
                      psychosomaticData={selectedEntry.psychosomatic || {
                        psychosomatic_analysis: selectedEntry.psychosomatic_analysis,
                        personalized_insights: selectedEntry.personalized_insights,
                        wellness_recommendations: selectedEntry.wellness_recommendations
                      }}
                      className="mb-6"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Editor View */
              <div className="flex-1 p-4 lg:p-8 pb-4">
                <div className="max-w-3xl mx-auto h-full flex flex-col">
                  <div className="mb-4 lg:mb-6">
                    <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">New Entry</h2>
                    {selectedDate && selectedDate > new Date() ? (
                      <p className="text-amber-600 text-sm lg:text-base">
                        You can only create journal entries for today or past dates. Please select a different date.
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm lg:text-base">Let your thoughts flow freely...</p>
                    )}
                  </div>

                  {/* Metadata Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-2 lg:space-y-0 mb-4 lg:mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {selectedDate && selectedDate.toDateString() !== new Date().toDateString() 
                          ? selectedDate.toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : currentTime.toLocaleString()
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {!locationSharing && locationStatus === 'granted' ? (
                        <span className="text-gray-500">Location disabled in settings</span>
                      ) : locationStatus === 'initial' ? (
                        <button 
                          onClick={requestLocation}
                          className="text-green-600 hover:text-green-700 underline decoration-dotted"
                        >
                          📍 Enable Location
                        </button>
                      ) : locationStatus === 'loading' ? (
                        <span className="flex items-center space-x-1">
                          <div className="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin"></div>
                          <span>Getting location...</span>
                        </span>
                      ) : locationStatus === 'granted' && locationSharing ? (
                        <span>{currentLocation}</span>
                      ) : locationStatus === 'denied' ? (
                        <span className="text-gray-500">Location access denied</span>
                      ) : (
                        <span className="text-gray-500" title={locationError || undefined}>
                          Location unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <Textarea
                      placeholder="Write your thoughts here..."
                      value={currentEntry}
                      onChange={(e) => handleTextChange(e.target.value)}
                      className="flex-1 resize-none border-0 text-base lg:text-lg leading-relaxed focus:ring-0 bg-transparent placeholder:text-gray-400 min-h-32 lg:min-h-0"
                    />
                    
                    {/* Emotion Preview */}
                    {emotionPreview && currentEntry.trim() && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Sparkles className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Will detect {emotionPreview.emotion_count} emotion{emotionPreview.emotion_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="text-xs text-green-600">
                            {emotionPreview.text_type} • {emotionPreview.strategy}
                          </div>
                        </div>
                        {emotionPreview.word_count && (
                          <div className="mt-1 text-xs text-green-600">
                            {emotionPreview.word_count} words
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Tagging System */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <Input
                          placeholder="Add tags (press Enter)"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleAddTag}
                          className="flex-1"
                        />
                      </div>
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 text-gray-500 hover:text-gray-700"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 lg:mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                      <div className="flex items-center space-x-4">
                        <Button type="button" variant="ghost" size="sm" className="hidden lg:flex">
                          <Paperclip className="w-4 h-4 mr-2" />
                          Attach
                        </Button>
                        <span className="text-sm text-gray-500">
                          {currentEntry.length} characters
                        </span>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={!currentEntry.trim() || isAnalyzing || (selectedDate && selectedDate > new Date())}
                        className="bg-green-600 hover:bg-green-700 w-full lg:w-auto"
                      >
                        {isAnalyzing ? (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 mr-2" />
                            Reflect
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Psychosomatic Analysis Results Display */}
                  {showResults && analysis && (
                    <div className="mt-4 mb-12 animate-fade-in">
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                Your Reflection Analysis
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                {analysis.fallback && (
                                  <Badge variant="secondary" className="text-xs">Fallback Mode</Badge>
                                )}
                                {analysis.psychosomatic && (
                                  <Badge className="bg-blue-600 text-white text-xs">
                                    Evidence-based
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={startNewEntry}
                            variant="outline"
                            size="sm"
                            className="border-green-200 text-green-700 hover:bg-green-50 transition-all hover:scale-105"
                          >
                            New Entry
                          </Button>
                        </div>

                        {/* Psychosomatic Analysis Results */}
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Enhanced Analysis Summary Card */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-400/5 to-green-500/10 rounded-3xl blur-xl"></div>
                              <Card className="relative bg-white/70 backdrop-blur-md border border-green-200/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                      <Heart className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-800">Analysis Summary</h3>
                                      <p className="text-sm text-gray-600">Your mind-body connection insights</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-green-600 text-white">Evidence-based</Badge>
                                    {analysis.psychosomatic?.personalized_insights?.gpt_enhanced && (
                                      <Badge className="bg-emerald-600 text-white">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        AI-Enhanced
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Primary Emotion & Body Response */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                      <Sparkles className="w-4 h-4 text-green-600" />
                                      <span>Primary Emotion Detected</span>
                                    </h4>
                                    <div className="p-3 bg-white rounded-lg border border-green-200">
                                      <p className="text-lg font-semibold text-green-800 capitalize">
                                        {analysis.psychosomatic?.primary_emotion || analysis.emotions?.[0]?.emotion || 'Neutral'}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {analysis.psychosomatic?.psychosomatic_analysis?.intensity || 'Moderate'} intensity
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                      <Activity className="w-4 h-4 text-emerald-600" />
                                      <span>Body Response</span>
                                    </h4>
                                    <div className="p-3 bg-white rounded-lg border border-emerald-200">
                                      <p className="text-sm text-gray-700">
                                        {analysis.psychosomatic?.psychosomatic_analysis?.bodily_sensations || 
                                         'Your body is responding to your emotional state'}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Key Wellness Recommendations */}
                                {analysis.psychosomatic?.wellness_recommendations && (
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                      <Target className="w-4 h-4 text-green-600" />
                                      <span>Immediate Recommendations</span>
                                    </h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                      {analysis.psychosomatic.wellness_recommendations.immediate_techniques?.slice(0, 2).map((technique: string, index: number) => (
                                        <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                                          <p className="text-sm text-green-800">{technique}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Personalized Insight Preview */}
                                {analysis.psychosomatic?.personalized_insights?.encouragement && (
                                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center space-x-2">
                                      <Star className="w-4 h-4" />
                                      <span>Personal Insight</span>
                                    </h4>
                                    <p className="text-sm text-green-700 italic">
                                      "{analysis.psychosomatic.personalized_insights.encouragement}"
                                    </p>
                                  </div>
                                )}

                              </CardContent>
                              </Card>
                            </div>

                            {/* Psychosomatic Body Map */}
                            <div className="mt-6">
                              <PsychosomaticBodyMap
                                emotions={analysis.emotions || {}}
                                symptoms={analysis.symptoms || {}}
                                onRegionClick={(region, data) => {
                                  console.log('Body region clicked:', region, data);
                                }}
                                className="max-w-2xl mx-auto"
                                interactive={true}
                              />
                            </div>

                            {/* View Detailed Analysis Button */}
                            <div className="mt-3 mb-4 flex justify-center">
                              <Button
                                onClick={() => setShowDetailModal(true)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3"
                                size="lg"
                              >
                                <Sparkles className="w-5 h-5 mr-2" />
                                View Detailed Analysis
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </Button>
                            </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Analysis Modal */}
                  {showDetailModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                      {/* Backdrop */}
                      <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setShowDetailModal(false)}
                      ></div>
                      
                      {/* Modal Content */}
                      <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                              <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800">Detailed Psychosomatic Analysis</h2>
                              <p className="text-sm text-gray-600">Complete mind-body connection insights</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDetailModal(false)}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 p-0"
                          >
                            ×
                          </Button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                          <PsychosomaticInsights 
                            emotions={analysis?.emotions ? Object.entries(analysis.emotions).map(([emotion, confidence]) => ({
                              emotion,
                              confidence: typeof confidence === 'number' ? confidence : 0.5
                            })) : []}
                            psychosomaticData={analysis?.psychosomatic || {
                              psychosomatic_analysis: analysis?.psychosomatic_analysis,
                              personalized_insights: analysis?.personalized_insights,
                              wellness_recommendations: analysis?.wellness_recommendations
                            }}
                            className=""
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {analysisError && (
                    <div className="mt-8">
                      <div className="border-t pt-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-400 rounded-full mr-3"></div>
                            <div>
                              <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
                              <p className="text-sm text-red-700 mt-1">{analysisError}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
