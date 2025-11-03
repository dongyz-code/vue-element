import type { NavigationGuardWithThis } from 'vue-router';

import { useUserStore } from '@/store';

export const withPermission: NavigationGuardWithThis<unknown> = async (to, from, next) => {
  if (to.meta.noAuth) {
    return next();
  }

  const userStore = useUserStore();
  if (!userStore.isLogin) {
    return next({ name: 'login' });
  }

  next();
};
