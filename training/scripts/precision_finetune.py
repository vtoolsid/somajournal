#!/usr/bin/env python3
"""
Precision-Focused Fine-tuning Script

This script fine-tunes an existing checkpoint to maximize precision
while maintaining reasonable recall.

Usage:
    python scripts/precision_finetune.py --checkpoint checkpoint-3500
    python scripts/precision_finetune.py --epochs 1 --lr 1e-6
"""

import os
import sys
import json
import torch
import numpy as np
from sklearn.metrics import precision_recall_fscore_support, accuracy_score
from transformers import (
    BertTokenizer, 
    BertForSequenceClassification, 
    Trainer, 
    TrainingArguments,
    EarlyStoppingCallback
)
import torch.nn as nn

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import from existing training script
from scripts.train import (
    GoEmotionsDataset,
    load_emotion_labels,
    load_data,
    create_datasets
)

class PrecisionFocusedLoss(nn.Module):
    """
    Custom loss function that penalizes false positives more heavily
    to improve precision.
    """
    
    def __init__(self, precision_weight=2.0, pos_weight=None):
        """
        Initialize precision-focused loss.
        
        Args:
            precision_weight: How much to penalize false positives (higher = more precision)
            pos_weight: Positive class weights for class imbalance
        """
        super().__init__()
        self.precision_weight = precision_weight
        self.pos_weight = pos_weight
        
    def forward(self, logits, labels):
        """
        Compute precision-focused loss.
        
        Args:
            logits: Model predictions (batch_size, num_labels)
            labels: True labels (batch_size, num_labels)
        """
        # Standard BCE loss
        if self.pos_weight is not None:
            criterion = nn.BCEWithLogitsLoss(pos_weight=self.pos_weight)
        else:
            criterion = nn.BCEWithLogitsLoss()
        
        base_loss = criterion(logits, labels.float())
        
        # Additional penalty for false positives
        sigmoid_logits = torch.sigmoid(logits)
        
        # False positive penalty: high prediction but low true label
        false_positive_penalty = torch.mean(
            sigmoid_logits * (1 - labels.float()) * self.precision_weight
        )
        
        total_loss = base_loss + false_positive_penalty
        return total_loss

class PrecisionTrainer(Trainer):
    """Custom trainer with precision-focused loss and metrics."""
    
    def __init__(self, *args, precision_weight=2.0, **kwargs):
        super().__init__(*args, **kwargs)
        self.precision_weight = precision_weight
        
    def compute_loss(self, model, inputs, return_outputs=False):
        """
        Custom loss computation with precision focus.
        """
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        logits = outputs.get('logits')
        
        # Use precision-focused loss
        loss_fn = PrecisionFocusedLoss(precision_weight=self.precision_weight)
        loss = loss_fn(logits, labels)
        
        return (loss, outputs) if return_outputs else loss

def compute_precision_focused_metrics(eval_pred):
    """
    Compute metrics with focus on precision.
    """
    predictions, labels = eval_pred
    
    # Apply sigmoid to get probabilities
    predictions = torch.sigmoid(torch.tensor(predictions))
    
    # Use higher threshold for precision
    threshold = 0.5  # Higher than default 0.3
    predictions = (predictions > threshold).int().numpy()
    labels = labels.astype(int)
    
    # Calculate metrics
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, predictions, average='macro', zero_division=0
    )
    
    # Calculate per-class precision for monitoring
    per_class_precision, _, _, _ = precision_recall_fscore_support(
        labels, predictions, average=None, zero_division=0
    )
    
    # Subset accuracy
    subset_accuracy = accuracy_score(labels, predictions)
    
    # Hamming loss
    hamming_loss = np.mean(labels != predictions)
    
    # Precision-focused metrics
    true_positives = np.sum((predictions == 1) & (labels == 1))
    false_positives = np.sum((predictions == 1) & (labels == 0))
    
    # Overall precision (strict)
    overall_precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    
    return {
        'f1': f1,
        'precision': precision,
        'recall': recall,
        'subset_accuracy': subset_accuracy,
        'hamming_loss': hamming_loss,
        'overall_precision': overall_precision,  # Key metric for precision tuning
        'mean_per_class_precision': np.mean(per_class_precision)
    }

def setup_precision_training_args(output_dir: str, epochs: int = 1, lr: float = 1e-6) -> TrainingArguments:
    """
    Set up training arguments optimized for precision.
    
    Args:
        output_dir: Output directory for results
        epochs: Number of training epochs
        lr: Learning rate (lower for fine-tuning)
    """
    return TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=epochs,
        per_device_train_batch_size=8,  # Smaller batch for stability
        per_device_eval_batch_size=16,
        gradient_accumulation_steps=4,  # Maintain effective batch size
        learning_rate=lr,
        warmup_steps=100,  # Fewer warmup steps
        weight_decay=0.01,
        logging_dir=f'{output_dir}/logs',
        logging_steps=50,
        eval_strategy="steps",
        eval_steps=200,
        save_strategy="steps",
        save_steps=200,
        save_total_limit=2,
        load_best_model_at_end=True,
        metric_for_best_model="overall_precision",  # Focus on precision
        greater_is_better=True,
        report_to=None,
        seed=42,
        fp16=torch.cuda.is_available(),
        dataloader_pin_memory=False,  # Disable for MPS compatibility
    )

def load_model_from_checkpoint(checkpoint_path: str, num_labels: int):
    """
    Load model and tokenizer from checkpoint.
    
    Args:
        checkpoint_path: Path to the checkpoint
        num_labels: Number of emotion labels
        
    Returns:
        Tuple of (model, tokenizer)
    """
    print(f"📂 Loading model from checkpoint: {checkpoint_path}")
    
    try:
        # Load tokenizer and model from checkpoint
        tokenizer = BertTokenizer.from_pretrained(checkpoint_path)
        model = BertForSequenceClassification.from_pretrained(
            checkpoint_path,
            num_labels=num_labels
        )
        
        print("✅ Model and tokenizer loaded successfully")
        return model, tokenizer
        
    except Exception as e:
        print(f"❌ Error loading checkpoint: {e}")
        print("Falling back to base BERT model...")
        
        # Fallback to base model
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        model = BertForSequenceClassification.from_pretrained(
            'bert-base-uncased',
            num_labels=num_labels
        )
        
        return model, tokenizer

def precision_finetune(
    checkpoint_path: str,
    epochs: int = 1,
    learning_rate: float = 1e-6,
    precision_weight: float = 2.0
):
    """
    Fine-tune model for improved precision.
    
    Args:
        checkpoint_path: Path to starting checkpoint
        epochs: Number of epochs to train
        learning_rate: Learning rate for fine-tuning
        precision_weight: Weight for false positive penalty
    """
    print("🎯 Precision-Focused Fine-tuning")
    print("=" * 50)
    
    # Load emotion labels
    emotion_labels = load_emotion_labels()
    num_labels = len(emotion_labels)
    print(f"📋 Working with {num_labels} emotion labels")
    
    # Load data
    train_data, val_data, test_data = load_data()
    
    # Load model from checkpoint
    model, tokenizer = load_model_from_checkpoint(checkpoint_path, num_labels)
    
    # Create datasets
    train_dataset, val_dataset, test_dataset = create_datasets(
        train_data, val_data, test_data, tokenizer
    )
    
    # Setup training arguments
    output_dir = f'outputs/precision_finetuning'
    training_args = setup_precision_training_args(output_dir, epochs, learning_rate)
    
    print(f"⚙️ Training configuration:")
    print(f"   Epochs: {epochs}")
    print(f"   Learning rate: {learning_rate}")
    print(f"   Precision weight: {precision_weight}")
    print(f"   Output dir: {output_dir}")
    
    # Create precision-focused trainer
    trainer = PrecisionTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_precision_focused_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=2)],
        precision_weight=precision_weight
    )
    
    # Train the model
    print("🚀 Starting precision-focused fine-tuning...")
    train_result = trainer.train()
    
    print("✅ Training completed!")
    print(f"Training time: {train_result.metrics['train_runtime']:.2f} seconds")
    
    # Evaluate on test set
    print("📊 Evaluating on test set...")
    test_results = trainer.evaluate(test_dataset)
    
    print("\n🏆 Test Results (Precision-Focused):")
    print("=" * 50)
    print(f"Overall Precision: {test_results['eval_overall_precision']:.4f}")
    print(f"Macro Precision:   {test_results['eval_precision']:.4f}")
    print(f"Recall:           {test_results['eval_recall']:.4f}")
    print(f"F1 Score:         {test_results['eval_f1']:.4f}")
    print(f"Subset Accuracy:  {test_results['eval_subset_accuracy']:.4f}")
    
    # Save the fine-tuned model
    final_model_path = 'models/bert_emotion_model_precision'
    os.makedirs(final_model_path, exist_ok=True)
    
    trainer.model.save_pretrained(final_model_path)
    tokenizer.save_pretrained(final_model_path)
    
    # Save training info
    training_info = {
        'base_checkpoint': checkpoint_path,
        'precision_weight': precision_weight,
        'learning_rate': learning_rate,
        'epochs': epochs,
        'test_metrics': test_results,
        'overall_precision': test_results['eval_overall_precision'],
        'macro_precision': test_results['eval_precision']
    }
    
    with open(f'{final_model_path}/precision_training_info.json', 'w') as f:
        json.dump(training_info, f, indent=2)
    
    print(f"\n💾 Precision-optimized model saved to: {final_model_path}")
    print(f"📊 Training results saved to: {final_model_path}/precision_training_info.json")
    
    return trainer, test_results

def main():
    """Main function for precision fine-tuning."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Fine-tune BERT for higher precision")
    parser.add_argument(
        '--checkpoint',
        type=str,
        default='checkpoint-3500',
        help='Checkpoint to start from (e.g., checkpoint-3500)'
    )
    parser.add_argument(
        '--epochs',
        type=int,
        default=1,
        help='Number of epochs to train (default: 1)'
    )
    parser.add_argument(
        '--lr',
        type=float,
        default=1e-6,
        help='Learning rate (default: 1e-6)'
    )
    parser.add_argument(
        '--precision_weight',
        type=float,
        default=2.0,
        help='Weight for false positive penalty (default: 2.0)'
    )
    
    args = parser.parse_args()
    
    # Construct checkpoint path
    checkpoint_path = f'outputs/training_results/{args.checkpoint}'
    
    if not os.path.exists(checkpoint_path):
        print(f"❌ Checkpoint not found: {checkpoint_path}")
        print("Available checkpoints:")
        if os.path.exists('outputs/training_results'):
            for item in os.listdir('outputs/training_results'):
                if item.startswith('checkpoint-'):
                    print(f"  - {item}")
        sys.exit(1)
    
    # Run precision fine-tuning
    trainer, results = precision_finetune(
        checkpoint_path=checkpoint_path,
        epochs=args.epochs,
        learning_rate=args.lr,
        precision_weight=args.precision_weight
    )
    
    print(f"\n🎉 Precision fine-tuning complete!")
    print(f"🎯 Achieved {results['eval_overall_precision']:.1%} overall precision")
    print(f"📈 Macro precision: {results['eval_precision']:.1%}")
    
    print(f"\n🚀 To test the precision-optimized model:")
    print(f"python scripts/inference.py --model_path models/bert_emotion_model_precision")

if __name__ == "__main__":
    main()