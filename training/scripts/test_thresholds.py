#!/usr/bin/env python3
"""
Simple Threshold Testing Script

Test different confidence thresholds to find the optimal precision/recall balance.

Usage:
    python scripts/test_thresholds.py
"""

import sys
import os

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_threshold_with_examples(threshold):
    """Test a specific threshold with example journal entries."""
    
    # Example journal entries for testing
    test_examples = [
        "I'm so excited about my new job! I can't wait to start and meet my new colleagues.",
        "I'm feeling really anxious about the presentation tomorrow. I'm worried I'll mess up.",
        "Thank you so much for helping me today. I really appreciate your kindness.",
        "I'm frustrated with this project. Nothing seems to be going right lately.",
        "Today was peaceful. I spent time in the garden and felt very calm.",
        "I'm proud of finishing the marathon despite the challenges. It was hard work.",
        "I feel sad about saying goodbye to my friend who is moving away.",
        "This situation is confusing. I don't understand what's happening anymore.",
        "I'm grateful for my family's support during this difficult time.",
        "I love spending time with my children. They bring me so much joy."
    ]
    
    print(f"\n🔍 Testing Threshold: {threshold}")
    print("=" * 60)
    
    total_emotions = 0
    total_texts = len(test_examples)
    
    for i, text in enumerate(test_examples, 1):
        print(f"\n{i}. \"{text[:50]}...\"")
        
        # Simulate confidence scores for different emotions
        # In real implementation, this would use the actual model
        simulated_results = simulate_emotion_detection(text, threshold)
        
        if simulated_results:
            print(f"   Detected emotions ({len(simulated_results)}):")
            for emotion, confidence in simulated_results:
                print(f"     • {emotion}: {confidence:.3f}")
            total_emotions += len(simulated_results)
        else:
            print("   No emotions detected above threshold")
    
    avg_emotions_per_text = total_emotions / total_texts
    print(f"\n📊 Summary for threshold {threshold}:")
    print(f"   Total emotions detected: {total_emotions}")
    print(f"   Average emotions per text: {avg_emotions_per_text:.2f}")
    print(f"   Detection rate: {(total_emotions > 0) * 100 / total_texts:.1f}%")
    
    return {
        'threshold': threshold,
        'total_emotions': total_emotions,
        'avg_per_text': avg_emotions_per_text,
        'detection_rate': total_emotions / total_texts
    }

def simulate_emotion_detection(text, threshold):
    """
    Simulate emotion detection based on keywords and confidence levels.
    This is a placeholder for actual model inference.
    """
    
    # Emotion keywords with simulated confidence scores
    emotion_keywords = {
        'excitement': ['excited', 'can\'t wait', 'thrilled'] ,
        'anxiety': ['anxious', 'worried', 'nervous'],
        'gratitude': ['thank', 'appreciate', 'grateful'],
        'frustration': ['frustrated', 'annoyed', 'nothing seems'],
        'peace': ['peaceful', 'calm', 'serene'],
        'pride': ['proud', 'accomplished', 'achieved'],
        'sadness': ['sad', 'goodbye', 'saying goodbye'],
        'confusion': ['confusing', 'don\'t understand', 'unclear'],
        'love': ['love', 'adore', 'cherish'],
        'joy': ['joy', 'happy', 'brings me']
    }
    
    detected_emotions = []
    text_lower = text.lower()
    
    for emotion, keywords in emotion_keywords.items():
        # Calculate confidence based on keyword matches
        matches = sum(1 for keyword in keywords if keyword in text_lower)
        if matches > 0:
            # Simulate confidence score
            base_confidence = 0.3 + (matches * 0.2)
            # Add some variation
            import random
            confidence = min(0.95, base_confidence + random.uniform(-0.1, 0.1))
            
            if confidence >= threshold:
                detected_emotions.append((emotion, confidence))
    
    # Sort by confidence
    detected_emotions.sort(key=lambda x: x[1], reverse=True)
    return detected_emotions

def compare_thresholds():
    """Compare multiple thresholds and provide recommendations."""
    
    print("🎯 Threshold Comparison for Emotion Classification")
    print("=" * 70)
    
    # Test different thresholds
    thresholds = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
    results = []
    
    for threshold in thresholds:
        result = test_threshold_with_examples(threshold)
        results.append(result)
    
    # Summary comparison
    print("\n📊 THRESHOLD COMPARISON SUMMARY")
    print("=" * 70)
    print(f"{'Threshold':<12} {'Emotions':<10} {'Avg/Text':<10} {'Detection':<12}")
    print("-" * 70)
    
    for result in results:
        print(f"{result['threshold']:<12} {result['total_emotions']:<10} "
              f"{result['avg_per_text']:<10.2f} {result['detection_rate']:<12.2f}")
    
    # Recommendations
    print("\n💡 RECOMMENDATIONS")
    print("=" * 70)
    
    # Find thresholds with different characteristics
    high_detection = max(results, key=lambda x: x['total_emotions'])
    balanced = min(results, key=lambda x: abs(x['avg_per_text'] - 2.0))  # Target ~2 emotions per text
    conservative = min(results, key=lambda x: x['avg_per_text'])
    
    print(f"🔥 High Detection: threshold {high_detection['threshold']} "
          f"({high_detection['total_emotions']} emotions total)")
    print(f"⚖️  Balanced: threshold {balanced['threshold']} "
          f"({balanced['avg_per_text']:.1f} emotions per text average)")
    print(f"🎯 Conservative: threshold {conservative['threshold']} "
          f"({conservative['avg_per_text']:.1f} emotions per text)")
    
    print(f"\n🏆 FOR SOMAJOURNAL WELLNESS APP:")
    print(f"Recommended threshold: 0.4 - 0.5")
    print(f"- Good balance of precision and useful insights")
    print(f"- Avoids overwhelming users with too many emotions")
    print(f"- Maintains high confidence in detected emotions")
    
    return results

def test_specific_threshold():
    """Allow user to test a specific threshold interactively."""
    
    print("\n🧪 Interactive Threshold Testing")
    print("=" * 50)
    
    try:
        threshold = float(input("Enter threshold to test (0.1 - 0.9): "))
        if threshold < 0.1 or threshold > 0.9:
            print("⚠️ Threshold should be between 0.1 and 0.9")
            return
        
        result = test_threshold_with_examples(threshold)
        
        print(f"\n🎯 Your threshold {threshold} results:")
        print(f"   Would detect {result['total_emotions']} emotions total")
        print(f"   Average {result['avg_per_text']:.1f} emotions per journal entry")
        
        if result['avg_per_text'] > 3:
            print("   ⚠️ This might be too many emotions - consider higher threshold")
        elif result['avg_per_text'] < 1:
            print("   ⚠️ This might be too conservative - consider lower threshold")
        else:
            print("   ✅ This looks like a good balance!")
            
    except ValueError:
        print("❌ Please enter a valid number")

def main():
    """Main function."""
    
    print("Welcome to the Threshold Testing Tool!")
    print("This helps you find the optimal confidence threshold for emotion detection.")
    
    while True:
        print("\n📋 OPTIONS:")
        print("1. Compare multiple thresholds")
        print("2. Test a specific threshold")
        print("3. Exit")
        
        choice = input("\nChoose an option (1-3): ").strip()
        
        if choice == '1':
            compare_thresholds()
        elif choice == '2':
            test_specific_threshold()
        elif choice == '3':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()