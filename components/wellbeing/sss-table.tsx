'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SSSSymptoms, symptomLabels, scaleLabels } from '@/lib/wellbeing/sss-scoring';

interface SSSTableProps {
  onAnswer: (symptoms: SSSSymptoms) => void;
  selectedSymptoms?: SSSSymptoms;
}

export function SSSTable({ onAnswer, selectedSymptoms }: SSSTableProps) {
  const [symptoms, setSymptoms] = useState<SSSSymptoms>(
    selectedSymptoms || {
      trouble_sleeping: 1,
      low_energy: 1,
      headaches: 1,
      chest_pain_breath: 1,
      digestive_problems: 1,
    }
  );

  const handleSymptomChange = (symptom: keyof SSSSymptoms, value: 1 | 2 | 3 | 4 | 5) => {
    const newSymptoms = { ...symptoms, [symptom]: value };
    setSymptoms(newSymptoms);
    onAnswer(newSymptoms);
  };

  const getButtonVariant = (currentValue: number, targetValue: number) => {
    if (currentValue === targetValue) {
      if (targetValue <= 2) return 'default'; // Green for low scores
      if (targetValue === 3) return 'secondary'; // Gray for medium
      return 'destructive'; // Red for high scores
    }
    return 'outline';
  };

  const getButtonClasses = (currentValue: number, targetValue: number) => {
    const baseClasses = `w-12 h-12 rounded-full text-sm font-bold transition-all duration-200 hover:scale-110`;
    
    if (currentValue === targetValue) {
      return `${baseClasses} shadow-lg border-2`;
    } else {
      return `${baseClasses} hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 bg-white border-gray-300`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score: number) => {
    const emojiMap = { 1: '💚', 2: '💛', 3: '🧡', 4: '❤️', 5: '🚨' };
    return emojiMap[score as keyof typeof emojiMap];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">
          How much have you been bothered by any of the following physical symptoms?
        </h3>
        <p className="text-sm text-gray-600">
          Rate each symptom from 1 (Not at all) to 5 (Very much)
        </p>
      </div>

      {/* Symptoms Table */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="text-lg text-center flex items-center justify-center space-x-2">
            <span className="text-2xl">🏥</span>
            <span>Physical Symptoms Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Scale Header */}
          <div className="grid grid-cols-6 bg-gray-50 border-b text-sm font-medium">
            <div className="p-3 text-left">Physical Symptom</div>
            <div className="p-3 text-center border-l">Not at all</div>
            <div className="p-3 text-center border-l">A little bit</div>
            <div className="p-3 text-center border-l">Somewhat</div>
            <div className="p-3 text-center border-l">Quite a bit</div>
            <div className="p-3 text-center border-l">Very much</div>
          </div>

          {/* Symptom Rows */}
          {Object.entries(symptomLabels).map(([key, label], index) => {
            const symptomKey = key as keyof SSSSymptoms;
            const currentValue = symptoms[symptomKey];
            
            return (
              <div
                key={symptomKey}
                className={`grid grid-cols-6 border-b last:border-b-0 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                } hover:bg-blue-25 transition-colors`}
              >
                {/* Symptom Label */}
                <div className="p-4 font-medium text-gray-800 flex items-center">
                  <span className={`mr-2 ${getScoreColor(currentValue)}`}>
                    {getScoreEmoji(currentValue)}
                  </span>
                  {label}
                </div>

                {/* Rating Buttons */}
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="p-2 border-l flex items-center justify-center">
                    <Button
                      variant={getButtonVariant(currentValue, value)}
                      size="sm"
                      onClick={() => handleSymptomChange(symptomKey, value as 1 | 2 | 3 | 4 | 5)}
                      className={getButtonClasses(currentValue, value)}
                    >
                      {value}
                    </Button>
                  </div>
                ))}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Scale Reference */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">📊 Rating Scale:</h4>
        <div className="grid grid-cols-5 gap-2 text-sm">
          {Object.entries(scaleLabels).map(([value, label]) => (
            <div key={value} className="text-center">
              <div className={`font-bold ${getScoreColor(parseInt(value))}`}>
                {getScoreEmoji(parseInt(value))} {value}
              </div>
              <div className="text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Summary */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">✨ Current Selection:</h4>
        <div className="text-sm space-y-1">
          {Object.entries(symptoms).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{symptomLabels[key as keyof SSSSymptoms]}:</span>
              <span className={`font-medium ${getScoreColor(value)}`}>
                {getScoreEmoji(value)} {value} - {scaleLabels[value]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-green-200">
          <div className="flex justify-between font-semibold">
            <span>Total Score:</span>
            <span className={getScoreColor(Object.values(symptoms).reduce((sum, v) => sum + v, 0))}>
              {Object.values(symptoms).reduce((sum, v) => sum + v, 0)} / 25
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}