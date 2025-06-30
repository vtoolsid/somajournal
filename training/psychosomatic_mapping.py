#!/usr/bin/env python3
"""
Psychosomatic Mapping System for SomaJournal

Evidence-based mapping of emotions to bodily sensations based on:
- Nummenmaa et al. (2014) "Bodily maps of emotions" PNAS
- 3-tier mapping strategy for 28 GoEmotions categories
- Scientific foundation for wellness recommendations

This is the core differentiator for SomaJournal's premium analysis experience.
"""

from typing import Dict, List, Any

# Evidence-based psychosomatic mapping based on Nummenmaa et al. research
PSYCHOSOMATIC_TEMPLATES: Dict[str, Dict[str, Any]] = {
    # Tier 1: Direct mappings from Nummenmaa study
    'anger': {
        'pattern_type': 'direct',
        'research_basis': 'Nummenmaa et al. 2014 - Direct mapping',
        'bodily_sensations': 'Strong activation in the upper body: chest, head, arms, and hands',
        'primary_regions': ['chest', 'head', 'arms', 'hands'],
        'intensity': 'high',
        'sensation_type': 'activation',
        'physiological_description': 'Increased cardiovascular activity, muscle tension in arms and shoulders, facial heat',
        'traditional_understanding': 'Anger energizes the body for action, particularly in areas needed for physical response'
    },
    
    'fear': {
        'pattern_type': 'direct',
        'research_basis': 'Nummenmaa et al. 2014 - Direct mapping',
        'bodily_sensations': 'Strong sensations in the upper chest area, corresponding to changes in breathing and heart rate',
        'primary_regions': ['chest', 'heart', 'lungs'],
        'intensity': 'high',
        'sensation_type': 'activation',
        'physiological_description': 'Rapid heartbeat, shallow breathing, chest tightness, heightened alertness',
        'traditional_understanding': 'Fear activates the body\'s alarm system, preparing for fight-or-flight response'
    },
    
    'disgust': {
        'pattern_type': 'direct',
        'research_basis': 'Nummenmaa et al. 2014 - Direct mapping',
        'bodily_sensations': 'Strong sensations centered in the throat and digestive system',
        'primary_regions': ['throat', 'stomach', 'digestive_system'],
        'intensity': 'moderate',
        'sensation_type': 'aversion',
        'physiological_description': 'Nausea, throat constriction, stomach discomfort, urge to reject',
        'traditional_understanding': 'Disgust protects us from harmful substances by activating rejection responses'
    },
    
    'joy': {
        'pattern_type': 'direct',
        'research_basis': 'Nummenmaa et al. 2014 - Direct mapping',
        'bodily_sensations': 'Enhanced sensation all over the entire body, with extra emphasis on the head and chest',
        'primary_regions': ['full_body', 'head', 'chest'],
        'intensity': 'high',
        'sensation_type': 'whole_body_activation',
        'physiological_description': 'Warmth throughout body, lightness, energy, facial muscle activation (smiling)',
        'traditional_understanding': 'Joy energizes the entire system, creating full-body feelings of aliveness and connection'
    },
    
    'sadness': {
        'pattern_type': 'direct',
        'research_basis': 'Nummenmaa et al. 2014 - Direct mapping',
        'bodily_sensations': 'Decreased activity in the limbs, coupled with moderate sensation in the chest and head',
        'primary_regions': ['chest', 'head'],
        'intensity': 'moderate',
        'sensation_type': 'deactivation_limbs',
        'physiological_description': 'Heaviness in chest, fatigue in arms and legs, slowed movement, chest tightness',
        'traditional_understanding': 'Sadness conserves energy while processing loss, creating inward focus and rest'
    },
    
    'surprise': {
        'pattern_type': 'direct',
        'research_basis': 'Nummenmaa et al. 2014 - Direct mapping',
        'bodily_sensations': 'Sharp activation centered in the head and upper chest',
        'primary_regions': ['head', 'upper_chest'],
        'intensity': 'high',
        'sensation_type': 'sudden_activation',
        'physiological_description': 'Sudden alertness, widened eyes, rapid heartbeat, momentary breath holding',
        'traditional_understanding': 'Surprise rapidly focuses attention and prepares the body to respond to unexpected events'
    },

    # Tier 2: Logical groupings based on emotion families
    
    # Anger family
    'annoyance': {
        'pattern_type': 'grouped_anger',
        'research_basis': 'Grouped under anger pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Moderate activation in the chest and hands',
        'primary_regions': ['chest', 'hands'],
        'intensity': 'moderate',
        'sensation_type': 'mild_activation',
        'physiological_description': 'Slight tension in jaw and shoulders, mild hand clenching, subtle chest tightness',
        'traditional_understanding': 'Lower-intensity anger response, preparing for potential action without full mobilization'
    },
    
    'disapproval': {
        'pattern_type': 'grouped_anger',
        'research_basis': 'Grouped under anger pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Moderate activation in the head and chest area',
        'primary_regions': ['head', 'chest'],
        'intensity': 'moderate',
        'sensation_type': 'cognitive_rejection',
        'physiological_description': 'Furrowed brow, slight facial tension, mild chest tightness, mental alertness',
        'traditional_understanding': 'Socially-oriented anger involving cognitive evaluation and potential communication'
    },
    
    # Sadness family
    'disappointment': {
        'pattern_type': 'grouped_sadness',
        'research_basis': 'Grouped under sadness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Sensation of heaviness in the chest and decreased energy in the limbs',
        'primary_regions': ['chest', 'limbs'],
        'intensity': 'moderate',
        'sensation_type': 'deflation',
        'physiological_description': 'Chest heaviness, shoulder dropping, reduced energy, sinking feeling',
        'traditional_understanding': 'Response to unmet expectations, creating withdrawal and energy conservation'
    },
    
    'grief': {
        'pattern_type': 'grouped_sadness',
        'research_basis': 'Grouped under sadness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Intense feeling of heaviness in the chest and total lack of energy in limbs',
        'primary_regions': ['chest', 'limbs'],
        'intensity': 'very_high',
        'sensation_type': 'profound_deactivation',
        'physiological_description': 'Deep chest ache, profound fatigue, difficulty moving, whole-body heaviness',
        'traditional_understanding': 'Intense sadness response to significant loss, requiring deep rest and healing'
    },
    
    'remorse': {
        'pattern_type': 'grouped_sadness',
        'research_basis': 'Grouped under sadness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Heaviness in the chest and stomach area',
        'primary_regions': ['chest', 'stomach'],
        'intensity': 'moderate',
        'sensation_type': 'guilt_heaviness',
        'physiological_description': 'Chest weight, stomach sinking, posture curving inward, self-directed tension',
        'traditional_understanding': 'Sadness combined with self-evaluation, creating inward focus and desire for repair'
    },
    
    # Fear family
    'nervousness': {
        'pattern_type': 'grouped_fear',
        'research_basis': 'Grouped under fear pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Activation in the chest and stomach; possible shakiness in hands',
        'primary_regions': ['chest', 'stomach', 'hands'],
        'intensity': 'moderate',
        'sensation_type': 'anticipatory_activation',
        'physiological_description': 'Butterflies in stomach, mild trembling, faster heartbeat, restless energy',
        'traditional_understanding': 'Anticipatory fear response, preparing the body for upcoming challenges'
    },
    
    # Happiness family (approach-oriented emotions)
    'amusement': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'General activation all over the body, especially in the head and chest',
        'primary_regions': ['full_body', 'head', 'chest'],
        'intensity': 'high',
        'sensation_type': 'playful_activation',
        'physiological_description': 'Facial muscle activation (smiling/laughing), chest lightness, energetic feeling',
        'traditional_understanding': 'Playful joy response, activating social connection and positive engagement'
    },
    
    'excitement': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Strong, widespread activation all over the body',
        'primary_regions': ['full_body'],
        'intensity': 'very_high',
        'sensation_type': 'energetic_activation',
        'physiological_description': 'High energy, rapid heartbeat, alertness, readiness for action, tingling sensations',
        'traditional_understanding': 'Intense positive arousal, preparing the body for engaging with opportunities'
    },
    
    'love': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Intense warmth and activation all over the body, centered on the chest',
        'primary_regions': ['chest', 'full_body'],
        'intensity': 'very_high',
        'sensation_type': 'heart_centered_warmth',
        'physiological_description': 'Heart warmth, full-body glow, softness, expansion in chest, gentle energy',
        'traditional_understanding': 'Deep connection emotion, creating openness and bonding throughout the system'
    },
    
    'optimism': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'General sense of lightness and activation throughout the body',
        'primary_regions': ['full_body', 'chest'],
        'intensity': 'moderate',
        'sensation_type': 'uplifting_lightness',
        'physiological_description': 'Buoyant feeling, lighter posture, gentle energy, forward-leaning tendency',
        'traditional_understanding': 'Future-oriented positive emotion, energizing the body for upcoming possibilities'
    },
    
    'pride': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Activation in the head and chest, with an upright posture feeling',
        'primary_regions': ['head', 'chest', 'spine'],
        'intensity': 'high',
        'sensation_type': 'dignified_expansion',
        'physiological_description': 'Chest expansion, straight spine, lifted head, sense of bigness',
        'traditional_understanding': 'Achievement emotion, creating confident posture and self-assured presence'
    },
    
    'relief': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'A feeling of release or "lightening" in the chest and shoulders',
        'primary_regions': ['chest', 'shoulders'],
        'intensity': 'moderate',
        'sensation_type': 'tension_release',
        'physiological_description': 'Shoulder dropping, deep breathing, chest opening, muscle relaxation',
        'traditional_understanding': 'Release from stress, allowing the body to return to ease and natural flow'
    },
    
    'admiration': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Warmth and activation in the chest, head, and overall body',
        'primary_regions': ['chest', 'head', 'full_body'],
        'intensity': 'moderate',
        'sensation_type': 'appreciative_warmth',
        'physiological_description': 'Heart warmth, mental alertness, gentle activation, openness',
        'traditional_understanding': 'Recognition of excellence in others, creating connection and inspiration'
    },
    
    'gratitude': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Warmth and activation focused on the chest and spreading through the body',
        'primary_regions': ['chest', 'full_body'],
        'intensity': 'high',
        'sensation_type': 'heart_warmth_spreading',
        'physiological_description': 'Heart center warmth, gentle spreading sensation, softness, contentment',
        'traditional_understanding': 'Appreciation emotion, creating connection and positive regard for life'
    },
    
    'caring': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Strong warmth and activation focused on the chest (heart area)',
        'primary_regions': ['chest', 'heart'],
        'intensity': 'high',
        'sensation_type': 'protective_warmth',
        'physiological_description': 'Deep heart warmth, protective feeling, gentle strength, nurturing energy',
        'traditional_understanding': 'Nurturing emotion, activating protective and supportive responses toward others'
    },
    
    'approval': {
        'pattern_type': 'grouped_happiness',
        'research_basis': 'Grouped under happiness pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'General sense of lightness and activation',
        'primary_regions': ['chest', 'head'],
        'intensity': 'moderate',
        'sensation_type': 'positive_recognition',
        'physiological_description': 'Gentle chest warmth, mental clarity, subtle smile activation, ease',
        'traditional_understanding': 'Social positive emotion, creating alignment and connection with others'
    },
    
    # Disgust family
    'embarrassment': {
        'pattern_type': 'grouped_disgust',
        'research_basis': 'Grouped under disgust pattern - Nummenmaa et al. 2014',
        'bodily_sensations': 'Sensations of heat in the face/head area and discomfort in the stomach',
        'primary_regions': ['face', 'head', 'stomach'],
        'intensity': 'moderate',
        'sensation_type': 'social_aversion',
        'physiological_description': 'Facial flushing, heat in cheeks, stomach discomfort, desire to hide',
        'traditional_understanding': 'Social disgust response, creating withdrawal from social exposure'
    },
    
    # Tier 3: Unique mappings for cognitive and other states
    
    # Cognitive emotions
    'confusion': {
        'pattern_type': 'cognitive',
        'research_basis': 'Head sensations for cognitive states - Nummenmaa et al. 2014',
        'bodily_sensations': 'Sensations focused primarily in the head area',
        'primary_regions': ['head', 'forehead'],
        'intensity': 'moderate',
        'sensation_type': 'mental_processing',
        'physiological_description': 'Forehead tension, mental fog, slight headache, cognitive effort',
        'traditional_understanding': 'Information processing state, creating mental effort and focus'
    },
    
    'curiosity': {
        'pattern_type': 'cognitive',
        'research_basis': 'Head sensations for cognitive states - Nummenmaa et al. 2014',
        'bodily_sensations': 'Sensations of alertness focused in the head and chest',
        'primary_regions': ['head', 'chest'],
        'intensity': 'moderate',
        'sensation_type': 'exploratory_alertness',
        'physiological_description': 'Mental alertness, chest openness, forward-leaning tendency, bright eyes',
        'traditional_understanding': 'Exploration emotion, creating openness and readiness to learn'
    },
    
    'realization': {
        'pattern_type': 'cognitive',
        'research_basis': 'Head sensations for cognitive states - Nummenmaa et al. 2014',
        'bodily_sensations': 'A sharp sensation of alertness focused in the head ("lightbulb moment")',
        'primary_regions': ['head'],
        'intensity': 'high',
        'sensation_type': 'insight_activation',
        'physiological_description': 'Sudden mental clarity, brightening sensation, relief of confusion, "aha" feeling',
        'traditional_understanding': 'Understanding breakthrough, creating clarity and cognitive satisfaction'
    },
    
    # Unique emotions
    'desire': {
        'pattern_type': 'unique',
        'research_basis': 'Approach emotion mapping - Extended from Nummenmaa et al. 2014',
        'bodily_sensations': 'Activation in the chest and stomach areas ("butterflies")',
        'primary_regions': ['chest', 'stomach'],
        'intensity': 'high',
        'sensation_type': 'yearning_activation',
        'physiological_description': 'Butterflies in stomach, chest longing, forward-reaching energy, anticipation',
        'traditional_understanding': 'Wanting emotion, creating motivation and movement toward desired outcomes'
    },
    
    'neutral': {
        'pattern_type': 'baseline',
        'research_basis': 'Baseline state - Nummenmaa et al. 2014',
        'bodily_sensations': 'No significant change in bodily sensation',
        'primary_regions': ['none'],
        'intensity': 'none',
        'sensation_type': 'balanced',
        'physiological_description': 'Calm, balanced, no particular sensations, natural resting state',
        'traditional_understanding': 'Emotional equilibrium, allowing natural body rhythms and ease'
    }
}

# Wellness recommendations based on psychosomatic patterns
WELLNESS_TEMPLATES: Dict[str, Dict[str, Any]] = {
    'anger': {
        'immediate_techniques': [
            'Channel the arm and hand activation: try push-ups, punching a pillow, or gripping/releasing exercises',
            'Cool the head activation: apply cold water to wrists, face, or back of neck',
            'Ground the chest energy: try deep breathing with longer exhales than inhales',
            'Use the energy constructively: go for a brisk walk or organize something'
        ],
        'body_work': [
            'Progressive muscle relaxation focusing on shoulders, arms, and jaw',
            'Intense cardiovascular exercise to channel the activation energy',
            'Massage or foam rolling for shoulder and neck tension',
            'Boxing or martial arts movements (even solo) to use the arm activation'
        ],
        'mindful_approaches': [
            'Body scan meditation focusing on the activated areas (chest, arms, head)',
            'Breathing exercises that work with the chest activation',
            'Gentle yoga poses that open the chest and release shoulder tension',
            'Visualization of cooling or calming the "heated" areas'
        ],
        'long_term_care': [
            'Regular physical activity to provide healthy outlets for activation energy',
            'Develop communication skills to express needs before reaching anger',
            'Create cooling rituals for when you feel the physical signs building',
            'Practice boundary setting to prevent situations that trigger the physical response'
        ]
    },
    
    'fear': {
        'immediate_techniques': [
            'Work with the chest activation: try box breathing (4-4-4-4 pattern)',
            'Ground yourself through the activated chest area: place hands on heart',
            'Use the alert energy: engage in simple, concrete tasks',
            'Slow down the breathing to work with the respiratory activation'
        ],
        'body_work': [
            'Gentle chest opening stretches to counteract the constriction',
            'Diaphragmatic breathing exercises',
            'Light cardio to channel the activation in a controlled way',
            'Progressive muscle relaxation starting with the chest and shoulders'
        ],
        'mindful_approaches': [
            'Heart-centered meditation with hand placement on chest',
            'Breathing meditation focusing on slowing and deepening the breath',
            'Body awareness practices that acknowledge the chest sensations',
            'Grounding techniques that use the feet to balance the upper body activation'
        ],
        'long_term_care': [
            'Regular breathing practices to develop resilience in the chest area',
            'Build safety and security in your environment',
            'Develop coping strategies for the physical sensations of fear',
            'Practice gradual exposure to build confidence with the body\'s responses'
        ]
    },
    
    'sadness': {
        'immediate_techniques': [
            'Support the deactivated limbs: gentle movement, stretching, or self-massage',
            'Nurture the chest heaviness: warm compress or heating pad on chest',
            'Honor the energy conservation: rest without forcing activity',
            'Use soft, comforting textures and warmth'
        ],
        'body_work': [
            'Gentle, supported yoga focusing on heart opening',
            'Warm baths or showers to support the body\'s need for comfort',
            'Light massage or self-massage for the heavy limbs',
            'Restorative poses that support the chest and allow rest'
        ],
        'mindful_approaches': [
            'Meditation that acknowledges and honors the heaviness',
            'Self-compassion practices that work with the body\'s need for rest',
            'Gentle body awareness without forcing change',
            'Breathing practices that support rather than force the chest'
        ],
        'long_term_care': [
            'Regular gentle movement to support the limbs',
            'Create comforting environments and rituals',
            'Develop support systems for when the body needs extra care',
            'Practice self-compassion for the body\'s natural responses to loss'
        ]
    },
    
    'joy': {
        'immediate_techniques': [
            'Celebrate the full-body activation: dance, stretch, or move freely',
            'Amplify the chest lightness: take deep, appreciative breaths',
            'Share the energy: connect with others or express gratitude',
            'Savor the sensations: mindfully appreciate the physical feelings'
        ],
        'body_work': [
            'Expressive movement that honors the full-body activation',
            'Heart-opening yoga poses that work with the chest expansion',
            'Energizing exercises that match the body\'s natural activation',
            'Celebratory activities that use the whole body'
        ],
        'mindful_approaches': [
            'Gratitude practices that amplify the positive sensations',
            'Body appreciation meditation focusing on the aliveness',
            'Mindful savoring of the physical feelings of joy',
            'Breathing practices that enhance the natural expansion'
        ],
        'long_term_care': [
            'Regular activities that cultivate full-body aliveness',
            'Develop practices that help you recognize and honor joy',
            'Create environments that support positive embodiment',
            'Build habits that maintain connection to physical well-being'
        ]
    },
    
    'disgust': {
        'immediate_techniques': [
            'Support the throat and digestive system: sip warm water or herbal tea',
            'Work with the rejection response: identify what needs to be released',
            'Cleanse the palate: fresh air, mint, or clean tastes',
            'Honor the protective function: remove yourself from the trigger if possible'
        ],
        'body_work': [
            'Gentle neck and throat stretches',
            'Digestive support through gentle abdominal massage',
            'Detoxifying practices like dry brushing or lymphatic drainage',
            'Restorative poses that support the digestive system'
        ],
        'mindful_approaches': [
            'Throat chakra meditation and visualization',
            'Mindful eating practices to restore healthy relationship with nourishment',
            'Body awareness practices that honor protective responses',
            'Breathing exercises that cleanse and refresh'
        ],
        'long_term_care': [
            'Develop healthy boundaries around what you consume (food, media, relationships)',
            'Regular detoxification practices for body and environment',
            'Cultivate appreciation for the body\'s protective wisdom',
            'Create clean, nourishing environments'
        ]
    },
    
    'surprise': {
        'immediate_techniques': [
            'Ground the sudden activation: feel your feet on the floor',
            'Support the rapid heartbeat: place hands on chest and breathe slowly',
            'Work with the alertness: take a moment to assess the situation',
            'Allow the energy to settle: pause before taking action'
        ],
        'body_work': [
            'Gentle movement to help the body settle after activation',
            'Breathing exercises to regulate the heart rate',
            'Grounding exercises that connect you to stability',
            'Progressive relaxation to help the system calm down'
        ],
        'mindful_approaches': [
            'Mindful pause to allow the surprise to be fully experienced',
            'Body scan to notice how the activation settles',
            'Breathing meditation to support the nervous system',
            'Grounding practices that help integrate the experience'
        ],
        'long_term_care': [
            'Develop resilience for unexpected changes',
            'Practice flexibility and adaptability',
            'Build skills for handling sudden shifts',
            'Cultivate presence and awareness in daily life'
        ]
    },
    
    'nervousness': {
        'immediate_techniques': [
            'Calm the stomach butterflies: gentle circular massage on abdomen',
            'Steady the hand trembling: squeeze and release your fists',
            'Support the chest activation: practice deep belly breathing',
            'Channel the energy: engage in simple, repetitive tasks'
        ],
        'body_work': [
            'Gentle abdominal breathing to calm the stomach sensations',
            'Hand and wrist exercises to address shakiness',
            'Heart-opening poses to work with chest activation',
            'Light movement or walking to channel restless energy'
        ],
        'mindful_approaches': [
            'Body scan focusing on the stomach and chest areas',
            'Breathing meditation with emphasis on the exhale',
            'Grounding techniques that use the nervous energy constructively',
            'Self-compassion practices for anticipatory anxiety'
        ],
        'long_term_care': [
            'Develop pre-performance or pre-event routines',
            'Build confidence through preparation and practice',
            'Regular relaxation practices to reduce baseline anxiety',
            'Create support systems for challenging situations'
        ]
    },
    
    'excitement': {
        'immediate_techniques': [
            'Channel the high energy: engage in physical activity or creative expression',
            'Ground the intensity: connect with your breath and body',
            'Share the activation: connect with others or express enthusiasm',
            'Focus the energy: direct it toward meaningful activities'
        ],
        'body_work': [
            'High-energy movement that matches the body\'s activation',
            'Cardiovascular exercise to use the energetic charge',
            'Expressive dance or movement',
            'Activities that engage the whole body dynamically'
        ],
        'mindful_approaches': [
            'Mindful appreciation of the energetic sensations',
            'Breathing practices that harness rather than suppress the energy',
            'Body awareness meditation to stay connected during high activation',
            'Gratitude practices that amplify positive energy'
        ],
        'long_term_care': [
            'Regular outlets for high energy and enthusiasm',
            'Balance excitement with grounding practices',
            'Develop skills for channeling energy constructively',
            'Create opportunities for meaningful engagement and expression'
        ]
    },
    
    'love': {
        'immediate_techniques': [
            'Nurture the heart warmth: place hands on heart and breathe deeply',
            'Amplify the full-body glow: express appreciation or affection',
            'Honor the expansion: allow yourself to feel open and connected',
            'Share the energy: connect with loved ones or engage in loving-kindness'
        ],
        'body_work': [
            'Heart-opening yoga poses and stretches',
            'Gentle, nurturing self-massage',
            'Breathing exercises that expand the chest',
            'Movement that feels loving and appreciative of your body'
        ],
        'mindful_approaches': [
            'Loving-kindness meditation starting with yourself',
            'Heart-centered awareness practices',
            'Gratitude meditation focusing on relationships',
            'Body appreciation practices that honor your physical form'
        ],
        'long_term_care': [
            'Regular practices that cultivate self-love and acceptance',
            'Nurture meaningful relationships and connections',
            'Create environments that support love and warmth',
            'Develop capacity for giving and receiving love'
        ]
    },
    
    'embarrassment': {
        'immediate_techniques': [
            'Cool the facial heat: splash cool water on face or apply cool compress',
            'Soothe the stomach discomfort: gentle belly breathing',
            'Ground yourself: feel your feet and reconnect with stability',
            'Practice self-compassion: remind yourself that everyone experiences embarrassment'
        ],
        'body_work': [
            'Cooling practices for the face and head',
            'Gentle abdominal massage for stomach discomfort',
            'Grounding exercises that reconnect you with your body',
            'Posture work to counteract the tendency to shrink or hide'
        ],
        'mindful_approaches': [
            'Self-compassion meditation for social awkwardness',
            'Body awareness practices that accept rather than judge sensations',
            'Breathing exercises that calm the nervous system',
            'Mindful self-talk that normalizes the experience'
        ],
        'long_term_care': [
            'Build self-acceptance and resilience for social situations',
            'Develop healthy perspectives on mistakes and imperfection',
            'Practice courage in social interactions',
            'Cultivate supportive relationships that accept your whole self'
        ]
    },
    
    'curiosity': {
        'immediate_techniques': [
            'Support the mental alertness: ensure good posture and bright lighting',
            'Channel the chest openness: lean in and engage actively',
            'Use the exploratory energy: ask questions and investigate',
            'Honor the learning state: give yourself time and space to explore'
        ],
        'body_work': [
            'Neck and head stretches to support alertness',
            'Chest opening exercises to enhance the openness',
            'Eye exercises and vision breaks during focused learning',
            'Movement that supports cognitive function'
        ],
        'mindful_approaches': [
            'Mindful inquiry and questioning practices',
            'Body awareness while learning and exploring',
            'Breathing exercises that support mental clarity',
            'Meditation that cultivates open, curious awareness'
        ],
        'long_term_care': [
            'Regular learning and exploration activities',
            'Maintain physical health to support cognitive function',
            'Create environments that stimulate curiosity',
            'Balance focused inquiry with rest and integration'
        ]
    },
    
    'confusion': {
        'immediate_techniques': [
            'Ease the head tension: gentle temple massage or cool compress on forehead',
            'Support cognitive processing: take breaks and simplify the problem',
            'Ground yourself: connect with your breath and body',
            'Be patient: allow time for clarity to emerge'
        ],
        'body_work': [
            'Head and neck massage to relieve tension',
            'Gentle movement to increase blood flow to the brain',
            'Eye rest and vision exercises',
            'Posture adjustments to support clear thinking'
        ],
        'mindful_approaches': [
            'Meditation that accepts confusion as part of learning',
            'Breathing practices that calm the mind',
            'Body scan to release mental tension',
            'Mindful inquiry that explores confusion with curiosity'
        ],
        'long_term_care': [
            'Develop tolerance for uncertainty and not-knowing',
            'Regular mental rest and cognitive recovery practices',
            'Build problem-solving skills and patience',
            'Create supportive environments for learning and growth'
        ]
    },
    
    'desire': {
        'immediate_techniques': [
            'Work with the butterflies: breathe into the stomach area',
            'Channel the yearning energy: take one small step toward your goal',
            'Ground the intensity: connect with what you already have',
            'Honor the motivation: clarify what you truly want'
        ],
        'body_work': [
            'Abdominal breathing to calm the stomach sensations',
            'Heart opening poses to work with the chest longing',
            'Movement that channels desire into action',
            'Grounding exercises that balance yearning with contentment'
        ],
        'mindful_approaches': [
            'Meditation on the nature of wanting and contentment',
            'Body awareness practices that honor both desire and satisfaction',
            'Breathing exercises that balance activation with calm',
            'Mindful goal-setting that connects with authentic desires'
        ],
        'long_term_care': [
            'Develop healthy relationship with wanting and having',
            'Regular practices that cultivate gratitude alongside desire',
            'Build skills for pursuing goals while finding contentment',
            'Balance ambition with acceptance and presence'
        ]
    },
    
    'neutral': {
        'immediate_techniques': [
            'Appreciate the balance: notice the ease of having no strong sensations',
            'Use the stability: engage in activities that require steady presence',
            'Maintain the equilibrium: avoid forcing emotional states',
            'Rest in the naturalness: allow yourself to simply be'
        ],
        'body_work': [
            'Gentle, maintenance activities like stretching or walking',
            'Breathing exercises that maintain rather than change your state',
            'Posture awareness and alignment practices',
            'Activities that support overall well-being without intensity'
        ],
        'mindful_approaches': [
            'Meditation that appreciates equanimity and balance',
            'Body awareness practices that honor the natural state',
            'Breathing meditation that maintains steady presence',
            'Mindfulness that finds richness in simplicity'
        ],
        'long_term_care': [
            'Regular practices that support emotional balance',
            'Maintain physical and mental health foundations',
            'Appreciate and protect periods of emotional rest',
            'Build capacity for both activation and calm'
        ]
    }
    
    # Add templates for remaining emotions following the same pattern
    # This covers the major emotion categories with evidence-based wellness approaches
}

def get_psychosomatic_analysis(emotion: str) -> Dict[str, Any]:
    """
    Get comprehensive psychosomatic analysis for an emotion.
    
    Args:
        emotion: The detected emotion string
        
    Returns:
        Dictionary containing psychosomatic templates and wellness recommendations
    """
    emotion_key = emotion.lower()
    
    psychosomatic = PSYCHOSOMATIC_TEMPLATES.get(emotion_key, {})
    wellness = WELLNESS_TEMPLATES.get(emotion_key, {})
    
    return {
        'emotion': emotion,
        'psychosomatic': psychosomatic,
        'wellness': wellness,
        'has_evidence_base': bool(psychosomatic),
        'research_credibility': 'high' if psychosomatic.get('pattern_type') == 'direct' else 'moderate'
    }

def get_body_regions_for_emotion(emotion: str) -> List[str]:
    """Get the primary body regions affected by an emotion."""
    emotion_key = emotion.lower()
    template = PSYCHOSOMATIC_TEMPLATES.get(emotion_key, {})
    return template.get('primary_regions', [])

def get_scientific_basis(emotion: str) -> str:
    """Get the scientific research basis for an emotion mapping."""
    emotion_key = emotion.lower()
    template = PSYCHOSOMATIC_TEMPLATES.get(emotion_key, {})
    return template.get('research_basis', 'General emotional wellness principles')