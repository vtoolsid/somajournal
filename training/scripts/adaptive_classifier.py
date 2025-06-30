#!/usr/bin/env python3
"""
Adaptive Emotion Classification System

This system dynamically adjusts emotion detection based on:
- Text length (longer texts can handle more emotions)
- Emotional richness (more emotional words = more emotions detected)
- Context complexity (journal vs quick note)

Usage:
    python scripts/adaptive_classifier.py
"""

import os
import sys
import re
import numpy as np
from typing import Dict, List, Tuple
import statistics

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from scripts.inference import EmotionClassifier
except ImportError:
    print("❌ Could not import EmotionClassifier. Please ensure the model is trained.")
    sys.exit(1)

class AdaptiveEmotionClassifier:
    """
    Adaptive emotion classifier that adjusts detection based on text characteristics.
    """
    
    def __init__(self, model_path: str = 'models/bert_emotion_model'):
        """Initialize the adaptive classifier."""
        self.base_classifier = EmotionClassifier(model_path=model_path)
        
        # Emotional richness indicators
        self.emotional_words = {
            'positive': [
                'amazing', 'wonderful', 'fantastic', 'incredible', 'awesome', 'brilliant',
                'love', 'adore', 'cherish', 'treasure', 'appreciate', 'grateful',
                'happy', 'joy', 'excited', 'thrilled', 'delighted', 'ecstatic',
                'proud', 'accomplished', 'successful', 'victorious', 'triumphant',
                'peaceful', 'calm', 'serene', 'tranquil', 'relaxed', 'content',
                'optimistic', 'hopeful', 'confident', 'secure', 'comfortable'
            ],
            'negative': [
                'terrible', 'awful', 'horrible', 'devastating', 'crushing', 'overwhelming',
                'hate', 'despise', 'loathe', 'disgusted', 'revolted', 'sickened',
                'sad', 'depressed', 'miserable', 'heartbroken', 'devastated', 'grief',
                'angry', 'furious', 'enraged', 'livid', 'outraged', 'irritated',
                'anxious', 'worried', 'stressed', 'panicked', 'terrified', 'scared',
                'frustrated', 'annoyed', 'bothered', 'upset', 'disappointed', 'hurt'
            ],
            'complex': [
                'bittersweet', 'conflicted', 'ambivalent', 'confused', 'overwhelmed',
                'nostalgic', 'wistful', 'melancholy', 'contemplative', 'reflective',
                'uncertain', 'torn', 'mixed', 'complicated', 'intense', 'profound'
            ]
        }
        
        # Intensity amplifiers
        self.intensity_amplifiers = [
            'super', 'really', 'very', 'extremely', 'incredibly', 'absolutely',
            'totally', 'completely', 'utterly', 'deeply', 'profoundly', 'intensely',
            'so much', 'so very', 'way too', 'overwhelmingly', 'unbelievably'
        ]
        
        print("✅ Adaptive emotion classifier initialized")
    
    def analyze_text_characteristics(self, text: str) -> Dict:
        """
        Analyze text to determine its emotional characteristics.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Dictionary with text characteristics
        """
        words = text.lower().split()
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        # Basic metrics
        word_count = len(words)
        sentence_count = len(sentences)
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # Emotional richness analysis
        emotional_word_count = 0
        emotion_categories = {'positive': 0, 'negative': 0, 'complex': 0}
        
        for word in words:
            for category, word_list in self.emotional_words.items():
                if any(emotional_word in word for emotional_word in word_list):
                    emotional_word_count += 1
                    emotion_categories[category] += 1
                    break
        
        # Intensity analysis
        intensity_count = sum(1 for word in words 
                            if any(amp in text.lower() for amp in self.intensity_amplifiers))
        
        # Emotional density
        emotional_density = emotional_word_count / max(word_count, 1)
        
        # Complexity indicators
        has_multiple_emotions = sum(1 for count in emotion_categories.values() if count > 0) > 1
        has_contrasts = any(contrast in text.lower() for contrast in 
                          ['but', 'however', 'although', 'despite', 'yet', 'while', 'though'])
        
        return {
            'word_count': word_count,
            'sentence_count': sentence_count,
            'avg_sentence_length': avg_sentence_length,
            'emotional_word_count': emotional_word_count,
            'emotional_density': emotional_density,
            'emotion_categories': emotion_categories,
            'intensity_count': intensity_count,
            'has_multiple_emotions': has_multiple_emotions,
            'has_contrasts': has_contrasts,
            'complexity_score': self._calculate_complexity_score(
                emotional_density, has_multiple_emotions, has_contrasts, intensity_count
            )
        }
    
    def _calculate_complexity_score(self, emotional_density: float, 
                                  has_multiple_emotions: bool, 
                                  has_contrasts: bool, 
                                  intensity_count: int) -> float:
        """Calculate overall emotional complexity score (0-1)."""
        score = 0.0
        
        # Base score from emotional density
        score += min(emotional_density * 2, 0.5)  # Max 0.5 from density
        
        # Bonus for multiple emotion types
        if has_multiple_emotions:
            score += 0.2
        
        # Bonus for emotional contrasts
        if has_contrasts:
            score += 0.2
        
        # Bonus for intensity
        score += min(intensity_count * 0.1, 0.3)  # Max 0.3 from intensity
        
        return min(score, 1.0)
    
    def determine_adaptive_parameters(self, characteristics: Dict) -> Dict:
        """
        Determine optimal parameters based on text characteristics.
        
        Args:
            characteristics: Text analysis results
            
        Returns:
            Dictionary with adaptive parameters
        """
        word_count = characteristics['word_count']
        complexity_score = characteristics['complexity_score']
        emotional_density = characteristics['emotional_density']
        
        # Adaptive threshold calculation
        base_threshold = 0.4  # Conservative starting point
        
        # Adjust threshold based on text length
        if word_count < 10:  # Very short text
            threshold_adjustment = 0.15  # Higher threshold, fewer emotions
        elif word_count < 30:  # Short text
            threshold_adjustment = 0.05
        elif word_count < 100:  # Medium text
            threshold_adjustment = 0.0
        else:  # Long text
            threshold_adjustment = -0.1  # Lower threshold, more emotions
        
        # Adjust based on emotional complexity
        complexity_adjustment = -0.2 * complexity_score  # More complex = lower threshold
        
        # Adjust based on emotional density
        density_adjustment = -0.1 * emotional_density  # More emotional = lower threshold
        
        final_threshold = base_threshold + threshold_adjustment + complexity_adjustment + density_adjustment
        final_threshold = max(0.2, min(0.8, final_threshold))  # Clamp between 0.2-0.8
        
        # Determine max emotions to show
        if word_count < 10:
            max_emotions = 1
        elif word_count < 30:
            max_emotions = 2
        elif word_count < 100:
            max_emotions = 3
        else:
            max_emotions = 5
        
        # Adjust max emotions based on complexity
        if complexity_score > 0.7:
            max_emotions = min(max_emotions + 1, 6)
        elif complexity_score < 0.3:
            max_emotions = max(max_emotions - 1, 1)
        
        return {
            'threshold': final_threshold,
            'max_emotions': max_emotions,
            'reasoning': {
                'base_threshold': base_threshold,
                'length_adjustment': threshold_adjustment,
                'complexity_adjustment': complexity_adjustment,
                'density_adjustment': density_adjustment,
                'final_threshold': final_threshold,
                'max_emotions': max_emotions
            }
        }
    
    def classify_adaptive(self, text: str, debug: bool = False) -> Dict:
        """
        Classify emotions with adaptive parameters.
        
        Args:
            text: Input text
            debug: Whether to show reasoning
            
        Returns:
            Adaptive classification results
        """
        # Analyze text characteristics
        characteristics = self.analyze_text_characteristics(text)
        
        # Determine adaptive parameters
        adaptive_params = self.determine_adaptive_parameters(characteristics)
        
        # Set adaptive threshold
        original_threshold = self.base_classifier.threshold
        self.base_classifier.threshold = adaptive_params['threshold']
        
        # Get emotions with adaptive threshold
        result = self.base_classifier.classify_emotion(text, top_k=adaptive_params['max_emotions'])
        
        # Restore original threshold
        self.base_classifier.threshold = original_threshold
        
        # Limit to max emotions
        limited_emotions = result['emotions'][:adaptive_params['max_emotions']]
        
        # Enhanced result with adaptive info
        adaptive_result = {
            'text': text,
            'emotions': limited_emotions,
            'characteristics': characteristics,
            'adaptive_params': adaptive_params,
            'analysis': {
                'text_type': self._categorize_text_type(characteristics),
                'emotional_richness': self._categorize_emotional_richness(characteristics),
                'recommended_approach': self._get_recommended_approach(characteristics)
            }
        }
        
        if debug:
            self._print_debug_info(adaptive_result)
        
        return adaptive_result
    
    def _categorize_text_type(self, characteristics: Dict) -> str:
        """Categorize the type of text based on characteristics."""
        word_count = characteristics['word_count']
        
        if word_count < 10:
            return "quick_note"
        elif word_count < 30:
            return "short_entry"
        elif word_count < 100:
            return "medium_entry"
        else:
            return "detailed_journal"
    
    def _categorize_emotional_richness(self, characteristics: Dict) -> str:
        """Categorize emotional richness."""
        complexity_score = characteristics['complexity_score']
        
        if complexity_score < 0.3:
            return "low"
        elif complexity_score < 0.6:
            return "moderate"
        else:
            return "high"
    
    def _get_recommended_approach(self, characteristics: Dict) -> str:
        """Get recommendation for how to handle this text type."""
        text_type = self._categorize_text_type(characteristics)
        richness = self._categorize_emotional_richness(characteristics)
        
        recommendations = {
            ("quick_note", "low"): "Focus on primary emotion only",
            ("quick_note", "moderate"): "Show 1-2 key emotions",
            ("quick_note", "high"): "Show 2 emotions, user might want to expand",
            ("short_entry", "low"): "Look for subtle emotions",
            ("short_entry", "moderate"): "Show 2-3 emotions",
            ("short_entry", "high"): "Rich emotional content, show multiple",
            ("medium_entry", "low"): "Gentle emotion detection",
            ("medium_entry", "moderate"): "Balanced emotion analysis",
            ("medium_entry", "high"): "Comprehensive emotion mapping",
            ("detailed_journal", "low"): "Deep analysis for subtle patterns",
            ("detailed_journal", "moderate"): "Full emotional landscape",
            ("detailed_journal", "high"): "Complex emotional journey analysis"
        }
        
        return recommendations.get((text_type, richness), "Balanced approach")
    
    def _print_debug_info(self, result: Dict):
        """Print detailed debug information."""
        print("\n🔍 ADAPTIVE ANALYSIS DEBUG")
        print("=" * 60)
        
        char = result['characteristics']
        params = result['adaptive_params']
        
        print(f"📝 Text Analysis:")
        print(f"   Words: {char['word_count']}")
        print(f"   Sentences: {char['sentence_count']}")
        print(f"   Emotional words: {char['emotional_word_count']}")
        print(f"   Emotional density: {char['emotional_density']:.2f}")
        print(f"   Complexity score: {char['complexity_score']:.2f}")
        
        print(f"\n🎯 Adaptive Parameters:")
        print(f"   Threshold used: {params['threshold']:.2f}")
        print(f"   Max emotions: {params['max_emotions']}")
        
        print(f"\n💡 Analysis:")
        print(f"   Text type: {result['analysis']['text_type']}")
        print(f"   Emotional richness: {result['analysis']['emotional_richness']}")
        print(f"   Approach: {result['analysis']['recommended_approach']}")
        
        if params['reasoning']:
            reasoning = params['reasoning']
            print(f"\n🧮 Threshold Calculation:")
            print(f"   Base threshold: {reasoning['base_threshold']:.2f}")
            print(f"   Length adjustment: {reasoning['length_adjustment']:+.2f}")
            print(f"   Complexity adjustment: {reasoning['complexity_adjustment']:+.2f}")
            print(f"   Density adjustment: {reasoning['density_adjustment']:+.2f}")
            print(f"   Final threshold: {reasoning['final_threshold']:.2f}")

def demo_adaptive_system():
    """Demonstrate the adaptive emotion classification system."""
    print("🎭 Adaptive Emotion Classification Demo")
    print("=" * 60)
    
    classifier = AdaptiveEmotionClassifier()
    
    # Test examples of different lengths and emotional complexity
    test_examples = [
        {
            'text': "Good day",
            'description': "Very short, simple"
        },
        {
            'text': "I'm happy today!",
            'description': "Short, one emotion"
        },
        {
            'text': "Yo I felt super amazing today the weather the vibes it was immaculate had a wonderful day",
            'description': "Medium length, emotionally rich"
        },
        {
            'text': "Today was bittersweet. I'm excited about my new job opportunity, but I'm also really sad about leaving my current team. They've been like family to me. I feel grateful for everything I've learned here, yet anxious about starting over somewhere new. It's overwhelming to have so many conflicting emotions at once.",
            'description': "Long, complex, multiple emotions"
        },
        {
            'text': "Had lunch. It was okay. Work was fine. Nothing special happened.",
            'description': "Medium length, low emotional content"
        }
    ]
    
    for i, example in enumerate(test_examples, 1):
        print(f"\n{'='*60}")
        print(f"Example {i}: {example['description']}")
        print(f"Text: \"{example['text']}\"")
        print("=" * 60)
        
        result = classifier.classify_adaptive(example['text'], debug=True)
        
        print(f"\n🎯 DETECTED EMOTIONS:")
        if result['emotions']:
            for emotion in result['emotions']:
                print(f"   • {emotion['emotion']}: {emotion['confidence']:.3f}")
        else:
            print("   No emotions detected")
        
        print(f"\n📊 ADAPTIVE SUMMARY:")
        print(f"   Threshold used: {result['adaptive_params']['threshold']:.2f}")
        print(f"   Max emotions: {result['adaptive_params']['max_emotions']}")
        print(f"   Text type: {result['analysis']['text_type']}")
        print(f"   Strategy: {result['analysis']['recommended_approach']}")

def interactive_adaptive_test():
    """Interactive testing of adaptive system."""
    print("\n🧪 Interactive Adaptive Testing")
    print("=" * 50)
    
    classifier = AdaptiveEmotionClassifier()
    
    while True:
        print("\nEnter text to analyze (or 'quit' to exit):")
        text = input("💬 ").strip()
        
        if text.lower() in ['quit', 'exit', 'q']:
            print("👋 Goodbye!")
            break
        
        if not text:
            continue
        
        result = classifier.classify_adaptive(text, debug=True)
        
        print(f"\n🎯 RESULTS:")
        if result['emotions']:
            for emotion in result['emotions']:
                print(f"   • {emotion['emotion']}: {emotion['confidence']:.3f}")
        else:
            print("   No emotions detected")

def main():
    """Main function."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Adaptive Emotion Classification")
    parser.add_argument('--mode', choices=['demo', 'interactive'], default='demo',
                      help='Run mode')
    parser.add_argument('--text', type=str, help='Analyze specific text')
    
    args = parser.parse_args()
    
    if args.text:
        classifier = AdaptiveEmotionClassifier()
        result = classifier.classify_adaptive(args.text, debug=True)
        
        print(f"Text: \"{args.text}\"")
        if result['emotions']:
            print("Detected emotions:")
            for emotion in result['emotions']:
                print(f"  • {emotion['emotion']}: {emotion['confidence']:.3f}")
        else:
            print("No emotions detected")
    elif args.mode == 'interactive':
        interactive_adaptive_test()
    else:
        demo_adaptive_system()

if __name__ == "__main__":
    main()