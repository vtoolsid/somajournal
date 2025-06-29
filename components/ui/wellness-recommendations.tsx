'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Lightbulb, 
  Moon, 
  Droplets, 
  Activity,
  ChevronRight,
  Clock,
  CheckCircle
} from 'lucide-react';

interface WellnessRecommendation {
  id: string;
  category: 'stress' | 'tension' | 'sleep' | 'anxiety' | 'fatigue' | 'general';
  title: string;
  description: string;
  techniques: string[];
  timeToTry: string;
  evidenceBased: boolean;
  icon: typeof Brain;
}

interface WellnessRecommendationsProps {
  emotions: string[];
  symptoms: string[];
  className?: string;
}

const recommendations: WellnessRecommendation[] = [
  {
    id: 'stress-management',
    category: 'stress',
    title: 'Stress Relief Techniques',
    description: 'Evidence-based methods to reduce stress and promote relaxation',
    techniques: [
      '4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8',
      'Progressive muscle relaxation: Tense and release each muscle group',
      'Take a 5-minute walk outside',
      'Practice the 5-4-3-2-1 grounding technique'
    ],
    timeToTry: '5-10 minutes',
    evidenceBased: true,
    icon: Brain
  },
  {
    id: 'physical-tension',
    category: 'tension',
    title: 'Tension Release',
    description: 'Simple exercises to release physical tension and improve comfort',
    techniques: [
      'Neck rolls: Slowly roll your head in circles',
      'Shoulder blade squeezes: Pull shoulder blades together',
      'Gentle spinal twists while seated',
      'Apply heat or cold therapy to tense areas'
    ],
    timeToTry: '2-5 minutes',
    evidenceBased: true,
    icon: Activity
  },
  {
    id: 'sleep-hygiene',
    category: 'sleep',
    title: 'Better Sleep Practices',
    description: 'Research-backed strategies for improving sleep quality',
    techniques: [
      'Keep bedroom temperature between 65-68°F',
      'No screens 1 hour before bedtime',
      'Create a consistent bedtime routine',
      'Try reading or gentle stretching before bed'
    ],
    timeToTry: 'Evening routine',
    evidenceBased: true,
    icon: Moon
  },
  {
    id: 'anxiety-relief',
    category: 'anxiety',
    title: 'Calming Strategies',
    description: 'Techniques to manage anxious thoughts and feelings',
    techniques: [
      'Box breathing: 4 counts in, hold 4, out 4, hold 4',
      'Name 3 things you can see, hear, and feel',
      'Write down your worries for 5 minutes',
      'Practice self-compassion phrases'
    ],
    timeToTry: '3-10 minutes',
    evidenceBased: true,
    icon: Heart
  },
  {
    id: 'energy-boost',
    category: 'fatigue',
    title: 'Natural Energy Enhancement',
    description: 'Healthy ways to boost energy without stimulants',
    techniques: [
      'Drink a full glass of water',
      'Take 10 deep breaths with good posture',
      'Do 30 seconds of light movement or stretching',
      'Step outside for natural light exposure'
    ],
    timeToTry: '1-5 minutes',
    evidenceBased: true,
    icon: Droplets
  },
  {
    id: 'general-wellness',
    category: 'general',
    title: 'Daily Wellness Habits',
    description: 'Small, sustainable practices for overall well-being',
    techniques: [
      'Set a gentle intention for your day',
      'Practice gratitude: write down 3 things you appreciate',
      'Take regular breaks from work every 90 minutes',
      'Connect with a friend or loved one'
    ],
    timeToTry: 'Throughout the day',
    evidenceBased: true,
    icon: Lightbulb
  }
];

export const WellnessRecommendations = ({ emotions, symptoms, className = '' }: WellnessRecommendationsProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Filter recommendations based on user's emotions and symptoms
  const getRelevantRecommendations = () => {
    const relevantRecs: WellnessRecommendation[] = [];
    
    // Check for stress-related emotions/symptoms
    if (emotions.some(e => ['stress', 'frustrated', 'overwhelmed', 'anxious'].includes(e.toLowerCase())) ||
        symptoms.some(s => ['headache', 'tension'].includes(s))) {
      relevantRecs.push(recommendations.find(r => r.category === 'stress')!);
    }

    // Check for physical tension
    if (symptoms.some(s => ['tension', 'neck_pain', 'back_pain', 'muscle_tension'].includes(s))) {
      relevantRecs.push(recommendations.find(r => r.category === 'tension')!);
    }

    // Check for anxiety
    if (emotions.some(e => ['anxious', 'worried', 'nervous', 'panic'].includes(e.toLowerCase()))) {
      relevantRecs.push(recommendations.find(r => r.category === 'anxiety')!);
    }

    // Check for sleep issues
    if (symptoms.some(s => ['insomnia', 'fatigue'].includes(s)) ||
        emotions.some(e => ['tired', 'exhausted'].includes(e.toLowerCase()))) {
      relevantRecs.push(recommendations.find(r => r.category === 'sleep')!);
    }

    // Check for low energy
    if (symptoms.some(s => ['fatigue'].includes(s)) ||
        emotions.some(e => ['tired', 'low energy', 'drained'].includes(e.toLowerCase()))) {
      relevantRecs.push(recommendations.find(r => r.category === 'fatigue')!);
    }

    // Always include general wellness
    relevantRecs.push(recommendations.find(r => r.category === 'general')!);

    // Remove duplicates and limit to 3 most relevant
    return Array.from(new Set(relevantRecs)).slice(0, 3);
  };

  const relevantRecommendations = getRelevantRecommendations();

  const toggleExpanded = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-slate-800">Wellness Recommendations</h3>
        <Badge variant="secondary" className="text-xs">Evidence-based</Badge>
      </div>

      <div className="grid gap-4">
        {relevantRecommendations.map((rec) => {
          const Icon = rec.icon;
          const isExpanded = expandedCard === rec.id;
          
          return (
            <Card key={rec.id} className="border border-green-100 hover:border-green-200 transition-colors">
              <CardHeader 
                className="cursor-pointer" 
                onClick={() => toggleExpanded(rec.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-slate-800">{rec.title}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {rec.timeToTry}
                    </div>
                    <ChevronRight 
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-800 text-sm">Try these techniques:</h4>
                    <ul className="space-y-2">
                      {rec.techniques.map((technique, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{technique}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-green-50">
                      <p className="text-xs text-slate-500">
                        💡 Start with the technique that feels most accessible to you right now
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-slate-500">
          These recommendations are based on your recent journal patterns. 
          For persistent concerns, consider consulting a healthcare professional.
        </p>
      </div>
    </div>
  );
};