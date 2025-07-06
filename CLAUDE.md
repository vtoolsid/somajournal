# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Full Stack Development (Recommended)
```bash
npm run dev:full        # Start both Next.js + Python BERT server concurrently
npm run dev            # Start Next.js development server only
npm run dev:python     # Start Python BERT emotion analysis server only
```

### Production & Build
```bash
npm run build          # Build Next.js for production
npm run start          # Start production server
npm run lint           # Run ESLint
```

### Python Emotion Analysis Setup
```bash
cd training
pip install -r requirements.txt  # Install Python dependencies
git lfs pull                     # Download BERT model files (418MB)
python api_server.py             # Start BERT server manually
```

### Psychosomatic Analysis Setup (Premium Feature)
```bash
# 1. Install OpenAI dependency
pip install openai

# 2. Set up API key in .env.local (copy from .env.example)
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key:
# OPENAI_API_KEY=sk-your-actual-api-key-here

# 3. The system gracefully falls back to evidence-based templates if no API key
```

### Git LFS Model Management
```bash
git lfs install        # Initialize Git LFS
git lfs pull          # Download large model files
git lfs ls-files      # View LFS-tracked files
```

## Architecture Overview

This is a **Next.js 13.5.1** wellness journaling application with integrated **BERT emotion analysis** built with:

- **Frontend**: Next.js (App Router) with TypeScript, Radix UI, Tailwind CSS
- **Backend**: Python Flask API serving trained BERT emotion classifier
- **State Management**: Zustand with localStorage persistence
- **Model**: Fine-tuned BERT on 58k GoEmotions dataset (28 emotions, 62% precision)
- **Storage**: Git LFS for large model files (418MB)

### Dual-Server Architecture

**Frontend (Next.js - Port 3000)**:
- React components with shadcn/ui design system
- Real-time emotion preview as users type
- Proxy API routes to Python backend
- Graceful fallback to keyword analysis

**Backend (Python Flask - Port 8000)**:
- Serves adaptive BERT emotion classifier
- Endpoints: `/analyze-emotion`, `/preview-analysis`, `/health`
- Adaptive detection: 1-5 emotions based on text characteristics
- CORS enabled for Next.js integration

### Key Architecture Patterns

**Adaptive Emotion Detection**: Core innovation that dynamically adjusts based on text:
- **Text Length**: Short (1 emotion) → Medium (2-3) → Long (4-5 emotions)
- **Emotional Richness**: Density of emotional vocabulary affects threshold
- **Complexity Scoring**: Multiple emotion types, contrasts, intensity amplifiers
- **Strategy Selection**: "Focus on primary" vs "Comprehensive analysis"

**Hybrid Analysis Pipeline**:
```
Journal Text → Real-time Preview → Next.js API → Python Flask → Adaptive BERT → Results
             ↓                                                                    ↓
         Live Feedback                                                     Full Analysis
```

**State Management Flow**:
- `lib/store.ts`: Zustand store with interfaces for User, JournalEntry, MoodEntry
- `lib/mock-data.ts`: Contains `analyzeJournalEntry()` function (now calls BERT API)
- Journal entries store both emotions (confidence scores) and symptoms (boolean flags)
- Automatic persistence to localStorage with optimistic updates

**Component Architecture**:
- `/app/journal/page.tsx`: Main journal interface with real-time emotion preview
- `/components/ui/`: shadcn/ui components with wellness-specific extensions
- `/components/layout/`: AppLayout with authentication protection
- Custom wellness components: KarmicAura, MandalaProgress, FloatingParticles

### BERT Model Integration

**Model Details**:
- **Architecture**: Fine-tuned bert-base-uncased on GoEmotions dataset
- **Performance**: 62% precision baseline, 75-80% with threshold optimization
- **Emotions**: 28 categories (joy, anger, sadness, excitement, etc.)
- **Adaptive Logic**: Dynamic threshold adjustment (0.2-0.8 range)
- **Storage**: Git LFS managed files in `training/models/bert_emotion_model/`

**API Integration Pattern**:
- **Primary**: Python Flask server with full BERT analysis
- **Fallback**: Keyword-based analysis when Python server unavailable
- **Preview**: Lightweight characteristics analysis without model inference
- **Error Handling**: Graceful degradation with user-friendly feedback

### Data Models & Emotion Mapping

**Core Interfaces** (defined in `lib/store.ts`):
```typescript
interface JournalEntry {
  emotions: Record<string, number>;      // BERT confidence scores
  symptoms: Record<string, boolean>;     // Physical symptom mapping
  analysis?: {                           // Adaptive metadata
    text_type: 'quick_note' | 'short_entry' | 'medium_entry' | 'detailed_journal';
    emotional_richness: 'low' | 'moderate' | 'high';
    recommended_approach: string;
    threshold_used: number;
  };
}
```

**Emotion-to-Symptom Mapping**: Emotions trigger physical symptoms (tension, headache, fatigue) based on psychological research patterns.

**Chakra Integration**: Emotions categorized by energy centers for holistic wellness tracking.

### Development Workflow

**Standard Development**:
1. Run `npm run dev:full` to start both servers
2. Navigate to `/journal` route for emotion analysis testing
3. Type varying text lengths to see adaptive behavior
4. Submit entries to view full BERT analysis results

**Python Model Development**:
- `training/scripts/adaptive_classifier.py`: Core adaptive logic
- `training/scripts/inference.py`: Base BERT classifier
- `training/api_server.py`: Flask server with CORS
- Model files managed via Git LFS (never commit large files directly)

**Frontend Integration Points**:
- `app/api/analyze-emotion/route.ts`: Proxy to Python with fallback
- `lib/mock-data.ts`: `analyzeJournalEntry()` async function
- Real-time preview with debounced API calls (500ms)

### Wellness-Specific Features

**Adaptive Detection Strategies**:
- Quick notes (< 10 words): "Focus on primary emotion only"
- Short entries (10-30 words): "Balanced emotion detection"  
- Medium entries (30-100 words): "Comprehensive analysis"
- Detailed journals (100+ words): "Full emotional landscape"

**Real-time User Feedback**:
- Live emotion count preview as user types
- Strategy display: "Will detect 2 emotions • Short entry • Balanced detection"
- Word count and complexity indicators

**Comprehensive Analysis Display**:
- Emotion confidence percentages
- Physical symptom indicators
- Adaptive reasoning (threshold used, text type, strategy)
- Emotional density and complexity metrics

### Path Aliasing & TypeScript

- Uses `@/*` for root-level imports (configured in tsconfig.json)
- Strict TypeScript with Next.js plugin integration
- All wellness models properly typed with emotion and chakra mappings

### Dynamic Navigation Architecture

**CSS Grid-Based Header System**: 
- Uses `grid-cols-[1fr_2fr_1fr]` for stable layout without flash
- Three sections: Logo (left), Navigation Pill (center), Actions (right)
- Prevents layout shifts during scroll transitions with `justify-self-*` positioning

**Scroll-Responsive Design**:
- `isScrolled` state triggers at 50px scroll with initial position check
- Logo/actions fade with `opacity-0 pointer-events-none` (700ms duration)
- Navigation pill transitions from `max-w-xl` to `max-w-2xl` (700ms)
- Get Started button appears in pill with `hover:bg-gray-50` matching header style

**OPAL-Style Grid System** (in globals.css):
- Custom grid with named lines: `[full-start]`, `[wide-start]`, `[narrow-start]`
- Responsive breakpoints: mobile (wide), desktop (narrow)
- Use `.opal-wrapper` for layout, `.full-bleed` for full-width elements

### UI Design System Notes

**Glassmorphic Navigation**:
- Pill uses `bg-white/15 backdrop-blur-[12px] border-white/20`
- Rounded-full design with consistent `px-6 py-2` spacing
- Smooth transitions prevent visual artifacts

**Button Consistency**:
- Header buttons: `hover:bg-gray-50` for cream/beige hover effect
- Maintain `transition-colors duration-200` for smooth interactions
- Use `relative overflow-hidden` structure for advanced effects

**Animation Performance**:
- All transitions use `ease-out` timing for natural feel
- Synchronized durations (700ms) prevent layout conflicts
- Initial scroll position check prevents flash on page load