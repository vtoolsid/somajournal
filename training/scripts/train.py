#!/usr/bin/env python3
"""
BERT Fine-tuning Script for GoEmotions Multi-label Emotion Classification

This script fine-tunes a BERT model on the GoEmotions dataset for multi-label
emotion classification. The model can predict multiple emotions simultaneously
for journaling applications.

Usage:
    python scripts/train.py
"""

import os
import sys
import json
import torch
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, multilabel_confusion_matrix
from transformers import (
    BertTokenizer, 
    BertForSequenceClassification, 
    Trainer, 
    TrainingArguments,
    EarlyStoppingCallback
)
from torch.utils.data import Dataset
import evaluate
from typing import Dict, List

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class GoEmotionsDataset(Dataset):
    """Custom dataset class for GoEmotions multi-label classification."""
    
    def __init__(self, texts: List[str], labels: List[List[int]], tokenizer, max_length: int = 128):
        """
        Initialize the dataset.
        
        Args:
            texts: List of text inputs
            labels: List of multi-hot encoded label vectors
            tokenizer: BERT tokenizer
            max_length: Maximum sequence length
        """
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        labels = self.labels[idx]
        
        # Tokenize the text
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(labels, dtype=torch.float)
        }

def load_emotion_labels() -> List[str]:
    """Load emotion labels from the saved mapping file."""
    try:
        with open('data/emotion_labels.json', 'r') as f:
            label_mapping = json.load(f)
        return [label_mapping[str(i)] for i in range(len(label_mapping))]
    except FileNotFoundError:
        print("❌ Emotion labels file not found. Please run preprocess.py first.")
        sys.exit(1)

def load_data() -> tuple:
    """
    Load preprocessed data from TSV files.
    
    Returns:
        Tuple of (train_data, val_data, test_data)
    """
    print("📂 Loading preprocessed data...")
    
    def parse_labels(label_str: str) -> List[int]:
        """Parse comma-separated label string to list of integers."""
        return [int(x) for x in label_str.split(',')]
    
    try:
        # Load train data
        train_df = pd.read_csv('data/train.tsv', sep='\t')
        train_texts = train_df['text'].tolist()
        train_labels = [parse_labels(labels) for labels in train_df['labels']]
        
        # Load validation data
        val_df = pd.read_csv('data/dev.tsv', sep='\t')
        val_texts = val_df['text'].tolist()
        val_labels = [parse_labels(labels) for labels in val_df['labels']]
        
        # Load test data
        test_df = pd.read_csv('data/test.tsv', sep='\t')
        test_texts = test_df['text'].tolist()
        test_labels = [parse_labels(labels) for labels in test_df['labels']]
        
        print(f"✓ Loaded {len(train_texts)} training examples")
        print(f"✓ Loaded {len(val_texts)} validation examples")
        print(f"✓ Loaded {len(test_texts)} test examples")
        
        return (train_texts, train_labels), (val_texts, val_labels), (test_texts, test_labels)
    
    except FileNotFoundError as e:
        print(f"❌ Data files not found: {e}")
        print("Please run preprocess.py first to download and prepare the data.")
        sys.exit(1)

def compute_metrics(eval_pred):
    """
    Compute evaluation metrics for multi-label classification.
    
    Args:
        eval_pred: Tuple of (predictions, labels)
        
    Returns:
        Dictionary of metric scores
    """
    predictions, labels = eval_pred
    
    # Apply sigmoid to get probabilities
    predictions = torch.sigmoid(torch.tensor(predictions))
    
    # Convert to binary predictions (threshold = 0.5)
    predictions = (predictions > 0.5).int().numpy()
    labels = labels.astype(int)
    
    # Calculate metrics
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, predictions, average='macro', zero_division=0
    )
    
    # Subset accuracy (exact match)
    subset_accuracy = accuracy_score(labels, predictions)
    
    # Hamming loss (average across all label-sample pairs)
    hamming_loss = np.mean(labels != predictions)
    
    return {
        'f1': f1,
        'precision': precision,
        'recall': recall,
        'subset_accuracy': subset_accuracy,
        'hamming_loss': hamming_loss
    }

def create_model_and_tokenizer(num_labels: int):
    """
    Create BERT model and tokenizer for multi-label classification.
    
    Args:
        num_labels: Number of emotion labels (28 for GoEmotions)
        
    Returns:
        Tuple of (model, tokenizer)
    """
    print("🤖 Initializing BERT model and tokenizer...")
    
    # Load tokenizer
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    
    # Load model with classification head
    model = BertForSequenceClassification.from_pretrained(
        'bert-base-uncased',
        num_labels=num_labels,
        problem_type="multi_label_classification"
    )
    
    print(f"✓ Model initialized with {num_labels} output labels")
    return model, tokenizer

def create_datasets(train_data, val_data, test_data, tokenizer):
    """
    Create PyTorch datasets from the loaded data.
    
    Args:
        train_data: Training data tuple (texts, labels)
        val_data: Validation data tuple (texts, labels)
        test_data: Test data tuple (texts, labels)
        tokenizer: BERT tokenizer
        
    Returns:
        Tuple of (train_dataset, val_dataset, test_dataset)
    """
    print("🔧 Creating PyTorch datasets...")
    
    train_texts, train_labels = train_data
    val_texts, val_labels = val_data
    test_texts, test_labels = test_data
    
    train_dataset = GoEmotionsDataset(train_texts, train_labels, tokenizer)
    val_dataset = GoEmotionsDataset(val_texts, val_labels, tokenizer)
    test_dataset = GoEmotionsDataset(test_texts, test_labels, tokenizer)
    
    print(f"✓ Created datasets: {len(train_dataset)} train, {len(val_dataset)} val, {len(test_dataset)} test")
    return train_dataset, val_dataset, test_dataset

def setup_training_args() -> TrainingArguments:
    """
    Set up training arguments for BERT fine-tuning.
    
    Returns:
        TrainingArguments object
    """
    print("⚙️ Setting up training configuration...")
    
    # Create output directories
    os.makedirs('outputs/training_results', exist_ok=True)
    os.makedirs('outputs/training_logs', exist_ok=True)
    
    training_args = TrainingArguments(
        output_dir='outputs/training_results',
        num_train_epochs=3,  # Start with 3 epochs
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        gradient_accumulation_steps=2,  # Effective batch size = 32
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='outputs/training_logs',
        logging_steps=100,
        eval_strategy="steps",
        eval_steps=500,
        save_strategy="steps",
        save_steps=500,
        save_total_limit=3,
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        greater_is_better=True,
        report_to=None,  # Disable wandb logging for now
        seed=42,
        fp16=torch.cuda.is_available(),  # Use mixed precision only for CUDA
        # Note: fp16 is not yet stable on MPS (Apple Silicon)
    )
    
    print("✓ Training configuration set up")
    return training_args

def train_model(model, train_dataset, val_dataset, training_args, fresh_start=False):
    """
    Train the BERT model.
    
    Args:
        model: BERT model
        train_dataset: Training dataset
        val_dataset: Validation dataset
        training_args: Training arguments
        fresh_start: Whether to ignore existing checkpoints
        
    Returns:
        Trained model
    """
    print("🚀 Starting model training...")
    
    # Create trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=3)]
    )
    
    # Check if there's a checkpoint to resume from
    checkpoint_dir = 'outputs/training_results'
    checkpoints = []
    if os.path.exists(checkpoint_dir):
        checkpoints = [d for d in os.listdir(checkpoint_dir) if d.startswith('checkpoint-')]
    
    # Train the model (resume from checkpoint if available)
    if checkpoints and not fresh_start:
        # Sort checkpoints by step number and get the latest
        checkpoints.sort(key=lambda x: int(x.split('-')[1]))
        latest_checkpoint = os.path.join(checkpoint_dir, checkpoints[-1])
        print(f"📂 Found checkpoint: {latest_checkpoint}")
        print(f"🔄 Resuming training from checkpoint...")
        train_result = trainer.train(resume_from_checkpoint=latest_checkpoint)
    else:
        if fresh_start and checkpoints:
            print("🗑️ Ignoring existing checkpoints (--fresh flag used)")
        print("🆕 Starting fresh training...")
        train_result = trainer.train()
    
    print("✓ Training completed!")
    print(f"Training time: {train_result.metrics['train_runtime']:.2f} seconds")
    print(f"Training samples per second: {train_result.metrics['train_samples_per_second']:.2f}")
    
    return trainer

def evaluate_model(trainer, test_dataset, emotion_labels):
    """
    Evaluate the trained model on the test set.
    
    Args:
        trainer: Trained model trainer
        test_dataset: Test dataset
        emotion_labels: List of emotion label names
    """
    print("📊 Evaluating model on test set...")
    
    # Evaluate on test set
    test_results = trainer.evaluate(test_dataset)
    
    print("\n🏆 Test Results:")
    print("=" * 40)
    print(f"F1 Score:        {test_results['eval_f1']:.4f}")
    print(f"Precision:       {test_results['eval_precision']:.4f}")
    print(f"Recall:          {test_results['eval_recall']:.4f}")
    print(f"Subset Accuracy: {test_results['eval_subset_accuracy']:.4f}")
    print(f"Hamming Loss:    {test_results['eval_hamming_loss']:.4f}")
    
    # Save test results
    with open('outputs/test_results.json', 'w') as f:
        json.dump(test_results, f, indent=2)
    
    print("✓ Test results saved to outputs/test_results.json")

def save_model(model, tokenizer):
    """
    Save the trained model and tokenizer.
    
    Args:
        model: Trained BERT model
        tokenizer: BERT tokenizer
    """
    print("💾 Saving trained model...")
    
    # Create models directory
    os.makedirs('models/bert_emotion_model', exist_ok=True)
    
    # Save model and tokenizer
    model.save_pretrained('models/bert_emotion_model')
    tokenizer.save_pretrained('models/bert_emotion_model')
    
    # Save training configuration
    config = {
        "model_type": "bert-base-uncased",
        "task": "multi-label emotion classification",
        "dataset": "GoEmotions",
        "num_labels": 28,
        "emotions": load_emotion_labels()
    }
    
    with open('models/bert_emotion_model/training_config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("✓ Model saved to models/bert_emotion_model/")

def main():
    """Main function to orchestrate the training process."""
    import argparse
    
    parser = argparse.ArgumentParser(description="BERT Fine-tuning for GoEmotions")
    parser.add_argument(
        '--fresh', 
        action='store_true',
        help='Start fresh training (ignore existing checkpoints)'
    )
    args = parser.parse_args()
    
    print("🎭 BERT Fine-tuning for GoEmotions Dataset")
    print("=" * 50)
    
    # Check device availability (CUDA for NVIDIA, MPS for Apple Silicon, CPU as fallback)
    if torch.cuda.is_available():
        device = torch.device('cuda')
        print(f"🖥️ Using device: CUDA GPU")
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    elif torch.backends.mps.is_available():
        device = torch.device('mps')
        print(f"🖥️ Using device: Apple Silicon GPU (MPS)")
        print("✅ Metal Performance Shaders acceleration enabled")
    else:
        device = torch.device('cpu')
        print(f"🖥️ Using device: CPU")
        print("⚠️ Training on CPU will be slow. Consider using a GPU for faster training.")
    
    # Load emotion labels
    emotion_labels = load_emotion_labels()
    num_labels = len(emotion_labels)
    print(f"📋 Training with {num_labels} emotion labels")
    
    # Load data
    train_data, val_data, test_data = load_data()
    
    # Create model and tokenizer
    model, tokenizer = create_model_and_tokenizer(num_labels)
    
    # Create datasets
    train_dataset, val_dataset, test_dataset = create_datasets(
        train_data, val_data, test_data, tokenizer
    )
    
    # Setup training arguments
    training_args = setup_training_args()
    
    # Train the model
    trainer = train_model(model, train_dataset, val_dataset, training_args, fresh_start=args.fresh)
    
    # Evaluate on test set
    evaluate_model(trainer, test_dataset, emotion_labels)
    
    # Save the model
    save_model(trainer.model, tokenizer)
    
    print("\n✅ Training pipeline completed successfully!")
    print("\nNext steps:")
    print("1. Test inference: python scripts/inference.py")
    print("2. Integrate with your application")

if __name__ == "__main__":
    main()