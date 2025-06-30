#!/usr/bin/env python3
"""
GoEmotions Dataset Preprocessing Script

This script downloads the GoEmotions dataset from Hugging Face and prepares it 
for BERT fine-tuning. The dataset contains 58k Reddit comments labeled with 
28 emotion categories (27 emotions + neutral).

Usage:
    python scripts/preprocess.py
"""

import os
import sys
import pandas as pd
from datasets import load_dataset
from typing import List, Dict

# Add the project root to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def create_directories():
    """Create necessary directories if they don't exist."""
    os.makedirs('data', exist_ok=True)
    os.makedirs('outputs', exist_ok=True)
    print("✓ Created necessary directories")

def get_emotion_labels() -> List[str]:
    """
    Returns the complete list of 28 emotion labels used in GoEmotions dataset.
    
    Returns:
        List of emotion label names
    """
    emotion_labels = [
        "admiration", "amusement", "anger", "annoyance", "approval", "caring",
        "confusion", "curiosity", "desire", "disappointment", "disapproval", 
        "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
        "joy", "love", "nervousness", "optimism", "pride", "realization",
        "relief", "remorse", "sadness", "surprise", "neutral"
    ]
    return emotion_labels

def download_dataset():
    """
    Download the GoEmotions dataset from Hugging Face.
    
    Returns:
        Loaded dataset object
    """
    print("📥 Downloading GoEmotions dataset from Hugging Face...")
    try:
        # Load the official GoEmotions dataset
        dataset = load_dataset("google-research-datasets/go_emotions")
        print("✓ Dataset downloaded successfully")
        return dataset
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        print("Trying alternative dataset source...")
        try:
            dataset = load_dataset("go_emotions")
            print("✓ Dataset downloaded from alternative source")
            return dataset
        except Exception as e2:
            print(f"❌ Failed to download dataset: {e2}")
            sys.exit(1)

def process_labels(dataset_split, emotion_labels: List[str]) -> pd.DataFrame:
    """
    Process the dataset split and convert to a format suitable for training.
    
    Args:
        dataset_split: A split of the dataset (train/validation/test)
        emotion_labels: List of emotion label names
        
    Returns:
        Processed DataFrame
    """
    data_rows = []
    
    for example in dataset_split:
        text = example['text']
        labels = example['labels']  # This is a list of label indices
        
        # Create a multi-hot encoded label vector
        label_vector = [0] * len(emotion_labels)
        for label_idx in labels:
            if label_idx < len(emotion_labels):
                label_vector[label_idx] = 1
        
        data_rows.append({
            'text': text,
            'labels': label_vector,
            'emotion_names': [emotion_labels[i] for i in labels if i < len(emotion_labels)]
        })
    
    return pd.DataFrame(data_rows)

def save_processed_data(dataset, emotion_labels: List[str]):
    """
    Save the processed dataset splits to TSV files.
    
    Args:
        dataset: The downloaded dataset
        emotion_labels: List of emotion label names
    """
    print("🔄 Processing and saving dataset splits...")
    
    # Process each split
    splits = {
        'train': 'train.tsv',
        'validation': 'dev.tsv', 
        'test': 'test.tsv'
    }
    
    for split_name, filename in splits.items():
        print(f"  Processing {split_name} split...")
        
        # Process the split
        df = process_labels(dataset[split_name], emotion_labels)
        
        # Convert labels list to string representation for TSV
        df['labels_str'] = df['labels'].apply(lambda x: ','.join(map(str, x)))
        df['emotion_names_str'] = df['emotion_names'].apply(lambda x: ','.join(x))
        
        # Create final dataframe for saving
        final_df = pd.DataFrame({
            'text': df['text'],
            'labels': df['labels_str'],
            'emotion_names': df['emotion_names_str']
        })
        
        # Save to TSV file
        filepath = f'data/{filename}'
        final_df.to_csv(filepath, sep='\t', index=False)
        print(f"  ✓ Saved {len(final_df)} examples to {filepath}")

def create_label_mapping(emotion_labels: List[str]):
    """
    Create and save a label mapping file for reference.
    
    Args:
        emotion_labels: List of emotion label names
    """
    print("📝 Creating label mapping file...")
    
    # Create mapping dictionary
    label_mapping = {i: label for i, label in enumerate(emotion_labels)}
    
    # Save as JSON for easy loading
    import json
    with open('data/emotion_labels.json', 'w') as f:
        json.dump(label_mapping, f, indent=2)
    
    # Also save as text file for human readability
    with open('data/emotion_labels.txt', 'w') as f:
        f.write("GoEmotions Dataset - 28 Emotion Labels\n")
        f.write("=" * 40 + "\n\n")
        for idx, label in enumerate(emotion_labels):
            f.write(f"{idx:2d}: {label}\n")
    
    print("✓ Label mapping saved to data/emotion_labels.json and data/emotion_labels.txt")

def print_dataset_statistics(dataset):
    """Print useful statistics about the dataset."""
    print("\n📊 Dataset Statistics:")
    print("=" * 40)
    
    for split_name in ['train', 'validation', 'test']:
        split_data = dataset[split_name]
        print(f"{split_name.capitalize()} split: {len(split_data):,} examples")
    
    # Print emotion distribution for training set
    print(f"\nTotal examples: {len(dataset['train']) + len(dataset['validation']) + len(dataset['test']):,}")
    print("Ready for BERT fine-tuning! 🚀")

def main():
    """Main function to orchestrate the preprocessing."""
    print("🎭 GoEmotions Dataset Preprocessing")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Get emotion labels
    emotion_labels = get_emotion_labels()
    print(f"📋 Working with {len(emotion_labels)} emotion labels")
    
    # Download dataset
    dataset = download_dataset()
    
    # Print statistics
    print_dataset_statistics(dataset)
    
    # Process and save data
    save_processed_data(dataset, emotion_labels)
    
    # Create label mapping
    create_label_mapping(emotion_labels)
    
    print("\n✅ Preprocessing complete!")
    print("\nNext steps:")
    print("1. Run training script: python scripts/train.py")
    print("2. Test inference: python scripts/inference.py")

if __name__ == "__main__":
    main()