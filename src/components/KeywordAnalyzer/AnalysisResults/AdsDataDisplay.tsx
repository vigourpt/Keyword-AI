import React from 'react';
import { Search, DollarSign, Target, TrendingUp } from 'lucide-react';
import type { DataForSeoResponse, SearchVolumeResult } from '../../../services/api/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface MonthlyData {
  date: string;
  searchVolume: number;
}

interface AdsDataDisplayProps {
  data: DataForSeoResponse<SearchVolumeResult>;
}

export const AdsDataDisplay: React.FC<AdsDataDisplayProps> = ({ data }) => {
  // Check for API error response
  if (data.tasks[0]?.status_code !== 20000) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Keyword Metrics</h2>
        <p className="text-red-600">
          Unable to fetch keyword data: {data.tasks[0]?.status_message || 'Unknown error'}
        </p>
      </div>
    );
  }

  const result = data.tasks[0]?.result?.[0];
  if (!result) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const monthlySearches = result.monthly_searches || [];
  monthlySearches.reverse(); // Show oldest to newest

  // Transform the data for the chart
  const chartData = monthlySearches.map(item => ({
    date: format(new Date(item.year, item.month - 1), 'MMM yyyy'),
    searchVolume: item.search_volume
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Keyword Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium">Search Volume</h3>
          </div>
          <p className="text-2xl font-bold">{formatNumber(result.search_volume || 0)}</p>
          <p className="text-sm text-gray-600">Monthly searches</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="font-medium">CPC</h3>
          </div>
          <p className="text-2xl font-bold">${result.cpc || '0.00'}</p>
          <p className="text-sm text-gray-600">Cost per click</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h3 className="font-medium">Competition</h3>
          </div>
          <p className="text-2xl font-bold">
            {typeof result.competition === 'number' 
              ? Number(result.competition).toFixed(2) 
              : '0.00'}
          </p>
          <p className="text-sm text-gray-600">Competition level</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <h3 className="font-medium">Competition Index</h3>
          </div>
          <p className="text-2xl font-bold">{formatNumber(result.competition_index || 0)}</p>
          <p className="text-sm text-gray-600">Competitive index</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Monthly Search Trends</h3>
        <div className="w-full h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), 'Search Volume']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="searchVolume"
                name="Search Volume"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};