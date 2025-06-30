# Prototype Mode Guide

## Overview

Prototype Mode allows you to develop and test the SomaJournal UI with realistic mock psychosomatic analysis data without making actual API calls. This is perfect for:

- **UI Development**: Work on the interface without API dependencies
- **Offline Development**: No need for the Python server
- **Cost-Free Testing**: No OpenAI API charges during development
- **Consistent Demos**: Predictable results for demonstrations
- **Performance Testing**: Instant responses without server latency

## Quick Start

### 1. Enable Prototype Mode

In your `.env.local` file:

```bash
# Enable prototype mode
NEXT_PUBLIC_PROTOTYPE_MODE=true

# Optional: Enable debug logging
NEXT_PUBLIC_DEBUG_MODE=true
```

### 2. Restart Your Development Server

```bash
npm run dev
```

That's it! The app will now use mock data instead of API calls.

## How It Works

When prototype mode is enabled:

1. **Journal Analysis**: When you click "Reflect", the app uses keyword analysis to detect emotions
2. **Mock Data**: Based on detected emotions, it returns comprehensive mock psychosomatic data
3. **Realistic Delay**: Simulates API processing time (1.5 seconds by default)
4. **Full UI Experience**: All components receive the same data structure as real API responses

## Available Mock Templates

The system includes templates for these emotional states:

### Primary Templates
- **Sadness**: Decreased limb activity, chest/head sensations
- **Joy**: Full-body activation with emphasis on chest/head
- **Anxiety/Nervousness**: Chest/stomach activation, hand tremors
- **Anger**: Upper body activation (chest, head, arms)
- **Neutral**: Balanced state with no specific activation

### Emotion Mapping
Other emotions automatically map to the closest template:
- Grief, disappointment → Sadness template
- Happiness, excitement, gratitude → Joy template
- Fear, worry, stress → Anxiety template
- Frustration, annoyance → Anger template
- Calm, peaceful → Neutral template

## Customizing Mock Data

### 1. Add New Emotion Keywords

Edit `lib/mock-data.ts` to add keywords:

```typescript
const emotionPatterns = {
  joy: ['happy', 'joy', 'wonderful', 'amazing', 'great'],
  // Add your custom keywords here
  excitement: ['excited', 'thrilled', 'pumped', 'energized'],
};
```

### 2. Create New Templates

Edit `lib/mock-psychosomatic-data.ts` to add templates:

```typescript
export const MOCK_PSYCHOSOMATIC_TEMPLATES = {
  // Add your custom template
  excitement: {
    emotions: [
      { emotion: 'excitement', confidence: 0.85 }
    ],
    psychosomatic: {
      // ... full template structure
    }
  }
};
```

### 3. Adjust Processing Delay

Edit `lib/config.ts`:

```typescript
mockData: {
  simulatedDelay: 2000, // 2 seconds instead of 1.5
}
```

## Switching Between Modes

### Use Mock Data (Prototype Mode)
```bash
NEXT_PUBLIC_PROTOTYPE_MODE=true
```

### Use Real API
```bash
NEXT_PUBLIC_PROTOTYPE_MODE=false
# Or just remove/comment out the line
```

## Debugging

Enable debug logging to see what's happening:

```bash
NEXT_PUBLIC_DEBUG_MODE=true
```

This will log:
- Detected emotions and confidence scores
- Which template is being used
- Mock data generation details

## Example Usage

1. Write a journal entry:
   ```
   "I feel overwhelmed with work and my shoulders are tense"
   ```

2. Click "Reflect"

3. The system will:
   - Detect keywords: "overwhelmed", "tense"
   - Map to emotions: nervousness (0.72), fear (0.58)
   - Return anxiety template with full psychosomatic analysis
   - Show body mapping, wellness recommendations, etc.

## Best Practices

1. **Test Different Emotions**: Write entries with various emotional keywords to test all templates
2. **Check Responsiveness**: Test on different screen sizes
3. **Verify Data Flow**: Ensure all UI components receive and display data correctly
4. **Performance**: Note that mock mode is faster than real API calls

## Troubleshooting

### Mock Data Not Working?
- Check that `NEXT_PUBLIC_PROTOTYPE_MODE=true` is in `.env.local`
- Restart the development server after changing env variables
- Check browser console for error messages

### Wrong Emotion Detected?
- Add more specific keywords to `emotionPatterns` in `lib/mock-data.ts`
- Adjust confidence calculation logic if needed

### Need More Realistic Data?
- Copy actual API responses and add them as templates
- Increase variety in wellness recommendations
- Add more nuanced body sensation descriptions

## Production Deployment

**Important**: Always set `NEXT_PUBLIC_PROTOTYPE_MODE=false` for production to use real API analysis.

```bash
# Production .env
NEXT_PUBLIC_PROTOTYPE_MODE=false
```