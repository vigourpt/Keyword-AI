import React, { useState } from 'react';
import {
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Brain,
  TrendingUp,
  DollarSign,
  Share,
  Target,
  ArrowUpRight,
  Calculator,
  Wrench
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import type { ToolTemplate } from '../../../types/toolTemplate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { CreditCardCalculator } from './CreditCardCalculator';

interface ToolTemplateDisplayProps {
  template: ToolTemplate;
}

interface Section {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface CalculationResult {
  [key: string]: number;
}

const CalculatorDisplay: React.FC<{ calculator: any }> = ({ calculator }) => {
  const [expanded, setExpanded] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, string | number>>({});
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const handleInputChange = (fieldName: string, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const calculateResult = () => {
    setIsCalculating(true);
    try {
      // Convert all form values to numbers
      const numericValues: Record<string, number> = {};
      Object.entries(formValues).forEach(([key, value]) => {
        numericValues[key] = Number(value) || 0;
      });

      // Create a basic result object with all numeric values
      const result: CalculationResult = { ...numericValues };

      // Add calculated fields based on calculator type
      switch (calculator.type.toLowerCase()) {
        case 'roi calculator':
          result.roi = ((numericValues.revenue - numericValues.cost) / numericValues.cost) * 100;
          result.profit = numericValues.revenue - numericValues.cost;
          break;
          
        case 'conversion rate calculator':
          result.conversionRate = (numericValues.conversions / numericValues.visitors) * 100;
          result.potentialRevenue = result.conversionRate * numericValues.averageOrderValue;
          break;
          
        case 'savings calculator':
          result.monthlySavings = numericValues.income * (numericValues.savingsRate / 100);
          result.yearlySavings = result.monthlySavings * 12;
          result.projectedSavings = result.yearlySavings * numericValues.years;
          break;
          
        // Add more calculator types as needed
        default:
          // For custom calculators, just return the numeric values
          break;
      }

      setCalculationResult(result);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getEmbedCode = () => {
    return `<iframe 
      src="${window.location.origin}/calculator-embed/${calculator.type}"
      width="100%"
      height="600px"
      frameborder="0"
    ></iframe>`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">{calculator.title}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4">
          <p className="text-gray-600">{calculator.description}</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {calculator.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.description && (
                    <span className="text-xs text-gray-500 block">{field.description}</span>
                  )}
                </label>
                <input
                  type={field.type}
                  value={formValues[field.name] || field.defaultValue}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={calculateResult}
              disabled={isCalculating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </button>
            
            <button
              onClick={() => setShowEmbedCode(true)}
              className="px-4 py-2 text-blue-500 hover:text-blue-600"
            >
              <Share2 className="w-4 h-4 inline mr-2" />
              Get Embed Code
            </button>
          </div>

          {calculationResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Results:</h4>
              <div className="grid gap-2">
                {Object.entries(calculationResult).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-medium">
                      {typeof value === 'number' && value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={showEmbedCode} onOpenChange={setShowEmbedCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed Calculator</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>{getEmbedCode()}</code>
            </pre>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEmbedCode(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ConversionStrategySection: React.FC<{ strategy: any }> = ({ strategy }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Conversion Strategy</h3>
      
      {/* Funnel Stages */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Funnel Stages</h4>
        {strategy.funnelStages.map((stage: any, index: number) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-gray-900 mb-2">{stage.name}</h5>
            <p className="text-gray-600 mb-3">{stage.description}</p>
            <ul className="list-disc pl-5 space-y-1">
              {stage.strategies.map((s: string, i: number) => (
                <li key={i} className="text-gray-700">{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Calls to Action */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Calls to Action</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {strategy.callsToAction.map((cta: any, index: number) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">{cta.stage}</div>
              <div className="text-gray-600 mb-2">{cta.cta}</div>
              <div className="text-sm text-gray-500">Placement: {cta.placement}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Points */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Conversion Points</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {strategy.conversionPoints.map((point: any, index: number) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-purple-600 mb-1">{point.type}</div>
              <div className="text-gray-900 mb-2">{point.action}</div>
              <div className="text-sm text-gray-500">{point.placement}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ToolTemplateDisplay: React.FC<ToolTemplateDisplayProps> = ({ template }) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const sections: Section[] = [
    {
      id: 'marketAnalysis',
      title: 'Market Analysis',
      subtitle: 'Understanding Your Market Position',
      content: template.marketAnalysis || 'No market analysis available',
      icon: <Brain className="w-5 h-5" />,
      bgColor: 'bg-blue-50'
    },
    {
      id: 'conversionStrategy',
      title: 'Conversion Strategy',
      subtitle: 'Optimizing for Conversions',
      content: template.conversionStrategy || 'No conversion strategy available',
      icon: <TrendingUp className="w-5 h-5" />,
      bgColor: 'bg-green-50'
    },
    {
      id: 'monetization',
      title: 'Monetization Strategy',
      subtitle: 'Revenue Generation Plan',
      content: template.monetizationStrategy || 'No monetization strategy available',
      icon: <DollarSign className="w-5 h-5" />,
      bgColor: 'bg-yellow-50'
    }
  ];

  const handleDownloadPDF = async () => {
    const element = document.getElementById('tool-template');
    if (element) {
      const opt = {
        margin: 1,
        filename: 'tool-template.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      try {
        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tool Analysis</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculator
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {showCalculator && (
        <div className="mb-6">
          <CalculatorDisplay calculator={template.calculator} />
        </div>
      )}

      <div id="tool-template" className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`p-6 rounded-lg ${section.bgColor}`}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-white">
                {section.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {section.subtitle}
                </p>
                <div className="prose prose-sm max-w-none">
                  {typeof section.content === 'string' ? (
                    <p>{section.content}</p>
                  ) : (
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(section.content, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Tool Analysis</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Copy
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
