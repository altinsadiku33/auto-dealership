import { Request, Response, NextFunction } from 'express';
import { inquiryService } from '../services/inquiry.service';

export const inquiryController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query as { status?: string };
      const inquiries = await inquiryService.listInquiries(req.user, status);
      res.json({ success: true, data: inquiries });
    } catch (err) { next(err); }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inquiry = await inquiryService.getInquiry(+req.params['id']!, req.user);
      res.json({ success: true, data: inquiry });
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inquiry = await inquiryService.createInquiry(req.body);
      res.status(201).json({ success: true, data: inquiry });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inquiry = await inquiryService.updateInquiry(+req.params['id']!, req.body, req.user);
      res.json({ success: true, data: inquiry });
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await inquiryService.deleteInquiry(+req.params['id']!, req.user);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
