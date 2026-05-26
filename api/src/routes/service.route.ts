import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdSchema,
} from '../validators/service.validator';

export const serviceRouter = Router();

serviceRouter.get('/',    serviceController.list);
serviceRouter.post('/',   authMiddleware, validate(createServiceSchema), serviceController.create);
serviceRouter.put('/:id', authMiddleware, validate(updateServiceSchema), serviceController.update);
serviceRouter.delete('/:id', authMiddleware, validate(serviceIdSchema),  serviceController.remove);
