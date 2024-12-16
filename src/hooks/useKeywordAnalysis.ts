import { useState } from 'react';
import { DataForSeoClient } from '../services/api/dataForSeoClient';
import { openAiService } from '../services/openAiService';
import type { DataForSeoResponse, SearchVolumeResult } from '../services/api/types';

interface AnalysisResult {
  searchVolumeData: DataForSeoResponse<SearchVolumeResult>;
  insights: any;
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
      // Get search volume data from DataForSEO
      const searchVolumeData = await dataForSeoClient.getSearchVolumeLive({
        keywords: [keyword.trim()]
      });

      // Get AI insights from OpenAI
      const insights = await openAiService.analyzeKeywords(keyword);

      setResults({
        searchVolumeData,
        insights
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