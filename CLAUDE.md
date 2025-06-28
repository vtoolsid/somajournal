# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
npm run dev     # Start Next.js development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

### Package Management
```bash
npm install     # Install dependencies
```

## Architecture Overview

This is a **Next.js 13.5.1** wellness journaling application built with:

- **Framework**: Next.js (App Router) with TypeScript
- **UI**: Radix UI components with Tailwind CSS and custom shadcn/ui components
- **State Management**: Zustand with persistence for auth, journal entries, and mood tracking
- **Styling**: Tailwind CSS with custom animations and theming
- **Forms**: React Hook Form with Zod validation

### Key Architecture Patterns

**App Structure**: Uses Next.js App Router with route-based pages in `/app/`:
- Authentication routes: `/auth/login`, `/auth/signup`
- Protected routes: `/dashboard`, `/journal`, `/karma`, `/onboarding`
- Layout protection via `AppLayout` component that redirects unauthenticated users

**State Management**: Centralized Zustand store in `lib/store.ts` handles:
- User authentication state
- Journal entries with karmic values (-1.0 to 1.0)
- Mood entries with emotion tracking
- Theme preferences
- Automatic persistence to localStorage

**Component Architecture**:
- Reusable UI components in `/components/ui/` following shadcn/ui patterns
- Layout components in `/components/layout/`
- Custom components like `KarmicAura`, `MandalaProgress`, `FloatingParticles`

**Data Models**:
- `JournalEntry`: Core content with karmic analysis, emotions, and psychosomatic symptoms
- `MoodEntry`: Daily mood tracking (1-5 scale) with emotion tags
- `User`: Basic auth model with timezone support
- Emotion mapping to chakra system (root, sacral, solar, heart, throat, third-eye, crown)

**Path Aliasing**: Uses `@/*` for root-level imports (configured in tsconfig.json)

### Wellness-Specific Features

- **Karmic Analysis**: Journal entries include karmic value calculation
- **Emotion-Chakra Mapping**: Emotions are categorized by chakra centers
- **Psychosomatic Tracking**: Boolean symptom tracking linked to journal entries
- **Mood Visualization**: Mood trends with emotion correlation

### TypeScript Configuration

Strict TypeScript enabled with Next.js plugin integration. All components use proper typing with interfaces for User, JournalEntry, MoodEntry, and Emotion models.