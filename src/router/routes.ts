import type { RouteItem } from './static';

export const routes: RouteItem[] = [
  {
    path: '',
    name: 'layout',
    component: () => import('@/layout/basic-layout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/pages/home/index.vue'),
      },
      {
        path: '403',
        name: '403',
        component: () => import('@/pages/403/index.vue'),
      },
      {
        path: '404',
        name: '404',
        component: () => import('@/pages/404/index.vue'),
      },
      {
        path: '/:catchAll(.*)',
        redirect: '/404',
      },
    ],
  },
];
