'use client';

import { useState, useEffect } from 'react';
import { PsychosomaticBodyMap } from '@/components/wellness/psychosomatic-body-map';
import { mapEmotionsToBody, generateSymptomSuggestions } from '@/lib/wellness/emotion-body-mapping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Heart, Brain, Activity, Sparkles } from 'lucide-react';

// Sample emotion data for demonstration
const DEMO_EMOTIONS = {
  'stress': 0.7,
  'anxiety': 0.5,
  'sadness': 0.3,
  'frustration': 0.4
};

const SAMPLE_JOURNAL_ENTRIES = [
  {
    title: "Stressful Day at Work",
    emotions: { 'stress': 0.8, 'overwhelm': 0.6, 'frustration': 0.4 },
    text: "Had a really overwhelming day with back-to-back meetings. Feeling the weight on my shoulders."
  },
  {
    title: "Feeling Anxious",
    emotions: { 'anxiety': 0.7, 'worry': 0.5, 'fear': 0.3 },
    text: "Can't shake this anxious feeling in my stomach. Keep thinking about tomorrow's presentation."
  },
  {
    title: "Sad Evening",
    emotions: { 'sadness': 0.6, 'loneliness': 0.4, 'grief': 0.3 },
    text: "Missing my family tonight. Feel a heaviness in my chest and heart area."
  },
  {
    title: "Angry About Traffic",
    emotions: { 'anger': 0.8, 'frustration': 0.9, 'irritation': 0.6 },
    text: "Stuck in traffic for an hour! My jaw is so tense and I can feel the anger in my neck and shoulders."
  },
  {
    title: "Joyful Moment",
    emotions: { 'joy': 0.8, 'love': 0.6, 'excitement': 0.5 },
    text: "Such a wonderful day with friends! My heart feels so full and I'm practically glowing with happiness."
  }
];

export default function BodyMapDemo() {
  const [currentEmotions, setCurrentEmotions] = useState(DEMO_EMOTIONS);
  const [selectedEntry, setSelectedEntry] = useState(0);
  const [bodyData, setBodyData] = useState({});
  const [symptoms, setSymptoms] = useState({});

  // Update body map when emotions change
  useEffect(() => {
    const mappedBody = mapEmotionsToBody(currentEmotions);
    const suggestedSymptoms = generateSymptomSuggestions(mappedBody);
    
    setBodyData(mappedBody);
    setSymptoms(suggestedSymptoms);
  }, [currentEmotions]);

  const handleEntrySelect = (index: number) => {
    setSelectedEntry(index);
    setCurrentEmotions(SAMPLE_JOURNAL_ENTRIES[index].emotions);
  };

  const handleEmotionIntensityChange = (emotion: string, value: number[]) => {
    setCurrentEmotions(prev => ({
      ...prev,
      [emotion]: value[0]
    }));
  };

  const handleRegionClick = (region: string, data: any) => {
    console.log('Clicked region:', region, data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/30 to-teal-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
              Psychosomatic Body Map
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize how your emotions connect to physical sensations in your body
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Sample Journal Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  <span>Sample Journal Entries</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SAMPLE_JOURNAL_ENTRIES.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedEntry === index
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                    }`}
                    onClick={() => handleEntrySelect(index)}
                  >
                    <h4 className="font-medium text-sm text-gray-800 mb-1">{entry.title}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{entry.text}</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(entry.emotions).slice(0, 3).map(([emotion, intensity]) => (
                        <Badge key={emotion} variant="secondary" className="text-xs">
                          {emotion} {Math.round(intensity * 100)}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emotion Intensity Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Emotion Intensity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(currentEmotions).map(([emotion, intensity]) => (
                  <div key={emotion} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium capitalize">{emotion}</label>
                      <span className="text-sm text-gray-600">{Math.round(intensity * 100)}%</span>
                    </div>
                    <Slider
                      value={[intensity]}
                      onValueChange={(value) => handleEmotionIntensityChange(emotion, value)}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Body Map */}
          <div className="lg:col-span-1">
            <PsychosomaticBodyMap
              emotions={currentEmotions}
              symptoms={symptoms}
              onRegionClick={handleRegionClick}
              interactive={true}
            />
          </div>

          {/* Right Panel - Analysis */}
          <div className="space-y-6">
            {/* Detected Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Detected Symptoms</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(symptoms)
                    .filter(([, present]) => present)
                    .map(([symptom]) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-sm capitalize">
                          {symptom.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  {Object.values(symptoms).every(v => !v) && (
                    <p className="text-sm text-gray-500 italic">
                      No symptoms detected at current intensity levels
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Body Region Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Affected Body Regions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.values(bodyData)
                    .filter((region: any) => region.intensity > 0.1)
                    .sort((a: any, b: any) => b.intensity - a.intensity)
                    .slice(0, 5)
                    .map((region: any) => (
                      <div key={region.region} className="border-l-4 border-blue-400 pl-3">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium text-sm capitalize">
                            {region.region.replace(/-/g, ' ')}
                          </h4>
                          <span className="text-xs text-gray-600">
                            {Math.round(region.intensity * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{region.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {region.primaryEmotions.slice(0, 2).map((emotion: string) => (
                            <Badge key={emotion} variant="outline" className="text-xs">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Integration Note */}
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <h4 className="font-medium text-green-800 mb-2">Integration Complete ✅</h4>
                <p className="text-sm text-green-700 mb-3">
                  This body map component is now fully integrated with your journal entries, 
                  BERT emotion analysis, and wellness tracking system.
                </p>
                <div className="space-y-2 text-xs text-green-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Real-time emotion-to-body mapping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Integrated with journal analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Zustand store & Supabase sync ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Responsive design & accessibility</span>
                  </div>
                </div>
                <Button 
                  onClick={() => window.open('/journal', '_blank')}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  View in Journal →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}