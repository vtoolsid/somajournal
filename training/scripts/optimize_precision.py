#!/usr/bin/env python3
"""
Precision Optimization Script

This script helps optimize the confidence threshold to maximize precision
while maintaining reasonable recall for emotion classification.

Usage:
    python scripts/optimize_precision.py
    python scripts/optimize_precision.py --checkpoint checkpoint-3500
    python scripts/optimize_precision.py --target_precision 0.75
"""

import os
import sys
import json
import torch
import pandas as pd
import numpy as np
from sklearn.metrics import precision_recall_fscore_support, accuracy_score
from typing import Dict, List, Tuple
import matplotlib.pyplot as plt
import seaborn as sns

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from scripts.inference import EmotionClassifier
except ImportError:
    print("❌ Could not import EmotionClassifier. Please ensure the model is trained.")
    sys.exit(1)

class PrecisionOptimizer:
    """
    Optimize confidence thresholds for maximum precision.
    """
    
    def __init__(self, model_path: str = 'models/bert_emotion_model'):
        """
        Initialize the precision optimizer.
        
        Args:
            model_path: Path to the trained model
        """
        self.model_path = model_path
        self.classifier = None
        self.test_data = None
        
    def load_model_from_checkpoint(self, checkpoint_path: str):
        """Load model from a specific checkpoint."""
        print(f"📂 Loading model from checkpoint: {checkpoint_path}")
        
        try:
            self.classifier = EmotionClassifier(model_path=checkpoint_path)
            print("✅ Model loaded successfully")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise
    
    def load_test_data(self, limit: int = 1000):
        """Load test data for threshold optimization."""
        print(f"📊 Loading test data (limit: {limit})...")
        
        try:
            df = pd.read_csv('data/test.tsv', sep='\t')
            
            # Limit data for faster testing
            if len(df) > limit:
                df = df.sample(n=limit, random_state=42)
            
            texts = df['text'].tolist()
            
            # Parse labels (multi-hot encoded)
            labels = []
            for label_str in df['labels']:
                label_vector = [int(x) for x in label_str.split(',')]
                labels.append(label_vector)
            
            self.test_data = {
                'texts': texts,
                'labels': labels
            }
            
            print(f"✅ Loaded {len(texts)} test examples")
            return True
            
        except Exception as e:
            print(f"❌ Error loading test data: {e}")
            return False
    
    def evaluate_threshold(self, threshold: float) -> Dict:
        """
        Evaluate model performance at a specific threshold.
        
        Args:
            threshold: Confidence threshold for predictions
            
        Returns:
            Dictionary with performance metrics
        """
        if not self.test_data or not self.classifier:
            raise ValueError("Test data and model must be loaded first")
        
        # Temporarily change classifier threshold
        original_threshold = self.classifier.threshold
        self.classifier.threshold = threshold
        
        y_true = np.array(self.test_data['labels'])
        y_pred = []
        confidence_scores = []
        
        # Get predictions for all test examples
        for text in self.test_data['texts']:
            result = self.classifier.classify_emotion(text, top_k=28)
            
            # Convert to binary vector
            pred_vector = [0] * 28
            for emotion in result['emotions']:
                emotion_idx = self.classifier.emotion_labels.index(emotion['emotion'])
                pred_vector[emotion_idx] = 1
            
            y_pred.append(pred_vector)
            
            # Collect confidence scores for analysis
            scores = result['confidence_scores']
            max_confidence = max(scores.values()) if scores else 0
            confidence_scores.append(max_confidence)
        
        y_pred = np.array(y_pred)
        
        # Calculate metrics
        precision, recall, f1, _ = precision_recall_fscore_support(
            y_true, y_pred, average='macro', zero_division=0
        )
        
        subset_accuracy = accuracy_score(y_true, y_pred)
        hamming_loss = np.mean(y_true != y_pred)
        
        # Count predictions
        total_predictions = np.sum(y_pred)
        total_actual = np.sum(y_true)
        
        # Restore original threshold
        self.classifier.threshold = original_threshold
        
        return {
            'threshold': threshold,
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'subset_accuracy': subset_accuracy,
            'hamming_loss': hamming_loss,
            'total_predictions': total_predictions,
            'total_actual': total_actual,
            'avg_confidence': np.mean(confidence_scores),
            'predictions_per_text': total_predictions / len(self.test_data['texts'])
        }
    
    def optimize_thresholds(self, thresholds: List[float] = None) -> pd.DataFrame:
        """
        Test multiple thresholds and return results.
        
        Args:
            thresholds: List of thresholds to test
            
        Returns:
            DataFrame with results for each threshold
        """
        if thresholds is None:
            # Default range from 0.1 to 0.8
            thresholds = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8]
        
        print(f"🔍 Testing {len(thresholds)} different thresholds...")
        
        results = []
        for threshold in thresholds:
            print(f"  Testing threshold {threshold:.2f}...", end=" ")
            result = self.evaluate_threshold(threshold)
            results.append(result)
            print(f"Precision: {result['precision']:.3f}, Recall: {result['recall']:.3f}")
        
        df = pd.DataFrame(results)
        return df
    
    def find_optimal_threshold(self, target_precision: float = 0.75) -> Dict:
        """
        Find the threshold that achieves target precision with highest recall.
        
        Args:
            target_precision: Desired precision level
            
        Returns:
            Best threshold and its metrics
        """
        print(f"🎯 Finding optimal threshold for {target_precision:.1%} precision...")
        
        # Test fine-grained thresholds around common ranges
        thresholds = np.arange(0.1, 0.9, 0.05)
        results_df = self.optimize_thresholds(thresholds)
        
        # Find thresholds that meet or exceed target precision
        valid_thresholds = results_df[results_df['precision'] >= target_precision]
        
        if len(valid_thresholds) == 0:
            print(f"⚠️ No threshold achieves {target_precision:.1%} precision")
            print("📊 Best precision achieved:")
            best = results_df.loc[results_df['precision'].idxmax()]
            return best.to_dict()
        
        # Among valid thresholds, pick the one with highest recall
        optimal = valid_thresholds.loc[valid_thresholds['recall'].idxmax()]
        
        print(f"✅ Optimal threshold: {optimal['threshold']:.2f}")
        print(f"   Precision: {optimal['precision']:.1%}")
        print(f"   Recall: {optimal['recall']:.1%}")
        print(f"   F1: {optimal['f1']:.1%}")
        
        return optimal.to_dict()
    
    def plot_threshold_analysis(self, results_df: pd.DataFrame, save_path: str = None):
        """
        Create visualization of threshold analysis.
        
        Args:
            results_df: DataFrame with threshold results
            save_path: Optional path to save the plot
        """
        print("📈 Creating threshold analysis plots...")
        
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))
        
        # Plot 1: Precision vs Recall vs Threshold
        ax1.plot(results_df['threshold'], results_df['precision'], 'b-', label='Precision', linewidth=2)
        ax1.plot(results_df['threshold'], results_df['recall'], 'r-', label='Recall', linewidth=2)
        ax1.plot(results_df['threshold'], results_df['f1'], 'g-', label='F1 Score', linewidth=2)
        ax1.set_xlabel('Threshold')
        ax1.set_ylabel('Score')
        ax1.set_title('Precision-Recall Trade-off')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Plot 2: Precision-Recall Curve
        ax2.plot(results_df['recall'], results_df['precision'], 'bo-', linewidth=2)
        ax2.set_xlabel('Recall')
        ax2.set_ylabel('Precision')
        ax2.set_title('Precision-Recall Curve')
        ax2.grid(True, alpha=0.3)
        
        # Add threshold annotations
        for i, row in results_df.iterrows():
            if i % 3 == 0:  # Annotate every 3rd point to avoid clutter
                ax2.annotate(f'{row["threshold"]:.2f}', 
                           (row['recall'], row['precision']),
                           xytext=(5, 5), textcoords='offset points', fontsize=8)
        
        # Plot 3: Predictions per text
        ax3.plot(results_df['threshold'], results_df['predictions_per_text'], 'mo-', linewidth=2)
        ax3.set_xlabel('Threshold')
        ax3.set_ylabel('Avg Predictions per Text')
        ax3.set_title('Prediction Volume vs Threshold')
        ax3.grid(True, alpha=0.3)
        
        # Plot 4: Confidence distribution
        ax4.plot(results_df['threshold'], results_df['avg_confidence'], 'co-', linewidth=2)
        ax4.set_xlabel('Threshold')
        ax4.set_ylabel('Average Confidence')
        ax4.set_title('Average Confidence vs Threshold')
        ax4.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"📊 Plot saved to {save_path}")
        else:
            plt.savefig('outputs/threshold_analysis.png', dpi=300, bbox_inches='tight')
            print("📊 Plot saved to outputs/threshold_analysis.png")
        
        plt.close()
    
    def save_results(self, results_df: pd.DataFrame, optimal_threshold: Dict):
        """Save optimization results to files."""
        print("💾 Saving optimization results...")
        
        # Save detailed results
        results_df.to_csv('outputs/threshold_optimization_results.csv', index=False)
        
        # Save optimal threshold config
        config = {
            'optimal_threshold': optimal_threshold,
            'recommendation': {
                'threshold': optimal_threshold['threshold'],
                'expected_precision': optimal_threshold['precision'],
                'expected_recall': optimal_threshold['recall'],
                'expected_f1': optimal_threshold['f1']
            },
            'usage_instructions': {
                'command': f"python scripts/inference.py --threshold {optimal_threshold['threshold']:.2f}",
                'integration': f"EmotionClassifier(threshold={optimal_threshold['threshold']:.2f})"
            }
        }
        
        with open('outputs/optimal_threshold_config.json', 'w') as f:
            json.dump(config, f, indent=2)
        
        print("✅ Results saved:")
        print("   - outputs/threshold_optimization_results.csv")
        print("   - outputs/optimal_threshold_config.json")
        print("   - outputs/threshold_analysis.png")

def main():
    """Main function for threshold optimization."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Optimize confidence threshold for precision")
    parser.add_argument(
        '--checkpoint', 
        type=str,
        default='checkpoint-3500',
        help='Checkpoint to use (e.g., checkpoint-3500)'
    )
    parser.add_argument(
        '--target_precision',
        type=float,
        default=0.75,
        help='Target precision level (default: 0.75)'
    )
    parser.add_argument(
        '--test_limit',
        type=int,
        default=1000,
        help='Number of test samples to use (default: 1000)'
    )
    
    args = parser.parse_args()
    
    print("🎯 Precision Optimization Tool")
    print("=" * 50)
    
    # Initialize optimizer
    optimizer = PrecisionOptimizer()
    
    # Load model from checkpoint
    checkpoint_path = f'outputs/training_results/{args.checkpoint}'
    if not os.path.exists(checkpoint_path):
        print(f"❌ Checkpoint not found: {checkpoint_path}")
        print("Available checkpoints:")
        if os.path.exists('outputs/training_results'):
            for item in os.listdir('outputs/training_results'):
                if item.startswith('checkpoint-'):
                    print(f"  - {item}")
        sys.exit(1)
    
    optimizer.load_model_from_checkpoint(checkpoint_path)
    
    # Load test data
    if not optimizer.load_test_data(limit=args.test_limit):
        sys.exit(1)
    
    # Run optimization
    results_df = optimizer.optimize_thresholds()
    optimal = optimizer.find_optimal_threshold(target_precision=args.target_precision)
    
    # Create visualizations
    optimizer.plot_threshold_analysis(results_df)
    
    # Save results
    optimizer.save_results(results_df, optimal)
    
    print(f"\n🎉 Optimization Complete!")
    print(f"💡 Recommended threshold: {optimal['threshold']:.2f}")
    print(f"📊 Expected precision: {optimal['precision']:.1%}")
    print(f"📊 Expected recall: {optimal['recall']:.1%}")
    print(f"📊 Expected F1: {optimal['f1']:.1%}")
    
    print(f"\n🚀 To use the optimized model:")
    print(f"python scripts/inference.py --threshold {optimal['threshold']:.2f} --mode demo")

if __name__ == "__main__":
    main()