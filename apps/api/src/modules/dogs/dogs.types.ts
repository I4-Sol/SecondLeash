import { Dog, DogStatus, Sex, Size } from '@prisma/client';

export interface DogResponse {
  id: string;
  shelterId: string;
  name: string;
  sex: Sex;
  approxBirthdate: Date | null;
  breed: string | null;
  size: Size;
  weightKg: number | null;
  microchipId: string | null;
  intakeDate: Date | null;
  status: DogStatus;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DogListParams {
  shelterId?: string;
  status?: DogStatus;
  page: number;
  limit: number;
}

export interface PaginatedDogs {
  data: DogResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
