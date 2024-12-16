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
}