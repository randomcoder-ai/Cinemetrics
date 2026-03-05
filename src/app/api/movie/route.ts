import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imdbId = searchParams.get('id');

    if (!imdbId) {
      return NextResponse.json(
        { error: 'IMDb ID is required' },
        { status: 400 }
      );
    }

    if (!imdbId.match(/^tt\d{7,}$/)) {
      return NextResponse.json(
        { error: 'Invalid IMDb ID format. Expected format: tt0000000' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OMDB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OMDb API key not configured. Please add OMDB_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const url = `http://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.Response === 'False') {
      const errorMsg = response.data.Error || 'Movie not found';
      
      // Check if it's an API key error
      if (errorMsg.includes('Invalid API key') || errorMsg.includes('No API key provided')) {
        return NextResponse.json(
          { error: 'Invalid OMDb API key. Please get a new one at: http://www.omdbapi.com/apikey.aspx' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: errorMsg },
        { status: 404 }
      );
    }

    // Transform OMDb response to our camelCase format
    const omdbData = response.data;
    const movieData = {
      title: omdbData.Title || '',
      year: omdbData.Year || '',
      rated: omdbData.Rated || '',
      released: omdbData.Released || '',
      runtime: omdbData.Runtime || '',
      genre: omdbData.Genre || '',
      director: omdbData.Director || '',
      writer: omdbData.Writer || '',
      actors: omdbData.Actors || '',
      plot: omdbData.Plot || '',
      poster: omdbData.Poster || '',
      imdbRating: omdbData.imdbRating || 'N/A',
      imdbID: omdbData.imdbID || '',
      country: omdbData.Country || '',
      awards: omdbData.Awards || 'N/A'
    };

    return NextResponse.json({
      movie: movieData
    });
  } catch (error) {
    console.error('Error fetching movie data:', error);
    
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: 'Invalid OMDb API key. Get a free key at: http://www.omdbapi.com/apikey.aspx and add it to .env.local as OMDB_API_KEY' },
          { status: 401 }
        );
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch movie data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
