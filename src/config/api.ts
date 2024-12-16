// API Configuration
export const DATAFORSEO_CONFIG = {
  baseUrl: 'https://api.dataforseo.com/v3',
  login: import.meta.env.VITE_DATAFORSEO_LOGIN || 'fulfilment@noobru.com',
  password: import.meta.env.VITE_DATAFORSEO_PASSWORD || 'd7294e573370da4a',
};

export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
};