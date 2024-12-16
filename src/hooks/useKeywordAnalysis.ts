import { useState } from 'react';
import { DataForSeoClient } from '../services/api/dataForSeoClient';
import { openAiService } from '../services/openAiService';
import { generateToolTemplate } from '../services/templateGenerator/templateGeneratorService';
import type { DataForSeoResponse, SearchVolumeResult } from '../services/api/types';
import type { ToolTemplate } from '../services/templateGenerator/types';

interface AnalysisResults {
  searchVolumeData?: DataForSeoResponse<SearchVolumeResult>;
  insights?: any;
  template?: ToolTemplate;
  error?: string;
}

export function useKeywordAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);

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

      // Generate tool template
      const templateResult = await generateToolTemplate(keyword, searchVolumeData, insights);

      setResults({
        searchVolumeData,
        insights,
        template: templateResult.success ? templateResult.template : undefined,
        error: templateResult.error
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      setResults(null);
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