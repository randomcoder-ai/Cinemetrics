import { NextRequest, NextResponse } from 'next/server';
import { analyzeSentiment, analyzeSentimentWithGemini } from '@/lib/sentiment';
import { Review } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviews } = body;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Reviews array is required' },
        { status: 400 }
      );
    }

    // Use Google Gemini AI if key is available, otherwise fall back to algorithmic
    const sentiment = await analyzeSentimentWithGemini(reviews as Review[]);

    return NextResponse.json({ sentiment });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}
