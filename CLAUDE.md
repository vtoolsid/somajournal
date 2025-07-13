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

### Authentication & Database Setup
```bash
# Supabase Database Schema (run in Supabase SQL Editor)
# Copy contents of supabase/schema.sql and execute

# Clerk-Supabase Integration Setup
# 1. Create JWT template named "supabase" in Clerk dashboard
# 2. Configure with proper claims for RLS policies
# 3. Add Supabase JWT secret as signing key
```

## Architecture Overview

This is a **Next.js 13.5.1** wellness journaling application with integrated **BERT emotion analysis** and **Clerk authentication** built with:

- **Frontend**: Next.js (App Router) with TypeScript, Radix UI, Tailwind CSS
- **Authentication**: Clerk with catch-all routes for sign-in/sign-up
- **Database**: Supabase with Row Level Security (RLS) integration
- **Backend**: Python Flask API serving trained BERT emotion classifier
- **State Management**: Zustand with localStorage persistence + Supabase sync
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

**Authentication Flow**:
- `middleware.ts`: Clerk middleware protecting routes with public route exceptions
- `components/clerk-sync.tsx`: Syncs Clerk user data to Zustand store and Supabase
- `components/layout/app-layout.tsx`: Smart routing based on auth + assessment completion
- Catch-all routes: `/app/auth/login/[[...rest]]/` and `/app/auth/signup/[[...rest]]/`

**State Management Flow**:
- `lib/store.ts`: Zustand store with interfaces for User, JournalEntry, MoodEntry, WellbeingAssessment
- `lib/supabase.ts`: Clerk-integrated Supabase client with singleton pattern
- `lib/mock-data.ts`: Contains `analyzeJournalEntry()` function (calls BERT API)
- Dual persistence: localStorage (immediate) + Supabase (authenticated users)
- Assessment progress stored in both local state and database

**Component Architecture**:
- `/app/journal/page.tsx`: Main journal interface with real-time emotion preview
- `/app/wellbeing-assessment/page.tsx`: Multi-step assessment with progress tracking
- `/app/dashboard/page.tsx`: Main authenticated user dashboard
- `/components/ui/`: shadcn/ui components with wellness-specific extensions
- `/components/layout/`: AppLayout with authentication protection and smart routing
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
interface User {
  id: string;           // Clerk user ID
  email: string;
  name: string;
  timezone: string;
  createdAt: Date;
}

interface JournalEntry {
  emotions: Record<string, number>;      // BERT confidence scores
  symptoms: Record<string, boolean>;     // Physical symptom mapping
  analysis?: {                           // Adaptive metadata
    text_type: 'quick_note' | 'short_entry' | 'medium_entry' | 'detailed_journal';
    emotional_richness: 'low' | 'moderate' | 'high';
    recommended_approach: string;
    threshold_used: number;
  };
  psychosomatic_analysis?: any;          // OpenAI-powered insights
}

interface WellbeingAssessment {
  // DEQ (Difficulties in Emotion Regulation) scores
  deq_scores: Record<string, number>;
  // SSS (Somatic Symptom Scale) scores  
  sss_scores: Record<string, number>;
  completed: boolean;
  completedAt?: Date;
}
```

**Emotion-to-Symptom Mapping**: Emotions trigger physical symptoms (tension, headache, fatigue) based on psychological research patterns.

**Chakra Integration**: Emotions categorized by energy centers for holistic wellness tracking.

**Assessment Integration**: DEQ and SSS standardized questionnaires for baseline wellness measurement.

### Development Workflow

**Standard Development**:
1. Run `npm run dev:full` to start both servers
2. Navigate to `/` for home page with auth integration
3. Test auth flow: Sign up → Assessment → Dashboard → Journal
4. Type varying text lengths in journal to see adaptive BERT behavior
5. Submit entries to view full analysis results

**Authentication Testing**:
- New users: Sign up → Redirected to wellbeing assessment
- Existing users: Sign in → Dashboard (or assessment if incomplete)
- Sign out: Settings page or test button on home page
- Protected routes: All pages except `/`, `/auth/*`, API routes

**Python Model Development**:
- `training/scripts/adaptive_classifier.py`: Core adaptive logic
- `training/scripts/inference.py`: Base BERT classifier
- `training/api_server.py`: Flask server with CORS
- Model files managed via Git LFS (never commit large files directly)

**Frontend Integration Points**:
- `app/api/analyze-emotion/route.ts`: Proxy to Python with fallback
- `lib/mock-data.ts`: `analyzeJournalEntry()` async function
- Real-time preview with debounced API calls (500ms)
- Supabase sync for authenticated users with fallback to localStorage

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

## Critical Implementation Notes

### Authentication Architecture
- **Clerk Integration**: Uses catch-all routes `[[...rest]]` for sign-in/sign-up components
- **Smart Routing**: AppLayout handles user redirection based on auth + assessment status
- **Dual Persistence**: Zustand store syncs to Supabase for authenticated users
- **Graceful Fallbacks**: App works with localStorage when Supabase JWT template not configured

### Database Integration Pattern
- **RLS Policies**: Supabase Row Level Security uses `auth.jwt() ->> 'sub'` for user isolation
- **JWT Template**: Must be named exactly "supabase" in Clerk dashboard
- **Sync Strategy**: ClerkSync component handles real-time user data synchronization
- **Error Handling**: Comprehensive fallbacks for missing JWT templates or DB connection issues

### Assessment Flow
- **Mandatory Completion**: New users must complete wellbeing assessment before accessing main app
- **Progress Tracking**: Assessment progress saved to both localStorage and Supabase
- **Smart Resume**: Users can resume incomplete assessments from where they left off
- **Baseline Establishment**: DEQ and SSS scores provide clinical-grade wellness baselines

### BERT Model Deployment
- **Dual-Server Requirement**: Python Flask server (port 8000) must run alongside Next.js (port 3000)
- **Git LFS Dependency**: Model files (418MB) require `git lfs pull` before first run
- **Graceful Degradation**: Falls back to keyword analysis when Python server unavailable
- **Real-time Analysis**: Debounced preview (500ms) + full analysis on submission