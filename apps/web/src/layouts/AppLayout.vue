<template>
  <div class="layout">
    <div class="topbar">
      <Menubar :model="menuItems">
        <template #start>
          <div class="logo-container">
            <i class="pi pi-heart" style="font-size: 1.5rem; color: white; margin-right: 0.5rem"></i>
            <span class="logo-text">SecondLeash</span>
          </div>
        </template>
        <template #end>
          <div class="user-section">
            <Avatar icon="pi pi-user" size="large" style="background-color: var(--accent-color); color: white" />
            <div class="user-info">
              <span class="user-name">{{ user?.fullName }}</span>
              <span class="user-role">{{ user?.role }}</span>
            </div>
            <Button icon="pi pi-sign-out" text rounded @click="handleLogout" aria-label="Logout" />
          </div>
        </template>
      </Menubar>
    </div>

    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const menuItems = computed(() => [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    command: () => router.push('/dashboard'),
  },
  {
    label: 'Dogs',
    icon: 'pi pi-heart',
    command: () => router.push('/dogs'),
  },
]);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.25rem;
  color: white;
  padding-left: 1rem;
}

.logo-text {
  color: white;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  color: white;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.75rem;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

:deep(.p-menubar) {
  background: var(--primary-color);
  border: none;
  border-radius: 0;
}

:deep(.p-menubar .p-menuitem-link) {
  color: white;
}

:deep(.p-menubar .p-menuitem-link:hover) {
  background: var(--primary-hover);
}

:deep(.p-button-text) {
  color: white;
}
</style>
