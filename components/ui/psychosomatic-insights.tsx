'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PsychosomaticBodyMap } from './psychosomatic-body-map';
import { 
  Heart, 
  Brain, 
  Activity,
  Sparkles,
  BookOpen,
  Zap,
  Wind,
  Target,
  Clock,
  Users,
  Star,
  Award,
  Lightbulb
} from 'lucide-react';

interface PsychosomaticInsightsProps {
  emotions: Array<{
    emotion: string;
    confidence: number;
  }>;
  psychosomaticData?: {
    primary_emotion?: string;
    evidence_based?: boolean;
    research_basis?: string;
    psychosomatic_analysis?: {
      bodily_sensations?: string;
      primary_regions?: string[];
      intensity?: string;
      sensation_type?: string;
      physiological_description?: string;
      traditional_understanding?: string;
    };
    wellness_recommendations?: {
      immediate_techniques?: string[];
      body_work?: string[];
      mindful_approaches?: string[];
      long_term_care?: string[];
    };
    personalized_insights?: {
      personalized_psychosomatic?: string;
      personalized_wellness?: {
        immediate_techniques?: string[];
        body_work?: string[];
        mindful_approaches?: string[];
        contextual_insight?: string;
      };
      encouragement?: string;
      gpt_enhanced?: boolean;
    };
    personalization_level?: string;
  };
  className?: string;
}

export function PsychosomaticInsights({ 
  emotions, 
  psychosomaticData, 
  className = '' 
}: PsychosomaticInsightsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!psychosomaticData) {
    return (
      <Card className={`${className} border-dashed border-slate-300`}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500">Psychosomatic analysis not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPremium = psychosomaticData.personalized_insights?.gpt_enhanced;
  const primaryEmotion = psychosomaticData.primary_emotion || (emotions?.[0]?.emotion) || 'neutral';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with credibility indicators */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-800">
                  Psychosomatic Analysis
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="default" className="bg-blue-600 text-white">
                    Evidence-based
                  </Badge>
                  {isPremium && (
                    <Badge variant="default" className="bg-purple-600 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI-Enhanced
                    </Badge>
                  )}
                  <span className="text-sm text-slate-600">
                    {psychosomaticData.research_basis || 'Nummenmaa et al. 2014'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700 capitalize">
                {primaryEmotion}
              </p>
              <p className="text-xs text-slate-500">
                Primary Emotion
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="bodymap" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Body Map</span>
          </TabsTrigger>
          <TabsTrigger value="wellness" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Wellness</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Psychosomatic Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span>How Your Body Responds</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {psychosomaticData.psychosomatic_analysis?.bodily_sensations && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Primary Sensations</h4>
                  <p className="text-blue-700">
                    {psychosomaticData.psychosomatic_analysis.bodily_sensations}
                  </p>
                </div>
              )}

              {psychosomaticData.psychosomatic_analysis?.physiological_description && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Physiological Response</h4>
                  <p className="text-green-700">
                    {psychosomaticData.psychosomatic_analysis.physiological_description}
                  </p>
                </div>
              )}

              {psychosomaticData.psychosomatic_analysis?.traditional_understanding && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Traditional Understanding</h4>
                  <p className="text-purple-700">
                    {psychosomaticData.psychosomatic_analysis.traditional_understanding}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emotion Breakdown */}
          {emotions && emotions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span>Detected Emotions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {emotions.slice(0, 4).map((emotion, index) => (
                    <div 
                      key={emotion.emotion}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                        }`} />
                        <span className="font-medium text-slate-700 capitalize">
                          {emotion.emotion}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(emotion.confidence * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bodymap" className="space-y-4">
          <PsychosomaticBodyMap 
            emotions={emotions} 
            psychosomaticData={psychosomaticData}
          />
          
          {/* Body Regions Details */}
          {psychosomaticData.psychosomatic_analysis?.primary_regions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-red-600" />
                  <span>Primary Affected Regions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {psychosomaticData.psychosomatic_analysis.primary_regions.map((region) => (
                    <Badge 
                      key={region} 
                      variant="outline" 
                      className="justify-center py-2 text-center capitalize"
                    >
                      {region.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Evidence-Based Wellness Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {psychosomaticData.wellness_recommendations?.immediate_techniques && (
                  <AccordionItem value="immediate">
                    <AccordionTrigger className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Immediate Techniques</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {psychosomaticData.wellness_recommendations.immediate_techniques.map((technique, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-700">{technique}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {psychosomaticData.wellness_recommendations?.body_work && (
                  <AccordionItem value="bodywork">
                    <AccordionTrigger className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span>Body Work & Movement</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {psychosomaticData.wellness_recommendations.body_work.map((technique, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-700">{technique}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {psychosomaticData.wellness_recommendations?.mindful_approaches && (
                  <AccordionItem value="mindful">
                    <AccordionTrigger className="flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-purple-600" />
                      <span>Mindful Approaches</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {psychosomaticData.wellness_recommendations.mindful_approaches.map((technique, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-700">{technique}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {psychosomaticData.wellness_recommendations?.long_term_care && (
                  <AccordionItem value="longterm">
                    <AccordionTrigger className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-orange-600" />
                      <span>Long-term Care</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {psychosomaticData.wellness_recommendations.long_term_care.map((technique, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-700">{technique}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* Personalized Insights */}
          {psychosomaticData.personalized_insights && (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Personalized Insights</span>
                  {isPremium && (
                    <Badge className="bg-purple-600 text-white">
                      AI-Enhanced
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {psychosomaticData.personalized_insights.personalized_psychosomatic && (
                  <div className="p-4 bg-white/70 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Your Body's Story</span>
                    </h4>
                    <p className="text-purple-700">
                      {psychosomaticData.personalized_insights.personalized_psychosomatic}
                    </p>
                  </div>
                )}

                {psychosomaticData.personalized_insights.personalized_wellness && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-800 flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Personalized Recommendations</span>
                    </h4>
                    
                    {psychosomaticData.personalized_insights.personalized_wellness.immediate_techniques && (
                      <div className="p-3 bg-white/50 rounded-lg">
                        <h5 className="font-medium text-purple-700 mb-2">Right Now</h5>
                        <ul className="space-y-1">
                          {psychosomaticData.personalized_insights.personalized_wellness.immediate_techniques.map((technique, index) => (
                            <li key={index} className="text-sm text-purple-600 flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span>{technique}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {psychosomaticData.personalized_insights.personalized_wellness.contextual_insight && (
                      <div className="p-3 bg-white/50 rounded-lg">
                        <h5 className="font-medium text-purple-700 mb-2 flex items-center space-x-2">
                          <Lightbulb className="w-4 h-4" />
                          <span>Key Insight</span>
                        </h5>
                        <p className="text-sm text-purple-600">
                          {psychosomaticData.personalized_insights.personalized_wellness.contextual_insight}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {psychosomaticData.personalized_insights.encouragement && (
                  <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Encouragement</span>
                    </h4>
                    <p className="text-purple-700 italic">
                      "{psychosomaticData.personalized_insights.encouragement}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Analysis Quality Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-slate-600" />
                <span>Analysis Quality</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-700">Evidence-Based</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Based on peer-reviewed research
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-700">Scientifically Grounded</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Psychosomatic mapping validated
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-700">
                    {isPremium ? 'AI-Enhanced' : 'Template-Based'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {isPremium ? 'Contextually personalized' : 'Evidence-based guidance'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}