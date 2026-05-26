import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service';

export const settingsController = {
  async get(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.getSettings();
      res.json({ success: true, data: settings });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.updateSettings(req.body);
      res.json({ success: true, data: settings });
    } catch (err) { next(err); }
  },
};
