'use client';

import { useState } from 'react';
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
import { useAppStore } from '@/lib/store';
import { mockJournalEntries, analyzeJournalEntry } from '@/lib/mock-data';
import { 
  BookOpen, 
  Heart,
  Sparkles,
  Calendar as CalendarIcon,
  List,
  MapPin,
  Cloud,
  Tag,
  Paperclip,
  Clock,
  Feather,
  Star
} from 'lucide-react';

export default function JournalPage() {
  const { currentEntry, updateCurrentEntry, addJournalEntry, addJournalEntryWithoutClear, user } = useAppStore();
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
        location: 'San Francisco, CA',
        weather: '☀️ 72°F',
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
        message: error.message,
        stack: error.stack,
        name: error.name
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

  const getOnThisDayEntry = () => {
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}-${today.getDate()}`;
    
    return mockJournalEntries.find(entry => {
      const entryDate = new Date(entry.createdAt);
      const entryStr = `${entryDate.getMonth() + 1}-${entryDate.getDate()}`;
      return entryStr === todayStr && entryDate.getFullYear() !== today.getFullYear();
    });
  };

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return mockJournalEntries.filter(entry => 
      new Date(entry.createdAt).toDateString() === dateStr
    );
  };

  const getDatesWithEntries = () => {
    return mockJournalEntries.map(entry => new Date(entry.createdAt));
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
                    ? "Analyzing your emotions..." 
                    : analysisPhase === 'processing'
                    ? "Discovering emotional patterns..."
                    : analysisPhase === 'preparing'
                    ? "Preparing your reflection..."
                    : "Your words are being analyzed with care..."
                } 
              />
            </div>
            
            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2 mb-4">
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                analysisPhase ? 'bg-green-600' : 'bg-gray-300'
              }`} />
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                analysisPhase === 'processing' || analysisPhase === 'preparing' ? 'bg-green-600' : 'bg-gray-300'
              }`} />
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                analysisPhase === 'preparing' ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            </div>
            
            {/* Preview Emotions */}
            {previewEmotions.length > 0 && analysisPhase !== 'analyzing' && (
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
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')} className="hidden lg:flex">
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
                  onClick={() => setViewMode('calendar')}
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
                    {mockJournalEntries.map((entry) => (
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
                          
                          {/* Show entries for selected date if it's in this month */}
                          {selectedDate && 
                           selectedDate.getMonth() === currentMonth.getMonth() && 
                           selectedDate.getFullYear() === currentMonth.getFullYear() && 
                           getEntriesForDate(selectedDate).length > 0 && (
                            <div className="space-y-2 px-2">
                              <h3 className="text-sm font-medium text-gray-700">
                                Entries for {selectedDate.toLocaleDateString()}
                              </h3>
                              {getEntriesForDate(selectedDate).map((entry) => (
                                <Card 
                                  key={entry.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md ${
                                    selectedEntry?.id === entry.id 
                                      ? 'ring-2 ring-green-500 bg-green-50 hover:bg-green-100' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => setSelectedEntry(entry)}
                                >
                                  <CardContent className="p-3">
                                    <p className={`text-sm line-clamp-2 ${
                                      selectedEntry?.id === entry.id 
                                        ? '!text-green-800 hover:!text-green-900' 
                                        : 'text-gray-700 hover:text-gray-800'
                                    }`}>
                                      {entry.content}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
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
                      {selectedEntry.weather && (
                        <div className="flex items-center space-x-1">
                          <Cloud className="w-4 h-4" />
                          <span>{selectedEntry.weather}</span>
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

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="analysis">
                      <AccordionTrigger>
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Emotion Analysis</span>
                          {selectedEntry.fallback && (
                            <Badge variant="secondary" className="text-xs">Fallback</Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6">
                          {/* Emotions Display */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Detected Emotions</p>
                              <div className="space-y-2">
                                {Object.entries(selectedEntry.emotions).map(([emotion, confidence]) => (
                                  <div key={emotion} className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs">
                                      {emotion}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {typeof confidence === 'number' ? `${(confidence * 100).toFixed(0)}%` : 'detected'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Physical Symptoms</p>
                              <div className="space-y-1">
                                {Object.entries(selectedEntry.symptoms || {}).map(([symptom, present]) => (
                                  <div key={symptom} className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${present ? 'bg-red-400' : 'bg-gray-200'}`} />
                                    <span className={`text-xs ${present ? 'text-gray-700' : 'text-gray-400'}`}>
                                      {symptom.replace('_', ' ')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Adaptive Analysis Info */}
                          {selectedEntry.analysis && (
                            <div className="border-t pt-4">
                              <p className="text-sm font-medium text-gray-700 mb-3">Adaptive Analysis</p>
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                                <div>
                                  <p className="text-gray-600">Text Type</p>
                                  <p className="font-medium text-gray-800 capitalize">
                                    {selectedEntry.analysis.text_type?.replace('_', ' ')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Emotional Richness</p>
                                  <p className="font-medium text-gray-800 capitalize">
                                    {selectedEntry.analysis.emotional_richness}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Strategy Used</p>
                                  <p className="font-medium text-gray-800">
                                    {selectedEntry.analysis.recommended_approach}
                                  </p>
                                </div>
                              </div>
                              
                              {selectedEntry.characteristics && (
                                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                                  <div>
                                    <p className="text-gray-600">Word Count</p>
                                    <p className="font-medium">{selectedEntry.characteristics.word_count || selectedEntry.analysis.word_count}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Threshold</p>
                                    <p className="font-medium">{selectedEntry.analysis.threshold_used || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Max Emotions</p>
                                    <p className="font-medium">{selectedEntry.analysis.max_emotions || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Complexity</p>
                                    <p className="font-medium">
                                      {selectedEntry.characteristics.complexity_score ? 
                                        (selectedEntry.characteristics.complexity_score * 100).toFixed(0) + '%' : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {selectedEntry.adaptive_info && (
                                <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                                  <p className="text-green-800">
                                    <span className="font-medium">Strategy:</span> {selectedEntry.adaptive_info.reasoning}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            ) : (
              /* Editor View */
              <div className="flex-1 p-4 lg:p-8">
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
                      <span>{(selectedDate || new Date()).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Cloud className="w-4 h-4" />
                      <span>☀️ 72°F</span>
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

                  {/* Analysis Results Display */}
                  {showResults && analysis && (
                    <div className="mt-8 animate-fade-in">
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Sparkles className="w-5 h-5 mr-2 text-green-600 animate-pulse" />
                            Your Reflection Analysis
                            {analysis.fallback && (
                              <Badge variant="secondary" className="text-xs ml-2">Fallback Mode</Badge>
                            )}
                          </h3>
                          <Button 
                            onClick={startNewEntry}
                            variant="outline"
                            size="sm"
                            className="border-green-200 text-green-700 hover:bg-green-50 transition-all hover:scale-105"
                          >
                            New Entry
                          </Button>
                        </div>

                        <div className="wellness-card bg-gradient-to-br from-green-50 via-white to-emerald-50 border border-green-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                          <div className="space-y-6">
                            {/* Emotions Display */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">Detected Emotions</p>
                                <div className="space-y-2">
                                  {Object.entries(analysis.emotions).map(([emotion, confidence], index) => (
                                    <div 
                                      key={emotion} 
                                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100 hover:border-green-300 transition-all animate-fade-in hover:shadow-md"
                                      style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                      <Badge variant="outline" className="text-sm font-medium">
                                        {emotion}
                                      </Badge>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
                                            style={{ width: `${(confidence as number) * 100}%` }}
                                          />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 min-w-[45px] text-right">
                                          {typeof confidence === 'number' ? `${(confidence * 100).toFixed(0)}%` : 'detected'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-3">Physical Symptoms</p>
                                <div className="space-y-1">
                                  {Object.entries(analysis.symptoms || {}).map(([symptom, present], index) => (
                                    <div 
                                      key={symptom} 
                                      className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-green-100 animate-fade-in"
                                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                                    >
                                      <div className={`w-3 h-3 rounded-full transition-all ${
                                        present ? 'bg-red-400 animate-pulse' : 'bg-gray-200'
                                      }`} />
                                      <span className={`text-sm ${present ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                                        {symptom.replace('_', ' ')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Adaptive Analysis Info */}
                            {analysis.analysis && (
                              <div className="border-t border-green-200 pt-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Adaptive Analysis</p>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                                  <div className="p-3 bg-white rounded border border-green-100">
                                    <p className="text-gray-600">Text Type</p>
                                    <p className="font-medium text-gray-800 capitalize">
                                      {analysis.analysis.text_type?.replace('_', ' ')}
                                    </p>
                                  </div>
                                  <div className="p-3 bg-white rounded border border-green-100">
                                    <p className="text-gray-600">Emotional Richness</p>
                                    <p className="font-medium text-gray-800 capitalize">
                                      {analysis.analysis.emotional_richness}
                                    </p>
                                  </div>
                                  <div className="p-3 bg-white rounded border border-green-100">
                                    <p className="text-gray-600">Strategy Used</p>
                                    <p className="font-medium text-gray-800">
                                      {analysis.analysis.recommended_approach}
                                    </p>
                                  </div>
                                </div>
                                
                                {analysis.characteristics && (
                                  <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                    <div className="p-2 bg-white rounded border border-green-100">
                                      <p className="text-gray-600">Word Count</p>
                                      <p className="font-medium">{analysis.characteristics.word_count || analysis.analysis.word_count}</p>
                                    </div>
                                    <div className="p-2 bg-white rounded border border-green-100">
                                      <p className="text-gray-600">Threshold</p>
                                      <p className="font-medium">{analysis.analysis.threshold_used || 'N/A'}</p>
                                    </div>
                                    <div className="p-2 bg-white rounded border border-green-100">
                                      <p className="text-gray-600">Max Emotions</p>
                                      <p className="font-medium">{analysis.analysis.max_emotions || 'N/A'}</p>
                                    </div>
                                    <div className="p-2 bg-white rounded border border-green-100">
                                      <p className="text-gray-600">Complexity</p>
                                      <p className="font-medium">
                                        {analysis.characteristics.complexity_score ? 
                                          (analysis.characteristics.complexity_score * 100).toFixed(0) + '%' : 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {analysis.adaptive_info && (
                                  <div className="mt-3 p-3 bg-green-100 rounded border border-green-200 text-sm">
                                    <p className="text-green-800">
                                      <span className="font-medium">Strategy:</span> {analysis.adaptive_info.reasoning}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
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
                          <Button 
                            onClick={startNewEntry}
                            variant="outline"
                            size="sm"
                            className="mt-3 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            Try Again
                          </Button>
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