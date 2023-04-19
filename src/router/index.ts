import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  {
    path: '/',
    name: 'base',
    meta: { title: 'SmartMat' },
    component: () => import('@/views/BasePageView.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        meta: { title: 'Logg inn' },
        component: () => import('@/views/Auth/LoginUserView.vue'),
      },
      {
        path: '/register',
        name: 'register',
        meta: { title: 'Registrer ny bruker' },
        component: () => import('@/views/Auth/RegisterUserView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
