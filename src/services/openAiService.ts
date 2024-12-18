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

  private async makeOpenAIRequest(messages: Array<{ role: string; content: string }>) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  async generateInsights(prompt: string) {
    try {
      return await this.makeOpenAIRequest([
        {
          role: 'system',
          content: 'You are an AI expert in market analysis, user behavior, and monetization strategies. Provide detailed, data-driven insights in the requested JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }

  async analyzeKeywords(keyword: string) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are a monetization strategy expert specializing in Hidden Money Doors - opportunities where low-cost or free online content can lead to high-value advertising or affiliate markets.

For the given keyword, analyze and provide detailed insights about:

1. Market Overview: Size, trends, and growth potential
2. User Intent: Search intent, pain points, and needs
3. Competition Analysis: Current players, gaps, and opportunities
4. Content Strategy: Types of content that would work best
5. Monetization Methods: Specific ways to generate revenue
6. Implementation Plan: Step-by-step guide to execute

Format your response as clear, actionable insights that can be immediately implemented.`
        },
        {
          role: 'user',
          content: `Analyze this keyword: ${keyword}`
        }
      ];

      return await this.makeOpenAIRequest(messages);
    } catch (error) {
      console.error('Error analyzing keywords:', error);
      throw error;
    }
  }
}

export const openAiService = OpenAIService.getInstance();