import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Target, 
  LineChart, 
  ChevronDown, 
  ChevronUp,
  Wrench,
  Share2,
  ArrowRight,
  BarChart4,
  AlertTriangle,
  Users,
  Globe,
  Zap
} from 'lucide-react';

interface InsightSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
  color: string;
  metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
}

interface KeywordOpportunity {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  difficulty: number;
}

interface AiInsightsDisplayProps {
  insights: {
    marketAnalysis?: string[];
    highValueKeywords?: KeywordOpportunity[];
    lowCompetitionKeywords?: KeywordOpportunity[];
    contentStrategy?: string[];
    monetizationStrategy?: string[];
    metrics?: {
      difficulty?: number;
      potential?: number;
      competition?: number;
      trend?: 'up' | 'down' | 'neutral';
    };
  };
}

export const AiInsightsDisplay: React.FC<AiInsightsDisplayProps> = ({ insights }) => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0, 1, 2, 3, 4])); // All sections open by default

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const sections: InsightSection[] = [
    {
      title: 'Market Analysis',
      icon: <Globe className="w-5 h-5" />,
      content: insights.marketAnalysis || [],
      color: 'blue',
      metrics: [
        { 
          label: 'Market Potential', 
          value: `${insights.metrics?.potential || 0}%`,
          trend: insights.metrics?.trend 
        },
        { 
          label: 'Competition Level', 
          value: `${insights.metrics?.competition || 0}%` 
        }
      ]
    },
    {
      title: 'High-Value Keywords',
      icon: <DollarSign className="w-5 h-5" />,
      content: insights.highValueKeywords?.map(k => 
        `${k.keyword} - Volume: ${formatNumber(k.searchVolume)}, CPC: ${formatCurrency(k.cpc)}`
      ) || [],
      color: 'green',
      metrics: [
        { 
          label: 'Avg CPC', 
          value: formatCurrency(
            (insights.highValueKeywords?.reduce((acc, k) => acc + k.cpc, 0) || 0) / 
            (insights.highValueKeywords?.length || 1)
          )
        }
      ]
    },
    {
      title: 'Low-Competition Opportunities',
      icon: <Target className="w-5 h-5" />,
      content: insights.lowCompetitionKeywords?.map(k => 
        `${k.keyword} - Volume: ${formatNumber(k.searchVolume)}, CPC: ${formatCurrency(k.cpc)}`
      ) || [],
      color: 'purple',
      metrics: [
        { 
          label: 'Avg Competition', 
          value: `${Math.round(
            (insights.lowCompetitionKeywords?.reduce((acc, k) => acc + k.competition, 0) || 0) / 
            (insights.lowCompetitionKeywords?.length || 1)
          )}%` 
        }
      ]
    },
    {
      title: 'Content Strategy',
      icon: <Zap className="w-5 h-5" />,
      content: insights.contentStrategy || [],
      color: 'orange'
    },
    {
      title: 'Monetization Strategy',
      icon: <LineChart className="w-5 h-5" />,
      content: insights.monetizationStrategy || [],
      color: 'indigo'
    }
  ];

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getBgColor = (color: string, isExpanded: boolean) => {
    const colors = {
      blue: isExpanded ? 'bg-blue-50' : 'bg-white hover:bg-blue-50',
      green: isExpanded ? 'bg-green-50' : 'bg-white hover:bg-green-50',
      purple: isExpanded ? 'bg-purple-50' : 'bg-white hover:bg-purple-50',
      orange: isExpanded ? 'bg-orange-50' : 'bg-white hover:bg-orange-50',
      indigo: isExpanded ? 'bg-indigo-50' : 'bg-white hover:bg-indigo-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBorderColor = (color: string) => {
    const colors = {
      blue: 'border-blue-200',
      green: 'border-green-200',
      purple: 'border-purple-200',
      orange: 'border-orange-200',
      indigo: 'border-indigo-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
      indigo: 'text-indigo-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-semibold text-gray-900">AI Market Analysis</h2>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className={`rounded-lg border ${getBorderColor(section.color)} shadow-sm hover:shadow-md transition-all ${getBgColor(section.color, expandedSections.has(index))}`}
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full text-left p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-opacity-10 ${getBgColor(section.color, true)} ${getIconColor(section.color)}`}>
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                {expandedSections.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {section.metrics && (
                <div className="mt-4 grid grid-cols-2 gap-6 p-4 bg-white bg-opacity-50 rounded-lg">
                  {section.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <div className={`w-2 h-2 rounded-full ${getIconColor(section.color)}`} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900">{metric.value}</span>
                          {metric.trend && (
                            <TrendingUp className={`w-4 h-4 ${
                              metric.trend === 'up' ? 'text-green-500' : 
                              metric.trend === 'down' ? 'text-red-500' : 
                              'text-gray-500'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>

            {expandedSections.has(index) && section.content.length > 0 && (
              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <ArrowRight className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getIconColor(section.color)}`} />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};