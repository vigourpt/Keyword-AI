import React from 'react';
import ResultCard from './ResultCard';

interface AnalysisResultsProps {
  adsData: any;
  aiInsights: any;
}

const AnalysisResults = ({ adsData, aiInsights }: AnalysisResultsProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Results</h2>
        <p className="text-gray-600">Here's what we found for your keyword:</p>
      </div>

      <ResultCard
        title="AI Insights"
        data={aiInsights}
      />
      
      <ResultCard
        title="Ads Data"
        data={adsData}
      />
    </div>
  );
};

export default AnalysisResults;