'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface QuestionOption {
  value: number;
  label: string;
  emoji: string;
}

interface DEQQuestionProps {
  questionNumber: number;
  question: string;
  options: QuestionOption[];
  onAnswer: (value: number | number[]) => void;
  selectedValue?: number | number[];
  multiple?: boolean;
}

export function DEQQuestion({ 
  questionNumber, 
  question, 
  options, 
  onAnswer, 
  selectedValue,
  multiple = false 
}: DEQQuestionProps) {
  const [localSelection, setLocalSelection] = useState<number | number[]>(
    multiple ? (selectedValue as number[] || []) : (selectedValue as number || 0)
  );

  const handleSingleSelection = (value: number) => {
    setLocalSelection(value);
    onAnswer(value);
  };

  const handleMultipleSelection = (value: number, checked: boolean) => {
    const currentSelection = localSelection as number[];
    let newSelection: number[];
    
    if (checked) {
      newSelection = [...currentSelection, value];
    } else {
      newSelection = currentSelection.filter(v => v !== value);
    }
    
    setLocalSelection(newSelection);
    onAnswer(newSelection);
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">{question}</h3>
        {multiple && (
          <p className="text-sm text-gray-600">Select all that apply</p>
        )}
      </div>

      {/* Options Grid */}
      <div className={`grid gap-3 ${multiple ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {options.map((option) => {
          const isSelected = multiple 
            ? (localSelection as number[]).includes(option.value)
            : localSelection === option.value;

          return multiple ? (
            // Multiple Selection (Checkboxes)
            <Card
              key={option.value}
              className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                isSelected 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
              }`}
              onClick={() => handleMultipleSelection(option.value, !isSelected)}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={isSelected}
                  onChange={(checked) => handleMultipleSelection(option.value, checked)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-2xl">{option.emoji}</div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{option.label}</div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            // Single Selection (Radio Buttons)
            <Button
              key={option.value}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => handleSingleSelection(option.value)}
              className={`p-6 h-auto justify-start transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? 'wellness-button shadow-lg border-green-500' 
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="text-2xl">{option.emoji}</div>
                <div className="text-left flex-1">
                  <div className="font-medium">{option.label}</div>
                </div>
                {isSelected && (
                  <div className="text-green-600 text-lg">✓</div>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Selection Summary for Multiple Choice */}
      {multiple && (localSelection as number[]).length > 0 && (
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            {(localSelection as number[]).length} item{(localSelection as number[]).length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}