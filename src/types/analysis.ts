export interface SearchParams {
  locationCode?: number;
  device?: string;
  os?: string;
  depth?: number;
  target?: string;
  selectedPlatform?: string;
  selectedFormat?: string;
}

export interface AnalysisResult {
  adsData: any;
  aiInsights: any;
}