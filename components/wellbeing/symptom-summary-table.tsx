'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  SSSSymptoms, 
  PhysicalBurden, 
  symptomLabels, 
  scaleLabels,
  categoryDescriptions,
  categoryEmojis,
  getSymptomSeverity,
  getSymptomEmoji,
  analyzeSymptoms,
  getPhysicalRecommendations
} from '@/lib/wellbeing/sss-scoring';

interface SymptomSummaryTableProps {
  physicalSymptoms: SSSSymptoms;
  physicalBurden: PhysicalBurden;
}

export function SymptomSummaryTable({ physicalSymptoms, physicalBurden }: SymptomSummaryTableProps) {
  const symptomAnalysis = analyzeSymptoms(physicalSymptoms);
  const recommendations = getPhysicalRecommendations(physicalBurden);
  
  const getBurdenColor = (category: PhysicalBurden['category']) => {
    switch (category) {
      case 'minimal': return 'text-green-600';
      case 'low': return 'text-yellow-600';
      case 'medium': return 'text-orange-600';
      case 'high': return 'text-red-600';
      case 'very_high': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  const getBurdenProgress = (totalScore: number) => {
    return ((totalScore - 5) / 20) * 100; // Convert 5-25 range to 0-100%
  };

  return (
    <div className="space-y-6">
      {/* Overall Burden Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
          <span className="text-xl mr-2">{categoryEmojis[physicalBurden.category]}</span>
          Physical Symptom Burden
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-800">
              {physicalBurden.totalScore}/25
            </div>
            <div className="text-sm text-blue-600">Total Score</div>
          </div>
          <div>
            <div className={`text-lg font-semibold capitalize ${getBurdenColor(physicalBurden.category)}`}>
              {physicalBurden.category.replace('_', ' ')}
            </div>
            <div className="text-sm text-blue-600">Burden Level</div>
          </div>
        </div>
        <div className="mt-3">
          <Progress 
            value={getBurdenProgress(physicalBurden.totalScore)} 
            className="h-3"
          />
          <div className="text-xs text-blue-600 mt-1">
            {categoryDescriptions[physicalBurden.category]}
          </div>
        </div>
      </div>

      {/* Individual Symptoms Breakdown */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <span className="text-xl mr-2">🔍</span>
          Individual Symptom Analysis
        </h4>
        
        {symptomAnalysis.map((symptom) => (
          <Card key={symptom.symptom} className={`p-4 ${symptom.flagged ? 'border-orange-200 bg-orange-25' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{symptom.emoji}</span>
                <span className="font-medium text-gray-700">{symptom.symptom}</span>
                {symptom.flagged && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                    Flagged
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{symptom.score}/5</div>
                <div className="text-sm text-gray-500 capitalize">{symptom.severity}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{scaleLabels[symptom.score]}</span>
              <Progress value={(symptom.score / 5) * 100} className="w-20 h-2" />
            </div>
          </Card>
        ))}
      </div>

      {/* Flagged Symptoms Alert */}
      {physicalBurden.flaggedSymptoms.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            Symptoms Requiring Attention
          </h4>
          <div className="space-y-1">
            {physicalBurden.flaggedSymptoms.map((symptom, index) => (
              <div key={index} className="text-sm text-orange-700">
                • {symptom} (rated 3 or higher)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💚</span>
          Personalized Recommendations
        </h4>
        <div className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="text-sm text-green-700 flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-xl mr-2">📈</span>
          Score Distribution
        </h4>
        <div className="grid grid-cols-5 gap-2 text-xs text-center">
          {[1, 2, 3, 4, 5].map((score) => {
            const count = Object.values(physicalSymptoms).filter(s => s === score).length;
            return (
              <div key={score} className="space-y-1">
                <div className="font-medium">{score}</div>
                <div className="text-gray-600">{scaleLabels[score as keyof typeof scaleLabels]}</div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(count / 5) * 100}%` }}
                  />
                </div>
                <div className="font-medium">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}