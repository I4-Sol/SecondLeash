<template>
  <AppLayout>
    <div class="dogs-list">
      <div class="header-section flex justify-between items-center mb-4">
        <h1>Dogs Management</h1>
        <Button label="Add New Dog" icon="pi pi-plus" @click="router.push('/dogs/new')" />
      </div>

      <Card>
        <template #content>
          <div class="filters mb-3">
            <Dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Filter by status"
              @change="handleFilterChange"
              class="filter-dropdown"
            />
          </div>

          <DataTable :value="dogsStore.dogs" :loading="dogsStore.loading" paginator :rows="20" stripedRows>
            <Column field="name" header="Name" sortable></Column>
            <Column field="sex" header="Sex" sortable></Column>
            <Column field="breed" header="Breed" sortable>
              <template #body="slotProps">
                {{ slotProps.data.breed || 'Unknown' }}
              </template>
            </Column>
            <Column field="size" header="Size" sortable></Column>
            <Column field="status" header="Status" sortable>
              <template #body="slotProps">
                <span :class="'status-badge status-' + slotProps.data.status.toLowerCase()">
                  {{ slotProps.data.status }}
                </span>
              </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                <div class="action-buttons">
                  <Button
                    icon="pi pi-eye"
                    text
                    rounded
                    @click="viewDog(slotProps.data.id)"
                    v-tooltip.top="'View Details'"
                  />
                  <Button
                    icon="pi pi-trash"
                    text
                    rounded
                    severity="danger"
                    @click="confirmDelete(slotProps.data)"
                    v-tooltip.top="'Delete'"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <Dialog v-model:visible="deleteDialogVisible" header="Confirm Deletion" :modal="true" :style="{ width: '450px' }">
      <p>Are you sure you want to delete <strong>{{ dogToDelete?.name }}</strong>?</p>
      <template #footer>
        <Button label="Cancel" text @click="deleteDialogVisible = false" />
        <Button label="Delete" severity="danger" @click="handleDelete" :loading="dogsStore.loading" />
      </template>
    </Dialog>

    <Toast />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDogsStore } from '@/stores/dogs.store';
import { useToast } from 'primevue/usetoast';
import type { Dog, DogStatus } from '@/services/dogs.service';
import AppLayout from '@/layouts/AppLayout.vue';

const router = useRouter();
const dogsStore = useDogsStore();
const toast = useToast();

const selectedStatus = ref<DogStatus | null>(null);
const deleteDialogVisible = ref(false);
const dogToDelete = ref<Dog | null>(null);

const statusOptions = [
  { label: 'All Statuses', value: null },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'On Hold', value: 'ON_HOLD' },
  { label: 'Adopted', value: 'ADOPTED' },
  { label: 'Fostered', value: 'FOSTERED' },
  { label: 'Medical', value: 'MEDICAL' },
];

const handleFilterChange = () => {
  dogsStore.fetchDogs({ status: selectedStatus.value || undefined });
};

const viewDog = (id: string) => {
  router.push(`/dogs/${id}`);
};

const confirmDelete = (dog: Dog) => {
  dogToDelete.value = dog;
  deleteDialogVisible.value = true;
};

const handleDelete = async () => {
  if (!dogToDelete.value) return;

  try {
    await dogsStore.deleteDog(dogToDelete.value.id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Dog deleted successfully', life: 3000 });
    deleteDialogVisible.value = false;
    dogToDelete.value = null;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete dog', life: 3000 });
  }
};

onMounted(() => {
  dogsStore.fetchDogs();
});
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters {
  margin-bottom: 1rem;
}

.filter-dropdown {
  min-width: 200px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-available {
  background: var(--status-available-bg);
  color: var(--status-available-text);
}

.status-on_hold {
  background: var(--status-on-hold-bg);
  color: var(--status-on-hold-text);
}

.status-adopted {
  background: var(--status-adopted-bg);
  color: var(--status-adopted-text);
}

.status-fostered {
  background: var(--status-fostered-bg);
  color: var(--status-fostered-text);
}

.status-medical {
  background: var(--status-medical-bg);
  color: var(--status-medical-text);
}

.status-unknown {
  background: var(--status-unknown-bg);
  color: var(--status-unknown-text);
}
</style>
