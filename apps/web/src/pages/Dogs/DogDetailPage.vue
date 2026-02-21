<template>
  <AppLayout>
    <div v-if="dogsStore.loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 3rem; color: var(--primary-color)"></i>
    </div>

    <div v-else-if="dog" class="dog-detail">
      <div class="header-section mb-4">
        <h1>{{ dog.name }}</h1>
        <div class="header-actions">
          <Button label="Edit" icon="pi pi-pencil" @click="router.push(`/dogs/${dog.id}/edit`)" />
          <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDelete" />
          <Button label="Back to List" icon="pi pi-arrow-left" text @click="router.push('/dogs')" />
        </div>
      </div>

      <div class="details-grid">
        <Card class="detail-card">
          <template #title>Basic Information</template>
          <template #content>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">{{ dog.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Sex:</span>
              <span class="detail-value">{{ dog.sex }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Breed:</span>
              <span class="detail-value">{{ dog.breed || 'Unknown' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Size:</span>
              <span class="detail-value">{{ dog.size }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Weight:</span>
              <span class="detail-value">{{ dog.weightKg ? `${dog.weightKg} kg` : 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span :class="'status-badge status-' + dog.status.toLowerCase()">{{ dog.status }}</span>
            </div>
          </template>
        </Card>

        <Card class="detail-card">
          <template #title>Additional Details</template>
          <template #content>
            <div class="detail-row">
              <span class="detail-label">Approx. Birthdate:</span>
              <span class="detail-value">{{ formatDate(dog.approxBirthdate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Microchip ID:</span>
              <span class="detail-value">{{ dog.microchipId || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Intake Date:</span>
              <span class="detail-value">{{ formatDate(dog.intakeDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Created:</span>
              <span class="detail-value">{{ formatDate(dog.createdAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Last Updated:</span>
              <span class="detail-value">{{ formatDate(dog.updatedAt) }}</span>
            </div>
          </template>
        </Card>

        <Card v-if="dog.description" class="detail-card full-width">
          <template #title>Description</template>
          <template #content>
            <p class="description-text">{{ dog.description }}</p>
          </template>
        </Card>
      </div>
    </div>

    <Dialog v-model:visible="deleteDialogVisible" header="Confirm Deletion" :modal="true" :style="{ width: '450px' }">
      <p>Are you sure you want to delete <strong>{{ dog?.name }}</strong>?</p>
      <template #footer>
        <Button label="Cancel" text @click="deleteDialogVisible = false" />
        <Button label="Delete" severity="danger" @click="handleDelete" :loading="dogsStore.loading" />
      </template>
    </Dialog>

    <Toast />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDogsStore } from '@/stores/dogs.store';
import { useToast } from 'primevue/usetoast';
import AppLayout from '@/layouts/AppLayout.vue';

const router = useRouter();
const route = useRoute();
const dogsStore = useDogsStore();
const toast = useToast();

const deleteDialogVisible = ref(false);

const dog = computed(() => dogsStore.currentDog);

const formatDate = (date: string | null) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const confirmDelete = () => {
  deleteDialogVisible.value = true;
};

const handleDelete = async () => {
  if (!dog.value) return;

  try {
    await dogsStore.deleteDog(dog.value.id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Dog deleted successfully', life: 3000 });
    deleteDialogVisible.value = false;
    router.push('/dogs');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete dog', life: 3000 });
  }
};

onMounted(async () => {
  const id = route.params.id as string;
  try {
    await dogsStore.fetchDogById(id);
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load dog details', life: 3000 });
    router.push('/dogs');
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  height: fit-content;
}

.detail-card.full-width {
  grid-column: 1 / -1;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-light);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.detail-value {
  color: var(--text-color);
}

.description-text {
  line-height: 1.6;
  color: var(--text-color);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-available {
  background: #d4edda;
  color: #155724;
}

.status-on_hold {
  background: #fff3cd;
  color: #856404;
}

.status-adopted {
  background: #d1ecf1;
  color: #0c5460;
}

.status-fostered {
  background: #e2e3e5;
  color: #383d41;
}

.status-medical {
  background: #f8d7da;
  color: #721c24;
}

.status-unknown {
  background: #e9ecef;
  color: #495057;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
