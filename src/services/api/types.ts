// API Response Types
export interface DataForSeoTask<T> {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  path: string[];
  data: {
    api: string;
    function: string;
    se: string;
    se_type: string;
    search_query?: string;
    location_code: number;
    language_code?: string;
    device: string;
    os: string;
  };
  result: T[] | null;
}

export interface DataForSeoResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: DataForSeoTask<T>[];
}

// Search Parameters Types
export interface AdsSearchParams {
  search_query: string;
  location_code?: number;
  language_code?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  os?: 'windows' | 'mac' | 'android' | 'ios';
}

export interface SearchVolumeParams {
  keywords: string[];
  location_code?: number;
  language_code?: string;
}

// Result Types
export interface AdsSearchResult {
  type: string;
  rank_group: number;
  rank_absolute: number;
  position: string;
  title: string;
  description: string;
  url: string;
  highlighted: string[];
}

export interface SearchVolumeResult {
  keyword: string;
  location_code: number;
  language_code: string;
  search_volume: number;
  cpc: number;
  competition: number;
  categories: string[];
  monthly_searches: Array<{
    year: number;
    month: number;
    search_volume: number;
  }>;
}