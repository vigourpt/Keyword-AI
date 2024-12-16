import React from 'react';
import AdsDataDisplay from './AdsDataDisplay';
import AiInsightsDisplay from './AiInsightsDisplay';
import type { DataForSeoResponse, AdsSearchResult } from '../../../services/api/types';

interface AnalysisResultsProps {
  adsData: DataForSeoResponse<AdsSearchResult>;
  aiInsights: any;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ adsData, aiInsights }) => {
  return (
    <div className="space-y-8">
      {/* AI Insights Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Insights</h2>
        <AiInsightsDisplay data={aiInsights} />
      </section>

      {/* Ads Data Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ads Analysis</h2>
        <AdsDataDisplay data={adsData} />
      </section>
    </div>
  );
};

export default AnalysisResults;