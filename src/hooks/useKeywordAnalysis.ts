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
    setResults(null);

    try {
      console.log('Starting analysis for keyword:', keyword);

      // Get search volume data from DataForSEO
      console.log('Fetching search volume data...');
      const searchVolumeData = await dataForSeoClient.getSearchVolumeLive({
        keywords: [keyword.trim()]
      });
      console.log('Received search volume data:', searchVolumeData);

      if (!searchVolumeData.tasks?.[0]?.result) {
        throw new Error('No search volume data received from DataForSEO');
      }

      // Get AI insights from OpenAI
      console.log('Getting AI insights...');
      const insights = await openAiService.analyzeKeywords(keyword);
      console.log('Received AI insights:', insights);

      // Generate tool template
      console.log('Generating tool template...');
      const templateResult = await generateToolTemplate(keyword, searchVolumeData, insights);
      console.log('Template generation result:', templateResult);

      if (!templateResult.success) {
        console.warn('Template generation failed:', templateResult.error);
      }

      setResults({
        searchVolumeData,
        insights,
        template: templateResult.template,
      });
    } catch (err) {
      console.error('Error during keyword analysis:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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