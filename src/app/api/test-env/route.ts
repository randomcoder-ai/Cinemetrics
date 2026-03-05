import { NextResponse } from 'next/server';

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const omdbKey = process.env.OMDB_API_KEY;
  
  return NextResponse.json({
    geminiKeyPresent: !!geminiKey,
    geminiKeyLength: geminiKey?.length || 0,
    geminiKeyPrefix: geminiKey?.substring(0, 10) || 'none',
    omdbKeyPresent: !!omdbKey,
    omdbKeyPrefix: omdbKey?.substring(0, 5) || 'none',
  });
}
