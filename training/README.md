# BERT Fine-tuning for Emotion Classification

This directory contains a complete pipeline for fine-tuning BERT on the GoEmotions dataset for multi-label emotion classification in SomaJournal.

## 🎯 Overview

Train a custom BERT model to detect 28 different emotions in text, perfect for journaling applications. The model can identify multiple emotions simultaneously with confidence scores.

## 📁 Directory Structure

```
training/
├── data/                    # Dataset files (created after preprocessing)
│   ├── train.tsv           # Training data from GoEmotions
│   ├── dev.tsv             # Validation data from GoEmotions  
│   ├── test.tsv            # Test data from GoEmotions
│   ├── emotion_labels.json # Label mapping file
│   └── emotion_labels.txt  # Human-readable labels
├── scripts/                # Python scripts for the pipeline
│   ├── preprocess.py       # Download and prepare dataset
│   ├── train.py            # BERT fine-tuning script
│   ├── inference.py        # Model inference and demo
│   └── test_setup.py       # Test environment setup
├── models/                 # Trained models (created after training)
│   └── bert_emotion_model/ # Final trained model
├── outputs/                # Training logs and results
│   ├── training_results/   # Training checkpoints
│   ├── training_logs/      # TensorBoard logs
│   └── test_results.json   # Final evaluation metrics
├── venv/                   # Python virtual environment
├── config.yaml             # Training configuration
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Activate Virtual Environment
```bash
cd training
source venv/bin/activate
```

### 2. Test Setup
```bash
python scripts/test_setup.py
```

### 3. Download and Preprocess Data
```bash
python scripts/preprocess.py
```

### 4. Train the Model
```bash
python scripts/train.py
```

### 5. Test Inference
```bash
python scripts/inference.py --mode demo
```

## 📊 Dataset Information

**GoEmotions Dataset:**
- 58,009 Reddit comments
- 28 emotion labels (27 emotions + neutral)
- Multi-label classification (text can have multiple emotions)
- Created by Google Research

**Emotion Categories:**
- **Positive:** admiration, amusement, approval, caring, excitement, gratitude, joy, love, optimism, pride, relief
- **Negative:** anger, annoyance, disappointment, disapproval, disgust, embarrassment, fear, grief, nervousness, remorse, sadness
- **Ambiguous:** confusion, curiosity, desire, realization, surprise
- **Neutral:** neutral

## 🔧 Configuration

Modify `config.yaml` to customize training parameters:

```yaml
training:
  num_epochs: 3           # Number of training epochs
  train_batch_size: 16    # Batch size for training
  learning_rate: 2e-5     # Learning rate
  
inference:
  threshold: 0.3          # Confidence threshold
  top_k: 5               # Max emotions to return
```

## 💻 Usage Examples

### Programmatic Usage
```python
from scripts.inference import EmotionClassifier

classifier = EmotionClassifier()
result = classifier.classify_emotion("I'm so excited about my new job!")

print(result['emotions'])
# [{'emotion': 'excitement', 'confidence': 0.89}, 
#  {'emotion': 'joy', 'confidence': 0.76}]
```

### Command Line Usage
```bash
# Analyze specific text
python scripts/inference.py --text "I feel worried about the exam"

# Interactive mode
python scripts/inference.py --mode interactive

# Demo with examples
python scripts/inference.py --mode demo
```

## 📈 Expected Performance

Based on the original GoEmotions paper and similar implementations:
- **F1 Score:** ~0.46 (macro average)
- **Training Time:** 2-4 hours on GPU, 12+ hours on CPU
- **Model Size:** ~400MB
- **Inference Speed:** ~100ms per text on CPU

## 🔗 Integration with SomaJournal

The trained model integrates seamlessly with your journaling app:

```python
# In your journal processing code
classifier = EmotionClassifier()
journal_text = "Today was amazing! I got the promotion I was hoping for."
emotions = classifier.classify_emotion(journal_text)

# Use emotions for:
# - Mood tracking visualization
# - Psychosomatic symptom correlation
# - Wellness recommendations
# - Emotional pattern analysis
```

## 🛠️ Troubleshooting

### Common Issues

**Out of Memory Error:**
- Reduce batch size in `config.yaml`
- Use gradient accumulation
- Train on CPU if necessary

**Slow Training:**
- Enable mixed precision (`fp16: true`)
- Use GPU if available
- Reduce sequence length

**Import Errors:**
- Activate virtual environment: `source venv/bin/activate`
- Install missing packages: `pip install -r requirements.txt`

### Hardware Requirements

**Minimum:**
- 8GB RAM
- 2GB free disk space
- CPU training (slow but works)

**Recommended:**
- 16GB+ RAM
- 8GB+ GPU memory (NVIDIA)
- CUDA-compatible GPU

## 📚 Additional Resources

- [GoEmotions Paper](https://arxiv.org/abs/2005.00547)
- [BERT Documentation](https://huggingface.co/docs/transformers/model_doc/bert)
- [Transformers Library](https://huggingface.co/docs/transformers/index)

## 🤝 Contributing

To improve the emotion classification:

1. Experiment with different thresholds
2. Try other pre-trained models (RoBERTa, DistilBERT)
3. Add data augmentation
4. Fine-tune hyperparameters

## 📄 License

This implementation is for the SomaJournal project. The GoEmotions dataset is released under Apache 2.0 license.