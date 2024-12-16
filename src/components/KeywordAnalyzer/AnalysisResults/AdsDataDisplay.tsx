import React from 'react';
import { AlertTriangle, TrendingUp, DollarSign, Users, BarChart } from 'lucide-react';
import type { DataForSeoResponse, SearchVolumeResult } from '../../../services/api/types';

interface AdsDataDisplayProps {
  data: DataForSeoResponse<SearchVolumeResult>;
}

export const AdsDataDisplay: React.FC<AdsDataDisplayProps> = ({ data }) => {
  const task = data.tasks?.[0];
  
  if (!task) return null;

  const hasError = task.status_code !== 20000;
  const result = task.result?.[0];

  if (hasError || !result) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start gap-4 text-amber-600 bg-amber-50 p-4 rounded-lg">
          <AlertTriangle className="h-6 w-6 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Analysis Error</h3>
            <p className="text-sm text-amber-700">{task.status_message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Get the last 6 months of search volume data
  const recentSearches = result.monthly_searches?.slice(-6) || [];
  
  // Calculate trend percentage
  const firstVolume = recentSearches[0]?.search_volume || 0;
  const lastVolume = recentSearches[recentSearches.length - 1]?.search_volume || 0;
  const trendPercentage = firstVolume ? ((lastVolume - firstVolume) / firstVolume) * 100 : 0;

  // Safely access keyword properties
  const keywordProperties = result.keyword_properties || {};
  const {
    keyword_difficulty = 0,
    is_question = false,
    is_commercial = false,
    cpc = 0,
    competition_level = 'unknown',
    search_volume = 0
  } = keywordProperties;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Keyword Metrics</h3>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search Volume */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-gray-800">Search Volume</h4>
            </div>
            <span className={`text-sm font-medium ${trendPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{search_volume.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Monthly searches</p>
        </div>

        {/* CPC */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-800">Cost Per Click</h4>
          </div>
          <p className="text-2xl font-semibold text-gray-900">${cpc.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Average CPC</p>
        </div>

        {/* Competition */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-800">Competition</h4>
          </div>
          <p className="text-2xl font-semibold text-gray-900 capitalize">{competition_level}</p>
          <p className="text-sm text-gray-500 mt-1">Competition level</p>
        </div>

        {/* Difficulty */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart className="h-5 w-5 text-orange-600" />
            <h4 className="font-medium text-gray-800">Difficulty</h4>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{keyword_difficulty}%</p>
          <p className="text-sm text-gray-500 mt-1">Keyword difficulty</p>
        </div>
      </div>

      {/* Search Volume Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Monthly Search Trends</h4>
        <div className="h-40">
          {recentSearches.map((data, index) => (
            <div
              key={data.date}
              className="inline-block w-1/6 h-full relative"
              title={`${data.date}: ${data.search_volume} searches`}
            >
              <div
                className="absolute bottom-0 w-4/5 mx-auto left-0 right-0 bg-blue-500 rounded-t"
                style={{
                  height: `${(data.search_volume / Math.max(...recentSearches.map(d => d.search_volume || 0))) * 100}%`,
                }}
              />
              <div className="absolute bottom-0 w-full text-center -mb-6">
                <span className="text-xs text-gray-500">
                  {new Date(data.date).toLocaleDateString(undefined, { month: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Properties */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Additional Insights</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-sm">
            <span className="text-gray-500">Keyword Difficulty</span>
            <p className="font-medium mt-1">{keyword_difficulty}%</p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Type</span>
            <p className="font-medium mt-1">
              {is_question ? 'Question' : 
               is_commercial ? 'Commercial' : 'Informational'}
            </p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Competition</span>
            <p className="font-medium mt-1 capitalize">{competition_level}</p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">CPC</span>
            <p className="font-medium mt-1">${cpc.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};