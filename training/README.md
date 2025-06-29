# BERT Fine-tuning for Emotion Classification

This directory contains the setup for fine-tuning BERT on the GoEmotions dataset for emotion classification in SomaJournal.

## Directory Structure

```
training/
├── data/
│   ├── train.tsv       # Training data from GoEmotions
│   ├── dev.tsv         # Validation data from GoEmotions  
│   └── test.tsv        # Test data from GoEmotions
├── scripts/
│   ├── preprocess.py   # Data preprocessing utilities
│   ├── train.py        # Model training script
│   └── inference.py    # Model inference script
├── models/
│   └── (trained models will be saved here)
├── outputs/
│   └── (training logs and results will be saved here)
└── README.md           # This file
```

## Purpose

- **data/**: Store the GoEmotions dataset files
- **scripts/**: Python scripts for data processing, training, and inference
- **models/**: Saved model checkpoints and final trained models
- **outputs/**: Training logs, evaluation results, and prediction files

## Next Steps

1. Download the GoEmotions dataset
2. Set up Python environment with required packages
3. Preprocess the data
4. Train the BERT model
5. Evaluate and integrate with SomaJournal

## Dataset Information

The GoEmotions dataset contains:
- 58,000+ Reddit comments
- 27 emotion categories + neutral
- Fine-grained emotion labels suitable for journaling applications