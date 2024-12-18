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
    funnelStages: Array<{
      name: string;
      description: string;
      strategies: string[];
    }>;
    callsToAction: Array<{
      stage: string;
      cta: string;
      placement: string;
    }>;
    conversionPoints: Array<{
      type: string;
      action: string;
      placement: string;
    }>;
  };
  implementation: {
    requiredResources: string[];
    timeline: string;
    metrics: string[];
  };
  calculator?: {
    type: string;
    title: string;
    description: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      defaultValue: string | number;
      description: string;
    }>;
  };
}
