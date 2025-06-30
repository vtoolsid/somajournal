/**
 * Mock Psychosomatic Data Generator for Prototype Mode
 * 
 * Provides realistic mock psychosomatic analysis data that matches
 * the exact structure of the real API responses. This allows for
 * UI development and testing without API dependencies.
 */

interface MockPsychosomaticTemplate {
  emotions: Array<{ emotion: string; confidence: number }>;
  psychosomatic: {
    status: 'success';
    timestamp: string;
    emotions: Array<{ emotion: string; confidence: number }>;
    primary_emotion: string;
    evidence_based: true;
    research_basis: string;
    psychosomatic_analysis: {
      bodily_sensations: string;
      primary_regions: string[];
      intensity: 'low' | 'moderate' | 'high';
      sensation_type: string;
      physiological_description: string;
      traditional_understanding: string;
    };
    wellness_recommendations: {
      immediate_techniques: string[];
      body_work: string[];
      mindful_approaches: string[];
      long_term_care: string[];
    };
    personalized_insights: {
      personalized_psychosomatic: string;
      personalized_wellness: {
        immediate_techniques: string[];
        body_work: string[];
        mindful_approaches: string[];
        contextual_insight: string;
      };
      encouragement: string;
      gpt_enhanced: boolean;
    };
    personalization_level: 'hybrid_personalized' | 'template_based';
    performance: {
      gpt_available: boolean;
      processing_time: string;
      cost_impact: string;
    };
  };
}

// Mock templates for different emotions
export const MOCK_PSYCHOSOMATIC_TEMPLATES: Record<string, MockPsychosomaticTemplate> = {
  sadness: {
    emotions: [
      { emotion: 'sadness', confidence: 0.51 },
      { emotion: 'fear', confidence: 0.35 },
      { emotion: 'nervousness', confidence: 0.28 }
    ],
    psychosomatic: {
      status: 'success',
      timestamp: new Date().toISOString(),
      emotions: [
        { emotion: 'sadness', confidence: 0.51 },
        { emotion: 'fear', confidence: 0.35 },
        { emotion: 'nervousness', confidence: 0.28 }
      ],
      primary_emotion: 'sadness',
      evidence_based: true,
      research_basis: 'Nummenmaa et al. 2014 - Direct mapping',
      psychosomatic_analysis: {
        bodily_sensations: 'Decreased activity in the limbs, coupled with moderate sensation in the chest and head',
        primary_regions: ['chest', 'head', 'limbs'],
        intensity: 'moderate',
        sensation_type: 'deactivation',
        physiological_description: 'Heaviness in chest, fatigue in arms and legs, slowed movement, chest tightness',
        traditional_understanding: 'Sadness conserves energy while processing loss, creating inward focus and rest'
      },
      wellness_recommendations: {
        immediate_techniques: [
          'Support the deactivated limbs: gentle movement, stretching, or self-massage',
          'Nurture the chest heaviness: warm compress or heating pad on chest',
          'Breathe deeply into the chest area with hand placed over heart'
        ],
        body_work: [
          'Gentle yoga focusing on heart-opening poses',
          'Walking meditation to gently activate limbs',
          'Progressive muscle relaxation for the whole body'
        ],
        mindful_approaches: [
          'Practice self-compassion meditation',
          'Journal about the source of sadness',
          'Listen to soothing music while focusing on chest sensations'
        ],
        long_term_care: [
          'Regular gentle exercise to maintain energy flow',
          'Social connection to counteract withdrawal',
          'Creative expression through art or writing'
        ]
      },
      personalized_insights: {
        personalized_psychosomatic: 'Your body is showing signs of emotional processing through decreased limb activity and chest sensations. This is your nervous system\'s natural way of turning inward to process and heal from difficult emotions.',
        personalized_wellness: {
          immediate_techniques: [
            'Place both hands on your chest and take 5 deep breaths, feeling the warmth',
            'Do gentle arm circles to reactivate your limbs without forcing energy'
          ],
          body_work: [
            'Try a 10-minute gentle walk, focusing on each step',
            'Practice child\'s pose to support your chest and rest your limbs'
          ],
          mindful_approaches: [
            'Set a timer for 5 minutes of self-compassion meditation',
            'Write three things you\'re grateful for, even small ones'
          ],
          contextual_insight: 'Your body needs both rest and gentle activation right now. Honor the need for inward focus while slowly reengaging with movement.'
        },
        encouragement: 'It\'s okay to feel this way. Your body is wisely conserving energy while you process these emotions. Be gentle with yourself and trust that this feeling will shift with time and care.',
        gpt_enhanced: true
      },
      personalization_level: 'hybrid_personalized',
      performance: {
        gpt_available: true,
        processing_time: 'enhanced',
        cost_impact: 'minimal'
      }
    }
  },

  joy: {
    emotions: [
      { emotion: 'joy', confidence: 0.85 },
      { emotion: 'excitement', confidence: 0.65 },
      { emotion: 'gratitude', confidence: 0.45 }
    ],
    psychosomatic: {
      status: 'success',
      timestamp: new Date().toISOString(),
      emotions: [
        { emotion: 'joy', confidence: 0.85 },
        { emotion: 'excitement', confidence: 0.65 },
        { emotion: 'gratitude', confidence: 0.45 }
      ],
      primary_emotion: 'joy',
      evidence_based: true,
      research_basis: 'Nummenmaa et al. 2014 - Direct mapping',
      psychosomatic_analysis: {
        bodily_sensations: 'Enhanced sensation all over the entire body, with extra emphasis on the head and chest',
        primary_regions: ['full_body', 'chest', 'head'],
        intensity: 'high',
        sensation_type: 'whole_body_activation',
        physiological_description: 'Warmth throughout body, lightness, energy, facial muscle activation (smiling)',
        traditional_understanding: 'Joy energizes the entire system, creating full-body feelings of aliveness and connection'
      },
      wellness_recommendations: {
        immediate_techniques: [
          'Dance or move freely to express the joy physically',
          'Share your joy with someone - call a friend or hug a loved one',
          'Take deep breaths to fully experience the expansive feeling'
        ],
        body_work: [
          'Engage in playful movement - jumping, skipping, or dancing',
          'Practice heart-opening yoga poses like cobra or camel',
          'Go for a brisk walk or jog to channel the energy'
        ],
        mindful_approaches: [
          'Gratitude meditation to amplify positive feelings',
          'Mindful savoring - fully experience this moment of joy',
          'Create something artistic to capture this feeling'
        ],
        long_term_care: [
          'Regular celebration rituals for achievements',
          'Gratitude journaling practice',
          'Sharing joy through acts of kindness'
        ]
      },
      personalized_insights: {
        personalized_psychosomatic: 'Your entire body is lighting up with positive energy! This full-body activation shows how joy affects every system, from your smiling face to your energized limbs. Your body is celebrating!',
        personalized_wellness: {
          immediate_techniques: [
            'Stand up and do a 30-second happy dance right now!',
            'Place your hands on your heart and feel the warmth of joy'
          ],
          body_work: [
            'Take a 15-minute joy walk, smiling at everything you see',
            'Do 5 star jumps to spread the energy through your whole body'
          ],
          mindful_approaches: [
            'Close your eyes and replay what brought you this joy',
            'Send a message of gratitude to someone who contributed to this feeling'
          ],
          contextual_insight: 'Your body is in a state of positive activation. This is the perfect time to create positive memories and share your light with others.'
        },
        encouragement: 'What a beautiful moment! Your whole body is celebrating with you. Let this energy flow freely and remember - you have the capacity to create more moments like this.',
        gpt_enhanced: true
      },
      personalization_level: 'hybrid_personalized',
      performance: {
        gpt_available: true,
        processing_time: 'enhanced',
        cost_impact: 'minimal'
      }
    }
  },

  anxiety: {
    emotions: [
      { emotion: 'nervousness', confidence: 0.72 },
      { emotion: 'fear', confidence: 0.58 },
      { emotion: 'confusion', confidence: 0.35 }
    ],
    psychosomatic: {
      status: 'success',
      timestamp: new Date().toISOString(),
      emotions: [
        { emotion: 'nervousness', confidence: 0.72 },
        { emotion: 'fear', confidence: 0.58 },
        { emotion: 'confusion', confidence: 0.35 }
      ],
      primary_emotion: 'nervousness',
      evidence_based: true,
      research_basis: 'Nummenmaa et al. 2014 - Anxiety-similar pattern',
      psychosomatic_analysis: {
        bodily_sensations: 'Activation in the chest and stomach; possible shaking or restlessness in hands',
        primary_regions: ['chest', 'stomach', 'hands'],
        intensity: 'moderate',
        sensation_type: 'anxious_activation',
        physiological_description: 'Butterfly sensation in stomach, chest tightness, hand tremors, rapid heartbeat',
        traditional_understanding: 'Anxiety activates the sympathetic nervous system, preparing for potential threats'
      },
      wellness_recommendations: {
        immediate_techniques: [
          'Box breathing: 4 counts in, hold 4, out 4, hold 4',
          'Progressive muscle relaxation starting with hands',
          'Cold water on wrists or splash face'
        ],
        body_work: [
          'Gentle stretching focusing on chest openers',
          'Shake out your hands and arms to release tension',
          'Slow, mindful walking to ground yourself'
        ],
        mindful_approaches: [
          '5-4-3-2-1 grounding technique using your senses',
          'Observe thoughts without judgment meditation',
          'Anxiety acknowledgment practice'
        ],
        long_term_care: [
          'Regular exercise to manage stress hormones',
          'Consistent sleep schedule',
          'Limit caffeine and stimulants'
        ]
      },
      personalized_insights: {
        personalized_psychosomatic: 'Your chest and stomach are holding the anxiety, while your hands show the nervous energy seeking release. This pattern is your body\'s alarm system working to protect you, even if there\'s no immediate danger.',
        personalized_wellness: {
          immediate_techniques: [
            'Place one hand on chest, one on stomach - breathe slowly for 1 minute',
            'Shake your hands vigorously for 30 seconds then let them relax'
          ],
          body_work: [
            'Do 10 gentle shoulder rolls backward to open your chest',
            'Try legs-up-the-wall pose for 5 minutes to calm your system'
          ],
          mindful_approaches: [
            'Name 5 things you can see right now to ground yourself',
            'Repeat: "This feeling is temporary and I am safe"'
          ],
          contextual_insight: 'Your body is in protection mode. By acknowledging these sensations without judgment and using grounding techniques, you can help your nervous system return to balance.'
        },
        encouragement: 'Your body is doing its best to protect you. These sensations, while uncomfortable, show that your alarm system is working. With gentle practices, you can help your body find calm again.',
        gpt_enhanced: true
      },
      personalization_level: 'hybrid_personalized',
      performance: {
        gpt_available: true,
        processing_time: 'enhanced',
        cost_impact: 'minimal'
      }
    }
  },

  anger: {
    emotions: [
      { emotion: 'anger', confidence: 0.68 },
      { emotion: 'annoyance', confidence: 0.52 },
      { emotion: 'disappointment', confidence: 0.38 }
    ],
    psychosomatic: {
      status: 'success',
      timestamp: new Date().toISOString(),
      emotions: [
        { emotion: 'anger', confidence: 0.68 },
        { emotion: 'annoyance', confidence: 0.52 },
        { emotion: 'disappointment', confidence: 0.38 }
      ],
      primary_emotion: 'anger',
      evidence_based: true,
      research_basis: 'Nummenmaa et al. 2014 - Direct mapping',
      psychosomatic_analysis: {
        bodily_sensations: 'Strong activation in the upper body: chest, head, arms, and hands',
        primary_regions: ['chest', 'head', 'arms', 'hands'],
        intensity: 'high',
        sensation_type: 'activation',
        physiological_description: 'Increased cardiovascular activity, muscle tension in arms and shoulders, facial heat',
        traditional_understanding: 'Anger energizes the body for action, particularly in areas needed for physical response'
      },
      wellness_recommendations: {
        immediate_techniques: [
          'Release tension: squeeze and release fists 10 times',
          'Cool down: cold water on face and wrists',
          'Vocal release: hum or sigh loudly'
        ],
        body_work: [
          'Vigorous exercise: running, boxing, or power walking',
          'Push-ups or wall pushes to release arm tension',
          'Neck and shoulder stretches'
        ],
        mindful_approaches: [
          'Anger meditation: observe without acting',
          'Write uncensored letter (don\'t send)',
          'Count backwards from 100 by 7s'
        ],
        long_term_care: [
          'Regular physical exercise outlet',
          'Assertiveness training',
          'Identify and address anger triggers'
        ]
      },
      personalized_insights: {
        personalized_psychosomatic: 'Your upper body is charged with energy - your chest, arms, and head are all activated. This shows your body preparing for action. The key is channeling this powerful energy constructively.',
        personalized_wellness: {
          immediate_techniques: [
            'Do 20 jumping jacks to burn off the immediate energy',
            'Squeeze a stress ball or pillow as hard as you can for 10 seconds'
          ],
          body_work: [
            'Take a fast-paced walk around the block',
            'Do push-ups against a wall until you feel the tension release'
          ],
          mindful_approaches: [
            'Write down exactly what made you angry without censoring',
            'Imagine your anger as a color and breathe it out'
          ],
          contextual_insight: 'Your body has mobilized significant energy. Use physical movement to discharge it safely, then reflect on what boundary or value was crossed.'
        },
        encouragement: 'Your anger is valid and carries important information about your boundaries and values. Let\'s help your body process this energy safely so you can access the wisdom within the anger.',
        gpt_enhanced: true
      },
      personalization_level: 'hybrid_personalized',
      performance: {
        gpt_available: true,
        processing_time: 'enhanced',
        cost_impact: 'minimal'
      }
    }
  },

  neutral: {
    emotions: [
      { emotion: 'neutral', confidence: 0.65 }
    ],
    psychosomatic: {
      status: 'success',
      timestamp: new Date().toISOString(),
      emotions: [
        { emotion: 'neutral', confidence: 0.65 }
      ],
      primary_emotion: 'neutral',
      evidence_based: true,
      research_basis: 'Nummenmaa et al. 2014 - Baseline pattern',
      psychosomatic_analysis: {
        bodily_sensations: 'Balanced sensation throughout the body with no particular areas of activation or deactivation',
        primary_regions: ['full_body'],
        intensity: 'low',
        sensation_type: 'balanced',
        physiological_description: 'Steady breathing, relaxed muscles, stable heart rate, calm alertness',
        traditional_understanding: 'Neutral states represent emotional equilibrium and readiness for whatever comes next'
      },
      wellness_recommendations: {
        immediate_techniques: [
          'Body scan meditation to maintain awareness',
          'Gentle stretching to stay connected',
          'Three conscious breaths to center yourself'
        ],
        body_work: [
          'Tai chi or qigong for balanced energy',
          'Walking meditation',
          'Gentle yoga flow'
        ],
        mindful_approaches: [
          'Mindfulness of the present moment',
          'Gratitude for this peaceful state',
          'Setting positive intentions'
        ],
        long_term_care: [
          'Regular mindfulness practice',
          'Maintain consistent routines',
          'Cultivate appreciation for calm moments'
        ]
      },
      personalized_insights: {
        personalized_psychosomatic: 'Your body is in a state of calm balance. This neutral state is actually quite valuable - it\'s your nervous system at rest, ready to respond appropriately to whatever comes next.',
        personalized_wellness: {
          immediate_techniques: [
            'Take 3 deep breaths to appreciate this calm moment',
            'Do a quick body scan from head to toe'
          ],
          body_work: [
            'Gentle stretching for 5 minutes to maintain flexibility',
            'Slow walk while noticing your surroundings'
          ],
          mindful_approaches: [
            'Set an intention for the rest of your day',
            'Practice gratitude for this moment of balance'
          ],
          contextual_insight: 'This balanced state is a gift. Use it as an opportunity to check in with yourself and set positive intentions.'
        },
        encouragement: 'This calm, balanced state is wonderful! Your body is showing you what equilibrium feels like. Appreciate this baseline - it\'s from here that all other experiences arise.',
        gpt_enhanced: true
      },
      personalization_level: 'hybrid_personalized',
      performance: {
        gpt_available: true,
        processing_time: 'enhanced',
        cost_impact: 'minimal'
      }
    }
  }
};

/**
 * Get mock psychosomatic analysis based on primary emotion
 */
export function getMockPsychosomaticAnalysis(primaryEmotion: string): MockPsychosomaticTemplate {
  // Map similar emotions to available templates
  const emotionMapping: Record<string, string> = {
    // Sadness family
    'sadness': 'sadness',
    'grief': 'sadness',
    'disappointment': 'sadness',
    'remorse': 'sadness',
    
    // Joy family
    'joy': 'joy',
    'happiness': 'joy',
    'excitement': 'joy',
    'amusement': 'joy',
    'love': 'joy',
    'gratitude': 'joy',
    'pride': 'joy',
    'admiration': 'joy',
    'relief': 'joy',
    'optimism': 'joy',
    
    // Anxiety family
    'anxiety': 'anxiety',
    'nervousness': 'anxiety',
    'fear': 'anxiety',
    'confusion': 'anxiety',
    'embarrassment': 'anxiety',
    'surprise': 'anxiety',
    
    // Anger family
    'anger': 'anger',
    'annoyance': 'anger',
    'disapproval': 'anger',
    'disgust': 'anger',
    
    // Neutral family
    'neutral': 'neutral',
    'realization': 'neutral',
    'approval': 'neutral',
    'caring': 'neutral',
    'curiosity': 'neutral',
    'desire': 'neutral'
  };
  
  const templateKey = emotionMapping[primaryEmotion.toLowerCase()] || 'neutral';
  const template = MOCK_PSYCHOSOMATIC_TEMPLATES[templateKey];
  
  // Update timestamp to current time
  const updatedTemplate = JSON.parse(JSON.stringify(template));
  updatedTemplate.psychosomatic.timestamp = new Date().toISOString();
  
  // If the detected emotion is different from template emotion, update it
  if (primaryEmotion.toLowerCase() !== templateKey) {
    updatedTemplate.psychosomatic.primary_emotion = primaryEmotion.toLowerCase();
    if (updatedTemplate.emotions[0]) {
      updatedTemplate.emotions[0].emotion = primaryEmotion.toLowerCase();
      updatedTemplate.psychosomatic.emotions[0].emotion = primaryEmotion.toLowerCase();
    }
  }
  
  return updatedTemplate;
}

/**
 * Generate a complete mock analysis response
 */
export function generateMockAnalysisResponse(
  text: string,
  detectedEmotions: Array<{ emotion: string; confidence: number }>
) {
  const primaryEmotion = detectedEmotions[0]?.emotion || 'neutral';
  const mockTemplate = getMockPsychosomaticAnalysis(primaryEmotion);
  
  // Use detected emotions if provided, otherwise use template emotions
  if (detectedEmotions.length > 0) {
    mockTemplate.emotions = detectedEmotions;
    mockTemplate.psychosomatic.emotions = detectedEmotions;
  }
  
  // Calculate text characteristics
  const words = text.split(' ').filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const analysis = {
    text_type: wordCount < 10 ? 'quick_note' : 
                wordCount < 50 ? 'short_entry' : 
                wordCount < 100 ? 'medium_entry' : 'detailed_journal',
    emotional_richness: detectedEmotions.length > 2 ? 'high' : 
                       detectedEmotions.length > 1 ? 'moderate' : 'low',
    recommended_approach: wordCount < 10 ? 'Focus on primary emotion' :
                         wordCount < 50 ? 'Balanced analysis' :
                         'Comprehensive emotional landscape',
    word_count: wordCount,
    threshold_used: 0.35,
    max_emotions: Math.min(5, Math.max(1, Math.floor(wordCount / 20) + 1))
  };
  
  const characteristics = {
    emotional_density: detectedEmotions.length / Math.max(wordCount, 1),
    complexity_score: Math.min(1, detectedEmotions.length * 0.3),
    has_multiple_emotions: detectedEmotions.length > 1,
    emotional_word_count: detectedEmotions.length,
    sentence_count: sentences.length,
    word_count: wordCount
  };
  
  // Generate symptoms based on primary emotion
  const symptomMapping: Record<string, string[]> = {
    sadness: ['fatigue'],
    anger: ['tension', 'headache'],
    anxiety: ['tension', 'restlessness'],
    fear: ['tension', 'nausea'],
    joy: [],
    neutral: []
  };
  
  const emotionFamily = Object.keys(symptomMapping).find(family => 
    primaryEmotion.toLowerCase().includes(family) || 
    (MOCK_PSYCHOSOMATIC_TEMPLATES[family]?.emotions || []).some(e => 
      e.emotion === primaryEmotion.toLowerCase()
    )
  ) || 'neutral';
  
  const activeSymptoms = symptomMapping[emotionFamily] || [];
  const symptoms = {
    tension: activeSymptoms.includes('tension'),
    headache: activeSymptoms.includes('headache'),
    fatigue: activeSymptoms.includes('fatigue'),
    restlessness: activeSymptoms.includes('restlessness'),
    nausea: activeSymptoms.includes('nausea')
  };
  
  return {
    status: 'success',
    emotions: mockTemplate.emotions,
    analysis,
    characteristics,
    symptoms,
    adaptive_info: {
      strategy: analysis.recommended_approach,
      reasoning: `Detected ${detectedEmotions.length} emotions using prototype analysis`
    },
    psychosomatic: mockTemplate.psychosomatic,
    fallback: false,
    prototype_mode: true
  };
}