import React from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface ResultCardProps {
  title: string;
  data: any;
}

const ResultCard = ({ title, data }: ResultCardProps) => {
  const formatAdsData = (data: any) => {
    if (!data) return null;
    
    const task = data.tasks?.[0];
    if (!task) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Status" value={data.status_message} />
          <InfoItem label="Response Time" value={data.time} />
          <InfoItem label="Location" value={`Code: ${task.data?.location_code}`} />
          <InfoItem label="Device" value={task.data?.device} />
        </div>

        {task.status_code === 40501 && (
          <div className="mt-4 flex items-start gap-2 text-amber-600 bg-amber-50 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <p>{task.status_message}</p>
          </div>
        )}

        {task.result && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Search Results</h4>
            {/* Add formatted search results here */}
          </div>
        )}
      </div>
    );
  };

  const formatAiInsights = (data: any) => {
    if (!data) return null;

    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    // Split content by newlines and render as separate paragraphs
    return content.split('\\n').map((paragraph: string, index: number) => (
      <p key={index} className="mb-3">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <div className="text-gray-700">
        {title === "Ads Data" ? formatAdsData(data) : formatAiInsights(data)}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 p-3 rounded">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default ResultCard;