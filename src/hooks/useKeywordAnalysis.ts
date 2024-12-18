import { useState } from 'react';
import { DataForSeoClient } from '../services/api/dataForSeoClient';
import { openAiService } from '../services/openAiService';
import { generateToolTemplate } from '../services/templateGenerator/templateGeneratorService';
import type { DataForSeoResponse, SearchVolumeResult } from '../services/api/types';
import type { ToolTemplate } from '../services/templateGenerator/types';

interface MarketMetrics {
  difficulty: number;
  potential: number;
  competition: number;
  trend: 'up' | 'down' | 'neutral';
}

interface KeywordOpportunity {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  difficulty: number;
}

interface MarketInsights {
  marketAnalysis: string[];
  highValueKeywords: KeywordOpportunity[];
  lowCompetitionKeywords: KeywordOpportunity[];
  contentStrategy: string[];
  monetizationStrategy: string[];
  metrics: MarketMetrics;
}

interface AnalysisResults {
  searchVolumeData?: DataForSeoResponse<SearchVolumeResult>;
  insights?: MarketInsights;
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
      console.log('Starting market analysis for:', keyword);

      // Get related keywords and their metrics
      console.log('Fetching related keywords...');
      const relatedKeywordsData = await dataForSeoClient.getRelatedKeywords(keyword);
      
      // Sort and analyze keywords
      const keywords = relatedKeywordsData.tasks[0]?.result || [];
      const sortedKeywords = keywords.sort((a, b) => (b.cpc || 0) - (a.cpc || 0));
      
      const highValueKeywords = sortedKeywords
        .filter(k => k.cpc > 5) // High CPC threshold
        .slice(0, 5)
        .map(k => ({
          keyword: k.keyword,
          searchVolume: k.search_volume || 0,
          cpc: k.cpc || 0,
          competition: k.competition_index || 0,
          difficulty: k.keyword_properties?.keyword_difficulty || 0
        }));

      const lowCompetitionKeywords = sortedKeywords
        .filter(k => k.competition === 'LOW' && k.search_volume > 1000)
        .slice(0, 5)
        .map(k => ({
          keyword: k.keyword,
          searchVolume: k.search_volume || 0,
          cpc: k.cpc || 0,
          competition: k.competition_index || 0,
          difficulty: k.keyword_properties?.keyword_difficulty || 0
        }));

      // Generate AI insights using OpenAI
      console.log('Generating market insights...');
      const aiResponse = await openAiService.generateInsights(
        `You are a market analysis AI assistant. Your task is to analyze keyword data and return insights in a specific JSON format. 
        
        Analyze this market data:

        High-Value Keywords (High CPC):
        ${JSON.stringify(highValueKeywords, null, 2)}

        Low-Competition Keywords (Potential backdoor opportunities):
        ${JSON.stringify(lowCompetitionKeywords, null, 2)}

        IMPORTANT: You must respond with ONLY valid JSON in the exact format shown below. Do not include any other text or explanations.
        Required JSON format:

        {
          "marketAnalysis": [
            "First market insight",
            "Second market insight",
            "Third market insight"
          ],
          "highValueKeywords": ${JSON.stringify(highValueKeywords)},
          "lowCompetitionKeywords": ${JSON.stringify(lowCompetitionKeywords)},
          "contentStrategy": [
            "First content strategy",
            "Second content strategy",
            "Third content strategy"
          ],
          "monetizationStrategy": [
            "First monetization strategy",
            "Second monetization strategy",
            "Third monetization strategy"
          ],
          "metrics": {
            "difficulty": ${Math.round(highValueKeywords.reduce((acc, k) => acc + k.difficulty, 0) / highValueKeywords.length)},
            "potential": ${Math.min(Math.round(highValueKeywords.reduce((acc, k) => acc + k.searchVolume, 0) / 1000), 100)},
            "competition": ${Math.round(highValueKeywords.reduce((acc, k) => acc + k.competition, 0) / highValueKeywords.length)},
            "trend": "up"
          }
        }`
      );

      let insights;
      try {
        const content = aiResponse.choices[0].message.content.trim();
        insights = JSON.parse(content);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.error('Raw response:', aiResponse.choices[0].message.content);
        throw new Error('Failed to parse market insights. Please try again.');
      }

      // Generate tool template
      console.log('Generating tool template...');
      const templateResponse = await generateToolTemplate(keyword, relatedKeywordsData, insights);

      setResults({
        searchVolumeData: relatedKeywordsData,
        insights,
        template: templateResponse.template
      });
    } catch (err) {
      console.error('Error during market analysis:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    results,
    analyzeKeyword
  };
}