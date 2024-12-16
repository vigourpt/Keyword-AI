export interface ToolTemplate {
  name: string;
  description: string;
  targetAudience: string;
  contentStrategy: {
    topics: string[];
    formats: string[];
    platforms: string[];
  };
  monetizationStrategy: {
    primaryMethod: string;
    secondaryMethods: string[];
    estimatedRevenue: string;
  };
  trafficSources: {
    organic: string[];
    paid: string[];
    social: string[];
  };
  conversionStrategy: {
    funnelStages: string[];
    callsToAction: string[];
    conversionPoints: string[];
  };
  implementation: {
    requiredResources: string[];
    timeline: string;
    metrics: string[];
  };
}

export interface TemplateGeneratorResponse {
  success: boolean;
  template?: ToolTemplate;
  error?: string;
}
