import { Request, Response, NextFunction } from 'express';
import { authService, userService } from '../services/auth.service';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async me(req: Request, res: Response): Promise<void> {
    res.json({ success: true, data: req.user });
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.json({ success: true });
  },

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.changePassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};

export const userController = {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.listUsers();
      res.json({ success: true, data: users });
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      const { password: _, ...safe } = user;
      res.status(201).json({ success: true, data: safe });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUser(+req.params['id']!, req.body);
      const { password: _, ...safe } = user;
      res.json({ success: true, data: safe });
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.user!.userId, +req.params['id']!);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
