import { OPENAI_CONFIG } from '../config/api';

export class OpenAIService {
  private static instance: OpenAIService;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async analyzeKeywords(keywords: string) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a monetization strategy expert specializing in Hidden Money Doors - opportunities where low-cost or free online content can lead to high-value advertising or affiliate markets.

For the given keyword, analyze and provide the following in a structured format:

1. Market Overview: Brief analysis of the current market and opportunity.

2. Content Strategy: What type of free/low-cost content (tools, templates, calculators, guides) could attract traffic for this keyword?

3. High-Value Redirect Opportunities: Identify related high-CPC keywords and niches where traffic could be redirected.

4. Monetization Channels:
- Direct advertising opportunities
- Affiliate product recommendations
- Premium service upsells
- Related high-value keywords

5. Traffic Generation: Platforms and methods to distribute the content.

6. Conversion Strategy: How to convert free tool users into high-value opportunities.

Format each section clearly and provide actionable insights.`,
            },
            {
              role: 'user',
              content: keywords,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API error: ' + await response.text());
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

export const openAiService = OpenAIService.getInstance();