import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Target, 
  LineChart, 
  ChevronDown, 
  ChevronUp,
  Tool,
  Share2,
  ArrowRight,
  BarChart4
} from 'lucide-react';

interface AiInsightsDisplayProps {
  insights: {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };
}

const AiInsightsDisplay: React.FC<AiInsightsDisplayProps> = ({ insights }) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const content = insights?.choices?.[0]?.message?.content;
  
  if (!content) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start gap-4 text-amber-600 bg-amber-50 p-4 rounded-lg">
          <AlertTriangle className="h-6 w-6 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">No Analysis Available</h3>
            <p className="text-sm text-amber-700">Unable to generate insights for this keyword.</p>
          </div>
        </div>
      </div>
    );
  }

  // Split content into sections
  const sections = content.split(/\d+\.\s+/).filter(Boolean);
  
  const strategyConfig = [
    { 
      icon: Brain, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      label: 'Market Overview',
      description: 'Current market analysis and opportunity'
    },
    { 
      icon: Tool, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      label: 'Content Strategy',
      description: 'Free tools and content ideas'
    },
    { 
      icon: ArrowRight, 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      label: 'Redirect Opportunities',
      description: 'High-value related niches'
    },
    { 
      icon: DollarSign, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      label: 'Monetization Channels',
      description: 'Revenue generation methods'
    },
    { 
      icon: Share2, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      label: 'Traffic Generation',
      description: 'Distribution platforms and methods'
    },
    { 
      icon: BarChart4, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50', 
      label: 'Conversion Strategy',
      description: 'Converting users to revenue'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">Hidden Money Door Analysis</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((content, index) => {
          const strategy = strategyConfig[index];
          if (!strategy) return null;

          const { icon: Icon, color, bg, label, description } = strategy;
          const isExpanded = expandedSection === index;

          return (
            <div 
              key={index}
              className={`${bg} rounded-lg transition-all duration-200 ${
                isExpanded ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? null : index)}
                className="w-full text-left p-4"
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 ${color} mt-1 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">{label}</h4>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                    <div className={`mt-2 text-sm text-gray-700 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {content}
                    </div>
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="ml-8 pl-3 border-l-2 border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-800">Next Steps</h4>
            <p className="text-sm text-gray-600 mt-1">
              Create your free tool/content and start implementing the monetization strategy. 
              Monitor performance and optimize based on user engagement and conversion rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsightsDisplay;