import { Router } from 'express';
import { newsletterController } from '../controllers/newsletter.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { subscribeSchema, unsubscribeSchema } from '../validators/auth.validator';

export const newsletterRouter = Router();

newsletterRouter.post('/subscribe',       validate(subscribeSchema),   newsletterController.subscribe);
newsletterRouter.delete('/:email',        authMiddleware, validate(unsubscribeSchema), newsletterController.unsubscribe);
newsletterRouter.get('/subscribers',      authMiddleware, newsletterController.list);
