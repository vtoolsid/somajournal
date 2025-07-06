'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmotionScores } from '@/lib/wellbeing/deq-scoring';
import { PhysicalBurden } from '@/lib/wellbeing/sss-scoring';

interface PsychosomaticRecommendationsProps {
  emotionScores: EmotionScores;
  physicalBurden: PhysicalBurden;
}

export function PsychosomaticRecommendations({ 
  emotionScores, 
  physicalBurden 
}: PsychosomaticRecommendationsProps) {
  
  // Generate psychosomatic insights based on emotion-symptom correlations
  const generateInsights = () => {
    const insights: Array<{
      type: 'connection' | 'recommendation' | 'technique' | 'warning';
      title: string;
      description: string;
      emoji: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    // Analyze high emotions and their physical correlations
    const highAnxiety = emotionScores.anxiety >= 60;
    const highSadness = emotionScores.sadness >= 60;
    const highAnger = emotionScores.anger >= 60;
    const highStress = emotionScores.anxiety >= 40 || emotionScores.anger >= 40;
    const lowPositive = emotionScores.happiness <= 30 && emotionScores.relaxation <= 30;

    // High physical burden insights
    if (physicalBurden.category === 'very_high' || physicalBurden.category === 'high') {
      insights.push({
        type: 'warning',
        title: 'Mind-Body Connection Alert',
        description: 'Your high emotional stress levels may be contributing to physical symptoms. Consider both emotional support and medical consultation.',
        emoji: '🚨',
        priority: 'high'
      });
    }

    // Anxiety-Physical Connections
    if (highAnxiety && physicalBurden.flaggedSymptoms.length > 0) {
      insights.push({
        type: 'connection',
        title: 'Anxiety-Body Connection',
        description: 'High anxiety often manifests as physical symptoms like tension, digestive issues, and sleep problems. Your body is responding to emotional stress.',
        emoji: '🔗',
        priority: 'high'
      });

      insights.push({
        type: 'technique',
        title: 'Anxiety Management Techniques',
        description: 'Try deep breathing exercises, progressive muscle relaxation, or mindfulness meditation to reduce both anxiety and physical symptoms.',
        emoji: '🧘‍♀️',
        priority: 'high'
      });
    }

    // Sleep and Emotional State
    if (physicalBurden.flaggedSymptoms.includes('Trouble sleeping') && (highAnxiety || highSadness)) {
      insights.push({
        type: 'connection',
        title: 'Sleep-Emotion Cycle',
        description: 'Poor sleep and emotional distress create a cycle - addressing sleep hygiene can improve emotional regulation.',
        emoji: '🌙',
        priority: 'high'
      });
    }

    // Energy and Motivation
    if (physicalBurden.flaggedSymptoms.includes('Low energy or fatigue') && (highSadness || lowPositive)) {
      insights.push({
        type: 'connection',
        title: 'Energy-Mood Connection',
        description: 'Low energy often accompanies sadness and lack of motivation. Gentle movement and social connection can help break this cycle.',
        emoji: '⚡',
        priority: 'medium'
      });
    }

    // Anger and Physical Tension
    if (highAnger && (physicalBurden.flaggedSymptoms.includes('Headaches') || physicalBurden.flaggedSymptoms.includes('Muscle tension'))) {
      insights.push({
        type: 'technique',
        title: 'Anger Release Techniques',
        description: 'Physical exercise, journaling, or talking to someone can help process anger and reduce associated physical tension.',
        emoji: '🏃‍♂️',
        priority: 'medium'
      });
    }

    // Positive coping when things are going well
    if (physicalBurden.category === 'minimal' && emotionScores.happiness >= 50) {
      insights.push({
        type: 'recommendation',
        title: 'Maintain Your Wellness',
        description: 'You\'re doing great! Continue your current self-care practices and consider them a model for challenging times.',
        emoji: '✨',
        priority: 'low'
      });
    }

    // General stress management
    if (highStress) {
      insights.push({
        type: 'technique',
        title: 'Holistic Stress Management',
        description: 'Consider a multi-faceted approach: regular exercise, healthy nutrition, adequate sleep, and stress-reduction practices.',
        emoji: '🌿',
        priority: 'medium'
      });
    }

    // Digestive-Emotional Connection
    if (physicalBurden.flaggedSymptoms.includes('Digestive problems') && (highAnxiety || highStress)) {
      insights.push({
        type: 'connection',
        title: 'Gut-Brain Connection',
        description: 'Your digestive system is highly sensitive to stress and emotions. Managing emotional stress often improves digestive symptoms.',
        emoji: '🧠',
        priority: 'medium'
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const insights = generateInsights();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'connection': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'technique': return 'bg-green-100 text-green-800 border-green-200';
      case 'recommendation': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'bg-red-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    return variants[priority as keyof typeof variants] || variants.low;
  };

  return (
    <div className="space-y-4">
      {insights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🌱</div>
          <p>Your emotional and physical states appear balanced. Keep up the great work!</p>
        </div>
      ) : (
        insights.map((insight, index) => (
          <Card key={index} className={`border-l-4 ${getTypeColor(insight.type)}`}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{insight.emoji}</span>
                  <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {insight.type}
                  </Badge>
                  <Badge className={getPriorityBadge(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{insight.description}</p>
            </CardContent>
          </Card>
        ))
      )}

      {/* General Wellness Tips */}
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-teal-800 mb-3 flex items-center">
            <span className="text-2xl mr-2">🌟</span>
            Universal Wellness Practices
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-teal-700">
            <div className="flex items-start space-x-2">
              <span>🧘‍♀️</span>
              <span>Practice mindfulness or meditation daily</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>🏃‍♂️</span>
              <span>Engage in regular physical activity</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>😴</span>
              <span>Prioritize 7-9 hours of quality sleep</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>🥗</span>
              <span>Maintain a balanced, nutritious diet</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>👥</span>
              <span>Stay connected with supportive relationships</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>📝</span>
              <span>Continue journaling and self-reflection</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Support Reminder */}
      {physicalBurden.category === 'very_high' || physicalBurden.category === 'high' ? (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">👩‍⚕️</span>
              <h4 className="font-semibold text-yellow-800">Professional Support</h4>
            </div>
            <p className="text-yellow-700 text-sm">
              Given your current symptom levels, we recommend discussing your results with a healthcare provider or mental health professional. 
              They can provide personalized guidance and support for your specific situation.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}