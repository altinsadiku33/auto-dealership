import { Router } from 'express';
import { authController, userController } from '../controllers/auth.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from '../validators/auth.validator';

export const authRouter = Router();
export const userRouter = Router();

// Auth
authRouter.post('/login',           validate(loginSchema),           authController.login);
authRouter.post('/logout',          authMiddleware,                  authController.logout);
authRouter.get('/me',               authMiddleware,                  authController.me);
authRouter.post('/change-password', authMiddleware,                  authController.changePassword);

// Users — list available to admin+manager; mutations admin-only
userRouter.get('/',       authMiddleware, requireRole('admin', 'manager'),                 userController.list);
userRouter.post('/',      authMiddleware, requireRole('admin'),   validate(createUserSchema), userController.create);
userRouter.put('/:id',    authMiddleware, requireRole('admin'),   validate(updateUserSchema), userController.update);
userRouter.delete('/:id', authMiddleware, requireRole('admin'),   validate(userIdSchema),     userController.remove);
