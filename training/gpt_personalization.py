#!/usr/bin/env python3
"""
GPT Personalization System for SomaJournal

Hybrid approach that combines evidence-based psychosomatic templates
with GPT-3.5-Turbo personalization for premium wellness analysis.

This module provides:
1. GPT API integration with fallback to static templates
2. Personalized psychosomatic analysis based on user context
3. Cost-effective API usage with intelligent prompting
4. Error handling and graceful degradation
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timezone

# Load environment variables from .env.local
def load_env_file(env_path: str = '.env.local'):
    """Load environment variables from a file."""
    try:
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key.strip()] = value.strip()
    except Exception as e:
        logging.warning(f"Could not load {env_path}: {e}")

# Load environment variables on import
load_env_file(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local'))

# Valid GoEmotions categories (28 emotions from the dataset)
VALID_GOEMOTIONS = {
    'admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring', 
    'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval', 
    'disgust', 'embarrassment', 'excitement', 'fear', 'gratitude', 'grief', 
    'joy', 'love', 'nervousness', 'optimism', 'pride', 'realization', 
    'relief', 'remorse', 'sadness', 'surprise', 'neutral'
}

# OpenAI import (will be optional)
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    openai = None

from psychosomatic_mapping import (
    get_psychosomatic_analysis,
    PSYCHOSOMATIC_TEMPLATES,
    WELLNESS_TEMPLATES
)

logger = logging.getLogger(__name__)

class GPTPersonalizationEngine:
    """
    Intelligent personalization engine that combines evidence-based templates
    with GPT-3.5-Turbo for contextual wellness recommendations.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the personalization engine.
        
        Args:
            api_key: OpenAI API key. If None, will try to get from environment.
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        self.client = None
        self.gpt_available = False
        
        if OPENAI_AVAILABLE and self.api_key:
            try:
                self.client = openai.OpenAI(api_key=self.api_key)
                self.gpt_available = True
                logger.info("✅ GPT personalization engine initialized successfully")
            except Exception as e:
                logger.warning(f"⚠️ Could not initialize OpenAI client: {e}")
                self.gpt_available = False
        else:
            if not OPENAI_AVAILABLE:
                logger.warning("⚠️ OpenAI package not available")
            if not self.api_key:
                logger.warning("⚠️ OpenAI API key not provided")
    
    def create_hybrid_analysis(
        self, 
        journal_text: str, 
        detected_emotions: List[Dict[str, Any]],
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create comprehensive hybrid analysis combining evidence-based templates
        with GPT personalization.
        
        Args:
            journal_text: The user's journal entry text
            detected_emotions: List of emotions with confidence scores from BERT
            user_context: Optional user context for personalization
            
        Returns:
            Dictionary containing hybrid analysis with psychosomatic insights
        """
        # Check if BERT detected strong emotions
        has_strong_emotions = self._has_strong_emotions(detected_emotions)
        
        if not has_strong_emotions and self.gpt_available:
            logger.info("🔍 BERT detected weak emotions, using GPT for advanced emotion analysis")
            # Use GPT to analyze emotions when BERT doesn't detect strong ones
            detected_emotions = self._gpt_emotion_analysis(journal_text)
        
        primary_emotion = self._get_primary_emotion(detected_emotions)
        
        # Step 1: Get evidence-based templates
        base_analysis = get_psychosomatic_analysis(primary_emotion)
        
        # Step 2: Attempt GPT personalization if available
        personalized_analysis = None
        if self.gpt_available:
            try:
                personalized_analysis = self._personalize_with_gpt(
                    journal_text, 
                    primary_emotion, 
                    base_analysis,
                    user_context,
                    detected_emotions
                )
            except Exception as e:
                logger.warning(f"⚠️ GPT personalization failed: {e}")
        
        # Step 3: Combine results
        return self._combine_analyses(
            base_analysis, 
            personalized_analysis,
            journal_text,
            detected_emotions
        )
    
    def _has_strong_emotions(self, detected_emotions: List[Dict[str, Any]], threshold: float = 0.5) -> bool:
        """
        Check if BERT detected any strong emotions above the confidence threshold.
        
        Args:
            detected_emotions: List of emotions with confidence scores
            threshold: Minimum confidence to consider an emotion "strong"
            
        Returns:
            True if any emotion meets the threshold, False otherwise
        """
        if not detected_emotions:
            return False
        
        return any(emotion.get('confidence', 0) >= threshold for emotion in detected_emotions)
    
    def _get_primary_emotion(self, detected_emotions: List[Dict[str, Any]]) -> str:
        """Get the primary emotion from detection results."""
        if not detected_emotions:
            return 'neutral'
        
        # Find emotion with highest confidence
        primary = max(detected_emotions, key=lambda x: x.get('confidence', 0))
        return primary.get('emotion', 'neutral')
    
    def _gpt_emotion_analysis(self, journal_text: str) -> List[Dict[str, Any]]:
        """
        Use GPT to analyze emotions when BERT detection is weak.
        Applies the same adaptive strategy as BERT based on text length.
        
        Args:
            journal_text: The user's journal entry text
            
        Returns:
            List of detected emotions with confidence scores
        """
        if not self.client:
            logger.warning("⚠️ GPT client not available for emotion analysis")
            return [{"emotion": "neutral", "confidence": 0.5}]
        
        # Calculate text characteristics for adaptive approach
        word_count = len(journal_text.split())
        
        # Determine emotion count based on text length (same as BERT adaptive strategy)
        if word_count < 10:
            max_emotions = 1
            text_type = "quick_note"
            strategy = "Focus on primary emotion only"
        elif word_count < 50:
            max_emotions = 3
            text_type = "short_entry"
            strategy = "Show 2-3 emotions"
        elif word_count < 100:
            max_emotions = 4
            text_type = "medium_entry"
            strategy = "Comprehensive analysis"
        else:
            max_emotions = 5
            text_type = "detailed_journal"
            strategy = "Full emotional landscape"
        
        try:
            # Create specialized emotion detection prompt
            system_prompt = self._create_emotion_detection_system_prompt()
            user_prompt = self._create_emotion_detection_user_prompt(
                journal_text, max_emotions, text_type, strategy
            )
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,  # Lower temperature for more consistent emotion detection
                max_tokens=300,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            result = json.loads(content)
            
            # Validate and format the response
            detected_emotions = result.get('emotions', [])
            if not detected_emotions:
                return [{"emotion": "neutral", "confidence": 0.5}]
            
            # Validate and format the response - ensure only valid GoEmotions
            formatted_emotions = []
            for emotion_data in detected_emotions[:max_emotions]:
                emotion = emotion_data.get('emotion', 'neutral').lower().strip()
                confidence = min(max(emotion_data.get('confidence', 0.5), 0.1), 0.95)  # Clamp to reasonable range
                
                # Validate against GoEmotions categories
                if emotion in VALID_GOEMOTIONS:
                    formatted_emotions.append({
                        "emotion": emotion,
                        "confidence": confidence
                    })
                else:
                    # Map common invalid emotions to valid ones
                    mapped_emotion = self._map_to_valid_emotion(emotion)
                    if mapped_emotion:
                        logger.warning(f"⚠️ Mapped invalid emotion '{emotion}' to '{mapped_emotion}'")
                        formatted_emotions.append({
                            "emotion": mapped_emotion,
                            "confidence": confidence * 0.8  # Reduce confidence for mapped emotions
                        })
                    else:
                        logger.warning(f"⚠️ Discarded invalid emotion: '{emotion}'")
            
            logger.info(f"🎭 GPT detected {len(formatted_emotions)} emotions: {[e['emotion'] for e in formatted_emotions]}")
            return formatted_emotions
            
        except Exception as e:
            logger.error(f"❌ GPT emotion analysis failed: {e}")
            return [{"emotion": "neutral", "confidence": 0.5}]
    
    def _map_to_valid_emotion(self, invalid_emotion: str) -> Optional[str]:
        """
        Map common invalid emotions to valid GoEmotions categories.
        
        Args:
            invalid_emotion: The invalid emotion string
            
        Returns:
            Valid GoEmotion category or None if no mapping exists
        """
        emotion_mappings = {
            # Common invalid emotions -> valid GoEmotions
            'overwhelmed': 'anxiety',
            'anxious': 'nervousness', 
            'stressed': 'nervousness',
            'frustrated': 'annoyance',
            'upset': 'sadness',
            'worried': 'nervousness',
            'happy': 'joy',
            'mad': 'anger',
            'furious': 'anger',
            'depressed': 'sadness',
            'ecstatic': 'joy',
            'elated': 'joy',
            'content': 'approval',
            'pleased': 'approval',
            'irritated': 'annoyance',
            'concerned': 'nervousness',
            'thrilled': 'excitement',
            'delighted': 'joy',
            'disappointed': 'disappointment',
            'ashamed': 'embarrassment',
            'guilty': 'remorse',
            'hopeful': 'optimism',
            'confident': 'pride',
            'peaceful': 'relief',
            'calm': 'neutral',
            'relaxed': 'relief',
            'tense': 'nervousness',
            'uncomfortable': 'nervousness'
        }
        
        return emotion_mappings.get(invalid_emotion.lower())
    
    def _create_emotion_detection_system_prompt(self) -> str:
        """Create system prompt for GPT emotion detection."""
        return """You are an expert emotion analyst specializing in the 28 GoEmotions categories. Your task is to detect emotions in journal text with high accuracy and appropriate confidence scores.

CRITICAL: You MUST ONLY use emotions from this exact list of 28 GoEmotions categories:

admiration, amusement, anger, annoyance, approval, caring, confusion, curiosity, desire, disappointment, disapproval, disgust, embarrassment, excitement, fear, gratitude, grief, joy, love, nervousness, optimism, pride, realization, relief, remorse, sadness, surprise, neutral

DO NOT use any other emotion words like: overwhelmed, anxious, stressed, frustrated, happy, worried, etc.
If you think of those emotions, map them to the closest valid category:
- overwhelmed/stressed/anxious → nervousness  
- frustrated → annoyance
- happy → joy
- worried/concerned → nervousness
- upset → sadness or annoyance

CONFIDENCE SCORING GUIDELINES:
- 0.9-0.95: Extremely clear, explicit emotional language
- 0.7-0.89: Strong emotional indicators, clear context  
- 0.5-0.69: Moderate emotional signals, some ambiguity
- 0.3-0.49: Subtle emotional undertones
- 0.1-0.29: Very weak/uncertain emotional signals

CRITICAL RULES:
1. ONLY use the 28 exact emotion names listed above - no synonyms or variations
2. Double-check each emotion against the list before including it
3. Provide realistic confidence scores between 0.1 and 0.95
4. Focus on the most prominent emotions present
5. Consider context and implied emotions, not just explicit words
6. If unsure, use 'neutral' rather than invalid emotions

Respond with a JSON object containing an "emotions" array with exact emotion names from the list."""
    
    def _create_emotion_detection_user_prompt(
        self, 
        journal_text: str, 
        max_emotions: int, 
        text_type: str, 
        strategy: str
    ) -> str:
        """Create user prompt for emotion detection with adaptive strategy."""
        return f"""Analyze the following journal entry for emotions:

TEXT: "{journal_text}"

ANALYSIS REQUIREMENTS:
- Text Type: {text_type}
- Strategy: {strategy}
- Maximum Emotions: {max_emotions}
- Focus on the {max_emotions} most prominent emotions
- Provide confidence scores between 0.1 and 0.95

REMINDER: Use ONLY these 28 GoEmotions categories:
admiration, amusement, anger, annoyance, approval, caring, confusion, curiosity, desire, disappointment, disapproval, disgust, embarrassment, excitement, fear, gratitude, grief, joy, love, nervousness, optimism, pride, realization, relief, remorse, sadness, surprise, neutral

Consider:
1. Explicit emotional words and phrases
2. Contextual emotional meaning  
3. Implied emotions from situations described
4. Overall emotional tone
5. Map common emotions to valid categories (overwhelmed→nervousness, happy→joy, etc.)

Respond with JSON format using ONLY valid emotion names:
{{
  "emotions": [
    {{"emotion": "nervousness", "confidence": 0.75}},
    {{"emotion": "annoyance", "confidence": 0.65}}
  ]
}}

CRITICAL: Double-check each emotion name against the GoEmotions list before responding."""
    
    def _personalize_with_gpt(
        self,
        journal_text: str,
        primary_emotion: str,
        base_analysis: Dict[str, Any],
        user_context: Optional[Dict[str, Any]] = None,
        detected_emotions: Optional[List[Dict[str, Any]]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Use GPT-3.5-Turbo to personalize the evidence-based analysis.
        
        Returns None if GPT call fails.
        """
        if not self.client:
            return None
        
        # Construct intelligent prompt
        system_prompt = self._create_system_prompt()
        user_prompt = self._create_user_prompt(
            journal_text, 
            primary_emotion, 
            base_analysis,
            user_context,
            detected_emotions
        )
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=800,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            logger.error(f"❌ GPT API call failed: {e}")
            return None
    
    def _create_system_prompt(self) -> str:
        """Create the system prompt for GPT personalization."""
        return """You are a compassionate wellness coach for SomaJournal, an evidence-based wellness app. Your task is to personalize scientifically-grounded psychosomatic analysis and wellness recommendations.

IMPORTANT GUIDELINES:
1. You must base your response on the provided evidence-based templates from Nummenmaa et al. research
2. Do NOT invent new medical advice - only personalize the existing recommendations
3. Tailor the language and examples to the user's specific situation and journal entry
4. Maintain the scientific credibility while making it personally relevant
5. Be warm, supportive, and non-judgmental

RESPONSE FORMAT:
Respond with a JSON object containing exactly these keys:
{
  "personalized_psychosomatic": "Personalized description of bodily sensations relevant to their situation",
  "personalized_wellness": {
    "immediate_techniques": ["2-3 personalized immediate techniques"],
    "body_work": ["2-3 personalized body work suggestions"],
    "mindful_approaches": ["2-3 personalized mindfulness practices"],
    "contextual_insight": "One personalized insight about their situation"
  },
  "encouragement": "Brief, warm encouragement specific to their experience"
}"""
    
    def _create_user_prompt(
        self,
        journal_text: str,
        primary_emotion: str,
        base_analysis: Dict[str, Any],
        user_context: Optional[Dict[str, Any]] = None,
        detected_emotions: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """Create the user prompt with context and templates."""
        psychosomatic_template = base_analysis.get('psychosomatic', {})
        wellness_template = base_analysis.get('wellness', {})
        
        context_info = ""
        if user_context:
            context_info = f"\nUser Context: {json.dumps(user_context, indent=2)}"
        
        # Add emotion detection method information
        emotion_source_info = ""
        if detected_emotions:
            has_high_confidence = any(e.get('confidence', 0) >= 0.5 for e in detected_emotions)
            if has_high_confidence:
                emotion_source_info = "\nEmotion Detection: High-confidence BERT analysis"
            else:
                emotion_source_info = "\nEmotion Detection: Advanced GPT analysis (BERT detected weak signals)"
        
        return f"""Here is the user's journal entry:
---
{journal_text}
---

Primary emotion detected: {primary_emotion}{emotion_source_info}
Research basis: {psychosomatic_template.get('research_basis', 'Evidence-based analysis')}

EVIDENCE-BASED TEMPLATES (DO NOT INVENT NEW INFORMATION):

Psychosomatic Pattern:
{psychosomatic_template.get('bodily_sensations', 'General bodily awareness')}

Physiological Description:
{psychosomatic_template.get('physiological_description', 'Natural body responses')}

Wellness Recommendations:
{json.dumps(wellness_template, indent=2)}
{context_info}

TASK: Rewrite these evidence-based templates to be personally relevant to this user's specific journal entry. Keep the scientific foundation but make the language and examples specific to their situation. Focus on how the bodily sensations and wellness recommendations apply to their particular context."""
    
    def _combine_analyses(
        self,
        base_analysis: Dict[str, Any],
        personalized_analysis: Optional[Dict[str, Any]],
        journal_text: str,
        detected_emotions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Combine base evidence-based analysis with GPT personalization."""
        
        # Start with evidence-based foundation
        result = {
            'status': 'success',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'emotions': detected_emotions,
            'primary_emotion': self._get_primary_emotion(detected_emotions),
            'evidence_based': True,
            'research_basis': base_analysis.get('psychosomatic', {}).get('research_basis', ''),
            'psychosomatic_analysis': {
                'bodily_sensations': base_analysis.get('psychosomatic', {}).get('bodily_sensations', ''),
                'primary_regions': base_analysis.get('psychosomatic', {}).get('primary_regions', []),
                'intensity': base_analysis.get('psychosomatic', {}).get('intensity', 'moderate'),
                'sensation_type': base_analysis.get('psychosomatic', {}).get('sensation_type', ''),
                'physiological_description': base_analysis.get('psychosomatic', {}).get('physiological_description', ''),
                'traditional_understanding': base_analysis.get('psychosomatic', {}).get('traditional_understanding', '')
            },
            'wellness_recommendations': base_analysis.get('wellness', {}),
            'personalization_level': 'evidence_based_only'
        }
        
        # Add GPT personalization if available
        if personalized_analysis:
            result['personalized_insights'] = {
                'personalized_psychosomatic': personalized_analysis.get('personalized_psychosomatic', ''),
                'personalized_wellness': personalized_analysis.get('personalized_wellness', {}),
                'encouragement': personalized_analysis.get('encouragement', ''),
                'gpt_enhanced': True
            }
            result['personalization_level'] = 'hybrid_personalized'
        else:
            result['personalized_insights'] = {
                'personalized_psychosomatic': result['psychosomatic_analysis']['bodily_sensations'],
                'personalized_wellness': self._create_static_personalization(base_analysis, journal_text),
                'encouragement': self._create_static_encouragement(result['primary_emotion']),
                'gpt_enhanced': False
            }
            result['personalization_level'] = 'template_based'
        
        # Add cost and performance info
        result['performance'] = {
            'gpt_available': self.gpt_available,
            'processing_time': 'real_time' if not personalized_analysis else 'enhanced',
            'cost_impact': 'none' if not personalized_analysis else 'minimal'
        }
        
        return result
    
    def _create_static_personalization(
        self, 
        base_analysis: Dict[str, Any], 
        journal_text: str
    ) -> Dict[str, Any]:
        """Create basic personalization when GPT is not available."""
        wellness = base_analysis.get('wellness', {})
        
        # Simple text-based customization
        text_length = len(journal_text.split())
        
        if text_length < 20:
            focus = "quick, effective techniques"
        elif text_length < 100:
            focus = "balanced approach"
        else:
            focus = "comprehensive support"
        
        return {
            'immediate_techniques': wellness.get('immediate_techniques', [])[:3],
            'body_work': wellness.get('body_work', [])[:3], 
            'mindful_approaches': wellness.get('mindful_approaches', [])[:3],
            'contextual_insight': f"Based on your journal entry, a {focus} would be most beneficial."
        }
    
    def _create_static_encouragement(self, emotion: str) -> str:
        """Create encouraging message based on emotion."""
        encouragements = {
            'anger': "Your body's activation shows your strength and passion. Use this energy wisely.",
            'fear': "Your body is protecting you by staying alert. Trust in your resilience.",
            'sadness': "Your body's need for rest and care is wisdom. Be gentle with yourself.",
            'joy': "Your body's aliveness reflects your inner light. Celebrate this feeling.",
            'love': "Your heart's expansion shows your capacity for connection. Share this warmth.",
            'excitement': "Your body's energy shows your enthusiasm for life. Channel it purposefully.",
            'neutral': "Your body's balance is a gift. Appreciate this calm foundation."
        }
        
        return encouragements.get(emotion, "Your emotional awareness is a step toward greater well-being.")

# Initialize global instance (will be imported by API server)
personalization_engine = GPTPersonalizationEngine()

def create_hybrid_analysis(
    journal_text: str,
    detected_emotions: List[Dict[str, Any]],
    user_context: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Convenience function for creating hybrid analysis.
    
    This is the main entry point for the psychosomatic analysis system.
    """
    return personalization_engine.create_hybrid_analysis(
        journal_text, 
        detected_emotions, 
        user_context
    )