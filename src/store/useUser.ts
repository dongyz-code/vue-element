import { defineStore } from 'pinia';
import { routerPush } from '@/router';

export type UserInfo = {
  user_id: string;
  nickname: string;
  avatar: string;
  email: string;
  phone?: string;
};

export type UserStoreState = {
  token: string;
  userInfo: UserInfo | null;
};

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => ({
    token: '',
    userInfo: null,
  }),

  getters: {
    isLogin: state => !!state.token,
  },

  actions: {
    async login({ username, password }: { username: string; password: string }) {
      // const res = await api.login({ username, password });
      this.token = '1234567890';
      this.userInfo = {
        user_id: '1',
        nickname: 'admin',
        email: 'admin@example.com',
        avatar: 'https://example.com/avatar.png',
      };
    },

    async logout() {
      this.token = '';
      this.userInfo = null;
      const currentUrl = window.location.href;

      routerPush({
        name: 'login',
        query: {
          redirect: currentUrl,
        },
      });
    },
  },

  persist: {
    key: 'user',
    pick: ['token'],
  },
});
