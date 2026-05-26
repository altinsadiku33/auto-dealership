import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateSettingsSchema } from '../validators/settings.validator';

export const settingsRouter = Router();

settingsRouter.get('/',  settingsController.get);
settingsRouter.put('/',  authMiddleware, requireRole('admin', 'manager'), validate(updateSettingsSchema), settingsController.update);
