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
import { KarmicAura } from '@/components/ui/karmic-aura';
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
  const { currentEntry, updateCurrentEntry, addJournalEntry, user } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [showCeremony, setShowCeremony] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEntry.trim()) return;

    // Prevent submission for future dates
    const entryDate = selectedDate || new Date();
    if (entryDate > new Date()) {
      return;
    }

    setIsAnalyzing(true);
    setShowCeremony(true);

    setTimeout(() => {
      const analysisResult = analyzeJournalEntry(currentEntry);
      setAnalysis(analysisResult);
      
      addJournalEntry({
        content: currentEntry,
        userId: user?.id || '',
        location: 'San Francisco, CA',
        weather: '☀️ 72°F',
        tags: tags,
        ...analysisResult,
      });
      
      setIsAnalyzing(false);
      setShowCeremony(false);
      setSelectedEntry(null);
      setTags([]);
    }, 3000);
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

  const getKarmaColor = (value: number) => {
    if (value > 0.3) return 'text-emerald-600';
    if (value < -0.3) return 'text-red-500';
    return 'text-slate-500';
  };

  const getKarmaDotColor = (value: number) => {
    if (value > 0.3) return 'bg-emerald-400';
    if (value < -0.3) return 'bg-red-400';
    return 'bg-blue-400';
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
          <FloatingParticles count={20} />
          <div className="relative z-10">
            <BreathingLoader message="Your words are being analyzed with care..." />
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
                            <div className={`w-3 h-3 rounded-full ${getKarmaDotColor(entry.karmicValue)}`} />
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
                          <span>Karmic Analysis</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Karmic Value</p>
                              <div className={`text-2xl font-bold ${getKarmaColor(selectedEntry.karmicValue)}`}>
                                {(selectedEntry.karmicValue * 100).toFixed(0)}%
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Emotions</p>
                              <div className="flex flex-wrap gap-1">
                                {Object.keys(selectedEntry.emotions).map((emotion) => (
                                  <Badge key={emotion} variant="outline" className="text-xs">
                                    {emotion}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
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
                      onChange={(e) => updateCurrentEntry(e.target.value)}
                      className="flex-1 resize-none border-0 text-base lg:text-lg leading-relaxed focus:ring-0 bg-transparent placeholder:text-gray-400 min-h-32 lg:min-h-0"
                    />
                    
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}