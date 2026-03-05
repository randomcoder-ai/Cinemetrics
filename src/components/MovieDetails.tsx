'use client';

import { motion } from 'framer-motion';
import { Calendar, Star, Clock, Award, User, Users, Film } from 'lucide-react';
import { MovieData } from '@/types';
import Image from 'next/image';

interface MovieDetailsProps {
  movie: MovieData;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="bg-linear-to-br from-[#0f1419] to-[#0a0e14] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
          {/* Movie Poster */}
          <div className="lg:w-80 shrink-0">
            <div className="relative aspect-2/3 rounded-xl overflow-hidden shadow-2xl group">
              {movie.poster && movie.poster !== 'N/A' ? (
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                  <Film className="w-24 h-24 text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Movie Information */}
          <div className="flex-1 flex flex-col">
            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {movie.title}
              </h1>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.split(', ').map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Rating Badges */}
              <div className="flex flex-wrap items-center gap-4">
                {/* IMDb Rating */}
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 font-bold text-sm">IMDb</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <span className="text-white font-bold text-lg">
                    {movie.imdbRating}
                  </span>
                  <span className="text-gray-400 text-sm">/10</span>
                </div>

                {/* Rated */}
                {movie.rated !== 'N/A' && (
                  <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-gray-300 font-medium text-sm">{movie.rated}</span>
                  </div>
                )}

                {/* Runtime */}
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{movie.runtime}</span>
                </div>
              </div>
            </div>

            {/* Plot */}
            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed text-base">
                {movie.plot}
              </p>
            </div>

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Director */}
              {movie.director !== 'N/A' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs font-medium mb-1">Director</p>
                      <p className="text-white font-medium text-sm truncate">{movie.director}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actors */}
              {movie.actors !== 'N/A' && (
                <div className="col-span-1 sm:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs font-medium mb-2">Cast</p>
                      <div className="flex flex-wrap gap-2">
                        {movie.actors.split(',').map((actor, index) => (
                          <span key={index} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white text-xs font-medium">
                            {actor.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Year */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs font-medium mb-1">Release Year</p>
                    <p className="text-white font-medium text-sm">{movie.year}</p>
                  </div>
                </div>
              </div>

              {/* Awards */}
              {movie.awards !== 'N/A' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs font-medium mb-1">Awards</p>
                      <p className="text-white font-medium text-sm truncate">{movie.awards}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex mt-auto pt-4 border-t border-white/5">
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3 bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
              >
                <Film className="w-5 h-5" />
                View on IMDb
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
