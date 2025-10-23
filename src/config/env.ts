import type { APP_CONFIG } from '@/types';

export const env: APP_CONFIG = {
  APP_KEY: import.meta.env.VITE_APP_KEY ?? 'default',
  NODE_ENV: import.meta.env.VITE_APP_NODE_ENV ?? 'development',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
};
