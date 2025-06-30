#!/usr/bin/env python3
"""
SomaJournal Emotion Analysis API Server

Flask server that provides emotion analysis using the adaptive BERT model.
Serves the trained emotion classification model via REST API for the Next.js frontend.

Usage:
    python training/api_server.py

Endpoints:
    POST /analyze-emotion
    GET /health
"""

import os
import sys
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Global classifier instance
classifier = None

# Import psychosomatic analysis system
try:
    from gpt_personalization import create_hybrid_analysis
    PSYCHOSOMATIC_AVAILABLE = True
    logger.info("✅ Psychosomatic analysis system loaded")
except ImportError as e:
    PSYCHOSOMATIC_AVAILABLE = False
    logger.warning(f"⚠️ Psychosomatic analysis not available: {e}")

def initialize_classifier():
    """Initialize the adaptive emotion classifier."""
    global classifier
    
    try:
        from scripts.adaptive_classifier import AdaptiveEmotionClassifier
        
        model_path = 'models/bert_emotion_model'
        if not os.path.exists(model_path):
            logger.error(f"Model not found at {model_path}")
            return False
            
        classifier = AdaptiveEmotionClassifier(model_path=model_path)
        logger.info("✅ Adaptive emotion classifier initialized successfully")
        return True
        
    except ImportError as e:
        logger.error(f"❌ Failed to import adaptive classifier: {e}")
        logger.error("Please ensure all dependencies are installed: pip install -r training/requirements.txt")
        return False
    except Exception as e:
        logger.error(f"❌ Failed to initialize classifier: {e}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': classifier is not None,
        'service': 'SomaJournal Emotion Analysis API'
    })

@app.route('/analyze-emotion', methods=['POST'])
def analyze_emotion():
    """
    Analyze emotion in journal text using adaptive BERT model.
    
    Request JSON:
    {
        "text": "Your journal entry text here",
        "debug": false  // Optional: include debug info
    }
    
    Response JSON:
    {
        "status": "success",
        "emotions": [
            {"emotion": "joy", "confidence": 0.823},
            {"emotion": "gratitude", "confidence": 0.654}
        ],
        "analysis": {
            "text_type": "short_entry",
            "emotional_richness": "moderate", 
            "recommended_approach": "Show 2-3 emotions",
            "word_count": 17,
            "threshold_used": 0.33,
            "max_emotions": 2
        },
        "characteristics": {
            "emotional_density": 0.12,
            "complexity_score": 0.54,
            "has_multiple_emotions": true
        }
    }
    """
    if not classifier:
        return jsonify({
            'status': 'error',
            'message': 'Emotion classifier not initialized',
            'code': 'MODEL_NOT_LOADED'
        }), 500
    
    try:
        # Parse request
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing "text" field in request',
                'code': 'MISSING_TEXT'
            }), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({
                'status': 'error',
                'message': 'Text cannot be empty',
                'code': 'EMPTY_TEXT'
            }), 400
        
        debug = data.get('debug', False)
        
        # Analyze with adaptive classifier
        logger.info(f"Analyzing text: {text[:50]}...")
        result = classifier.classify_adaptive(text, debug=debug)
        
        # Format response for SomaJournal
        emotions = []
        for emotion_data in result['emotions']:
            emotions.append({
                'emotion': emotion_data['emotion'],
                'confidence': round(emotion_data['confidence'], 3)
            })
        
        # Extract analysis metadata
        analysis = {
            'text_type': result['analysis']['text_type'],
            'emotional_richness': result['analysis']['emotional_richness'],
            'recommended_approach': result['analysis']['recommended_approach'],
            'word_count': result['characteristics']['word_count'],
            'threshold_used': round(result['adaptive_params']['threshold'], 3),
            'max_emotions': result['adaptive_params']['max_emotions']
        }
        
        # Optional characteristics for detailed analysis
        characteristics = {
            'emotional_density': round(result['characteristics']['emotional_density'], 3),
            'complexity_score': round(result['characteristics']['complexity_score'], 3),
            'has_multiple_emotions': result['characteristics']['has_multiple_emotions'],
            'emotional_word_count': result['characteristics']['emotional_word_count'],
            'sentence_count': result['characteristics']['sentence_count']
        }
        
        # Convert to SomaJournal format (symptoms detection)
        symptoms = detect_symptoms_from_emotions(emotions)
        
        # Add psychosomatic analysis if available
        psychosomatic_analysis = None
        if PSYCHOSOMATIC_AVAILABLE:
            try:
                psychosomatic_analysis = create_hybrid_analysis(
                    text, 
                    emotions,
                    user_context=data.get('user_context')  # Optional user context
                )
                logger.info("✅ Psychosomatic analysis completed")
            except Exception as e:
                logger.warning(f"⚠️ Psychosomatic analysis failed: {e}")
        
        response = {
            'status': 'success',
            'emotions': emotions,
            'analysis': analysis,
            'characteristics': characteristics,
            'symptoms': symptoms,
            'adaptive_info': {
                'strategy': result['analysis']['recommended_approach'],
                'reasoning': f"Detected {len(emotions)} emotions using {analysis['text_type']} strategy"
            }
        }
        
        # Include psychosomatic analysis if available
        if psychosomatic_analysis:
            response['psychosomatic'] = psychosomatic_analysis
        
        if debug:
            response['debug'] = {
                'adaptive_params': result['adaptive_params'],
                'full_characteristics': result['characteristics']
            }
        
        logger.info(f"Analysis complete: {len(emotions)} emotions detected")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error analyzing emotion: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Analysis failed: {str(e)}',
            'code': 'ANALYSIS_FAILED'
        }), 500

def detect_symptoms_from_emotions(emotions):
    """
    Convert detected emotions to physical symptoms for SomaJournal compatibility.
    
    Args:
        emotions: List of emotion dictionaries with 'emotion' and 'confidence'
        
    Returns:
        Dictionary of symptoms with boolean values
    """
    symptoms = {
        'tension': False,
        'headache': False,
        'fatigue': False,
        'restlessness': False,
        'nausea': False
    }
    
    # Map emotions to potential symptoms
    emotion_symptom_map = {
        'anger': ['tension', 'headache'],
        'anxiety': ['tension', 'restlessness', 'nausea'],
        'fear': ['tension', 'nausea'],
        'nervousness': ['restlessness', 'tension'],
        'stress': ['tension', 'headache', 'fatigue'],
        'annoyance': ['tension', 'headache'],
        'frustration': ['tension'],
        'sadness': ['fatigue'],
        'grief': ['fatigue'],
        'disappointment': ['fatigue']
    }
    
    # Activate symptoms based on detected emotions
    for emotion_data in emotions:
        emotion = emotion_data['emotion']
        confidence = emotion_data['confidence']
        
        # Only trigger symptoms for high-confidence negative emotions
        if confidence > 0.5 and emotion in emotion_symptom_map:
            for symptom in emotion_symptom_map[emotion]:
                symptoms[symptom] = True
    
    return symptoms

@app.route('/preview-analysis', methods=['POST'])
def preview_analysis():
    """
    Quick preview of what analysis would return (for real-time UI feedback).
    Returns minimal data about emotion count and strategy without full analysis.
    """
    if not classifier:
        return jsonify({
            'status': 'error',
            'message': 'Classifier not available'
        }), 500
    
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({
                'emotion_count': 0,
                'strategy': 'No text provided',
                'text_type': 'empty'
            })
        
        # Quick characteristics analysis (no model inference)
        characteristics = classifier.analyze_text_characteristics(text)
        adaptive_params = classifier.determine_adaptive_parameters(characteristics)
        
        text_type_descriptions = {
            'quick_note': 'Quick note',
            'short_entry': 'Short entry', 
            'medium_entry': 'Medium entry',
            'detailed_journal': 'Detailed journal'
        }
        
        strategy_descriptions = {
            'quick_note': 'Focus on primary emotion',
            'short_entry': 'Balanced emotion detection',
            'medium_entry': 'Comprehensive analysis',
            'detailed_journal': 'Full emotional landscape'
        }
        
        text_type = classifier._categorize_text_type(characteristics)
        
        return jsonify({
            'emotion_count': adaptive_params['max_emotions'],
            'strategy': strategy_descriptions.get(text_type, 'Balanced approach'),
            'text_type': text_type_descriptions.get(text_type, text_type),
            'word_count': characteristics['word_count'],
            'threshold': round(adaptive_params['threshold'], 2)
        })
        
    except Exception as e:
        logger.error(f"Preview analysis error: {str(e)}")
        return jsonify({
            'emotion_count': 1,
            'strategy': 'Error in preview',
            'text_type': 'unknown'
        })

def create_fallback_response(text):
    """Create fallback response when BERT model is unavailable."""
    words = text.lower().split()
    word_count = len(words)
    
    # Simple fallback emotions based on keywords
    emotions = []
    if any(word in words for word in ['happy', 'joy', 'wonderful', 'amazing', 'great']):
        emotions.append({'emotion': 'joy', 'confidence': 0.7})
    if any(word in words for word in ['sad', 'down', 'depressed', 'awful']):
        emotions.append({'emotion': 'sadness', 'confidence': 0.7})
    if any(word in words for word in ['angry', 'mad', 'frustrated', 'annoyed']):
        emotions.append({'emotion': 'anger', 'confidence': 0.7})
    
    # Default to neutral if no emotions detected
    if not emotions:
        emotions.append({'emotion': 'neutral', 'confidence': 0.5})
    
    return {
        'status': 'success',
        'emotions': emotions,
        'analysis': {
            'text_type': 'short_entry' if word_count < 50 else 'medium_entry',
            'emotional_richness': 'low',
            'recommended_approach': 'Fallback keyword analysis',
            'word_count': word_count,
            'threshold_used': 0.5,
            'max_emotions': len(emotions)
        },
        'characteristics': {
            'emotional_density': 0.1,
            'complexity_score': 0.2,
            'has_multiple_emotions': len(emotions) > 1
        },
        'symptoms': {'tension': False, 'headache': False, 'fatigue': False},
        'adaptive_info': {
            'strategy': 'Keyword fallback (BERT model unavailable)',
            'reasoning': 'Using simple keyword matching as fallback'
        }
    }

if __name__ == '__main__':
    print("🚀 Starting SomaJournal Emotion Analysis API Server...")
    print("=" * 60)
    
    # Initialize the classifier
    if initialize_classifier():
        print(f"✅ Model loaded successfully")
        print(f"📍 Server will run on: http://localhost:8000")
        print(f"🔗 Health check: http://localhost:8000/health")
        print(f"📝 Emotion analysis: POST http://localhost:8000/analyze-emotion")
        print(f"⚡ Preview analysis: POST http://localhost:8000/preview-analysis")
        print("=" * 60)
        
        # Run the server
        app.run(
            host='0.0.0.0',
            port=8000,
            debug=True,
            use_reloader=False  # Prevent model reloading
        )
    else:
        print("❌ Failed to initialize classifier. Server not started.")
        print("💡 Please ensure:")
        print("   1. Model files exist: training/models/bert_emotion_model/")
        print("   2. Dependencies installed: pip install -r training/requirements.txt")
        print("   3. Git LFS files downloaded: git lfs pull")
        sys.exit(1)