import React, { useState } from 'react';
import {
  Wrench,
  Target,
  FileText,
  DollarSign,
  Users,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import type { ToolTemplate } from '../../../services/templateGenerator/types';

interface ToolTemplateDisplayProps {
  template: ToolTemplate;
}

export const ToolTemplateDisplay: React.FC<ToolTemplateDisplayProps> = ({ template }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!template) {
    return null;
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderList = (items: string[] = []) => (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">{item}</li>
      ))}
    </ul>
  );

  const sections = [
    {
      id: 'overview',
      title: 'Tool Overview',
      icon: <Wrench className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700"><strong>Name:</strong> {template.name || 'N/A'}</p>
          <p className="text-gray-700"><strong>Description:</strong> {template.description || 'N/A'}</p>
          <p className="text-gray-700"><strong>Target Audience:</strong> {template.targetAudience || 'N/A'}</p>
        </div>
      )
    },
    {
      id: 'content',
      title: 'Content Strategy',
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">Topics</h4>
            {renderList(template.contentStrategy?.topics)}
          </div>
          <div>
            <h4 className="font-medium mb-2">Content Formats</h4>
            {renderList(template.contentStrategy?.formats)}
          </div>
          <div>
            <h4 className="font-medium mb-2">Platforms</h4>
            {renderList(template.contentStrategy?.platforms)}
          </div>
        </div>
      )
    },
    {
      id: 'monetization',
      title: 'Monetization Strategy',
      icon: <DollarSign className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            <strong>Primary Method:</strong> {template.monetizationStrategy?.primaryMethod || 'N/A'}
          </p>
          <div>
            <h4 className="font-medium mb-2">Secondary Methods</h4>
            {renderList(template.monetizationStrategy?.secondaryMethods)}
          </div>
          <p className="text-gray-700">
            <strong>Estimated Revenue:</strong> {template.monetizationStrategy?.estimatedRevenue || 'N/A'}
          </p>
        </div>
      )
    },
    {
      id: 'traffic',
      title: 'Traffic Sources',
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">Organic Traffic</h4>
            {renderList(template.trafficSources?.organic)}
          </div>
          <div>
            <h4 className="font-medium mb-2">Paid Traffic</h4>
            {renderList(template.trafficSources?.paid)}
          </div>
          <div>
            <h4 className="font-medium mb-2">Social Traffic</h4>
            {renderList(template.trafficSources?.social)}
          </div>
        </div>
      )
    },
    {
      id: 'conversion',
      title: 'Conversion Strategy',
      icon: <ArrowUpRight className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">Funnel Stages</h4>
            {renderList(template.conversionStrategy?.funnelStages)}
          </div>
          <div>
            <h4 className="font-medium mb-2">Calls to Action</h4>
            {renderList(template.conversionStrategy?.callsToAction)}
          </div>
          <div>
            <h4 className="font-medium mb-2">Conversion Points</h4>
            {renderList(template.conversionStrategy?.conversionPoints)}
          </div>
        </div>
      )
    },
    {
      id: 'implementation',
      title: 'Implementation Plan',
      icon: <Clock className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">Required Resources</h4>
            {renderList(template.implementation?.requiredResources)}
          </div>
          <p className="text-gray-700">
            <strong>Timeline:</strong> {template.implementation?.timeline || 'N/A'}
          </p>
          <div>
            <h4 className="font-medium mb-2">Key Metrics</h4>
            {renderList(template.implementation?.metrics)}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-4">
        {sections.map(({ id, title, icon, content }) => (
          <div key={id} className="border rounded-lg">
            <button
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              onClick={() => toggleSection(id)}
            >
              <div className="flex items-center gap-3">
                {icon}
                <span className="font-medium">{title}</span>
              </div>
              {expandedSection === id ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedSection === id && (
              <div className="px-4 py-3 border-t">{content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
