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

export interface CalculatorField {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select';
  defaultValue?: string | number;
  options?: string[];  // For select fields
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    pattern?: string;
  };
}

export interface CalculatorFormula {
  name: string;
  description: string;
  formula: string;
  variables: string[];
  unit?: string;
}

export interface CalculatorTemplate {
  type: string;
  title: string;
  description: string;
  fields: CalculatorField[];
  formulas: CalculatorFormula[];
  displayOptions: {
    showChart?: boolean;
    chartType?: 'bar' | 'line' | 'pie';
    compareResults?: boolean;
    showBreakdown?: boolean;
  };
}

export interface TemplateGeneratorResponse {
  success: boolean;
  template?: ToolTemplate;
  error?: string;
}
