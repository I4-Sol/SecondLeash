import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with empty state', () => {
    const { useAuthStore } = await import('@/stores/auth.store');
    const authStore = useAuthStore();

    expect(authStore.accessToken).toBeNull();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });
});
