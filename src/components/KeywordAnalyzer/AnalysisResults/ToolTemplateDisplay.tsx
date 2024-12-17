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
  Clock,
  Calculator
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import type { ToolTemplate, CalculatorTemplate } from '../../../services/templateGenerator/types';

interface ToolTemplateDisplayProps {
  template: ToolTemplate;
}

const CalculatorDisplay: React.FC<{ calculator: CalculatorTemplate }> = ({ calculator }) => {
  const [expanded, setExpanded] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, string | number>>({});
  const [calculationResult, setCalculationResult] = useState<number | null>(null);

  const handleInputChange = (fieldName: string, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const calculateResult = () => {
    // Get values from form
    const currentLoanAmount = Number(formValues.currentLoanAmount) || 0;
    const currentInterestRate = Number(formValues.currentInterestRate) || 0;
    const newLoanAmount = Number(formValues.newLoanAmount) || 0;
    const newInterestRate = Number(formValues.newInterestRate) || 0;
    const loanTerm = 30; // Default to 30 years

    // Calculate monthly payments for current loan
    const currentMonthlyPayment = 
      (currentLoanAmount * (currentInterestRate / 1200)) / 
      (1 - Math.pow(1 + currentInterestRate / 1200, -loanTerm * 12));

    // Calculate monthly payments for new loan
    const newMonthlyPayment = 
      (newLoanAmount * (newInterestRate / 1200)) / 
      (1 - Math.pow(1 + newInterestRate / 1200, -loanTerm * 12));

    // Calculate yearly savings
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const yearlySavings = monthlySavings * 12;

    return yearlySavings;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateResult();
    setCalculationResult(result);
  };

  const handleExportCalculator = () => {
    const calculatorCode = `
// Mortgage Refinance Calculator
function calculateRefinanceSavings(
  currentLoanAmount: number,
  currentInterestRate: number,
  newLoanAmount: number,
  newInterestRate: number,
  loanTerm: number = 30
): number {
  // Calculate current monthly payment
  const currentMonthlyPayment = 
    (currentLoanAmount * (currentInterestRate / 1200)) / 
    (1 - Math.pow(1 + currentInterestRate / 1200, -loanTerm * 12));

  // Calculate new monthly payment
  const newMonthlyPayment = 
    (newLoanAmount * (newInterestRate / 1200)) / 
    (1 - Math.pow(1 + newInterestRate / 1200, -loanTerm * 12));

  // Calculate yearly savings
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const yearlySavings = monthlySavings * 12;

  return yearlySavings;
}
`;

    // Create a blob and download it
    const blob = new Blob([calculatorCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mortgage-refinance-calculator.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">{calculator.title}</h3>
        </div>
        <span className="text-gray-500">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </div>
      
      {expanded && (
        <div className="mt-4">
          <p className="text-gray-600 mb-4">{calculator.description}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calculator.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue={field.defaultValue}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      defaultValue={field.defaultValue}
                      onChange={(e) => handleInputChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Calculate
              </button>
              
              <button
                type="button"
                onClick={handleExportCalculator}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Export Calculator Code
              </button>
            </div>

            {calculationResult !== null && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Calculation Result</h4>
                <p className="text-2xl font-bold text-green-700 mt-2">
                  ${calculationResult.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600 mt-1">Estimated yearly savings</p>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export const ToolTemplateDisplay: React.FC<ToolTemplateDisplayProps> = ({ template }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview', 'content', 'monetization', 'traffic', 'conversion', 'implementation'])
  );

  if (!template) {
    return null;
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const renderList = (items: string[] = []) => (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">{item}</li>
      ))}
    </ul>
  );

  const handleExportAnalysisAsPDF = () => {
    // Create a temporary div to hold the content
    const content = document.createElement('div');
    content.className = 'pdf-export';
    
    // Add styling
    const style = document.createElement('style');
    style.textContent = `
      .pdf-export { font-family: Arial, sans-serif; padding: 20px; }
      .pdf-export h1 { color: #2563eb; font-size: 24px; margin-bottom: 20px; }
      .pdf-export h2 { color: #1f2937; font-size: 20px; margin-top: 30px; margin-bottom: 15px; }
      .pdf-export p { margin-bottom: 10px; line-height: 1.5; }
      .pdf-export ul { margin-left: 20px; margin-bottom: 15px; }
      .pdf-export li { margin-bottom: 5px; }
      .pdf-page { page-break-after: always; }
    `;
    content.appendChild(style);

    // Add title
    const title = document.createElement('h1');
    title.textContent = 'Hidden Money Door Analysis';
    content.appendChild(title);

    // Add each section with page breaks
    const sections = [
      { title: 'Overview', content: template.description },
      { title: 'Target Audience', content: template.targetAudience },
      { title: 'Content Strategy', content: template.contentStrategy },
      { title: 'Monetization Strategy', content: template.monetizationStrategy },
      { title: 'Traffic Sources', content: template.trafficSources },
      { title: 'Conversion Strategy', content: template.conversionStrategy },
      { title: 'Implementation', content: template.implementation }
    ];

    sections.forEach((section, index) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'pdf-page';
      
      const sectionTitle = document.createElement('h2');
      sectionTitle.textContent = section.title;
      sectionDiv.appendChild(sectionTitle);

      const sectionContent = document.createElement('div');
      if (typeof section.content === 'string') {
        sectionContent.textContent = section.content;
      } else {
        sectionContent.textContent = JSON.stringify(section.content, null, 2);
      }
      sectionDiv.appendChild(sectionContent);

      content.appendChild(sectionDiv);
    });

    // Convert to PDF
    const opt = {
      margin: 1,
      filename: 'hidden-money-door-analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  };

  const handleExportAnalysis = () => {
    const analysis = {
      name: template.name,
      description: template.description,
      targetAudience: template.targetAudience,
      contentStrategy: template.contentStrategy,
      monetizationStrategy: template.monetizationStrategy,
      trafficSources: template.trafficSources,
      conversionStrategy: template.conversionStrategy,
      implementation: template.implementation
    };

    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hidden-money-door-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
          <p className="text-gray-700"><strong>Primary Method:</strong> {template.monetizationStrategy?.primaryMethod || 'N/A'}</p>
          <div>
            <h4 className="font-medium mb-2">Secondary Methods</h4>
            {renderList(template.monetizationStrategy?.secondaryMethods)}
          </div>
          <p className="text-gray-700"><strong>Estimated Revenue:</strong> {template.monetizationStrategy?.estimatedRevenue || 'N/A'}</p>
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
            <h4 className="font-medium mb-2">Organic</h4>
            {renderList(template.trafficSources?.organic)}
          </div>
          <div>
            <h4 className="font-medium mb-2">Paid</h4>
            {renderList(template.trafficSources?.paid)}
          </div>
          <div>
            <h4 className="font-medium mb-2">Social</h4>
            {renderList(template.trafficSources?.social)}
          </div>
        </div>
      )
    },
    {
      id: 'conversion',
      title: 'Conversion Strategy',
      icon: <Target className="h-5 w-5" />,
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
      title: 'Implementation',
      icon: <Clock className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">Required Resources</h4>
            {renderList(template.implementation?.requiredResources)}
          </div>
          <p className="text-gray-700"><strong>Timeline:</strong> {template.implementation?.timeline || 'N/A'}</p>
          <div>
            <h4 className="font-medium mb-2">Metrics</h4>
            {renderList(template.implementation?.metrics)}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Hidden Money Door Analysis</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportAnalysisAsPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            Export as PDF
          </button>
          <button
            onClick={handleExportAnalysis}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            Export Analysis
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {sections.map(({ id, title, icon, content }) => (
          <div key={id} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection(id)}
            >
              <div className="flex items-center space-x-2">
                {icon}
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <span className="text-gray-500">
                {expandedSections.has(id) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </span>
            </div>
            
            {expandedSections.has(id) && (
              <div className="p-4 bg-white">{content}</div>
            )}
          </div>
        ))}
      </div>

      {template.calculator && (
        <CalculatorDisplay calculator={template.calculator} />
      )}
    </div>
  );
};
