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

    const prompt = `Generate a comprehensive tool template for the keyword "${keyword}" based on the following market data and AI insights:

Market Data:
${JSON.stringify(marketData, null, 2)}

AI Insights:
${JSON.stringify(aiInsights, null, 2)}

Create a detailed template that maximizes the Hidden Money Door strategy, focusing on:
1. Target audience and their pain points
2. Content strategy that leverages low-cost content creation
3. Monetization methods with emphasis on high-value opportunities
4. Traffic generation from both organic and paid sources
5. Conversion optimization strategies
6. Implementation timeline and required resources

Format the response as a structured JSON object matching the ToolTemplate interface.`;

    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    console.log('Received response from OpenAI');
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty content');
    }

    console.log('Parsing OpenAI response...');
    const template = JSON.parse(content) as ToolTemplate;

    return {
      success: true,
      template
    };
  } catch (error) {
    console.error('Error in generateToolTemplate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred in template generation'
    };
  }
}
