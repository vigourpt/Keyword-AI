import React from 'react';
import { Brain, TrendingUp, DollarSign, Target, LineChart } from 'lucide-react';

interface AiInsightsDisplayProps {
  data: {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };
}

const AiInsightsDisplay: React.FC<AiInsightsDisplayProps> = ({ data }) => {
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;

  // Split content into sections based on numbered points
  const sections = content.split(/\d+\.\s+/).filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Main Insight */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Brain className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
          <div className="text-gray-800">
            <h3 className="font-semibold mb-2">Key Insights</h3>
            <p className="text-sm leading-relaxed">{sections[0]}</p>
          </div>
        </div>
      </div>

      {/* Monetization Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.slice(1).map((section, index) => {
          const icons = [TrendingUp, DollarSign, Target, LineChart];
          const Icon = icons[index % icons.length];

          return (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Strategy {index + 1}</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{section}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AiInsightsDisplay;