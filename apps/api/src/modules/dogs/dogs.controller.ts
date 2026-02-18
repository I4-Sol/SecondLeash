import { Request, Response, NextFunction } from 'express';
import { DogsService } from './dogs.service';
import { CreateDogInput, UpdateDogInput, DogFilterInput } from '@/shared/schemas';

export class DogsController {
  constructor(private dogsService: DogsService) { }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, shelterId } = req.user!;

      const filters = req.query as unknown as DogFilterInput;

      const result = await this.dogsService.findAll(
        {
          status: filters.status,
          page: filters.page || 1,
          limit: filters.limit || 20,
        },
        role,
        shelterId
      );

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, shelterId } = req.user!;

      const { id } = req.params;

      const dog = await this.dogsService.findById(id, role,shelterId);

      res.json({
        success: true,
        data: dog,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, shelterId } = req.user!;

      const data = req.body as CreateDogInput;

      const dog = await this.dogsService.create(data, role, shelterId);

      res.status(201).json({
        success: true,
        data: dog,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, shelterId } = req.user!;

      const { id } = req.params;
      const data = req.body as UpdateDogInput;

      const dog = await this.dogsService.update(id, data, role, shelterId);

      res.json({
        success: true,
        data: dog,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, shelterId } = req.user!;

      const { id } = req.params;

      await this.dogsService.delete(id, role, shelterId);

      res.json({
        success: true,
        data: { message: 'Dog deleted successfully' },
      });
    } catch (error) {
      next(error);
    }
  };
}
