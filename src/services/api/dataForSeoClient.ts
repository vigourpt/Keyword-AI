import { BaseApiClient } from './base';
import { DATAFORSEO_CONFIG } from './config';
import { ENDPOINTS } from './endpoints';
import type { 
  AdsSearchParams, 
  DataForSeoResponse, 
  AdsSearchResult, 
  SearchVolumeParams,
  SearchVolumeResult 
} from './types';

export class DataForSeoClient extends BaseApiClient {
  private static instance: DataForSeoClient;
  private readonly authToken: string;

  private constructor() {
    super();
    const { login, password } = DATAFORSEO_CONFIG.credentials;
    this.authToken = this.getAuthToken(login, password);
  }

  public static getInstance(): DataForSeoClient {
    if (!DataForSeoClient.instance) {
      DataForSeoClient.instance = new DataForSeoClient();
    }
    return DataForSeoClient.instance;
  }

  async searchAds(params: AdsSearchParams): Promise<DataForSeoResponse<AdsSearchResult>> {
    const payload = [{
      search_query: params.search_query,
      location_code: params.location_code || 2840, // US
      language_code: params.language_code || "en",
      device: params.device || 'desktop',
      os: params.os || 'windows'
    }];

    const response = await fetch(`${DATAFORSEO_CONFIG.baseUrl}${ENDPOINTS.GOOGLE_ADS.SEARCH}`, {
      method: 'POST',
      headers: this.getHeaders(this.authToken),
      body: JSON.stringify(payload)
    });

    return this.handleResponse<DataForSeoResponse<AdsSearchResult>>(response);
  }

  async getSearchVolume(params: SearchVolumeParams): Promise<DataForSeoResponse<SearchVolumeResult>> {
    const payload = [{
      keywords: params.keywords,
      location_code: params.location_code || 2840, // US
      language_code: params.language_code || "en"
    }];

    const response = await fetch(`${DATAFORSEO_CONFIG.baseUrl}${ENDPOINTS.GOOGLE_ADS.SEARCH_VOLUME}`, {
      method: 'POST',
      headers: this.getHeaders(this.authToken),
      body: JSON.stringify(payload)
    });

    return this.handleResponse<DataForSeoResponse<SearchVolumeResult>>(response);
  }

  async getSearchVolumeLive(params: SearchVolumeParams): Promise<DataForSeoResponse<SearchVolumeResult>> {
    const payload = [{
      keywords: params.keywords,
      location_code: params.location_code || 2840, // Default to US
      language_code: params.language_code || 'en',
    }];

    const response = await fetch(`${DATAFORSEO_CONFIG.baseUrl}/keywords_data/google_ads/search_volume/live`, {
      method: 'POST',
      headers: this.getHeaders(this.authToken),
      body: JSON.stringify(payload)
    });

    return this.handleResponse<DataForSeoResponse<SearchVolumeResult>>(response);
  }

  async getRelatedKeywords(keyword: string): Promise<DataForSeoResponse<SearchVolumeResult>> {
    // First, get keyword suggestions with expanded parameters
    const suggestionsResponse = await fetch(`${DATAFORSEO_CONFIG.baseUrl}/keywords_data/google_ads/keywords_for_keywords/live`, {
      method: 'POST',
      headers: this.getHeaders(this.authToken),
      body: JSON.stringify([{
        keywords: [keyword],
        location_code: 2840,
        language_code: "en",
        include_seed_keyword: true,
        include_serp_info: true,
        include_related_search: true,
        depth: 3,  // Increased depth for more suggestions
        limit: 100 // Get more keywords
      }])
    });

    const suggestionsData = await this.handleResponse<DataForSeoResponse<any>>(suggestionsResponse);
    
    // Get all suggested keywords and their initial metrics
    const allKeywords = suggestionsData.tasks[0]?.result?.[0]?.keywords?.map(k => ({
      keyword: k.keyword,
      search_volume: k.search_volume,
      cpc: k.cpc,
      competition: k.competition
    })) || [];
    
    // Get detailed search volume and competition data
    const volumeResponse = await fetch(`${DATAFORSEO_CONFIG.baseUrl}/keywords_data/google_ads/search_volume/live`, {
      method: 'POST',
      headers: this.getHeaders(this.authToken),
      body: JSON.stringify([{
        keywords: [keyword, ...allKeywords.map(k => k.keyword)],
        location_code: 2840,
        language_code: "en"
      }])
    });

    const volumeData = await this.handleResponse<DataForSeoResponse<SearchVolumeResult>>(volumeResponse);
    
    // Process and categorize keywords
    const processedKeywords = volumeData.tasks[0]?.result?.map(k => ({
      keyword: k.keyword,
      search_volume: k.search_volume || 0,
      cpc: k.cpc || 0,
      competition: k.competition || 'HIGH',
      competition_index: k.competition_index || 100,
      monthly_searches: k.monthly_searches || [],
      trend: this.calculateTrend(k.monthly_searches || []),
      difficulty_score: this.calculateDifficultyScore(k)
    })) || [];

    // Find the main keyword data
    const mainKeyword = processedKeywords.find(k => k.keyword === keyword) || processedKeywords[0];
    
    // Filter and sort keywords based on multiple criteria
    const relatedKeywords = processedKeywords
      .filter(k => k.keyword !== keyword)
      .filter(k => k.search_volume > 0)  // Remove zero search volume
      .filter(k => k.competition_index < (mainKeyword.competition_index || 100))  // Lower competition than main keyword
      .sort((a, b) => {
        // Sort by a weighted score of competition index, search volume, and CPC
        const scoreA = this.calculateOpportunityScore(a, mainKeyword);
        const scoreB = this.calculateOpportunityScore(b, mainKeyword);
        return scoreB - scoreA;
      });

    // Get top 10 opportunities
    const topOpportunities = relatedKeywords.slice(0, 10);

    // Add opportunity analysis to each keyword
    const analyzedOpportunities = topOpportunities.map(k => ({
      ...k,
      opportunity_analysis: this.analyzeKeywordOpportunity(k, mainKeyword)
    }));

    return {
      ...volumeData,
      tasks: [{
        ...volumeData.tasks[0],
        result: [
          mainKeyword,
          ...analyzedOpportunities
        ]
      }]
    };
  }

  private calculateTrend(monthlySearches: Array<{ year: number; month: number; search_volume: number }>) {
    if (!monthlySearches.length) return 0;
    
    const recentSearches = monthlySearches.slice(-6);  // Last 6 months
    if (recentSearches.length < 2) return 0;

    const firstAvg = recentSearches.slice(0, 3).reduce((sum, m) => sum + (m.search_volume || 0), 0) / 3;
    const lastAvg = recentSearches.slice(-3).reduce((sum, m) => sum + (m.search_volume || 0), 0) / 3;
    
    return ((lastAvg - firstAvg) / firstAvg) * 100;
  }

  private calculateDifficultyScore(keyword: any) {
    const competitionWeight = 0.4;
    const cpcWeight = 0.3;
    const volumeWeight = 0.3;

    const competitionScore = (keyword.competition_index || 100) / 100;
    const cpcScore = Math.min(keyword.cpc / 5, 1);  // Normalize CPC with max of $5
    const volumeScore = Math.min(keyword.search_volume / 10000, 1);  // Normalize volume with max of 10k

    return (
      competitionWeight * competitionScore +
      cpcWeight * cpcScore +
      volumeWeight * volumeScore
    ) * 100;
  }

  private calculateOpportunityScore(keyword: any, mainKeyword: any) {
    const competitionWeight = 0.5;
    const volumeWeight = 0.3;
    const trendWeight = 0.2;

    const competitionScore = 1 - (keyword.competition_index || 100) / 100;
    const volumeScore = Math.min(keyword.search_volume / (mainKeyword.search_volume || 1), 1);
    const trendScore = (keyword.trend + 100) / 200;  // Normalize trend to 0-1

    return (
      competitionWeight * competitionScore +
      volumeWeight * volumeScore +
      trendWeight * trendScore
    ) * 100;
  }

  private analyzeKeywordOpportunity(keyword: any, mainKeyword: any) {
    const analysis = {
      competition_level: this.getCompetitionLevel(keyword.competition_index),
      volume_comparison: this.compareSearchVolume(keyword.search_volume, mainKeyword.search_volume),
      trend_analysis: this.analyzeTrend(keyword.trend),
      recommendation: ''
    };

    // Generate recommendation based on metrics
    if (keyword.competition_index < 30 && keyword.search_volume > mainKeyword.search_volume * 0.3) {
      analysis.recommendation = 'High potential opportunity with low competition';
    } else if (keyword.trend > 20) {
      analysis.recommendation = 'Growing search interest, consider targeting soon';
    } else if (keyword.cpc < mainKeyword.cpc * 0.7) {
      analysis.recommendation = 'Lower cost opportunity for paid campaigns';
    } else {
      analysis.recommendation = 'Moderate opportunity, monitor for changes';
    }

    return analysis;
  }

  private getCompetitionLevel(index: number): string {
    if (index < 30) return 'Very Low';
    if (index < 50) return 'Low';
    if (index < 70) return 'Moderate';
    if (index < 85) return 'High';
    return 'Very High';
  }

  private compareSearchVolume(volume: number, mainVolume: number): string {
    const ratio = volume / mainVolume;
    if (ratio > 1.5) return 'Significantly higher than main keyword';
    if (ratio > 1.2) return 'Higher than main keyword';
    if (ratio > 0.8) return 'Similar to main keyword';
    if (ratio > 0.5) return 'Lower than main keyword';
    return 'Significantly lower than main keyword';
  }

  private analyzeTrend(trend: number): string {
    if (trend > 50) return 'Strong upward trend';
    if (trend > 20) return 'Moderate growth';
    if (trend > -20) return 'Stable';
    if (trend > -50) return 'Moderate decline';
    return 'Strong downward trend';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    console.log('DataForSEO API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });

    if (!response.ok) {
      throw new Error(`DataForSEO API Error: ${response.status} ${response.statusText}`);
    }

    return data;
  }
}