# 🚀 BERT Emotion Classification - Quick Start Guide

Get your BERT emotion classifier running in 15 minutes!

## Prerequisites ✅

- Python 3.9+ installed
- At least 8GB RAM
- 2GB free disk space
- Internet connection for dataset download

## Step-by-Step Setup

### 1. Navigate to Training Directory
```bash
cd training
```

### 2. Activate Virtual Environment
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### 3. Verify Installation
```bash
python -c "import torch, transformers, datasets; print('✅ Ready to go!')"
```

### 4. Download and Prepare Data (5-10 minutes)
```bash
python scripts/preprocess.py
```

This will:
- Download the GoEmotions dataset (58k comments)
- Process and save train/dev/test splits
- Create emotion label mappings

### 5. Train the Model (2-4 hours GPU / 8+ hours CPU)
```bash
python scripts/train.py
```

**Training Progress:**
- Watch for evaluation metrics every 500 steps
- Best model automatically saved
- Early stopping if no improvement

**Expected Output:**
```
📊 Test Results:
F1 Score:        0.4500
Precision:       0.4800
Recall:          0.4200
Subset Accuracy: 0.3200
```

### 6. Test Your Model
```bash
python scripts/inference.py --mode demo
```

## 🎯 Quick Test

After training, test with your own text:

```bash
python scripts/inference.py --text "I'm so excited about starting my new job tomorrow!"
```

**Expected Output:**
```
Detected emotions:
  • excitement: 0.892
  • joy: 0.743
  • optimism: 0.621
```

## 📱 Use in Your App

```python
from scripts.inference import EmotionClassifier

# Initialize once
classifier = EmotionClassifier()

# Analyze journal entries
result = classifier.classify_emotion(journal_text)
emotions = result['emotions']  # List of {emotion, confidence}
```

## ⚡ Quick Tips

**Speed up training:**
- Use GPU if available (automatic detection)
- Reduce batch size if out of memory
- Use mixed precision (already enabled)

**Adjust sensitivity:**
```bash
python scripts/inference.py --threshold 0.5  # Higher = less sensitive
python scripts/inference.py --threshold 0.2  # Lower = more sensitive
```

**File sizes:**
- Dataset: ~50MB
- Trained model: ~400MB
- Training logs: ~10MB

## 🔧 Troubleshooting

**"Out of memory" error:**
```bash
# Edit config.yaml, reduce batch_size to 8 or 4
train_batch_size: 8
```

**Slow download:**
```bash
# The dataset download is one-time only
# Subsequent runs use cached data
```

**Import errors:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate
```

## ✨ What's Next?

1. **Integrate with SomaJournal**: Use the emotion classifier in your journal analysis
2. **Experiment**: Try different thresholds and models
3. **Customize**: Add your own emotion categories
4. **Monitor**: Track emotion patterns over time

## 🎉 You're Done!

Your BERT emotion classifier is ready to analyze journal entries and detect 28 different emotions with confidence scores. Perfect for building intelligent wellness applications!

---

**Need help?** Check the full README.md or review the troubleshooting section.