import React from 'react';
import { AlertCircle, Clock, Hash, Database } from 'lucide-react';
import type { DataForSeoResponse, AdsSearchResult } from '../../../services/api/types';
import MetricCard from './MetricCard';

interface AdsDataDisplayProps {
  data: DataForSeoResponse<AdsSearchResult>;
}

const AdsDataDisplay: React.FC<AdsDataDisplayProps> = ({ data }) => {
  const task = data.tasks?.[0];
  
  if (!task) return null;

  const hasError = task.status_code !== 20000;
  const searchQuery = task.data.search_query;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Search Query"
          value={searchQuery || 'N/A'}
          icon={<Database className="h-5 w-5 text-green-600" />}
        />
        <MetricCard
          title="Response Time"
          value={data.time}
          icon={<Clock className="h-5 w-5 text-blue-600" />}
        />
        <MetricCard
          title="Results Found"
          value={`${task.result_count}`}
          icon={<Hash className="h-5 w-5 text-purple-600" />}
        />
      </div>

      {/* Search Parameters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Search Parameters</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-sm">
            <span className="text-gray-500">Location:</span>
            <p className="font-medium mt-1">{task.data.location_code}</p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Device:</span>
            <p className="font-medium mt-1">{task.data.device}</p>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Language:</span>
            <p className="font-medium mt-1">{task.data.language_code}</p>
          </div>
        </div>
      </div>

      {/* Results or Error */}
      {hasError ? (
        <div className="flex items-start gap-3 text-amber-700 bg-amber-50 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error Detected</p>
            <p className="text-sm mt-1">{task.status_message}</p>
          </div>
        </div>
      ) : task.result && (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Ad Results</h4>
          {task.result.map((ad, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h5 className="font-medium text-blue-600">{ad.title}</h5>
              <p className="text-sm text-gray-600 mt-2">{ad.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="mr-4">Position: {ad.position}</span>
                <span>Rank: {ad.rank_absolute}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsDataDisplay;