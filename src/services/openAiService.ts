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
              content: 'You are a keyword analysis expert. Analyze the following keywords and provide insights about their monetization potential.',
            },
            {
              role: 'user',
              content: keywords,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

export const openAiService = OpenAIService.getInstance();