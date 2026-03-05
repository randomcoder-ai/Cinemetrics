'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Minus, Sparkles, Brain, TrendingUp } from 'lucide-react';
import { SentimentAnalysis } from '@/types';

interface SentimentAnalysisProps {
  sentiment: SentimentAnalysis;
}

export default function SentimentAnalysisComponent({ sentiment }: SentimentAnalysisProps) {
  const getSentimentIcon = () => {
    switch (sentiment.classification) {
      case 'positive':
        return <ThumbsUp className="w-6 h-6" />;
      case 'negative':
        return <ThumbsDown className="w-6 h-6" />;
      case 'mixed':
        return <Minus className="w-6 h-6" />;
    }
  };

  const getSentimentColor = () => {
    switch (sentiment.classification) {
      case 'positive':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'negative':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'mixed':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  const getConfidenceColor = () => {
    if (sentiment.confidence >= 80) return 'bg-green-500';
    if (sentiment.confidence >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8"
    >
      <div className="bg-linear-to-br from-[#0f1419] to-[#0a0e14] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-cyan-500/10 rounded-lg">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">AI Sentiment Analysis</h2>
          </div>

          {/* Sentiment Badge and Confidence */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            {/* Sentiment Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border ${getSentimentColor()} font-semibold`}>
              {getSentimentIcon()}
              <span className="uppercase text-sm tracking-wide">{sentiment.classification}</span>
            </div>

            {/* Confidence Bar */}
            <div className="flex-1 w-full sm:w-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-medium">Confidence</span>
                <span className="text-white font-semibold text-sm">{sentiment.confidence}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sentiment.confidence}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full ${getConfidenceColor()} rounded-full`}
                />
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Summary</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{sentiment.summary}</p>
          </div>

          {/* Key Insights */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Key Insights</h3>
            </div>
            <div className="space-y-3">
              {sentiment.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-semibold text-sm shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 leading-relaxed flex-1">{insight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
