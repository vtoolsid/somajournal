#!/usr/bin/env python3
"""
Test script for GPT emotion detection when BERT fails
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from gpt_personalization import create_hybrid_analysis

def test_weak_emotion_scenarios():
    """Test scenarios where BERT typically fails to detect strong emotions"""
    print("🧪 Testing GPT Emotion Detection for Weak BERT Scenarios")
    print("=" * 60)
    
    # Test cases where BERT often struggles
    test_cases = [
        {
            "description": "Subtle work stress",
            "text": "I've been feeling a bit overwhelmed with work lately. My shoulders are tense.",
            "bert_emotions": []  # Simulating weak BERT detection
        },
        {
            "description": "Indirect emotional expression", 
            "text": "The weather has been gray and I haven't been sleeping well. Everything feels harder.",
            "bert_emotions": [{"emotion": "neutral", "confidence": 0.3}]  # Low confidence
        },
        {
            "description": "Complex mixed emotions",
            "text": "I got the promotion but I'm worried about the new responsibilities. Part of me is excited but another part is terrified.",
            "bert_emotions": [{"emotion": "fear", "confidence": 0.4}]  # Below threshold
        },
        {
            "description": "Physical symptoms without emotional words",
            "text": "My chest feels tight and I can't focus. Had to step outside during the meeting.",
            "bert_emotions": []  # No emotions detected
        },
        {
            "description": "Relationship complexity",
            "text": "We had another argument about money. I love him but sometimes I wonder if we're compatible.",
            "bert_emotions": [{"emotion": "love", "confidence": 0.3}, {"emotion": "confusion", "confidence": 0.2}]
        }
    ]
    
    for i, case in enumerate(test_cases):
        print(f"\n📝 Test Case {i+1}: {case['description']}")
        print(f"   Text: {case['text'][:50]}...")
        print(f"   BERT: {len(case['bert_emotions'])} weak emotions")
        
        try:
            result = create_hybrid_analysis(
                case['text'],
                case['bert_emotions']  # Simulating weak BERT output
            )
            
            # Check if GPT emotion analysis was triggered
            emotions = result.get('emotions', [])
            personalization_level = result.get('personalization_level', 'unknown')
            
            print(f"   ✅ Status: {result.get('status', 'unknown')}")
            print(f"   🎭 Final emotions: {len(emotions)} detected")
            
            if emotions:
                for emotion in emotions[:3]:  # Show top 3
                    conf = emotion.get('confidence', 0)
                    print(f"      - {emotion.get('emotion', 'unknown')}: {conf:.2f}")
            
            print(f"   📊 Personalization: {personalization_level}")
            
            # Check if psychosomatic analysis was generated
            if result.get('psychosomatic_analysis'):
                psycho = result['psychosomatic_analysis']
                regions = psycho.get('primary_regions', [])
                if regions:
                    print(f"   🎯 Body regions: {regions[:3]}")
            
            # Check for personalized insights
            if result.get('personalized_insights'):
                insights = result['personalized_insights']
                gpt_enhanced = insights.get('gpt_enhanced', False)
                print(f"   🌟 GPT Enhanced: {gpt_enhanced}")
                
                if gpt_enhanced and insights.get('encouragement'):
                    print(f"   💪 Encouragement: {insights['encouragement'][:60]}...")
                    
        except Exception as e:
            print(f"   ❌ Error: {e}")

def test_strong_emotion_scenarios():
    """Test scenarios where BERT detection is strong (GPT should not override)"""
    print("\n\n🔬 Testing Strong BERT Scenarios (GPT should not override)")
    print("=" * 60)
    
    strong_cases = [
        {
            "description": "Clear happiness",
            "text": "I'm so happy and excited about my graduation!",
            "bert_emotions": [{"emotion": "joy", "confidence": 0.9}, {"emotion": "excitement", "confidence": 0.8}]
        },
        {
            "description": "Obvious anger",
            "text": "I'm furious about what happened at work today!",
            "bert_emotions": [{"emotion": "anger", "confidence": 0.85}]
        }
    ]
    
    for i, case in enumerate(strong_cases):
        print(f"\n📝 Test Case {i+1}: {case['description']}")
        print(f"   Text: {case['text']}")
        print(f"   BERT: Strong confidence emotions")
        
        try:
            result = create_hybrid_analysis(
                case['text'],
                case['bert_emotions']
            )
            
            emotions = result.get('emotions', [])
            print(f"   ✅ Emotions preserved: {[e['emotion'] for e in emotions]}")
            print(f"   📊 Should use BERT emotions, not GPT override")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_weak_emotion_scenarios()
    test_strong_emotion_scenarios()
    
    print("\n\n🎉 GPT Emotion Detection Testing Complete!")
    print("=" * 60)
    print("💡 Note: GPT analysis requires valid OpenAI API key in .env.local")
    print("🔧 Without API key, system falls back to evidence-based templates")