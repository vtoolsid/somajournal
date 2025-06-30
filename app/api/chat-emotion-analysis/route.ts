import { NextRequest, NextResponse } from 'next/server';

// ChatGPT emotion analysis API route
export async function POST(request: NextRequest) {
  try {
    const { prompt, maxTokens = 150, temperature = 0.3 } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ OpenAI API key not found, skipping ChatGPT emotion analysis');
      return NextResponse.json({
        emotions: [],
        message: 'OpenAI API key not configured'
      });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ OpenAI API error:', errorData);
      return NextResponse.json({
        emotions: [],
        error: 'OpenAI API error'
      });
    }

    const data = await response.json();
    console.log('🤖 OpenAI response:', data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      
      try {
        // Parse the JSON response from ChatGPT
        const parsed = JSON.parse(content);
        
        // Extract emotions array if it exists
        let emotions = [];
        if (Array.isArray(parsed)) {
          emotions = parsed;
        } else if (parsed.emotions && Array.isArray(parsed.emotions)) {
          emotions = parsed.emotions;
        }
        
        // Validate emotion format
        const validEmotions = emotions.filter((e: any) => 
          e.emotion && 
          typeof e.emotion === 'string' && 
          typeof e.confidence === 'number' &&
          e.confidence >= 0.1 && 
          e.confidence <= 1.0
        );

        return NextResponse.json({
          emotions: validEmotions,
          rawResponse: content
        });
        
      } catch (parseError) {
        console.error('❌ Failed to parse ChatGPT response:', parseError);
        return NextResponse.json({
          emotions: [],
          error: 'Failed to parse emotion analysis'
        });
      }
    }

    return NextResponse.json({
      emotions: [],
      error: 'No valid response from ChatGPT'
    });

  } catch (error) {
    console.error('❌ ChatGPT emotion analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error', emotions: [] },
      { status: 500 }
    );
  }
}