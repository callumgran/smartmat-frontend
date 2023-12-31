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
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
      },
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
        meta: { title: 'Handleliste', requiresAuth: true },
        component: () => import('@/views/ShoppingList/ShoppingListView.vue'),
      },
      {
        path: '/shopping-list/:id',
        name: 'previous-shopping-list',
        meta: { title: 'Handleliste', requiresAuth: true },
        component: () => import('@/views/ShoppingList/PreviousShoppingListView.vue'),
      },
      {
        path: '/shopping-trip',
        name: 'shopping-trip',
        meta: { title: 'Handleliste', requiresAuth: true },
        component: () => import('@/views/ShoppingList/ShoppingTripView.vue'),
      },
      {
        path: '/household/:id',
        name: 'household-detail',
        component: () => import('@/views/Household/HouseholdView.vue'),
        meta: { title: 'Husstand', requiresAuth: true },
      },
      {
        path: '/household/:id/:year/:week',
        name: 'household-weekly',
        component: () => import('@/views/Household/WeeklyMenuView.vue'),
        meta: { title: 'Ukes meny', requiresAuth: true },
      },
      {
        path: '/household/create',
        name: 'household-create',
        meta: { title: 'Ny husstand', requiresAuth: true },
        component: () => import('@/views/Household/CreateHouseholdView.vue'),
      },
      {
        path: '/recipe',
        name: 'recipe',
        meta: { title: 'Oppskrift' },
        component: () => import('@/views/Recipe/RecipeListView.vue'),
      },
      {
        path: '/recipe/:recipeId',
        name: 'recipe-detail',
        meta: { title: 'Oppskrift' },
        component: () => import('@/views/Recipe/RecipeDetailView.vue'),
      },
      {
        path: '/profile',
        name: 'profile',
        meta: { title: 'Profil', requiresAuth: true },
        component: () => import('@/views/Auth/UserDetailView.vue'),
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
