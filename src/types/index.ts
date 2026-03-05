// OMDb API returns data with capital first letters
export interface OMDbResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Country: string;
  Awards: string;
  Response: string;
  Error?: string;
}

// Our internal interface (camelCase)
export interface MovieData {
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  poster: string;
  imdbRating: string;
  imdbID: string;
  country: string;
  awards: string;
}

export interface Review {
  author: string;
  rating: number | null;
  title: string;
  text: string;
  date: string;
  helpful?: string;
}

export interface SentimentAnalysis {
  summary: string;
  classification: 'positive' | 'mixed' | 'negative';
  insights: string[];
  confidence: number;
}

export interface MovieResponse {
  movie: MovieData;
  reviews: Review[];
  sentiment: SentimentAnalysis;
}
