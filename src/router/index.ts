import { createRouter, createWebHistory } from 'vue-router';
import BasePageView from '@/views/BasePageView.vue';

export const routes = [
  {
    path: '/',
    name: 'base',
    meta: { title: 'SmartMat' },
    component: BasePageView,
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
      {
        path: '/shopping-list',
        name: 'shopping-list',
        meta: { title: 'Handleliste' },
        component: () => import('@/views/ShoppingList/ShoppingListListingView.vue'),
      },
      {
        path: '/household',
        name: 'household',
        meta: { title: 'Husstand' },
        component: () => import('@/views/Household/HouseholdView.vue'),
      },
      {
        path: '/household/:id',
        name: 'household-detail',
        component: () => import('@/views/Household/HouseholdDetailView.vue'),
      },
      {
        path: '/household/create',
        name: 'household-create',
        meta: { title: 'Ny husstand' },
        component: () => import('@/views/Household/CreateHouseholdView.vue'),
      },
      {
        path: '/household/join',
        name: 'household-join',
        meta: { title: 'Bli med i en husstand' },
        component: () => import('@/views/Household/JoinHouseholdView.vue'),
      },
      {
        path: '/not-found',
        name: 'not-found',
        meta: { title: 'Kunne ikke finne siden' },
        component: () => import('@/views/NotFound404View.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'not-found' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'not-found' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
