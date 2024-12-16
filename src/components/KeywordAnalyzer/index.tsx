import React, { useState } from 'react';
import { useKeywordAnalysis } from '../../hooks/useKeywordAnalysis';
import SearchForm from './SearchForm';
import ErrorMessage from './ErrorMessage';
import AnalysisResults from './AnalysisResults';

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
      <SearchForm
        keyword={keyword}
        loading={loading}
        onKeywordChange={setKeyword}
        onSubmit={handleSubmit}
      />

      {error && <ErrorMessage message={error} />}
      
      {results && (
        <div className="mt-8">
          <AnalysisResults
            adsData={results.adsData}
            aiInsights={results.aiInsights}
          />
        </div>
      )}
    </div>
  );
};

export default KeywordAnalyzer;