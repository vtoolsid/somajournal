'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmotionScores, getEmotionEmoji, categorizeEmotionScore, getTopEmotions } from '@/lib/wellbeing/deq-scoring';

interface EmotionSummaryTableProps {
  emotionScores: EmotionScores;
}

export function EmotionSummaryTable({ emotionScores }: EmotionSummaryTableProps) {
  const topEmotions = getTopEmotions(emotionScores, 3);
  
  const getCategoryColor = (score: number) => {
    const category = categorizeEmotionScore(score);
    switch (category) {
      case 'very_low': return 'text-gray-500';
      case 'low': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'very_high': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getCategoryBadge = (score: number) => {
    const category = categorizeEmotionScore(score);
    const colorMap = {
      'very_low': 'bg-gray-100 text-gray-700',
      'low': 'bg-blue-100 text-blue-700',
      'moderate': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-orange-100 text-orange-700',
      'very_high': 'bg-red-100 text-red-700',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[category]}`}>
        {category.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Emotions Highlight */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
          <span className="text-xl mr-2">🏆</span>
          Top Emotional States
        </h4>
        <div className="grid gap-2">
          {topEmotions.map((emotion, index) => (
            <div key={emotion.emotion} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getEmotionEmoji(emotion.emotion)}</span>
                <span className="font-medium capitalize">{emotion.emotion}</span>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-bold ${getCategoryColor(emotion.score)}`}>
                  {emotion.score}%
                </span>
                {getCategoryBadge(emotion.score)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Emotion Breakdown */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <span className="text-xl mr-2">📊</span>
          Complete Emotional Analysis
        </h4>
        
        {Object.entries(emotionScores).map(([emotion, score]) => (
          <div key={emotion} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getEmotionEmoji(emotion)}</span>
                <span className="font-medium capitalize text-gray-700">{emotion}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-bold ${getCategoryColor(score)}`}>
                  {score}%
                </span>
                {getCategoryBadge(score)}
              </div>
            </div>
            <Progress 
              value={score} 
              className="h-2"
            />
          </div>
        ))}
      </div>

      {/* Emotional Balance Insights */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
          <span className="text-xl mr-2">💡</span>
          Emotional Balance Insights
        </h4>
        <div className="text-sm text-blue-700 space-y-1">
          {(() => {
            const highEmotions = Object.entries(emotionScores).filter(([_, score]) => score >= 60);
            const positiveEmotions = Object.entries(emotionScores).filter(([emotion, score]) => 
              ['happiness', 'relaxation', 'desire'].includes(emotion) && score >= 40
            );
            const negativeEmotions = Object.entries(emotionScores).filter(([emotion, score]) => 
              ['sadness', 'anger', 'fear', 'anxiety', 'disgust'].includes(emotion) && score >= 40
            );

            const insights = [];
            
            if (highEmotions.length === 0) {
              insights.push("🌱 Your emotions are generally balanced with no dominant states");
            } else if (highEmotions.length === 1) {
              insights.push(`🎯 ${highEmotions[0][0]} is your primary emotional state right now`);
            } else {
              insights.push(`🌊 You're experiencing multiple strong emotions: ${highEmotions.map(([e]) => e).join(', ')}`);
            }

            if (positiveEmotions.length > negativeEmotions.length) {
              insights.push("✨ You're showing more positive emotional patterns overall");
            } else if (negativeEmotions.length > positiveEmotions.length) {
              insights.push("🤗 Consider focusing on self-care and stress management techniques");
            } else {
              insights.push("⚖️ You have a balanced mix of positive and challenging emotions");
            }

            return insights.map((insight, index) => (
              <p key={index}>• {insight}</p>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}