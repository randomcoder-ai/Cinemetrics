'use client';

import { useState } from 'react';
import MovieSearch from '@/components/MovieSearch';
import MovieDetails from '@/components/MovieDetails';
import SentimentAnalysisComponent from '@/components/SentimentAnalysis';
import { MovieData, Review, SentimentAnalysis } from '@/types';
import { Film, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);

  const handleSearch = async (imdbId: string) => {
    setIsLoading(true);
    setError('');
    setMovieData(null);
    setSentiment(null);

    try {
      // Fetch movie data
      const movieResponse = await fetch(`/api/movie?id=${imdbId}`);
      const movieResult = await movieResponse.json();

      if (!movieResponse.ok) {
        throw new Error(movieResult.error || 'Failed to fetch movie data');
      }

      setMovieData(movieResult.movie);

      // Fetch reviews
      const reviewsResponse = await fetch(`/api/reviews?id=${imdbId}`);
      const reviewsResult = await reviewsResponse.json();

      let reviews: Review[] = [];
      if (reviewsResponse.ok && reviewsResult.reviews) {
        reviews = reviewsResult.reviews;
      }

      // Analyze sentiment
      if (reviews.length > 0) {
        const sentimentResponse = await fetch('/api/sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reviews }),
        });

        const sentimentResult = await sentimentResponse.json();
        if (sentimentResponse.ok) {
          setSentiment(sentimentResult.sentiment);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_50%)]" />
      
      {/* Navigation Bar */}
      <nav className="relative z-50 border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              CineMetrics
            </h1>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Hero Section */}
        {!movieData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Discover Movie{' '}
              <span className="bg-linear-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Sentiment
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              AI-powered analysis of audience reactions and reviews from IMDb
            </p>
            <MovieSearch onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>
        )}

        {/* Search Bar When Movie is Displayed */}
        {movieData && (
          <div className="mb-8">
            <MovieSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto mb-6"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {movieData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <MovieDetails movie={movieData} />
              {sentiment && <SentimentAnalysisComponent sentiment={sentiment} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && !movieData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10">
              <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-white/90 text-sm font-medium">
                Analyzing movie sentiment...
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2026 CineMetrics. Powered by OMDb API & Google Gemini AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
