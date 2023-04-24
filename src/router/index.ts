import { createRouter, createWebHistory } from 'vue-router';
import BasePageView from '@/views/BasePageView.vue';
import { useUserInfoStore } from '@/stores/UserStore';

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
        meta: { title: 'Husstand', requiresAuth: true },
        component: () => import('@/views/Household/HouseholdView.vue'),
      },
      {
        path: '/household/:id',
        name: 'household-detail',
        component: () => import('@/views/Household/HouseholdDetailView.vue'),
        meta: { title: 'Husstand', requiresAuth: true },
      },
      {
        path: '/household/create',
        name: 'household-create',
        meta: { title: 'Ny husstand', requiresAuth: true },
        component: () => import('@/views/Household/CreateHouseholdView.vue'),
      },
      {
        path: '/not-found',
        name: 'not-found',
        meta: { title: 'Kunne ikke finne siden' },
        component: () => import('@/views/NotFound404View.vue'),
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

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  let user = useUserInfoStore();
  const isAuthenticated = user.isLoggedIn;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresRole: String[] = to.matched.flatMap(
    (record) => (record.meta.requiresRole as String[]) || [],
  );

  window.scrollY = 0;

  if (requiresAuth) {
    if (!isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } });
    } else {
      if (requiresRole.length === 0) {
        next();
      } else if (requiresRole.includes(user.role)) {
        next();
      } else {
        next({ name: 'home' });
      }
    }
  } else {
    next();
  }
});

export default router;
