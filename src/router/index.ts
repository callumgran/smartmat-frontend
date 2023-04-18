import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  {
    path: '/',
    name: 'base',
    meta: { title: 'SmartMat' },
    component: () => import('@/views/BasePageView.vue'),
    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
