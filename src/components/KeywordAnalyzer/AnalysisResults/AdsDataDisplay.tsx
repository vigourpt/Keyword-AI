import React from 'react';
import { AlertTriangle, TrendingUp, DollarSign, Users, BarChart } from 'lucide-react';
import type { DataForSeoResponse, SearchVolumeResult } from '../../../services/api/types';

interface AdsDataDisplayProps {
  data: DataForSeoResponse<SearchVolumeResult>;
}

const AdsDataDisplay: React.FC<AdsDataDisplayProps> = ({ data }) => {
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
  const recentSearches = result.monthly_searches.slice(-6);
  
  // Calculate trend percentage
  const firstVolume = recentSearches[0]?.search_volume || 0;
  const lastVolume = recentSearches[recentSearches.length - 1]?.search_volume || 0;
  const trendPercentage = firstVolume ? ((lastVolume - firstVolume) / firstVolume) * 100 : 0;

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
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">
              {result.search_volume.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">monthly searches</span>
          </div>
          {/* Mini Sparkline */}
          <div className="mt-3 flex items-end gap-1 h-8">
            {recentSearches.map((month, i) => (
              <div
                key={i}
                style={{ 
                  height: `${(month.search_volume / Math.max(...recentSearches.map(m => m.search_volume))) * 100}%` 
                }}
                className="flex-1 bg-blue-400 rounded-t"
              />
            ))}
          </div>
        </div>

        {/* CPC */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-gray-800">CPC</h4>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">
              ${result.cpc.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">per click</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-green-500 rounded" 
                style={{ width: `${(result.cpc / 5) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">$5.00</span>
          </div>
        </div>

        {/* Competition */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-gray-800">Competition</h4>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${
              result.competition_level === 'LOW' ? 'text-green-600' :
              result.competition_level === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result.competition_level}
            </span>
            <span className="text-sm text-gray-500">
              ({(result.competition * 100).toFixed(0)}%)
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div 
                className={`h-full rounded ${
                  result.competition_level === 'LOW' ? 'bg-green-500' :
                  result.competition_level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.competition * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-amber-600" />
              <h4 className="font-medium text-gray-800">Trend</h4>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Last 6 months</span>
            <span className={`text-sm font-medium ${
              trendPercentage > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trendPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="mt-3 flex items-end gap-1 h-12">
            {recentSearches.map((month, i) => (
              <div
                key={i}
                style={{ 
                  height: `${(month.search_volume / Math.max(...recentSearches.map(m => m.search_volume))) * 100}%` 
                }}
                className="flex-1 bg-amber-400 rounded-t"
                title={`${month.year}-${month.month}: ${month.search_volume.toLocaleString()}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Keyword Properties */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Additional Insights</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-sm">
            <span className="text-gray-500">Keyword Difficulty</span>
            <p className="font-medium mt-1">{result.keyword_properties.keyword_difficulty}%</p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Type</span>
            <p className="font-medium mt-1">
              {result.keyword_properties.is_question ? 'Question' : 
               result.keyword_properties.is_commercial ? 'Commercial' : 'Informational'}
            </p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Categories</span>
            <p className="font-medium mt-1">{result.categories.join(', ')}</p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Location</span>
            <p className="font-medium mt-1">
              {task.data.location_code === 2840 ? 'United States' : task.data.location_code}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsDataDisplay;