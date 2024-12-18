import React, { useState } from 'react';
import { Search, Loader, AlertTriangle } from 'lucide-react';
import { useKeywordAnalysis } from '../hooks/useKeywordAnalysis';
import { AdsDataDisplay } from './KeywordAnalyzer/AnalysisResults/AdsDataDisplay';
import { AiInsightsDisplay } from './KeywordAnalyzer/AnalysisResults/AiInsightsDisplay';
import { ToolTemplateDisplay } from './KeywordAnalyzer/AnalysisResults/ToolTemplateDisplay';

const KeywordAnalyzer = () => {
  const [keyword, setKeyword] = useState('');
  const { loading, error, results, analyzeKeyword } = useKeywordAnalysis();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      analyzeKeyword(keyword.trim());
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Keyword Analysis Tool</h1>
        <p className="text-gray-600">Analyze keywords, generate tools, and uncover monetization strategies in minutes using AI</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter a keyword to analyze..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            type="submit"
            disabled={loading || !keyword.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              'Analyze Keyword'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-red-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-800">Analysis Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-8">
          {results.searchVolumeData && (
            <AdsDataDisplay data={results.searchVolumeData} />
          )}
          {results.insights && (
            <AiInsightsDisplay insights={results.insights} />
          )}
          {results.template && (
            <ToolTemplateDisplay template={results.template} />
          )}
          {results.error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3 text-amber-700">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p>{results.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KeywordAnalyzer;