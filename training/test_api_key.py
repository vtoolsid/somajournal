#!/usr/bin/env python3
"""
Test OpenAI API key and GPT emotion detection
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from gpt_personalization import GPTPersonalizationEngine

def test_api_key():
    """Test if OpenAI API key is working"""
    print("🔑 Testing OpenAI API Key Configuration")
    print("=" * 50)
    
    # Test initialization
    engine = GPTPersonalizationEngine()
    
    print(f"📋 API Key Available: {bool(engine.api_key)}")
    print(f"📋 Client Available: {bool(engine.client)}")
    print(f"📋 GPT Available: {engine.gpt_available}")
    
    if engine.api_key:
        print(f"📋 API Key (masked): {engine.api_key[:10]}...{engine.api_key[-4:]}")
    
    if engine.gpt_available:
        print("\n🧪 Testing GPT Emotion Detection")
        
        # Test GPT emotion analysis
        test_text = "I feel overwhelmed with work and my shoulders are so tense"
        
        try:
            result = engine._gpt_emotion_analysis(test_text)
            print(f"✅ GPT Analysis Result: {result}")
            
            if result and len(result) > 0:
                for emotion in result:
                    print(f"   🎭 {emotion['emotion']}: {emotion['confidence']:.2f}")
        except Exception as e:
            print(f"❌ GPT Analysis Error: {e}")
    else:
        print("\n⚠️ GPT not available - will use template-based fallback")

if __name__ == "__main__":
    test_api_key()