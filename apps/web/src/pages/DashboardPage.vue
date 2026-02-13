<template>
  <AppLayout>
    <div class="dashboard">
      <h1 class="mb-4">Dashboard</h1>

      <div class="stats-grid">
        <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <i class="pi pi-heart stat-icon" style="color: var(--primary-color)"></i>
              <div class="stat-info">
                <h3>{{ stats.total }}</h3>
                <p>Total Dogs</p>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <i class="pi pi-check-circle stat-icon" style="color: var(--success-color)"></i>
              <div class="stat-info">
                <h3>{{ stats.available }}</h3>
                <p>Available</p>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <i class="pi pi-home stat-icon" style="color: var(--accent-color)"></i>
              <div class="stat-info">
                <h3>{{ stats.adopted }}</h3>
                <p>Adopted</p>
              </div>
            </div>
          </template>
        </Card>

        <Card class="stat-card">
          <template #content>
            <div class="stat-content">
              <i class="pi pi-heart-fill stat-icon" style="color: var(--secondary-color)"></i>
              <div class="stat-info">
                <h3>{{ stats.fostered }}</h3>
                <p>Fostered</p>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="quick-actions mt-5">
        <h2 class="mb-3">Quick Actions</h2>
        <div class="actions-grid">
          <Button label="Add New Dog" icon="pi pi-plus" @click="router.push('/dogs/new')" />
          <Button label="View All Dogs" icon="pi pi-list" severity="secondary" @click="router.push('/dogs')" />
        </div>
      </div>

      <div class="welcome-section mt-5">
        <Card>
          <template #content>
            <h2>Welcome, {{ user?.fullName }}!</h2>
            <p>You're logged in as <strong>{{ user?.role }}</strong></p>
            <p class="mt-2">Use the navigation above to manage shelter operations.</p>
          </template>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useDogsStore } from '@/stores/dogs.store';
import AppLayout from '@/layouts/AppLayout.vue';

const router = useRouter();
const authStore = useAuthStore();
const dogsStore = useDogsStore();

const user = computed(() => authStore.user);

const stats = ref({
  total: 0,
  available: 0,
  adopted: 0,
  fostered: 0,
});

onMounted(async () => {
  await dogsStore.fetchDogs();

  // Calculate stats from dogs
  const dogs = dogsStore.dogs;
  stats.value.total = dogs.length;
  stats.value.available = dogs.filter((d) => d.status === 'AVAILABLE').length;
  stats.value.adopted = dogs.filter((d) => d.status === 'ADOPTED').length;
  stats.value.fostered = dogs.filter((d) => d.status === 'FOSTERED').length;
});
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 2.5rem;
  margin: 0;
  color: var(--text-color);
}

.stat-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.actions-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.welcome-section h2 {
  margin: 0 0 0.5rem;
}

.welcome-section p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}
</style>
