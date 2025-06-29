'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Zap, 
  Shield, 
  Sunrise,
  Wind,
  TreePine,
  Lightbulb
} from 'lucide-react';

interface EmotionGuidance {
  emotion: string;
  category: 'challenging' | 'positive' | 'complex';
  description: string;
  healthyExpression: string[];
  copingStrategies: string[];
  journalPrompts: string[];
  physicalTechniques: string[];
  icon: typeof Heart;
  color: string;
}

interface EmotionGuidanceProps {
  emotions: string[];
  className?: string;
}

const emotionGuidanceMap: Record<string, EmotionGuidance> = {
  anger: {
    emotion: 'Anger',
    category: 'challenging',
    description: 'A natural response to perceived threats, injustice, or frustration. Anger can provide energy for positive change when channeled constructively.',
    healthyExpression: [
      'Express through physical movement (walk, exercise)',
      'Use "I" statements when communicating needs',
      'Channel energy into problem-solving or advocacy',
      'Practice assertiveness rather than aggression'
    ],
    copingStrategies: [
      'Count to 10 before responding',
      'Take slow, deep breaths',
      'Remove yourself from the situation temporarily',
      'Write down your feelings without censoring'
    ],
    journalPrompts: [
      'What boundary was crossed that triggered this anger?',
      'What do I need that I\'m not getting?',
      'How can I use this energy constructively?',
      'What would I say if I felt completely safe to express myself?'
    ],
    physicalTechniques: [
      'Progressive muscle relaxation',
      'Intense exercise or movement',
      'Cold water on wrists and face',
      'Squeeze and release your fists 10 times'
    ],
    icon: Zap,
    color: 'bg-red-50 border-red-200'
  },
  anxiety: {
    emotion: 'Anxiety',
    category: 'challenging',
    description: 'A response to uncertainty or perceived threats. While uncomfortable, anxiety can help us prepare and stay alert to important details.',
    healthyExpression: [
      'Acknowledge the feeling without judgment',
      'Share concerns with trusted friends or family',
      'Break overwhelming tasks into smaller steps',
      'Focus on what you can control'
    ],
    copingStrategies: [
      'Practice 4-7-8 breathing technique',
      'Use the 5-4-3-2-1 grounding method',
      'Challenge anxious thoughts with evidence',
      'Create a calming environment'
    ],
    journalPrompts: [
      'What am I really worried about?',
      'What evidence supports or contradicts this worry?',
      'What would I tell a friend experiencing this?',
      'What small step can I take right now?'
    ],
    physicalTechniques: [
      'Box breathing (4-4-4-4 pattern)',
      'Gentle yoga or stretching',
      'Warm bath or shower',
      'Hold an ice cube to engage your senses'
    ],
    icon: Shield,
    color: 'bg-yellow-50 border-yellow-200'
  },
  sadness: {
    emotion: 'Sadness',
    category: 'challenging',
    description: 'A natural response to loss, disappointment, or unmet needs. Sadness helps us process difficult experiences and seek support.',
    healthyExpression: [
      'Allow yourself to feel without rushing to "fix" it',
      'Reach out to supportive people',
      'Engage in gentle, nurturing activities',
      'Honor what you\'re grieving or missing'
    ],
    copingStrategies: [
      'Practice self-compassion',
      'Engage in gentle movement',
      'Listen to music that resonates',
      'Spend time in nature if possible'
    ],
    journalPrompts: [
      'What am I grieving or letting go of?',
      'What support do I need right now?',
      'How can I be gentle with myself today?',
      'What small thing would bring me comfort?'
    ],
    physicalTechniques: [
      'Gentle stretching or yoga',
      'Warm compress on chest or back',
      'Slow, mindful walking',
      'Hug a pillow or pet'
    ],
    icon: Heart,
    color: 'bg-blue-50 border-blue-200'
  },
  stress: {
    emotion: 'Stress',
    category: 'challenging',
    description: 'Your body\'s response to demands or pressures. Short-term stress can enhance performance, while chronic stress needs management.',
    healthyExpression: [
      'Identify and communicate your limits',
      'Prioritize tasks and delegate when possible',
      'Take regular breaks throughout the day',
      'Ask for help when needed'
    ],
    copingStrategies: [
      'Break large tasks into smaller ones',
      'Practice time management techniques',
      'Set realistic expectations',
      'Create boundaries between work and rest'
    ],
    journalPrompts: [
      'What aspects of this situation can I control?',
      'What support or resources do I need?',
      'How can I simplify my current responsibilities?',
      'What would "good enough" look like here?'
    ],
    physicalTechniques: [
      'Progressive muscle relaxation',
      'Deep breathing exercises',
      'Quick walk or movement break',
      'Massage temples and neck'
    ],
    icon: Brain,
    color: 'bg-orange-50 border-orange-200'
  },
  joy: {
    emotion: 'Joy',
    category: 'positive',
    description: 'A wonderful feeling of happiness and contentment. Joy reminds us what matters most and energizes us for life\'s challenges.',
    healthyExpression: [
      'Share your joy with others',
      'Savor the moment mindfully',
      'Express gratitude for what\'s going well',
      'Use this energy for creative pursuits'
    ],
    copingStrategies: [
      'Notice and appreciate the details',
      'Take photos or write about joyful moments',
      'Plan activities that cultivate more joy',
      'Share positive experiences with loved ones'
    ],
    journalPrompts: [
      'What specifically is bringing me joy right now?',
      'How can I cultivate more of this feeling?',
      'Who would I like to share this joy with?',
      'What does this joy teach me about what I value?'
    ],
    physicalTechniques: [
      'Dance or move your body freely',
      'Take deep breaths to anchor the feeling',
      'Smile and notice how it feels',
      'Stretch your arms up to the sky'
    ],
    icon: Sunrise,
    color: 'bg-green-50 border-green-200'
  },
  gratitude: {
    emotion: 'Gratitude',
    category: 'positive',
    description: 'Appreciation for what you have and what others do for you. Gratitude strengthens relationships and increases life satisfaction.',
    healthyExpression: [
      'Tell people specifically what you appreciate',
      'Write thank you notes or messages',
      'Keep a daily gratitude practice',
      'Pay kindness forward to others'
    ],
    copingStrategies: [
      'Start each day noting three things you\'re grateful for',
      'Focus on small, everyday blessings',
      'Thank people in person when possible',
      'Notice beauty in ordinary moments'
    ],
    journalPrompts: [
      'What am I most grateful for today?',
      'Who has made a positive difference in my life recently?',
      'What challenge has taught me something valuable?',
      'What simple pleasure brought me joy today?'
    ],
    physicalTechniques: [
      'Place hand on heart while reflecting',
      'Take slow, appreciative breaths',
      'Look up at the sky and appreciate its vastness',
      'Give yourself or others a gentle hug'
    ],
    icon: TreePine,
    color: 'bg-emerald-50 border-emerald-200'
  }
};

export const EmotionGuidance = ({ emotions, className = '' }: EmotionGuidanceProps) => {
  // Get guidance for detected emotions
  const getRelevantGuidance = () => {
    const guidanceList: EmotionGuidance[] = [];
    
    emotions.forEach(emotion => {
      const emotionKey = emotion.toLowerCase();
      if (emotionGuidanceMap[emotionKey]) {
        guidanceList.push(emotionGuidanceMap[emotionKey]);
      }
    });

    // If no specific matches, provide general emotional wellness guidance
    if (guidanceList.length === 0) {
      return [{
        emotion: 'Emotional Wellness',
        category: 'positive' as const,
        description: 'Taking time to understand and care for your emotions is a valuable practice for overall well-being.',
        healthyExpression: [
          'Name your emotions as you notice them',
          'Practice self-compassion',
          'Connect with supportive people',
          'Engage in activities that nourish you'
        ],
        copingStrategies: [
          'Take three deep breaths when overwhelmed',
          'Use mindful observation of your feelings',
          'Journal about your experiences',
          'Practice gentle movement or stretching'
        ],
        journalPrompts: [
          'How am I feeling right now, really?',
          'What do I need most in this moment?',
          'What would self-care look like today?',
          'What am I learning about myself lately?'
        ],
        physicalTechniques: [
          'Gentle stretching or yoga',
          'Deep breathing exercises',
          'Mindful walking',
          'Progressive relaxation'
        ],
        icon: Lightbulb,
        color: 'bg-purple-50 border-purple-200'
      }];
    }

    return guidanceList.slice(0, 2); // Limit to 2 most relevant
  };

  const relevantGuidance = getRelevantGuidance();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-slate-800">Emotion Guidance</h3>
        <Badge variant="secondary" className="text-xs">Evidence-based</Badge>
      </div>

      <div className="space-y-4">
        {relevantGuidance.map((guidance) => {
          const Icon = guidance.icon;
          
          return (
            <Card key={guidance.emotion} className={`${guidance.color} border`}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-slate-800">{guidance.emotion}</CardTitle>
                    <Badge 
                      variant={guidance.category === 'positive' ? 'default' : 'secondary'} 
                      className="text-xs mt-1"
                    >
                      {guidance.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2">{guidance.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-800 text-sm mb-2">Healthy Expression:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {guidance.healthyExpression.slice(0, 2).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 text-sm mb-2">Coping Strategies:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {guidance.copingStrategies.slice(0, 2).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 text-sm mb-2">Journal Prompt:</h4>
                  <p className="text-sm text-slate-600 italic bg-white/50 p-3 rounded">
                    &ldquo;{guidance.journalPrompts[0]}&rdquo;
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          💡 Remember: All emotions are valid and temporary. Be patient and kind with yourself.
        </p>
      </div>
    </div>
  );
};