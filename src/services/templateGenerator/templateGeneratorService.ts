import OpenAI from 'openai';
import type { ToolTemplate, TemplateGeneratorResponse } from './types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateToolTemplate = async (
  keyword: string,
  marketData: any,
  aiInsights: any
): Promise<TemplateGeneratorResponse> => {
  try {
    console.log('Generating template for keyword:', keyword);
    console.log('Market data:', JSON.stringify(marketData, null, 2));
    console.log('AI insights:', JSON.stringify(aiInsights, null, 2));

    if (!keyword) {
      throw new Error('Keyword is required');
    }

    if (!marketData) {
      throw new Error('Market data is required');
    }

    if (!aiInsights) {
      throw new Error('AI insights are required');
    }

    const prompt = `You are a specialized AI tool that generates comprehensive templates and calculators for online businesses. Generate a template for the keyword "${keyword}" based on the following data:

Market Data:
${JSON.stringify(marketData, null, 2)}

AI Insights:
${JSON.stringify(aiInsights, null, 2)}

IMPORTANT: Respond with ONLY a valid JSON object matching this EXACT structure. Do not include any text outside the JSON:

{
  "name": "Tool name",
  "description": "Tool description",
  "targetAudience": "Target audience description",
  "contentStrategy": {
    "topics": ["topic1", "topic2"],
    "formats": ["format1", "format2"],
    "platforms": ["platform1", "platform2"]
  },
  "monetizationStrategy": {
    "primaryMethod": "Primary monetization method",
    "secondaryMethods": ["method1", "method2"],
    "estimatedRevenue": "Revenue estimate"
  },
  "trafficSources": {
    "organic": ["source1", "source2"],
    "paid": ["source1", "source2"],
    "social": ["source1", "source2"]
  },
  "conversionStrategy": {
    "funnelStages": ["stage1", "stage2"],
    "callsToAction": ["cta1", "cta2"],
    "conversionPoints": ["point1", "point2"]
  },
  "implementation": {
    "requiredResources": ["resource1", "resource2"],
    "timeline": "Implementation timeline",
    "metrics": ["metric1", "metric2"]
  },
  "calculator": {
    "type": "Calculator type",
    "title": "Calculator title",
    "description": "Calculator description",
    "fields": [
      {
        "name": "field1",
        "label": "Field 1 Label",
        "type": "number",
        "defaultValue": 0
      }
    ]
  }
}`;

    const messages = [
      { 
        role: "system", 
        content: "You are a JSON generator. You MUST respond with ONLY a valid JSON object. No other text or explanation is allowed."
      },
      { role: "user", content: prompt }
    ];

    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 2000
    });

    console.log('Received response from OpenAI');
    const responseContent = completion.choices[0].message.content;
    console.log('Response content:', responseContent);

    try {
      console.log('Parsing OpenAI response...');
      const template = JSON.parse(responseContent.trim()) as ToolTemplate;
      
      // Validate the template has required fields
      if (!template.name || !template.description || !template.targetAudience) {
        throw new Error('Missing required fields in template');
      }

      console.log('Successfully parsed template:', template);
      return {
        success: true,
        template
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response:', responseContent);
      return {
        success: false,
        error: `Failed to parse template: ${error}`
      };
    }
  } catch (error) {
    console.error('Error in generateToolTemplate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred in template generation'
    };
  }
};
