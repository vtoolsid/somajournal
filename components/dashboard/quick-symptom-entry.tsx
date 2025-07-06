'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Zap,
  Clock,
  Sparkles,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface QuickSymptomEntryProps {
  onEntryAdded?: () => void;
}

interface QuickEntry {
  emotion: string;
  symptom: string;
  intensity: number;
  timestamp: Date;
}

interface RecentDiscovery {
  pattern: string;
  confidence: number;
  recommendation: string;
  isNew: boolean;
}

// Quick access emotions and symptoms
const QUICK_EMOTIONS = [
  { name: 'stress', color: '#EF4444', icon: '😰' },
  { name: 'anxiety', color: '#F59E0B', icon: '😟' },
  { name: 'anger', color: '#DC2626', icon: '😠' },
  { name: 'sadness', color: '#3B82F6', icon: '😢' },
  { name: 'joy', color: '#10B981', icon: '😊' },
  { name: 'calm', color: '#059669', icon: '😌' },
  { name: 'overwhelm', color: '#7C2D12', icon: '😵' },
  { name: 'excitement', color: '#F97316', icon: '🤩' }
];

const QUICK_SYMPTOMS = [
  { name: 'headache', region: 'head', severity: 'moderate' },
  { name: 'tension', region: 'shoulders', severity: 'mild' },
  { name: 'chest_tightness', region: 'chest', severity: 'moderate' },
  { name: 'nausea', region: 'stomach', severity: 'moderate' },
  { name: 'muscle_knots', region: 'shoulders', severity: 'severe' },
  { name: 'fatigue', region: 'body', severity: 'mild' },
  { name: 'restlessness', region: 'body', severity: 'mild' },
  { name: 'brain_fog', region: 'head', severity: 'moderate' }
];

const MOCK_DISCOVERIES: RecentDiscovery[] = [
  {
    pattern: "Stress consistently triggers shoulder tension",
    confidence: 87,
    recommendation: "Try neck rolls when feeling stressed",
    isNew: true
  },
  {
    pattern: "Monday anxiety correlates with chest tightness", 
    confidence: 73,
    recommendation: "Practice deep breathing on Sunday evenings",
    isNew: false
  },
  {
    pattern: "Joy shows in reduced physical symptoms",
    confidence: 91,
    recommendation: "Schedule more joyful activities weekly",
    isNew: true
  }
];

export function QuickSymptomEntry({ onEntryAdded }: QuickSymptomEntryProps) {
  const { addJournalEntryWithoutClear } = useAppStore();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentEntries, setRecentEntries] = useState<QuickEntry[]>([]);
  const [showDiscoveries, setShowDiscoveries] = useState(true);

  const handleSubmit = async () => {
    if (!selectedEmotion || !selectedSymptom) return;

    setIsSubmitting(true);
    
    try {
      // Create quick journal entry
      const entry = {
        content: `Quick entry: Feeling ${selectedEmotion} with ${selectedSymptom.replace('_', ' ')}. Intensity: ${intensity}/10`,
        userId: 'user-1',
        emotions: { [selectedEmotion]: intensity / 10 },
        symptoms: { [selectedSymptom]: true },
        tags: ['quick-entry', 'psychosomatic']
      };

      addJournalEntryWithoutClear(entry);

      // Add to recent entries
      const quickEntry: QuickEntry = {
        emotion: selectedEmotion,
        symptom: selectedSymptom,
        intensity,
        timestamp: new Date()
      };
      
      setRecentEntries(prev => [quickEntry, ...prev.slice(0, 4)]);

      // Reset form
      setSelectedEmotion(null);
      setSelectedSymptom(null);
      setIntensity(5);
      
      onEntryAdded?.();
    } catch (error) {
      console.error('Error submitting quick entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeRecentEntry = (index: number) => {
    setRecentEntries(prev => prev.filter((_, i) => i !== index));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'severe': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {/* Quick Entry Interface */}
      <Card className="quick-symptom-entry glass-card animate-fadeInUp">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Quick Symptom Logger
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Fast emotion-body tracking
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Emotion Selection */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              How are you feeling?
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_EMOTIONS.map(emotion => (
                <button
                  key={emotion.name}
                  onClick={() => setSelectedEmotion(emotion.name)}
                  className={`emotion-button p-3 rounded-lg border-2 flex flex-col items-center space-y-1 ${
                    selectedEmotion === emotion.name
                      ? 'selected border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{emotion.icon}</span>
                  <span className="text-xs font-medium capitalize">{emotion.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Selection */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              What is your body experiencing?
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_SYMPTOMS.map(symptom => (
                <button
                  key={symptom.name}
                  onClick={() => setSelectedSymptom(symptom.name)}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                    selectedSymptom === symptom.name
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {symptom.name.replace('_', ' ')}
                    </span>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getSeverityColor(symptom.severity) }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{symptom.region}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          {selectedEmotion && selectedSymptom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Intensity Level: {intensity}/10
              </h4>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10B981 0%, #F59E0B ${intensity * 10}%, #EF4444 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full wellness-button py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Log Pattern</span>
                  </div>
                )}
              </Button>
            </motion.div>
          )}

          {/* Recent Entries */}
          {recentEntries.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Recent Entries
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <AnimatePresence>
                  {recentEntries.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-2 bg-white/60 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium capitalize">{entry.emotion}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-sm capitalize">{entry.symptom.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {entry.intensity}/10
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRecentEntry(index)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Discoveries */}
      <Card className="glass-card-secondary animate-fadeInUp animate-delay-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Recent Discoveries
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  New mind-body patterns
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDiscoveries(!showDiscoveries)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              {showDiscoveries ? 'Hide' : 'Show'}
            </button>
          </div>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence>
            {showDiscoveries && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {MOCK_DISCOVERIES.map((discovery, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      discovery.isNew 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500' 
                        : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {discovery.isNew ? (
                        <Sparkles className="w-4 h-4 text-green-600 mt-0.5 animate-pulse" />
                      ) : (
                        <Target className="w-4 h-4 text-purple-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-semibold text-gray-800 text-sm">
                            {discovery.pattern}
                          </h5>
                          {discovery.isNew && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {discovery.recommendation}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${discovery.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-purple-600">
                            {discovery.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Action recommendations */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-800 text-sm">
                        Actionable Insights
                      </h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Based on your patterns, try gentle shoulder stretches when you feel stressed, 
                        and consider scheduling relaxing activities on Sunday evenings.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}