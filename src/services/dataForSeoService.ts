import { DATAFORSEO_CONFIG } from '../config/api';

interface SearchParams {
  locationCode?: number;
  device?: string;
  os?: string;
  depth?: number;
  target?: string;
  selectedPlatform?: string;
  selectedFormat?: string;
}

export class DataForSeoService {
  private static instance: DataForSeoService;
  private authToken: string;

  private constructor() {
    this.authToken = btoa(`${DATAFORSEO_CONFIG.login}:${DATAFORSEO_CONFIG.password}`);
  }

  public static getInstance(): DataForSeoService {
    if (!DataForSeoService.instance) {
      DataForSeoService.instance = new DataForSeoService();
    }
    return DataForSeoService.instance;
  }

  async searchAds(params: SearchParams = {}) {
    try {
      const response = await fetch(`${DATAFORSEO_CONFIG.baseUrl}/serp/google/ads_search/live/advanced`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          location_code: params.locationCode || 2840,
          device: params.device || 'desktop',
          os: params.os || 'windows',
          depth: params.depth || 40,
          target: params.target || 'dataforseo.com',
          selected_platform: params.selectedPlatform || 'all',
          selected_format: params.selectedFormat || 'all',
        }]),
      });

      if (!response.ok) {
        throw new Error('DataForSEO API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('DataForSEO API error:', error);
      throw error;
    }
  }
}

export const dataForSeoService = DataForSeoService.getInstance();