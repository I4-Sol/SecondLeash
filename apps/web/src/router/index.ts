import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import LoginPage from '@/pages/LoginPage.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import DogsListPage from '@/pages/DogsListPage.vue';
import DogFormPage from '@/pages/DogFormPage.vue';
import DogDetailPage from '@/pages/DogDetailPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/dogs',
      name: 'dogs',
      component: DogsListPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/dogs/new',
      name: 'dogs-new',
      component: DogFormPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/dogs/:id/edit',
      name: 'dog-edit',
      component: DogFormPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/dogs/:id',
      name: 'dog-detail',
      component: DogDetailPage,
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard
router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next) => {
  const authStore = useAuthStore();

  // Initialize auth on first load
  if (!authStore.isAuthenticated && !authStore.user) {
    await authStore.initialize();
  }

  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    // Already logged in, redirect to dashboard
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
