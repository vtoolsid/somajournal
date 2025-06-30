#!/usr/bin/env python3
"""
SomaJournal Integration Example

This script demonstrates how to integrate the BERT emotion classifier
with your SomaJournal application for real-time emotion analysis.

Usage:
    python scripts/integration_example.py
"""

import os
import sys
import json
from typing import Dict, List, Optional
from datetime import datetime

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from scripts.inference import EmotionClassifier
except ImportError:
    print("❌ Could not import EmotionClassifier. Please ensure the model is trained.")
    print("Run: python scripts/train.py")
    sys.exit(1)

class JournalEmotionAnalyzer:
    """
    Integration class for SomaJournal emotion analysis.
    """
    
    def __init__(self, model_path: str = 'models/bert_emotion_model'):
        """
        Initialize the journal emotion analyzer.
        
        Args:
            model_path: Path to the trained BERT model
        """
        try:
            self.classifier = EmotionClassifier(model_path=model_path)
            print("✅ Emotion analyzer initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize emotion analyzer: {e}")
            raise
    
    def analyze_journal_entry(self, text: str, user_id: str = None) -> Dict:
        """
        Analyze a complete journal entry for emotions.
        
        Args:
            text: The journal entry text
            user_id: Optional user identifier
            
        Returns:
            Comprehensive emotion analysis
        """
        if not text or not text.strip():
            return {
                "status": "error",
                "message": "Empty journal entry",
                "emotions": [],
                "analysis": {}
            }
        
        try:
            # Get emotion classification
            result = self.classifier.classify_emotion(text, top_k=5)
            
            # Enhanced analysis
            analysis = {
                "entry_length": len(text),
                "word_count": len(text.split()),
                "primary_emotion": result['top_emotion'],
                "emotion_diversity": len(result['emotions']),
                "emotional_intensity": self._calculate_intensity(result['emotions']),
                "emotion_categories": self._categorize_emotions(result['emotions']),
                "wellness_indicators": self._get_wellness_indicators(result['emotions']),
                "timestamp": datetime.now().isoformat()
            }
            
            if user_id:
                analysis['user_id'] = user_id
            
            return {
                "status": "success",
                "text": text,
                "emotions": result['emotions'],
                "analysis": analysis,
                "raw_scores": result['confidence_scores']
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"Analysis failed: {str(e)}",
                "emotions": [],
                "analysis": {}
            }
    
    def _calculate_intensity(self, emotions: List[Dict]) -> float:
        """Calculate overall emotional intensity."""
        if not emotions:
            return 0.0
        
        # Average confidence of detected emotions
        total_confidence = sum(emotion['confidence'] for emotion in emotions)
        return total_confidence / len(emotions)
    
    def _categorize_emotions(self, emotions: List[Dict]) -> Dict:
        """Categorize emotions into positive, negative, and neutral."""
        positive_emotions = {
            'admiration', 'amusement', 'approval', 'caring', 'excitement', 
            'gratitude', 'joy', 'love', 'optimism', 'pride', 'relief'
        }
        
        negative_emotions = {
            'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust',
            'embarrassment', 'fear', 'grief', 'nervousness', 'remorse', 'sadness'
        }
        
        categories = {
            'positive': [],
            'negative': [],
            'ambiguous': [],
            'neutral': []
        }
        
        for emotion in emotions:
            emotion_name = emotion['emotion']
            if emotion_name in positive_emotions:
                categories['positive'].append(emotion)
            elif emotion_name in negative_emotions:
                categories['negative'].append(emotion)
            elif emotion_name == 'neutral':
                categories['neutral'].append(emotion)
            else:
                categories['ambiguous'].append(emotion)
        
        return categories
    
    def _get_wellness_indicators(self, emotions: List[Dict]) -> Dict:
        """Generate wellness indicators based on detected emotions."""
        if not emotions:
            return {"status": "neutral", "recommendations": []}
        
        emotion_names = [e['emotion'] for e in emotions]
        
        # Stress indicators
        stress_emotions = {'anger', 'anxiety', 'fear', 'nervousness', 'annoyance'}
        stress_level = len(set(emotion_names) & stress_emotions)
        
        # Positive wellness indicators
        positive_emotions = {'joy', 'gratitude', 'love', 'excitement', 'pride'}
        positive_level = len(set(emotion_names) & positive_emotions)
        
        # Generate recommendations
        recommendations = []
        
        if stress_level > 0:
            recommendations.append("Consider stress-reduction techniques like deep breathing")
            recommendations.append("Take breaks and practice mindfulness")
        
        if 'sadness' in emotion_names or 'grief' in emotion_names:
            recommendations.append("Reach out to supportive friends or family")
            recommendations.append("Consider gentle physical activity")
        
        if 'anger' in emotion_names:
            recommendations.append("Try physical exercise to release tension")
            recommendations.append("Practice expressing feelings constructively")
        
        if positive_level > 0:
            recommendations.append("Celebrate these positive moments")
            recommendations.append("Share your joy with others")
        
        # Overall wellness status
        if positive_level > stress_level:
            status = "positive"
        elif stress_level > positive_level:
            status = "needs_attention"
        else:
            status = "balanced"
        
        return {
            "status": status,
            "stress_level": stress_level,
            "positive_level": positive_level,
            "recommendations": recommendations[:3]  # Top 3 recommendations
        }
    
    def get_emotion_trends(self, journal_entries: List[str]) -> Dict:
        """
        Analyze emotion trends across multiple journal entries.
        
        Args:
            journal_entries: List of journal entry texts
            
        Returns:
            Emotion trend analysis
        """
        if not journal_entries:
            return {"error": "No journal entries provided"}
        
        all_emotions = []
        entry_analyses = []
        
        for i, entry in enumerate(journal_entries):
            analysis = self.analyze_journal_entry(entry)
            if analysis['status'] == 'success':
                all_emotions.extend(analysis['emotions'])
                entry_analyses.append(analysis)
        
        if not all_emotions:
            return {"error": "No emotions detected in any entries"}
        
        # Calculate trends
        emotion_counts = {}
        for emotion in all_emotions:
            name = emotion['emotion']
            emotion_counts[name] = emotion_counts.get(name, 0) + 1
        
        # Most frequent emotions
        most_frequent = sorted(emotion_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Average emotional intensity over time
        intensities = [a['analysis']['emotional_intensity'] for a in entry_analyses]
        avg_intensity = sum(intensities) / len(intensities) if intensities else 0
        
        return {
            "total_entries": len(journal_entries),
            "analyzed_entries": len(entry_analyses),
            "most_frequent_emotions": most_frequent,
            "average_intensity": avg_intensity,
            "emotion_diversity": len(emotion_counts),
            "trend_summary": self._generate_trend_summary(most_frequent, avg_intensity)
        }
    
    def _generate_trend_summary(self, frequent_emotions: List, avg_intensity: float) -> str:
        """Generate a human-readable trend summary."""
        if not frequent_emotions:
            return "No clear emotional patterns detected."
        
        top_emotion = frequent_emotions[0][0]
        
        intensity_desc = "high" if avg_intensity > 0.7 else "moderate" if avg_intensity > 0.4 else "low"
        
        summary = f"Your most frequent emotion is {top_emotion} with {intensity_desc} intensity. "
        
        if len(frequent_emotions) > 1:
            second_emotion = frequent_emotions[1][0]
            summary += f"You also frequently experience {second_emotion}. "
        
        if avg_intensity > 0.6:
            summary += "Your emotions tend to be quite intense, suggesting strong engagement with your experiences."
        elif avg_intensity < 0.3:
            summary += "Your emotional responses tend to be more subdued or balanced."
        
        return summary

def demo_integration():
    """Demonstrate the integration with sample journal entries."""
    print("🎭 SomaJournal Integration Demo")
    print("=" * 50)
    
    try:
        analyzer = JournalEmotionAnalyzer()
    except Exception as e:
        print(f"❌ Could not initialize analyzer: {e}")
        print("Please train the model first: python scripts/train.py")
        return
    
    # Sample journal entries
    sample_entries = [
        "Today was absolutely amazing! I got the promotion I've been working towards for months. I feel so grateful and excited about this new opportunity.",
        
        "I'm feeling really anxious about the presentation tomorrow. I've prepared a lot but I'm still worried something will go wrong.",
        
        "Had a quiet day at home. Spent time reading and reflecting. Feeling peaceful and content with where I am in life.",
        
        "Got into an argument with my roommate about the dishes. I'm frustrated and angry. This keeps happening and I don't know how to fix it.",
        
        "Visited my grandmother today. She told me stories about her childhood. I felt so much love and connection to my family history."
    ]
    
    print(f"📖 Analyzing {len(sample_entries)} journal entries...\n")
    
    # Analyze individual entries
    for i, entry in enumerate(sample_entries, 1):
        print(f"Entry {i}: \"{entry[:50]}...\"")
        
        analysis = analyzer.analyze_journal_entry(entry, user_id="demo_user")
        
        if analysis['status'] == 'success':
            emotions = analysis['emotions']
            wellness = analysis['analysis']['wellness_indicators']
            
            print(f"  🎯 Primary Emotion: {analysis['analysis']['primary_emotion']['emotion']} ({analysis['analysis']['primary_emotion']['confidence']:.2f})")
            print(f"  😊 Emotional Intensity: {analysis['analysis']['emotional_intensity']:.2f}")
            print(f"  🏥 Wellness Status: {wellness['status']}")
            
            if wellness['recommendations']:
                print(f"  💡 Recommendation: {wellness['recommendations'][0]}")
        else:
            print(f"  ❌ Analysis failed: {analysis['message']}")
        
        print()
    
    # Analyze trends
    print("📈 Analyzing emotion trends across all entries...")
    trends = analyzer.get_emotion_trends(sample_entries)
    
    if 'error' not in trends:
        print(f"  📊 Most frequent emotions:")
        for emotion, count in trends['most_frequent_emotions'][:3]:
            print(f"    • {emotion}: {count} times")
        
        print(f"  🎢 Average emotional intensity: {trends['average_intensity']:.2f}")
        print(f"  🌈 Emotion diversity: {trends['emotion_diversity']} different emotions")
        print(f"  📝 Trend summary: {trends['trend_summary']}")
    
    print("\n✅ Integration demo completed!")
    print("\n🔗 To integrate with SomaJournal:")
    print("1. Import JournalEmotionAnalyzer in your journal processing code")
    print("2. Initialize analyzer once: analyzer = JournalEmotionAnalyzer()")
    print("3. Analyze entries: result = analyzer.analyze_journal_entry(text)")
    print("4. Use emotion data for mood tracking and wellness insights")

if __name__ == "__main__":
    demo_integration()