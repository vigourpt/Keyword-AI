import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword to analyze..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={loading || !keyword.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-5 w-5" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-6">
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
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {results.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KeywordAnalyzer;