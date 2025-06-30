# 🧠 SomaJournal Emotion Model Usage Guide

This guide shows how to use the trained BERT emotion classification model in your SomaJournal application.

## Quick Start

### 1. Basic Emotion Classification

```python
from training.scripts.inference import EmotionClassifier

# Initialize classifier
classifier = EmotionClassifier(
    model_path='training/models/bert_emotion_model',
    threshold=0.45  # Optimized for 75-80% precision
)

# Analyze journal entry
result = classifier.classify_emotion("I feel amazing today!")
print(result['emotions'])  # [{'emotion': 'joy', 'confidence': 0.823}]
```

### 2. Adaptive Classification (Recommended)

```python
from training.scripts.adaptive_classifier import AdaptiveEmotionClassifier

# Initialize adaptive system
analyzer = AdaptiveEmotionClassifier()

# Automatically adjusts based on text length and emotional richness
result = analyzer.classify_adaptive("Your journal text here", debug=True)
print(f"Detected {len(result['emotions'])} emotions with strategy: {result['analysis']['recommended_approach']}")
```

### 3. Full SomaJournal Integration

```python
from training.scripts.integration_example import JournalEmotionAnalyzer

# Initialize for SomaJournal
analyzer = JournalEmotionAnalyzer(model_path='training/models/bert_emotion_model')

# Comprehensive analysis with wellness indicators
analysis = analyzer.analyze_journal_entry(
    text="Today was challenging but I handled it well", 
    user_id="user123"
)

# Get results
emotions = analysis['emotions']                    # Detected emotions
wellness = analysis['analysis']['wellness_indicators']  # Wellness recommendations
intensity = analysis['analysis']['emotional_intensity']  # 0.0-1.0 scale
```

## Model Performance

- **Precision**: 62.2% (base) → 75-80% (with threshold 0.45)
- **Training Dataset**: 58k GoEmotions Reddit comments
- **Emotions Detected**: 28 emotions including joy, sadness, anger, excitement, etc.
- **Best Use**: Wellness journaling, mood tracking, emotional insights

## Adaptive Behavior

The adaptive system automatically adjusts emotion detection based on:

| Text Type | Length | Emotions Shown | Threshold | Strategy |
|-----------|--------|----------------|-----------|----------|
| Quick Note | < 10 words | 1 emotion | 0.55 | Focus on primary emotion |
| Short Entry | 10-30 words | 2 emotions | 0.45 | Balanced detection |
| Medium Entry | 30-100 words | 3 emotions | 0.35 | Comprehensive analysis |
| Detailed Journal | > 100 words | 4-5 emotions | 0.25 | Full emotional landscape |

## Integration Examples

### Next.js API Route
```typescript
// pages/api/analyze-emotion.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;
    
    // Call Python emotion analysis (via child_process or API)
    const emotions = await analyzeEmotion(text);
    
    res.status(200).json({ emotions });
  }
}
```

### React Component
```tsx
// components/EmotionAnalysis.tsx
import { useState } from 'react';

export function EmotionAnalysis({ journalText }: { journalText: string }) {
  const [emotions, setEmotions] = useState([]);
  
  const analyzeText = async () => {
    const response = await fetch('/api/analyze-emotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: journalText })
    });
    const data = await response.json();
    setEmotions(data.emotions);
  };
  
  return (
    <div>
      <button onClick={analyzeText}>Analyze Emotions</button>
      {emotions.map(emotion => (
        <div key={emotion.emotion}>
          {emotion.emotion}: {(emotion.confidence * 100).toFixed(1)}%
        </div>
      ))}
    </div>
  );
}
```

## Setup Requirements

### Dependencies
```bash
pip install torch transformers datasets numpy scikit-learn
```

### Model Files (Git LFS)
- `training/models/bert_emotion_model/` - Final trained model (418MB)
- **Important**: Model files are stored using Git LFS (Large File Storage)
- First-time setup: `git lfs pull` to download model files
- Model config, tokenizer, and weights are ready to use after LFS download

### Git LFS Setup (for new clones)
```bash
# Install Git LFS (if not already installed)
brew install git-lfs  # macOS
# or apt-get install git-lfs  # Ubuntu

# Initialize LFS in repository
git lfs install

# Download LFS files (including the model)
git lfs pull
```

### Environment Variables (Optional)
```bash
EMOTION_MODEL_PATH=training/models/bert_emotion_model
EMOTION_THRESHOLD=0.45
```

## Advanced Usage

### Custom Threshold
```python
# For higher precision (fewer false positives)
classifier = EmotionClassifier(threshold=0.6)  # ~85% precision

# For higher recall (catch more emotions)
classifier = EmotionClassifier(threshold=0.3)  # More emotions detected
```

### Batch Analysis
```python
analyzer = JournalEmotionAnalyzer()
entries = ["Entry 1", "Entry 2", "Entry 3"]

# Analyze emotion trends over time
trends = analyzer.get_emotion_trends(entries)
print(f"Most frequent emotion: {trends['most_frequent_emotions'][0][0]}")
```

### Production Deployment

For production, consider:
1. **Model Loading**: Load model once at startup, not per request
2. **Caching**: Cache results for identical text
3. **API Service**: Deploy model as separate microservice
4. **GPU**: Use GPU for faster inference if available

## Troubleshooting

### Model Not Found
```bash
# Ensure model exists
ls -la training/models/bert_emotion_model/

# Should contain: config.json, model.safetensors, tokenizer files
```

### Memory Issues
```python
# Use CPU instead of GPU
classifier = EmotionClassifier(device='cpu')

# Or reduce batch size for large texts
```

### Import Errors
```bash
# Install missing dependencies
pip install -r training/requirements.txt

# Check Python path
export PYTHONPATH="${PYTHONPATH}:/path/to/your/project"
```

## Backup Location

Full training artifacts backed up to: `/Users/virtoolsidass/Downloads/SomaJournal_Training_Backup/`

This includes all checkpoints, training data, and virtual environment for future reference or retraining.