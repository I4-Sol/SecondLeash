<template>
  <AppLayout>
    <div class="dog-form">
      <div class="header-section mb-4">
        <h1>{{ isEdit ? 'Edit Dog' : 'Add New Dog' }}</h1>
        <Button label="Back to List" icon="pi pi-arrow-left" text @click="router.push('/dogs')" />
      </div>

      <Card>
        <template #content>
          <form @submit.prevent="handleSubmit" class="form-grid">
            <div class="form-row">
              <div class="form-field">
                <label for="name">Name *</label>
                <InputText id="name" v-model="formData.name" required />
              </div>

              <div class="form-field">
                <label for="sex">Sex *</label>
                <Dropdown id="sex" v-model="formData.sex" :options="sexOptions" optionLabel="label" optionValue="value" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="breed">Breed</label>
                <InputText id="breed" v-model="formData.breed" />
              </div>

              <div class="form-field">
                <label for="size">Size *</label>
                <Dropdown id="size" v-model="formData.size" :options="sizeOptions" optionLabel="label" optionValue="value" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="birthdate">Approx. Birthdate</label>
                <Calendar id="birthdate" v-model="birthdate" dateFormat="yy-mm-dd" showIcon />
              </div>

              <div class="form-field">
                <label for="weight">Weight (kg)</label>
                <InputNumber id="weight" v-model="formData.weightKg" :minFractionDigits="1" :maxFractionDigits="2" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="microchip">Microchip ID</label>
                <InputText id="microchip" v-model="formData.microchipId" />
              </div>

              <div class="form-field">
                <label for="intakeDate">Intake Date</label>
                <Calendar id="intakeDate" v-model="intakeDate" dateFormat="yy-mm-dd" showIcon />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field full-width">
                <label for="status">Status *</label>
                <Dropdown id="status" v-model="formData.status" :options="statusOptions" optionLabel="label" optionValue="value" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field full-width">
                <label for="description">Description</label>
                <Textarea id="description" v-model="formData.description" rows="5" />
              </div>
            </div>

            <div class="form-actions">
              <Button label="Cancel" severity="secondary" text @click="router.push('/dogs')" />
              <Button type="submit" :label="isEdit ? 'Update Dog' : 'Create Dog'" :loading="dogsStore.loading" />
            </div>

            <div v-if="dogsStore.error" class="error-message mt-3">
              <i class="pi pi-exclamation-circle"></i>
              {{ dogsStore.error }}
            </div>
          </form>
        </template>
      </Card>
    </div>

    <Toast />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDogsStore } from '@/stores/dogs.store';
import { useToast } from 'primevue/usetoast';
import type { CreateDogData } from '@/services/dogs.service';
import AppLayout from '@/layouts/AppLayout.vue';

const router = useRouter();
const route = useRoute();
const dogsStore = useDogsStore();
const toast = useToast();

const isEdit = computed(() => !!route.params.id);

const formData = reactive<CreateDogData>({
  name: '',
  sex: 'UNKNOWN',
  breed: null,
  size: 'MEDIUM',
  weightKg: null,
  microchipId: null,
  status: 'AVAILABLE',
  description: null,
});

const birthdate = ref<Date | null>(null);
const intakeDate = ref<Date | null>(null);

const sexOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const sizeOptions = [
  { label: 'Small', value: 'SMALL' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Large', value: 'LARGE' },
  { label: 'XL', value: 'XL' },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const statusOptions = [
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'On Hold', value: 'ON_HOLD' },
  { label: 'Adopted', value: 'ADOPTED' },
  { label: 'Fostered', value: 'FOSTERED' },
  { label: 'Medical', value: 'MEDICAL' },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const handleSubmit = async () => {
  const data: CreateDogData = {
    ...formData,
    approxBirthdate: birthdate.value ? birthdate.value.toISOString() : null,
    intakeDate: intakeDate.value ? intakeDate.value.toISOString() : null,
  };

  try {
    if (isEdit.value) {
      await dogsStore.updateDog(route.params.id as string, data);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Dog updated successfully', life: 3000 });
    } else {
      await dogsStore.createDog(data);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Dog created successfully', life: 3000 });
    }
    router.push('/dogs');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: dogsStore.error, life: 3000 });
  }
};

onMounted(async () => {
  if (isEdit.value) {
    try {
      const dog = await dogsStore.fetchDogById(route.params.id as string);
      Object.assign(formData, {
        name: dog.name,
        sex: dog.sex,
        breed: dog.breed,
        size: dog.size,
        weightKg: dog.weightKg,
        microchipId: dog.microchipId,
        status: dog.status,
        description: dog.description,
      });

      if (dog.approxBirthdate) {
        birthdate.value = new Date(dog.approxBirthdate);
      }
      if (dog.intakeDate) {
        intakeDate.value = new Date(dog.intakeDate);
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load dog data', life: 3000 });
      router.push('/dogs');
    }
  }
});
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar),
:deep(.p-inputnumber),
:deep(.p-textarea) {
  width: 100%;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
