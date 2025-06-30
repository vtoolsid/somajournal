# 🎭 SomaJournal Emotion Analysis Integration

This guide shows how to run the complete SomaJournal app with real-time BERT emotion analysis.

## 🚀 Quick Start

### 1. Install Dependencies

**Python Dependencies:**
```bash
cd training
pip install -r requirements.txt
```

**Node.js Dependencies:**
```bash
npm install
npm install concurrently
```

### 2. Download Model Files (Git LFS)

```bash
# Ensure Git LFS is installed
brew install git-lfs  # macOS
git lfs install

# Download the BERT model files
git lfs pull
```

Verify model exists:
```bash
ls -la training/models/bert_emotion_model/model.safetensors
# Should show ~418MB file
```

### 3. Run the Complete System

**Option A: Run Both Servers Concurrently**
```bash
npm run dev:full
```

**Option B: Run Servers Separately**

Terminal 1 (Python BERT Server):
```bash
npm run dev:python
# or: cd training && python api_server.py
```

Terminal 2 (Next.js Frontend):
```bash
npm run dev
```

### 4. Test the Integration

1. **Open SomaJournal**: http://localhost:3000
2. **Navigate to Journal**: Click "Journal" in sidebar
3. **Start typing**: Watch real-time emotion preview
4. **Submit entry**: See adaptive BERT analysis results

## 🧠 How It Works

### Real-Time Preview
As you type journal entries, the system:
- Analyzes text length and emotional density
- Shows predicted emotion count
- Displays adaptive strategy (e.g., "Focus on primary emotion" vs "Comprehensive analysis")

### Adaptive Detection
The system automatically adjusts based on text characteristics:

| Text Length | Emotions Detected | Strategy |
|-------------|------------------|----------|
| < 10 words | 1 emotion | Focus on primary |
| 10-30 words | 2 emotions | Balanced detection |
| 30-100 words | 3 emotions | Comprehensive analysis |
| 100+ words | 4-5 emotions | Full emotional landscape |

### Analysis Results
After submitting, view detailed analysis including:
- **Detected emotions** with confidence scores
- **Physical symptoms** mapped from emotions
- **Adaptive metadata** (threshold used, text type, strategy)
- **Complexity metrics** (emotional density, richness)

## 🔧 System Architecture

```
Journal Text Input
       ↓
Real-time Preview → Next.js API → Python Flask → Adaptive Classifier
       ↓                                                    ↓
   Live feedback                                    BERT Model Analysis
       ↓                                                    ↓
Submit Entry ----→ Next.js API → Python Flask → Full Analysis
       ↓
 Store in Zustand + Display Results
```

## 📊 API Endpoints

### Python Server (Port 8000)
- `GET /health` - Health check
- `POST /analyze-emotion` - Full BERT analysis
- `POST /preview-analysis` - Quick preview for real-time feedback

### Next.js API Routes
- `GET /api/analyze-emotion` - Health check + fallback
- `POST /api/analyze-emotion` - Proxy to Python server
- `POST /api/preview-analysis` - Real-time preview proxy

## 🛠️ Troubleshooting

### Python Server Won't Start
```bash
# Check model files
ls -la training/models/bert_emotion_model/

# Install missing dependencies
pip install flask flask-cors torch transformers

# Download LFS files
git lfs pull
```

### Model Not Found Error
```bash
# Ensure you're in the right directory
pwd  # Should be in karmicwellnessappv1/

# Check LFS files
git lfs ls-files
# Should show model.safetensors

# Download if missing
git lfs pull
```

### API Connection Failed
- **Check Python server**: http://localhost:8000/health
- **Check Next.js**: http://localhost:3000
- **Restart both servers** if needed

### Fallback Mode
If Python server is unavailable, the system automatically falls back to keyword-based analysis. You'll see a "Fallback" badge in the analysis.

## 🎯 Features Demonstrated

### ✅ **Adaptive Classification**
- Text: "Good day" → 1 emotion (Quick note strategy)
- Text: "I feel amazing today the weather is perfect" → 2 emotions (Balanced)
- Text: Long journal entry → 3-5 emotions (Comprehensive)

### ✅ **Real-Time Feedback**
- Type in journal → See emotion count update
- Shows strategy: "Will detect 2 emotions • Short entry • Balanced emotion detection"

### ✅ **Detailed Analysis**
- Emotion confidence scores
- Physical symptom mapping
- Adaptive reasoning
- Text complexity metrics

### ✅ **Graceful Fallbacks**
- Python server down → Keyword analysis
- Model loading fails → Simple emotion detection
- API errors → User-friendly handling

## 🔄 Development Workflow

1. **Make changes** to adaptive classifier or API
2. **Restart Python server**: `Ctrl+C` then `npm run dev:python`
3. **Test in journal** with different text lengths
4. **Check browser console** for any errors
5. **View analysis details** in journal entry accordion

## 📈 Next Steps

- **Deploy Python server** to cloud (AWS, Docker, etc.)
- **Add emotion trends** over time
- **Implement wellness recommendations** based on patterns
- **A/B test different thresholds** for user satisfaction

---

**🎉 You now have a fully integrated adaptive emotion analysis system in SomaJournal!**

The system dynamically adjusts emotion detection based on text characteristics, exactly as requested.