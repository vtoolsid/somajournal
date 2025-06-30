#!/usr/bin/env python3
"""
Quick test script to verify the BERT emotion analysis integration
"""

import requests
import json
import time

def test_direct_python_server():
    """Test the Python Flask server directly"""
    print("🧪 Testing Python Flask server directly...")
    
    try:
        # Test health endpoint
        health_response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"✅ Health check: {health_response.status_code}")
        if health_response.status_code == 200:
            print(f"   Response: {health_response.json()}")
        
        # Test emotion analysis
        test_texts = [
            "Good day",  # Should detect 1 emotion
            "I feel really happy today the weather is perfect",  # Should detect 2-3 emotions
            "Today I woke up feeling incredibly grateful for my family, excited about the new project at work, but also nervous about the presentation I have to give."  # Should detect 3-5 emotions
        ]
        
        for i, text in enumerate(test_texts, 1):
            print(f"\n📝 Test {i}: '{text[:30]}...'")
            
            # Test preview analysis
            preview_response = requests.post(
                "http://localhost:8000/preview-analysis",
                json={"text": text},
                timeout=10
            )
            
            if preview_response.status_code == 200:
                preview = preview_response.json()
                print(f"   📊 Preview: {preview['emotion_count']} emotions - {preview['strategy']}")
            
            # Test full analysis
            analysis_response = requests.post(
                "http://localhost:8000/analyze-emotion",
                json={"text": text},
                timeout=15
            )
            
            if analysis_response.status_code == 200:
                result = analysis_response.json()
                emotions = result.get('emotions', [])
                print(f"   🎭 Detected: {len(emotions)} emotions")
                for emotion in emotions[:3]:  # Show first 3
                    print(f"      • {emotion['emotion']}: {emotion['confidence']:.3f}")
                
                analysis = result.get('analysis', {})
                print(f"   🧠 Strategy: {analysis.get('recommended_approach', 'N/A')}")
            else:
                print(f"   ❌ Analysis failed: {analysis_response.status_code}")
                
    except requests.exceptions.RequestException as e:
        print(f"❌ Python server not responding: {e}")

def test_nextjs_proxy():
    """Test the Next.js API proxy"""
    print("\n🌐 Testing Next.js API proxy...")
    
    try:
        # Test Next.js proxy to Python
        response = requests.post(
            "http://localhost:3000/api/analyze-emotion",
            json={"text": "I feel amazing today!"},
            timeout=10
        )
        
        print(f"✅ Next.js proxy: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            emotions = result.get('emotions', [])
            print(f"   🎭 Detected: {len(emotions)} emotions via Next.js")
            for emotion in emotions[:2]:
                print(f"      • {emotion['emotion']}: {emotion['confidence']:.3f}")
        else:
            print(f"   Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Next.js server not responding: {e}")

if __name__ == "__main__":
    print("🚀 SomaJournal Integration Test")
    print("=" * 50)
    
    test_direct_python_server()
    test_nextjs_proxy()
    
    print("\n✅ Integration test complete!")
    print("\n🌐 Open http://localhost:3000/journal to test the full UI!")