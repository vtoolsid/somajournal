# SomaJournal - AI-Powered Psychosomatic Wellness Platform

> A Next.js wellness journaling application that uses BERT-based emotion analysis and psychosomatic body mapping to help users understand the mind-body connection.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-13.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Python](https://img.shields.io/badge/Python-3.9-yellow)

## Overview

SomaJournal combines cutting-edge machine learning with evidence-based psychosomatic research to provide personalized wellness insights. The platform uses a fine-tuned BERT model to analyze journal entries, detecting emotional states and correlating them with physical symptoms through an interactive body mapping system.

## Key Features

- 🧠 **BERT Emotion Analysis** - Fine-tuned on 58k GoEmotions dataset with adaptive detection (1-5 emotions)
- 🎯 **Psychosomatic Body Mapping** - Real-time visualization of emotion-to-symptom correlations
- 📊 **Clinical Assessments** - DEQ (Difficulties in Emotion Regulation) and SSS (Somatic Symptom Scale)
- 🔐 **Secure Authentication** - Clerk-based auth with Supabase integration
- 💾 **Dual Persistence** - localStorage + Supabase with RLS policies
- ✨ **OpenAI Enhancement** - GPT-powered personalized psychosomatic insights (optional)

## Architecture

### Dual-Server Architecture

SomaJournal runs on a **dual-server architecture** designed for optimal performance and separation of concerns:

#### Frontend Server (Next.js - Port 3000)
- React components with shadcn/ui design system
- Real-time emotion preview as users type
- Proxy API routes to Python backend
- Graceful fallback to keyword analysis when ML server unavailable
- Clerk authentication and session management
- Supabase integration for data persistence

#### Backend Server (Python Flask - Port 8000)
- Serves fine-tuned BERT emotion classifier
- Adaptive emotion detection (1-5 emotions based on text characteristics)
- Endpoints: `/analyze-emotion`, `/preview-analysis`, `/health`
- CORS enabled for Next.js integration
- Optimized for real-time inference

### BERT Model Integration

**Emotion Detection Pipeline:**

```
Journal Entry → Next.js API Route → Python Flask Server → BERT Model → Emotion Analysis
      ↓                                                                       ↓
  Live Preview                                               {emotions, confidence, symptoms}
```

**Model Specifications:**
- **Base Model**: `bert-base-uncased` fine-tuned on GoEmotions dataset
- **Training Data**: 58,000 Reddit comments with 28 emotion labels
- **Performance**: 62% baseline precision, 75-80% with adaptive thresholds
- **Emotions Detected**: joy, sadness, anger, fear, anxiety, stress, gratitude, and 21 more
- **Storage**: 418MB model files managed via Git LFS

**Adaptive Detection Strategy:**
The BERT model uses intelligent threshold adjustment based on:
- **Text Length**: Short notes (1 emotion) → Long journals (4-5 emotions)
- **Emotional Density**: Frequency of emotion-laden vocabulary
- **Complexity Scoring**: Multiple emotion types, contrasts, intensity amplifiers
- **Dynamic Thresholds**: 0.2-0.8 range adapted per text

**Emotion-to-Symptom Correlation:**
Once emotions are detected, the system maps them to physical symptoms using research-backed psychosomatic patterns:

```python
# Example mapping (simplified)
EMOTION_SYMPTOM_MAP = {
    'stress': ['neck tension', 'shoulder pain', 'headache'],
    'anxiety': ['chest tightness', 'stomach discomfort', 'restlessness'],
    'sadness': ['chest heaviness', 'fatigue', 'low energy'],
    'anger': ['jaw tension', 'muscle tightness', 'irritability']
}
```

The interactive body map visualizes these correlations in real-time, showing users where their emotions might manifest physically.

## Tech Stack

### Frontend
- **Framework**: Next.js 13.5 (App Router)
- **Language**: TypeScript 5.0
- **UI Components**: Radix UI, shadcn/ui, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand with localStorage persistence

### Backend (ML Server)
- **Runtime**: Python 3.9
- **Framework**: Flask with CORS
- **ML Model**: Transformers (BERT fine-tuned)
- **Dependencies**: PyTorch, NumPy, scikit-learn
- **Model Storage**: Git LFS

### Optional Enhancements
- **OpenAI API**: GPT-3.5/4 for personalized psychosomatic insights
- **Enhanced Analysis**: Context-aware wellness recommendations

## Getting Started

### Prerequisites

```bash
node >= 18.0.0
python >= 3.9
git-lfs
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vtoolsid/somajournal.git
cd somajournal
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd training
pip install -r requirements.txt
```

4. **Download BERT model files**
```bash
git lfs pull  # Downloads 418MB model files
```

5. **Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys:
# - Clerk authentication keys
# - Supabase URL and anon key
# - OpenAI API key (optional)
```

### Running the Application

**Option 1: Full Stack (Recommended)**
```bash
npm run dev:full
# Starts both Next.js (3000) and Python BERT server (8000)
```

**Option 2: Separate Servers**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:python
```

The application will be available at `http://localhost:3000`

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the schema migration:
```sql
-- Copy contents from supabase/schema.sql and execute in Supabase SQL Editor
```

3. Configure Clerk-Supabase integration:
   - Create JWT template named "supabase" in Clerk dashboard
   - Add Supabase JWT secret as signing key
   - Configure RLS policies for user isolation

## Model Training (Optional)

To retrain or fine-tune the BERT model:

```bash
cd training
python scripts/train_bert_emotion.py \
  --data data/goemotions.csv \
  --epochs 3 \
  --batch-size 16 \
  --output models/bert_emotion_model
```

See `training/README.md` for detailed training instructions.

## API Endpoints

### Next.js API Routes

- `POST /api/analyze-emotion` - Full BERT emotion analysis
- `GET /api/analyze-emotion` - Health check
- `POST /api/preview-analysis` - Lightweight preview (no model inference)
- `POST /api/chat-emotion-analysis` - GPT-enhanced insights (requires OpenAI key)

### Python Flask Endpoints

- `POST /analyze-emotion` - BERT inference with adaptive detection
- `GET /health` - Server health status
- `POST /preview-analysis` - Text characteristics analysis

## Project Structure

```
somajournal/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── analyze-emotion/      # BERT analysis proxy
│   │   └── chat-emotion-analysis/# GPT enhancement
│   ├── journal/                  # Journal interface
│   ├── dashboard/                # User dashboard
│   └── wellbeing-assessment/     # DEQ & SSS questionnaires
├── components/
│   ├── wellness/                 # Wellness-specific components
│   │   └── psychosomatic-body-map.tsx  # Interactive body map
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── wellness/                 # Emotion-body mapping logic
│   ├── wellbeing/                # DEQ & SSS scoring
│   ├── store.ts                  # Zustand state management
│   └── supabase.ts               # Supabase client with Clerk integration
├── training/                     # Python ML backend
│   ├── api_server.py             # Flask server
│   ├── scripts/
│   │   ├── adaptive_classifier.py # Adaptive BERT logic
│   │   └── inference.py          # Base classifier
│   ├── models/
│   │   └── bert_emotion_model/   # Fine-tuned BERT (Git LFS)
│   └── requirements.txt          # Python dependencies
└── supabase/
    └── schema.sql                # Database schema
```

## Environment Variables

```bash
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs (Required)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/wellbeing-assessment

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (Optional - for enhanced insights)
OPENAI_API_KEY=sk-...

# Development Settings
NEXT_PUBLIC_PROTOTYPE_MODE=false
NEXT_PUBLIC_DEBUG_MODE=false
```

## Deployment

### Vercel (Frontend + Serverless Functions)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Note**: The Python BERT server requires a separate deployment (Railway, Render, or AWS Lambda)

### Docker (Full Stack)

```bash
docker-compose up
```

See `docker-compose.yml` for configuration.

## Performance

- **Emotion Analysis**: ~200-500ms (BERT inference)
- **Fallback Analysis**: ~50ms (keyword-based)
- **Real-time Preview**: Debounced 500ms
- **Model Size**: 418MB (loaded in memory)

## Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for guidelines.

## License

MIT License - see `LICENSE` file for details

## Acknowledgments

- **GoEmotions Dataset**: Google Research
- **BERT Model**: Hugging Face Transformers
- **Psychosomatic Research**: Evidence-based emotion-symptom correlations
- **UI Components**: shadcn/ui, Radix UI

## Support

For issues and questions:
- GitHub Issues: [github.com/vtoolsid/somajournal/issues](https://github.com/vtoolsid/somajournal/issues)
- Documentation: See `CLAUDE.md` for development guidance

---

**Built with ❤️ for holistic wellness**
