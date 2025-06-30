import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing or invalid "text" field in request',
          code: 'MISSING_TEXT' 
        },
        { status: 400 }
      );
    }

    // Forward request to Python API server
    const response = await fetch(`${PYTHON_API_URL}/analyze-emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: body.text,
        debug: body.debug || false
      }),
    });

    if (!response.ok) {
      // Handle Python server errors
      let errorMessage = 'Python emotion analysis server error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse error, use generic message
      }

      console.error(`Python API error (${response.status}): ${errorMessage}`);
      
      // Return fallback analysis if Python server is down
      return NextResponse.json(createFallbackAnalysis(body.text), { status: 200 });
    }

    const analysisResult = await response.json();
    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('Emotion analysis API error:', error);
    
    // Return fallback analysis on any error
    const body = await request.json().catch(() => ({ text: '' }));
    return NextResponse.json(createFallbackAnalysis(body.text || ''));
  }
}

export async function GET() {
  try {
    // Health check - ping Python server
    const response = await fetch(`${PYTHON_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const healthData = await response.json();
      return NextResponse.json({
        status: 'healthy',
        python_server: healthData,
        next_api: 'operational'
      });
    } else {
      return NextResponse.json({
        status: 'degraded',
        python_server: 'unavailable',
        next_api: 'operational',
        fallback: 'keyword analysis available'
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      python_server: 'unreachable',
      next_api: 'operational',
      fallback: 'keyword analysis available',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function createFallbackAnalysis(text: string) {
  console.log('Using fallback emotion analysis for text:', text.substring(0, 50) + '...');
  
  // Simple keyword-based fallback analysis
  const words = text.toLowerCase().split(' ');
  const wordCount = words.length;
  
  const emotions: Array<{ emotion: string; confidence: number }> = [];
  
  // Basic emotion detection
  const emotionKeywords = {
    joy: ['happy', 'joy', 'wonderful', 'amazing', 'great', 'awesome', 'fantastic', 'love', 'excited'],
    sadness: ['sad', 'down', 'depressed', 'awful', 'terrible', 'cry', 'upset', 'heartbroken'],
    anger: ['angry', 'mad', 'frustrated', 'annoyed', 'furious', 'irritated', 'hate'],
    anxiety: ['anxious', 'worried', 'nervous', 'stress', 'scared', 'fear'],
    gratitude: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate'],
    peace: ['peaceful', 'calm', 'serene', 'tranquil', 'relaxed', 'zen']
  };
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter(keyword => words.includes(keyword));
    if (matches.length > 0) {
      emotions.push({
        emotion,
        confidence: Math.min(0.8, 0.5 + (matches.length * 0.1))
      });
    }
  }
  
  // Default to neutral if no emotions detected
  if (emotions.length === 0) {
    emotions.push({ emotion: 'neutral', confidence: 0.5 });
  }
  
  // Limit emotions based on text length (adaptive-like behavior)
  const maxEmotions = wordCount < 10 ? 1 : wordCount < 50 ? 2 : 3;
  const limitedEmotions = emotions.slice(0, maxEmotions);
  
  // Simple symptoms detection
  const symptoms = {
    tension: words.some(word => ['stress', 'tension', 'tight', 'tense'].includes(word)),
    headache: words.some(word => ['headache', 'head', 'pain'].includes(word)),
    fatigue: words.some(word => ['tired', 'exhausted', 'fatigue', 'weary'].includes(word)),
    restlessness: words.some(word => ['restless', 'anxious', 'nervous'].includes(word)),
    nausea: words.some(word => ['nausea', 'sick', 'queasy'].includes(word))
  };
  
  return {
    status: 'success',
    emotions: limitedEmotions,
    analysis: {
      text_type: wordCount < 10 ? 'quick_note' : wordCount < 50 ? 'short_entry' : 'medium_entry',
      emotional_richness: emotions.length > 1 ? 'moderate' : 'low',
      recommended_approach: 'Keyword-based fallback analysis',
      word_count: wordCount,
      threshold_used: 0.5,
      max_emotions: maxEmotions
    },
    characteristics: {
      emotional_density: emotions.length / Math.max(wordCount, 1),
      complexity_score: Math.min(emotions.length * 0.3, 1.0),
      has_multiple_emotions: emotions.length > 1,
      emotional_word_count: emotions.length,
      sentence_count: text.split(/[.!?]+/).filter(s => s.trim()).length
    },
    symptoms,
    adaptive_info: {
      strategy: 'Fallback keyword analysis (BERT model unavailable)',
      reasoning: `Detected ${limitedEmotions.length} emotions using keyword matching`
    },
    fallback: true
  };
}