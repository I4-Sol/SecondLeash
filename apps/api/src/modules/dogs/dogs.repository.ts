import { prisma } from '@/shared/prisma';
import { Dog, DogStatus, Prisma } from '@prisma/client';
import { DogListParams } from './dogs.types';

export class DogsRepository {
  async findById(id: string): Promise<Dog | null> {
    return prisma.dog.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findAll(params: DogListParams): Promise<{ dogs: Dog[]; total: number }> {
    const { shelterId, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.DogWhereInput = {
      deletedAt: null,
    };

    if (shelterId) {
      where.shelterId = shelterId;
    }

    if (status) {
      where.status = status;
    }

    const [dogs, total] = await Promise.all([
      prisma.dog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.dog.count({ where }),
    ]);

    return { dogs, total };
  }

  async create(data: Prisma.DogCreateInput): Promise<Dog> {
    return prisma.dog.create({
      data,
    });
  }

  async update(id: string, data: Prisma.DogUpdateInput): Promise<Dog> {
    return prisma.dog.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Dog> {
    return prisma.dog.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async checkMicrochipExists(microchipId: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.dog.count({
      where: {
        microchipId,
        id: excludeId ? { not: excludeId } : undefined,
        deletedAt: null,
      },
    });

    return count > 0;
  }
}
