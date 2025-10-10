import type { LocationQueryRaw, RouteParamsRawGeneric, RouteRecordRaw } from 'vue-router';
import type { RouteName } from './static';
import { omit } from 'lodash-es';
import { createRouter, createWebHistory } from 'vue-router';
import { withPermission } from './permission';
import { routes } from './routes';

export const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/** Add permission guard */
router.beforeEach(withPermission);

/** ************** 路由通用方法 */

type RouterPushParams = {
  name: RouteName;
  query?: LocationQueryRaw;
  params?: RouteParamsRawGeneric;
  hash?: string;
  replace?: boolean;
} | {
  path: string;
  query?: LocationQueryRaw;
  hash?: string;
  replace?: boolean;
};

export function routerPush(to: RouterPushParams) {
  const { replace, ...params } = to;

  if (replace) {
    router.replace(params);
  }
  else {
    router.push(params);
  }
}
