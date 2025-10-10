import type { RouteRecordRaw } from 'vue-router';

export const routeNameMap = {
  layout: '',
  // 首页
  home: '首页',
  // 登录
  login: '登录',
  // 404
  404: 'Not Found',
  // 403
  403: 'Not Authorized',
};

/**
 * 路由名称类型
 */
export type RouteName = `${keyof typeof routeNameMap}`;

/**
 * 路由项类型
 */
export type RouteItem = Omit<RouteRecordRaw, 'name'> & {
  name: RouteName;
};
