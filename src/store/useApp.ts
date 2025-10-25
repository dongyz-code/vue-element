import type { ThemeKey } from '@/theme/types';
import { defineStore } from 'pinia';

export type AppStoreState = {
  theme: ThemeKey;
};

export const useAppStore = defineStore('app', {
  state: (): AppStoreState => ({
    theme: 'default',
  }),
});
