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
  calculator?: CalculatorTemplate;
}

export type CalculatorType = 
  | 'roi calculator'
  | 'conversion rate calculator'
  | 'savings calculator'
  | 'custom calculator';

export interface CalculatorField {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'percentage';
  defaultValue?: string | number;
  description?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    pattern?: string;
  };
  unit?: string;
  format?: {
    prefix?: string;
    suffix?: string;
    decimals?: number;
  };
}

export interface CalculatorFormula {
  name: string;
  description: string;
  formula: string;
  variables: string[];
  unit?: string;
  format?: {
    prefix?: string;
    suffix?: string;
    decimals?: number;
  };
}

export interface CalculatorTemplate {
  type: CalculatorType;
  title: string;
  description: string;
  fields: CalculatorField[];
  formulas: CalculatorFormula[];
  displayOptions: {
    showChart?: boolean;
    chartType?: 'bar' | 'line' | 'pie';
    compareResults?: boolean;
    showBreakdown?: boolean;
    layout?: 'single' | 'split' | 'tabs';
    theme?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

export interface TemplateGeneratorResponse {
  success: boolean;
  template?: ToolTemplate;
  error?: string;
}
