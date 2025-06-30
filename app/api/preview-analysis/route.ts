import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json({
        emotion_count: 0,
        strategy: 'No text provided',
        text_type: 'empty'
      });
    }

    // Forward request to Python API server for quick preview
    const response = await fetch(`${PYTHON_API_URL}/preview-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: body.text
      }),
    });

    if (!response.ok) {
      // Fallback preview calculation
      return NextResponse.json(createFallbackPreview(body.text));
    }

    const previewResult = await response.json();
    return NextResponse.json(previewResult);

  } catch (error) {
    console.error('Preview analysis API error:', error);
    
    // Return fallback preview on any error
    const body = await request.json().catch(() => ({ text: '' }));
    return NextResponse.json(createFallbackPreview(body.text || ''));
  }
}

function createFallbackPreview(text: string) {
  const wordCount = text.trim().split(' ').length;
  
  // Simple adaptive logic for preview
  let emotionCount = 1;
  let strategy = 'Focus on primary emotion';
  let textType = 'quick_note';
  
  if (wordCount >= 100) {
    emotionCount = 4;
    strategy = 'Comprehensive emotional analysis';
    textType = 'detailed_journal';
  } else if (wordCount >= 30) {
    emotionCount = 3;
    strategy = 'Balanced emotion detection';
    textType = 'medium_entry';
  } else if (wordCount >= 10) {
    emotionCount = 2;
    strategy = 'Focused emotion detection';
    textType = 'short_entry';
  }
  
  return {
    emotion_count: emotionCount,
    strategy: strategy,
    text_type: textType,
    word_count: wordCount,
    threshold: 0.5
  };
}