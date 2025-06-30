'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PsychosomaticBodyMap } from './psychosomatic-body-map';
import { useAppStore } from '@/lib/store';
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
  Lightbulb,
  Calendar,
  TrendingUp,
  Eye,
  ChevronRight,
  Database,
  Cpu
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
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

export function PsychosomaticInsights({ 
  emotions, 
  psychosomaticData, 
  className = '',
  initialTab = 'overview',
  onTabChange
}: PsychosomaticInsightsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showHistory, setShowHistory] = useState(false);
  const { journalEntries } = useAppStore();
  
  // Sync external tab changes
  useEffect(() => {
    console.log('🔄 PsychosomaticInsights: initialTab changed to:', initialTab);
    setActiveTab(initialTab);
  }, [initialTab]);
  
  useEffect(() => {
    console.log('🎯 PsychosomaticInsights: activeTab is now:', activeTab);
  }, [activeTab]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  
  // Get recent journal entries with analysis data
  const recentAnalyses = journalEntries
    .filter(entry => entry.emotions && Object.keys(entry.emotions).length > 0)
    .slice(0, 5)
    .map(entry => ({
      id: entry.id,
      date: entry.createdAt,
      content: entry.content.substring(0, 100) + '...',
      primaryEmotion: Object.entries(entry.emotions)[0] || ['neutral', 0.5],
      emotionCount: Object.keys(entry.emotions).length,
      hasSymptoms: entry.symptoms && Object.values(entry.symptoms).some(Boolean)
    }));

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
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-800">
                  Psychosomatic Analysis
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="default" className="bg-green-600 text-white">
                    Evidence-based
                  </Badge>
                  {isPremium && (
                    <Badge variant="default" className="bg-emerald-600 text-white">
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
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-green-200/50 rounded-xl p-1 shadow-lg">
          <TabsTrigger 
            value="overview" 
            className="flex items-center space-x-2 text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md rounded-lg transition-all duration-200 hover:text-green-600"
          >
            <Heart className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="bodymap" 
            className="flex items-center space-x-2 text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md rounded-lg transition-all duration-200 hover:text-green-600"
          >
            <Activity className="w-4 h-4" />
            <span>Body Map</span>
          </TabsTrigger>
          <TabsTrigger 
            value="wellness" 
            className="flex items-center space-x-2 text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md rounded-lg transition-all duration-200 hover:text-green-600"
          >
            <Target className="w-4 h-4" />
            <span>Wellness</span>
          </TabsTrigger>
          <TabsTrigger 
            value="insights" 
            className="flex items-center space-x-2 text-slate-700 font-medium data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md rounded-lg transition-all duration-200 hover:text-green-600"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analysis</span>
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
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Primary Sensations</h4>
                  <p className="text-green-700">
                    {psychosomaticData.psychosomatic_analysis.bodily_sensations}
                  </p>
                </div>
              )}

              {psychosomaticData.psychosomatic_analysis?.physiological_description && (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2">Physiological Response</h4>
                  <p className="text-emerald-700">
                    {psychosomaticData.psychosomatic_analysis.physiological_description}
                  </p>
                </div>
              )}

              {psychosomaticData.psychosomatic_analysis?.traditional_understanding && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">Traditional Understanding</h4>
                  <p className="text-slate-700">
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
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-emerald-500' : 
                          index === 2 ? 'bg-green-400' : 'bg-emerald-400'
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

        <TabsContent value="insights" className="space-y-6">
          {/* Hero Section - Most Recent Insight */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-400/10 to-green-500/20 rounded-3xl blur-xl"></div>
            <Card className="relative bg-white/60 backdrop-blur-sm border border-green-200/50 rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-800">Latest Analysis</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">Your most recent emotional insight</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-600 text-white px-3 py-1">
                      <Cpu className="w-3 h-3 mr-1" />
                      BERT-Powered
                    </Badge>
                    {isPremium && (
                      <Badge className="bg-emerald-600 text-white px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI-Enhanced
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Analysis Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-4">
                    {psychosomaticData.personalized_insights?.personalized_psychosomatic && (
                      <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-green-200/50">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span>Your Body's Current Story</span>
                        </h4>
                        <p className="text-green-700 leading-relaxed">
                          {psychosomaticData.personalized_insights.personalized_psychosomatic}
                        </p>
                      </div>
                    )}
                    
                    {psychosomaticData.personalized_insights?.encouragement && (
                      <div className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl border border-green-200/50">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
                          <Award className="w-4 h-4" />
                          <span>Personal Insight</span>
                        </h4>
                        <p className="text-green-700 italic font-medium">
                          "{psychosomaticData.personalized_insights.encouragement}"
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-green-200/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">Primary Emotion</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-lg font-semibold text-green-700 capitalize mt-1">
                        {primaryEmotion || 'Neutral'}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-green-200/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">Emotions Detected</span>
                        <Activity className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-lg font-semibold text-emerald-700 mt-1">
                        {emotions.length} emotions
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-green-200/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">Analysis Type</span>
                        <Database className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-green-700 mt-1">
                        {isPremium ? 'GPT + BERT Hybrid' : 'BERT Classification'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis History Section */}
          <Card className="bg-white/60 backdrop-blur-sm border border-green-200/50 rounded-2xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800">Analysis History</CardTitle>
                    <p className="text-sm text-slate-600">Track your emotional journey over time</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showHistory ? 'Hide History' : 'View All'}
                </Button>
              </div>
            </CardHeader>
            
            {showHistory && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {recentAnalyses.length > 0 ? (
                    recentAnalyses.map((analysis, index) => (
                      <div
                        key={analysis.id}
                        className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200/30 hover:bg-white/70 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-green-500' : 
                              index === 1 ? 'bg-emerald-500' : 'bg-green-400'
                            }`} />
                            <div>
                              <p className="font-medium text-slate-700 capitalize">
                                {analysis.primaryEmotion[0]} 
                                <span className="text-sm text-slate-500 font-normal ml-2">
                                  ({Math.round(analysis.primaryEmotion[1] * 100)}% confidence)
                                </span>
                              </p>
                              <p className="text-xs text-slate-500">
                                {analysis.date.toLocaleDateString()} • {analysis.emotionCount} emotions
                                {analysis.hasSymptoms && " • Physical symptoms detected"}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-600 mt-2 truncate">
                          {analysis.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500">No previous analyses found</p>
                      <p className="text-sm text-slate-400">Start journaling to see your emotional patterns</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Value Proposition Section */}
          <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-800">
                <Award className="w-5 h-5 text-green-600" />
                <span>Analysis Excellence</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-200/50">
                    <Database className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-700 mb-2">BERT-Powered</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Fine-tuned on 58,000 emotions with 62% precision across 28 categories
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200/50">
                    <Activity className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-700 mb-2">Evidence-Based</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Psychosomatic mapping validated by peer-reviewed research studies
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-200/50">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-700 mb-2">
                    {isPremium ? 'AI-Enhanced' : 'Adaptive Detection'}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {isPremium 
                      ? 'GPT-powered personalization with contextual understanding'
                      : 'Dynamic emotion detection based on text characteristics'
                    }
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