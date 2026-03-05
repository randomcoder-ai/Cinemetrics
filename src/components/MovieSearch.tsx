'use client';

import { useState } from 'react';
import { Search, Loader2, Film } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieSearchProps {
  onSearch: (imdbId: string) => void;
  isLoading: boolean;
}

export default function MovieSearch({ onSearch, isLoading }: MovieSearchProps) {
  const [imdbId, setImdbId] = useState('');
  const [error, setError] = useState('');

  const validateImdbId = (id: string): boolean => {
    const pattern = /^tt\d{7,}$/;
    return pattern.test(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = imdbId.trim();

    if (!trimmedId) {
      setError('Please enter an IMDb ID');
      return;
    }

    if (!validateImdbId(trimmedId)) {
      setError('Invalid IMDb ID format. Example: tt0133093');
      return;
    }

    onSearch(trimmedId);
  };

  const exampleIds = [
    { id: 'tt0133093', name: 'The Matrix' },
    { id: 'tt0111161', name: 'Shawshank Redemption' },
    { id: 'tt0068646', name: 'The Godfather' },
    { id: 'tt0468569', name: 'The Dark Knight' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
            placeholder="Enter IMDb ID (e.g., tt0133093)"
            className="w-full pl-14 pr-36 py-5 bg-[#0f1419] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <div className="space-y-3">
          <p className="text-gray-400 text-sm font-medium">Popular Movies</p>
          <div className="grid grid-cols-2 gap-3">
            {exampleIds.map((movie) => (
              <button
                key={movie.id}
                type="button"
                onClick={() => setImdbId(movie.id)}
                className="group px-4 py-3 bg-[#0f1419] hover:bg-[#1a1f2e] rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all duration-300 text-left"
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm mb-0.5">{movie.name}</p>
                    <p className="text-gray-500 text-xs font-mono">{movie.id}</p>
                  </div>
                  <Film className="w-4 h-4 text-gray-600 group-hover:text-cyan-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </form>
    </motion.div>
  );
}
