import { Router } from 'express';
import { carController } from '../controllers/car.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createCarSchema,
  updateCarSchema,
  carIdSchema,
  listCarsSchema,
} from '../validators/car.validator';

export const carRouter = Router();

carRouter.get('/',    validate(listCarsSchema),  carController.list);
carRouter.get('/:id', validate(carIdSchema),     carController.getOne);
carRouter.post('/',   authMiddleware, validate(createCarSchema), carController.create);
carRouter.put('/:id', authMiddleware, validate(updateCarSchema), carController.update);
carRouter.delete('/:id', authMiddleware, validate(carIdSchema),  carController.remove);
