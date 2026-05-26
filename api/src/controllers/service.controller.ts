import { Request, Response, NextFunction } from 'express';
import { dealershipServiceService } from '../services/dealership-service.service';

export const serviceController = {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await dealershipServiceService.listServices();
      res.json({ success: true, data: services });
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await dealershipServiceService.createService(req.body);
      res.status(201).json({ success: true, data: service });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await dealershipServiceService.updateService(+req.params['id']!, req.body);
      res.json({ success: true, data: service });
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await dealershipServiceService.deleteService(+req.params['id']!);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
