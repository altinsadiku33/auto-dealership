import { Request, Response, NextFunction } from 'express';
import { carService } from '../services/car.service';

export const carController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, status, make, search } = req.query as Record<string, string>;
      const cars = await carService.listCars({ category, status, make, search });
      res.json({ success: true, data: cars });
    } catch (err) { next(err); }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const car = await carService.getCar(+req.params['id']!);
      res.json({ success: true, data: car });
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const car = await carService.createCar(req.body);
      res.status(201).json({ success: true, data: car });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const car = await carService.updateCar(+req.params['id']!, req.body);
      res.json({ success: true, data: car });
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await carService.deleteCar(+req.params['id']!);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
