#!/usr/bin/env python3
"""
Test script for psychosomatic analysis system
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from gpt_personalization import create_hybrid_analysis
from psychosomatic_mapping import get_psychosomatic_analysis

def test_psychosomatic_mapping():
    """Test the psychosomatic mapping system"""
    print("🧪 Testing Psychosomatic Mapping System")
    print("=" * 50)
    
    # Test emotions
    test_emotions = [
        {"emotion": "anger", "confidence": 0.8},
        {"emotion": "joy", "confidence": 0.7},
        {"emotion": "sadness", "confidence": 0.6},
        {"emotion": "love", "confidence": 0.9}
    ]
    
    for emotion_data in test_emotions:
        print(f"\n🎭 Testing emotion: {emotion_data['emotion']}")
        analysis = get_psychosomatic_analysis(emotion_data['emotion'])
        
        if analysis['has_evidence_base']:
            psycho = analysis['psychosomatic']
            print(f"   📍 Body regions: {psycho.get('primary_regions', [])}")
            print(f"   💪 Intensity: {psycho.get('intensity', 'N/A')}")
            print(f"   🧠 Sensation: {psycho.get('bodily_sensations', 'N/A')[:60]}...")
            print(f"   📚 Research: {psycho.get('research_basis', 'N/A')}")
        else:
            print("   ❌ No evidence-based mapping found")

def test_hybrid_analysis():
    """Test the hybrid analysis system"""
    print("\n\n🔬 Testing Hybrid Analysis System")
    print("=" * 50)
    
    # Test cases
    test_cases = [
        {
            "text": "I am feeling so angry and frustrated with this situation",
            "emotions": [{"emotion": "anger", "confidence": 0.85}]
        },
        {
            "text": "My heart is full of love and gratitude today",
            "emotions": [{"emotion": "love", "confidence": 0.9}, {"emotion": "gratitude", "confidence": 0.7}]
        },
        {
            "text": "I feel overwhelmed and my chest feels tight",
            "emotions": [{"emotion": "anxiety", "confidence": 0.7}]
        }
    ]
    
    for i, case in enumerate(test_cases):
        print(f"\n📝 Test Case {i+1}: {case['text'][:40]}...")
        
        try:
            result = create_hybrid_analysis(
                case['text'],
                case['emotions']
            )
            
            print(f"   ✅ Status: {result.get('status', 'unknown')}")
            print(f"   🎭 Primary emotion: {result.get('primary_emotion', 'none')}")
            print(f"   📊 Personalization: {result.get('personalization_level', 'none')}")
            print(f"   🧬 Evidence-based: {result.get('evidence_based', False)}")
            
            if result.get('psychosomatic_analysis'):
                psycho = result['psychosomatic_analysis']
                print(f"   🎯 Body regions: {psycho.get('primary_regions', [])}")
                print(f"   💭 Sensations: {psycho.get('bodily_sensations', 'N/A')[:50]}...")
            
            if result.get('personalized_insights'):
                insights = result['personalized_insights']
                print(f"   🌟 GPT Enhanced: {insights.get('gpt_enhanced', False)}")
                if insights.get('encouragement'):
                    print(f"   💪 Encouragement: {insights['encouragement'][:50]}...")
                    
        except Exception as e:
            print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_psychosomatic_mapping()
    test_hybrid_analysis()
    
    print("\n\n🎉 Testing Complete!")
    print("=" * 50)