#!/usr/bin/env python3
"""
BERT Emotion Classification Inference Script

This script provides inference capabilities for the fine-tuned BERT emotion
classification model. It can analyze text and return predicted emotions with
confidence scores.

Usage:
    python scripts/inference.py
    
Or import and use programmatically:
    from scripts.inference import EmotionClassifier
    classifier = EmotionClassifier()
    result = classifier.classify_emotion("I'm so happy today!")
"""

import os
import sys
import json
import torch
import numpy as np
from transformers import BertTokenizer, BertForSequenceClassification, pipeline
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class EmotionClassifier:
    """
    BERT-based emotion classifier for multi-label emotion detection.
    """
    
    def __init__(self, model_path: str = 'models/bert_emotion_model', threshold: float = 0.3):
        """
        Initialize the emotion classifier.
        
        Args:
            model_path: Path to the trained model
            threshold: Confidence threshold for emotion detection
        """
        self.model_path = model_path
        self.threshold = threshold
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load model and tokenizer
        self._load_model()
        self._load_emotion_labels()
    
    def _load_model(self):
        """Load the trained BERT model and tokenizer."""
        try:
            print(f"📱 Loading model from {self.model_path}...")
            
            self.tokenizer = BertTokenizer.from_pretrained(self.model_path)
            self.model = BertForSequenceClassification.from_pretrained(self.model_path)
            self.model.to(self.device)
            self.model.eval()
            
            print(f"✓ Model loaded successfully on {self.device}")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            print("Please make sure you have trained the model first by running:")
            print("1. python scripts/preprocess.py")
            print("2. python scripts/train.py")
            sys.exit(1)
    
    def _load_emotion_labels(self):
        """Load emotion labels mapping."""
        try:
            # Try loading from training config first
            config_path = os.path.join(self.model_path, 'training_config.json')
            if os.path.exists(config_path):
                with open(config_path, 'r') as f:
                    config = json.load(f)
                self.emotion_labels = config['emotions']
            else:
                # Fallback to data directory
                with open('data/emotion_labels.json', 'r') as f:
                    label_mapping = json.load(f)
                self.emotion_labels = [label_mapping[str(i)] for i in range(len(label_mapping))]
            
            print(f"✓ Loaded {len(self.emotion_labels)} emotion labels")
            
        except Exception as e:
            print(f"❌ Error loading emotion labels: {e}")
            # Default GoEmotions labels as fallback
            self.emotion_labels = [
                "admiration", "amusement", "anger", "annoyance", "approval", "caring",
                "confusion", "curiosity", "desire", "disappointment", "disapproval", 
                "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
                "joy", "love", "nervousness", "optimism", "pride", "realization",
                "relief", "remorse", "sadness", "surprise", "neutral"
            ]
            print(f"⚠️ Using default emotion labels ({len(self.emotion_labels)} labels)")
    
    def classify_emotion(self, text: str, top_k: int = 5) -> Dict:
        """
        Classify emotions in the given text.
        
        Args:
            text: Input text to analyze
            top_k: Number of top emotions to return
            
        Returns:
            Dictionary containing emotion analysis results
        """
        if not text or not text.strip():
            return {
                "text": text,
                "emotions": [],
                "top_emotion": None,
                "confidence_scores": {},
                "detected_emotions_count": 0
            }
        
        try:
            # Tokenize input
            inputs = self.tokenizer(
                text,
                truncation=True,
                padding=True,
                max_length=128,
                return_tensors='pt'
            ).to(self.device)
            
            # Get model predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                
                # Apply sigmoid to get probabilities
                probabilities = torch.sigmoid(logits).cpu().numpy()[0]
            
            # Create emotion-confidence mapping
            emotion_scores = {
                self.emotion_labels[i]: float(probabilities[i])
                for i in range(len(self.emotion_labels))
            }
            
            # Filter emotions above threshold
            detected_emotions = [
                {
                    "emotion": emotion,
                    "confidence": score
                }
                for emotion, score in emotion_scores.items()
                if score >= self.threshold
            ]
            
            # Sort by confidence
            detected_emotions.sort(key=lambda x: x['confidence'], reverse=True)
            
            # Get top emotions
            top_emotions = detected_emotions[:top_k]
            
            # Determine primary emotion
            top_emotion = top_emotions[0] if top_emotions else None
            
            return {
                "text": text,
                "emotions": top_emotions,
                "top_emotion": top_emotion,
                "confidence_scores": emotion_scores,
                "detected_emotions_count": len(detected_emotions),
                "threshold_used": self.threshold
            }
            
        except Exception as e:
            print(f"❌ Error during inference: {e}")
            return {
                "text": text,
                "emotions": [],
                "top_emotion": None,
                "confidence_scores": {},
                "detected_emotions_count": 0,
                "error": str(e)
            }
    
    def classify_batch(self, texts: List[str], top_k: int = 5) -> List[Dict]:
        """
        Classify emotions for a batch of texts.
        
        Args:
            texts: List of input texts
            top_k: Number of top emotions to return per text
            
        Returns:
            List of emotion analysis results
        """
        results = []
        for text in texts:
            result = self.classify_emotion(text, top_k)
            results.append(result)
        return results
    
    def get_emotion_summary(self, text: str) -> str:
        """
        Get a human-readable summary of emotions in the text.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Human-readable emotion summary
        """
        result = self.classify_emotion(text)
        
        if not result['emotions']:
            return "No strong emotions detected in this text."
        
        emotions = result['emotions']
        
        if len(emotions) == 1:
            emotion = emotions[0]
            return f"Primary emotion: {emotion['emotion']} (confidence: {emotion['confidence']:.2f})"
        
        primary = emotions[0]
        others = [e['emotion'] for e in emotions[1:]]
        
        summary = f"Primary emotion: {primary['emotion']} (confidence: {primary['confidence']:.2f})"
        if others:
            summary += f". Also detected: {', '.join(others[:3])}"
            if len(others) > 3:
                summary += f" and {len(others) - 3} more"
        
        return summary

def demo_classifier():
    """Demonstrate the emotion classifier with example texts."""
    print("🎭 BERT Emotion Classification Demo")
    print("=" * 50)
    
    # Initialize classifier
    classifier = EmotionClassifier()
    
    # Example texts for demonstration
    example_texts = [
        "I'm so excited about my new job! I can't wait to start.",
        "I'm really worried about the exam tomorrow. I don't feel prepared.",
        "Thank you so much for your help. I really appreciate it!",
        "I'm so angry at myself for making that mistake.",
        "The sunset was absolutely beautiful tonight. It filled me with peace.",
        "I feel sad and lonely since my friend moved away.",
        "This is just a normal day, nothing special happening.",
        "I'm curious about how machine learning models work."
    ]
    
    print(f"🔍 Analyzing {len(example_texts)} example texts...\n")
    
    for i, text in enumerate(example_texts, 1):
        print(f"Example {i}: \"{text}\"")
        
        # Classify emotion
        result = classifier.classify_emotion(text, top_k=3)
        
        # Print results
        if result['emotions']:
            print(f"  Detected emotions:")
            for emotion in result['emotions']:
                print(f"    • {emotion['emotion']}: {emotion['confidence']:.3f}")
        else:
            print(f"  No emotions detected above threshold ({classifier.threshold})")
        
        # Print summary
        summary = classifier.get_emotion_summary(text)
        print(f"  Summary: {summary}")
        print()

def interactive_mode():
    """Run interactive mode for real-time emotion classification."""
    print("🎯 Interactive Emotion Classification")
    print("=" * 40)
    print("Enter text to analyze emotions (or 'quit' to exit):")
    print()
    
    classifier = EmotionClassifier()
    
    while True:
        try:
            user_input = input("💬 Enter text: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            if not user_input:
                print("Please enter some text to analyze.")
                continue
            
            # Classify emotion
            result = classifier.classify_emotion(user_input)
            
            # Display results
            print(f"\n📊 Analysis Results:")
            print(f"   Text: \"{user_input}\"")
            
            if result['emotions']:
                print(f"   Detected {len(result['emotions'])} emotions:")
                for emotion in result['emotions']:
                    print(f"   • {emotion['emotion']}: {emotion['confidence']:.3f}")
                
                # Show summary
                summary = classifier.get_emotion_summary(user_input)
                print(f"   {summary}")
            else:
                print(f"   No emotions detected above threshold ({classifier.threshold})")
            
            print()
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

def main():
    """Main function for the inference script."""
    import argparse
    
    parser = argparse.ArgumentParser(description="BERT Emotion Classification Inference")
    parser.add_argument(
        '--mode', 
        choices=['demo', 'interactive'], 
        default='demo',
        help='Run mode: demo with examples or interactive input'
    )
    parser.add_argument(
        '--text', 
        type=str,
        help='Analyze a specific text'
    )
    parser.add_argument(
        '--threshold',
        type=float,
        default=0.3,
        help='Confidence threshold for emotion detection (default: 0.3)'
    )
    
    args = parser.parse_args()
    
    if args.text:
        # Analyze specific text
        classifier = EmotionClassifier(threshold=args.threshold)
        result = classifier.classify_emotion(args.text)
        
        print(f"Text: \"{args.text}\"")
        if result['emotions']:
            print("Detected emotions:")
            for emotion in result['emotions']:
                print(f"  • {emotion['emotion']}: {emotion['confidence']:.3f}")
        else:
            print(f"No emotions detected above threshold ({args.threshold})")
    
    elif args.mode == 'interactive':
        interactive_mode()
    else:
        demo_classifier()

if __name__ == "__main__":
    main()