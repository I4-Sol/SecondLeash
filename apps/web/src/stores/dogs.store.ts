import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dogsService, type Dog, type CreateDogData, type DogStatus } from '@/services/dogs.service';

export const useDogsStore = defineStore('dogs', () => {
  const dogs = ref<Dog[]>([]);
  const currentDog = ref<Dog | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  async function fetchDogs(params?: { status?: DogStatus; page?: number; limit?: number }) {
    loading.value = true;
    error.value = null;

    try {
      const response = await dogsService.getAll(params);
      dogs.value = response.data;
      pagination.value = response.pagination;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch dogs';
      dogs.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchDogById(id: string) {
    loading.value = true;
    error.value = null;

    try {
      currentDog.value = await dogsService.getById(id);
      return currentDog.value;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch dog';
      currentDog.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createDog(data: CreateDogData) {
    loading.value = true;
    error.value = null;

    try {
      const newDog = await dogsService.create(data);
      dogs.value.unshift(newDog);
      return newDog;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to create dog';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateDog(id: string, data: Partial<CreateDogData>) {
    loading.value = true;
    error.value = null;

    try {
      const updated = await dogsService.update(id, data);

      // Update in list
      const index = dogs.value.findIndex((d) => d.id === id);
      if (index !== -1) {
        dogs.value[index] = updated;
      }

      // Update current dog if it's the same
      if (currentDog.value?.id === id) {
        currentDog.value = updated;
      }

      return updated;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to update dog';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteDog(id: string) {
    loading.value = true;
    error.value = null;

    try {
      await dogsService.delete(id);

      // Remove from list
      dogs.value = dogs.value.filter((d) => d.id !== id);

      // Clear current dog if it's the same
      if (currentDog.value?.id === id) {
        currentDog.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to delete dog';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    dogs,
    currentDog,
    loading,
    error,
    pagination,
    fetchDogs,
    fetchDogById,
    createDog,
    updateDog,
    deleteDog,
  };
});
