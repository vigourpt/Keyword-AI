export const DATAFORSEO_CONFIG = {
  baseUrl: 'https://api.dataforseo.com/v3',
  credentials: {
    login: import.meta.env.VITE_DATAFORSEO_LOGIN || 'fulfilment@noobru.com',
    password: import.meta.env.VITE_DATAFORSEO_PASSWORD || 'd7294e573370da4a'
  }
} as const;