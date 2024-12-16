import { useState } from 'react';
import { DataForSeoClient } from '../services/api/dataForSeoClient';
import { openAiService } from '../services/openAiService';
import type { DataForSeoResponse, AdsSearchResult } from '../services/api/types';

interface AnalysisResult {
  adsData: DataForSeoResponse<AdsSearchResult>;
  aiInsights: any;
}

export function useKeywordAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const dataForSeoClient = DataForSeoClient.getInstance();

  const analyzeKeyword = async (keyword: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get ads data from DataForSEO
      const adsData = await dataForSeoClient.searchAds({
        search_query: keyword.trim()
      });

      // Get AI insights from OpenAI
      const aiInsights = await openAiService.analyzeKeywords(keyword);

      setResults({
        adsData,
        aiInsights
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    results,
    analyzeKeyword,
  };
}