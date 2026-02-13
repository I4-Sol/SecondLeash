import apiClient from './api';

export type DogStatus = 'AVAILABLE' | 'ON_HOLD' | 'ADOPTED' | 'FOSTERED' | 'MEDICAL' | 'UNKNOWN';
export type Sex = 'MALE' | 'FEMALE' | 'UNKNOWN';
export type Size = 'SMALL' | 'MEDIUM' | 'LARGE' | 'XL' | 'UNKNOWN';

export interface Dog {
  id: string;
  shelterId: string;
  name: string;
  sex: Sex;
  approxBirthdate: string | null;
  breed: string | null;
  size: Size;
  weightKg: number | null;
  microchipId: string | null;
  intakeDate: string | null;
  status: DogStatus;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDogData {
  name: string;
  sex: Sex;
  approxBirthdate?: string | null;
  breed?: string | null;
  size: Size;
  weightKg?: number | null;
  microchipId?: string | null;
  intakeDate?: string | null;
  status: DogStatus;
  description?: string | null;
}

export interface DogsListResponse {
  success: boolean;
  data: Dog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DogResponse {
  success: boolean;
  data: Dog;
}

export const dogsService = {
  async getAll(params?: { status?: DogStatus; page?: number; limit?: number }): Promise<DogsListResponse> {
    const response = await apiClient.get<DogsListResponse>('/dogs', { params });
    return response.data;
  },

  async getById(id: string): Promise<Dog> {
    const response = await apiClient.get<DogResponse>(`/dogs/${id}`);
    return response.data.data;
  },

  async create(data: CreateDogData): Promise<Dog> {
    const response = await apiClient.post<DogResponse>('/dogs', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateDogData>): Promise<Dog> {
    const response = await apiClient.put<DogResponse>(`/dogs/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/dogs/${id}`);
  },
};
