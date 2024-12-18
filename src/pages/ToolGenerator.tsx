import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { useKeywordAnalysis } from '../hooks/useKeywordAnalysis';
import { Search, TrendingUp, Calculator, LineChart, Target, ArrowRight, Wrench } from 'lucide-react';
import { NavigationBar } from '../components/Navigation/NavigationBar';
import { ToolTemplateDisplay } from '../components/KeywordAnalyzer/AnalysisResults/ToolTemplateDisplay';

interface ToolTemplate {
  id: string;
  name: string;
  description: string;
  type: 'calculator' | 'visualizer' | 'analyzer';
  icon: React.ReactNode;
  component?: React.ReactNode;
  isRelevant: (keyword: string, analysis: any) => boolean;
}

export const ToolGenerator: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<ToolTemplate | null>(null);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const { analyzeKeyword, results, loading } = useKeywordAnalysis();

  const toolTemplates: ToolTemplate[] = [
    {
      id: 'roi-calculator',
      name: 'ROI Calculator',
      description: 'Calculate return on investment and break-even analysis',
      type: 'calculator',
      icon: <Calculator className="h-6 w-6" />,
      isRelevant: (keyword, analysis) => {
        const relevantTerms = ['investment', 'roi', 'return', 'profit', 'business'];
        return relevantTerms.some(term => keyword.toLowerCase().includes(term));
      }
    },
    {
      id: 'trend-visualizer',
      name: 'Trend Visualizer',
      description: 'Visualize search volume trends and seasonal patterns',
      type: 'visualizer',
      icon: <TrendingUp className="h-6 w-6" />,
      isRelevant: (keyword, analysis) => {
        return analysis?.searchVolume && analysis?.searchVolume.length > 0;
      }
    },
    {
      id: 'competitor-analyzer',
      name: 'Competitor Analysis Tool',
      description: 'Compare competitor rankings and metrics',
      type: 'analyzer',
      icon: <Target className="h-6 w-6" />,
      isRelevant: (keyword, analysis) => {
        return analysis?.competitors && analysis?.competitors.length > 0;
      }
    },
    {
      id: 'keyword-explorer',
      name: 'Keyword Explorer',
      description: 'Explore related keywords and search intent',
      type: 'analyzer',
      icon: <Search className="h-6 w-6" />,
      isRelevant: (keyword, analysis) => true // Always relevant
    }
  ];

  const getRelevantTools = () => {
    if (!keyword || !results) return toolTemplates;
    return toolTemplates.filter(tool => tool.isRelevant(keyword, results));
  };

  const getEmbedCode = (toolId: string) => {
    return `<iframe
  src="https://your-domain.com/embed/${toolId}?keyword=${encodeURIComponent(keyword)}"
  width="100%"
  height="600px"
  frameborder="0"
  style="border: 1px solid #eee; border-radius: 8px;"
 ></iframe>`;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleAnalyzeKeyword = async () => {
    if (keyword) {
      await analyzeKeyword(keyword);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tool Generator</h1>
          <p className="mt-2 text-lg text-gray-600">Generate custom tools based on your keyword analysis</p>
        </div>
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <Input
              type="text"
              placeholder="Enter a keyword to analyze..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="max-w-md"
            />
            <Button 
              onClick={handleAnalyzeKeyword}
              disabled={!keyword || loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getRelevantTools().map((tool) => (
            <Card
              key={tool.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <span className="mr-3 p-2 bg-green-100 rounded-lg text-green-600">
                  {tool.icon}
                </span>
                <h3 className="text-xl font-semibold">{tool.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTool(tool);
                    setShowPreview(true);
                  }}
                >
                  Try It Out
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTool(tool);
                    setShowEmbedCode(true);
                  }}
                >
                  Get Embed Code
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Embed Code Dialog */}
        <Dialog
          open={showEmbedCode}
          onOpenChange={setShowEmbedCode}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Embed Code for {selectedTool?.name}</DialogTitle>
            </DialogHeader>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap break-all text-sm">
                {selectedTool && getEmbedCode(selectedTool.id)}
              </pre>
            </div>
            <DialogFooter>
              <Button
                onClick={() => selectedTool && handleCopyCode(getEmbedCode(selectedTool.id))}
              >
                Copy Code
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEmbedCode(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tool Preview Dialog */}
        <Dialog
          open={showPreview}
          onOpenChange={setShowPreview}
        >
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{selectedTool?.name}</DialogTitle>
            </DialogHeader>
            <div className="min-h-[400px] bg-gray-50 p-4 rounded-md">
              {selectedTool?.id === 'roi-calculator' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ROI Calculator</h3>
                  {/* Add calculator component here */}
                </div>
              )}
              {selectedTool?.id === 'trend-visualizer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Search Volume Trends</h3>
                  {results?.searchVolume && (
                    <LineChart className="w-full h-64" />
                  )}
                </div>
              )}
              {selectedTool?.id === 'competitor-analyzer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Competitor Analysis</h3>
                  {/* Add competitor analysis component here */}
                </div>
              )}
              {selectedTool?.id === 'keyword-explorer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Related Keywords</h3>
                  {/* Add keyword explorer component here */}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ToolGenerator;
