import { Request, Response, NextFunction } from 'express';
import { newsletterService } from '../services/newsletter.service';

export const newsletterController = {
  async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sub = await newsletterService.subscribe(req.body.email);
      res.status(201).json({ success: true, data: sub });
    } catch (err) { next(err); }
  },

  async unsubscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await newsletterService.unsubscribe(req.params['email']!);
      res.json({ success: true });
    } catch (err) { next(err); }
  },

  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscribers = await newsletterService.listSubscribers();
      res.json({ success: true, data: subscribers, count: subscribers.length });
    } catch (err) { next(err); }
  },
};
