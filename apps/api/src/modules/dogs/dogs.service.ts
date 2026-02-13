import { DogsRepository } from './dogs.repository';
import { NotFoundError, ForbiddenError, ConflictError } from '@/shared/errors';
import { CreateDogInput, UpdateDogInput } from '@/shared/schemas';
import { DogResponse, DogListParams, PaginatedDogs } from './dogs.types';
import { Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class DogsService {
  constructor(private dogsRepository: DogsRepository) { }

  async findAll(
    params: DogListParams,
    userRole: Role,
    userShelterId: string | null
  ): Promise<PaginatedDogs> {
    // Enforce shelter scoping for non-SUPER_ADMIN users
    let shelterId = params.shelterId;

    if (userRole !== Role.SUPER_ADMIN) {
      if (!userShelterId) {
        throw new ForbiddenError('User has no shelter assigned');
      }
      shelterId = userShelterId; // Override with user's shelter
    }

    const { dogs, total } = await this.dogsRepository.findAll({
      ...params,
      shelterId,
    });

    return {
      data: dogs.map(this.toDogResponse),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async findById(
    id: string,
    userRole: Role,
    userShelterId: string | null
  ): Promise<DogResponse> {
    const dog = await this.dogsRepository.findById(id);

    if (!dog) {
      throw new NotFoundError('Dog not found');
    }

    // Check shelter ownership
    if (userRole !== Role.SUPER_ADMIN && dog.shelterId !== userShelterId) {
      throw new ForbiddenError('Access denied to this dog');
    }

    return this.toDogResponse(dog);
  }

  async create(
    data: CreateDogInput,
    userRole: Role,
    userShelterId: string | null
  ): Promise<DogResponse> {
    // Only SHELTER_ADMIN and STAFF can create
    if (userRole === Role.VOLUNTEER) {
      throw new ForbiddenError('Volunteers cannot create dogs');
    }

    // Determine shelter
    let shelterId: string;

    if (userRole === Role.SUPER_ADMIN) {
      // SUPER_ADMIN should specify shelter (for now, we'll require they have one)
      if (!userShelterId) {
        throw new ForbiddenError('Super admin must be assigned to a shelter to create dogs');
      }
      shelterId = userShelterId;
    } else {
      if (!userShelterId) {
        throw new ForbiddenError('User has no shelter assigned');
      }
      shelterId = userShelterId;
    }

    // Check microchip uniqueness
    if (data.microchipId) {
      const exists = await this.dogsRepository.checkMicrochipExists(data.microchipId);
      if (exists) {
        throw new ConflictError('Microchip ID already exists');
      }
    }

    const dog = await this.dogsRepository.create({
      name: data.name,
      sex: data.sex,
      approxBirthdate: data.approxBirthdate ? new Date(data.approxBirthdate) : null,
      breed: data.breed,
      size: data.size,
      weightKg: data.weightKg ? new Decimal(data.weightKg) : null,
      microchipId: data.microchipId,
      intakeDate: data.intakeDate ? new Date(data.intakeDate) : null,
      status: data.status,
      description: data.description,
      shelter: {
        connect: { id: shelterId },
      },
    });

    return this.toDogResponse(dog);
  }

  async update(
    id: string,
    data: UpdateDogInput,
    userRole: Role,
    userShelterId: string | null
  ): Promise<DogResponse> {
    // Only SHELTER_ADMIN and STAFF can update
    if (userRole === Role.VOLUNTEER) {
      throw new ForbiddenError('Volunteers cannot update dogs');
    }

    const dog = await this.dogsRepository.findById(id);

    if (!dog) {
      throw new NotFoundError('Dog not found');
    }

    // Check shelter ownership
    if (userRole !== Role.SUPER_ADMIN && dog.shelterId !== userShelterId) {
      throw new ForbiddenError('Access denied to this dog');
    }

    // Check microchip uniqueness if updating
    if (data.microchipId) {
      const exists = await this.dogsRepository.checkMicrochipExists(data.microchipId, id);
      if (exists) {
        throw new ConflictError('Microchip ID already exists');
      }
    }

    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.sex !== undefined) updateData.sex = data.sex;
    if (data.approxBirthdate !== undefined) {
      updateData.approxBirthdate = data.approxBirthdate ? new Date(data.approxBirthdate) : null;
    }
    if (data.breed !== undefined) updateData.breed = data.breed;
    if (data.size !== undefined) updateData.size = data.size;
    if (data.weightKg !== undefined) {
      updateData.weightKg = data.weightKg ? new Decimal(data.weightKg) : null;
    }
    if (data.microchipId !== undefined) updateData.microchipId = data.microchipId;
    if (data.intakeDate !== undefined) {
      updateData.intakeDate = data.intakeDate ? new Date(data.intakeDate) : null;
    }
    if (data.status !== undefined) updateData.status = data.status;
    if (data.description !== undefined) updateData.description = data.description;

    const updated = await this.dogsRepository.update(id, updateData);

    return this.toDogResponse(updated);
  }

  async delete(id: string, userRole: Role, userShelterId: string | null): Promise<void> {
    // Only SHELTER_ADMIN and STAFF can delete
    if (userRole === Role.VOLUNTEER) {
      throw new ForbiddenError('Volunteers cannot delete dogs');
    }

    const dog = await this.dogsRepository.findById(id);

    if (!dog) {
      throw new NotFoundError('Dog not found');
    }

    // Check shelter ownership
    if (userRole !== Role.SUPER_ADMIN && dog.shelterId !== userShelterId) {
      throw new ForbiddenError('Access denied to this dog');
    }

    await this.dogsRepository.softDelete(id);
  }

  private toDogResponse(dog: any): DogResponse {
    return {
      id: dog.id,
      shelterId: dog.shelterId,
      name: dog.name,
      sex: dog.sex,
      approxBirthdate: dog.approxBirthdate,
      breed: dog.breed,
      size: dog.size,
      weightKg: dog.weightKg ? parseFloat(dog.weightKg.toString()) : null,
      microchipId: dog.microchipId,
      intakeDate: dog.intakeDate,
      status: dog.status,
      description: dog.description,
      createdAt: dog.createdAt,
      updatedAt: dog.updatedAt,
    };
  }
}
