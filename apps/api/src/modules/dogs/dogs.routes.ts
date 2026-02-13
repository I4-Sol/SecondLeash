import { Router } from 'express';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';
import { DogsRepository } from './dogs.repository';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireShelterAccess } from '@/middlewares/rbac.middleware';
import { validate, validateQuery } from '@/middlewares/validation.middleware';
import { createDogSchema, updateDogSchema, dogFilterSchema } from '@/shared/schemas';

const router = Router();

// Dependencies
const dogsRepository = new DogsRepository();
const dogsService = new DogsService(dogsRepository);
const dogsController = new DogsController(dogsService);

// All routes require authentication and shelter access
router.use(authenticate);
router.use(requireShelterAccess);

// Routes
router.get('/', validateQuery(dogFilterSchema), dogsController.findAll);
router.post('/', validate(createDogSchema), dogsController.create);
router.get('/:id', dogsController.findById);
router.put('/:id', validate(updateDogSchema), dogsController.update);
router.delete('/:id', dogsController.delete);

export default router;
