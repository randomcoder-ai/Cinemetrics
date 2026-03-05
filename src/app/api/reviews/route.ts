import { NextRequest, NextResponse } from 'next/server';
import { scrapeIMDbReviews } from '@/lib/scraper';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imdbId = searchParams.get('id');

    if (!imdbId || !imdbId.startsWith('tt')) {
      return NextResponse.json(
        { error: 'Invalid IMDb ID' },
        { status: 400 }
      );
    }

    const reviews = await scrapeIMDbReviews(imdbId);

    if (reviews.length === 0) {
      return NextResponse.json(
        { error: 'No reviews found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
