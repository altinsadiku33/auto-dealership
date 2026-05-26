import { Router } from 'express';
import { inquiryController } from '../controllers/inquiry.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createInquirySchema,
  updateInquirySchema,
  inquiryIdSchema,
} from '../validators/inquiry.validator';

export const inquiryRouter = Router();

inquiryRouter.get('/',    authMiddleware, inquiryController.list);
inquiryRouter.get('/:id', authMiddleware, validate(inquiryIdSchema),      inquiryController.getOne);
inquiryRouter.post('/',   validate(createInquirySchema),                  inquiryController.create);
inquiryRouter.put('/:id', authMiddleware, validate(updateInquirySchema),  inquiryController.update);
inquiryRouter.delete('/:id', authMiddleware, validate(inquiryIdSchema),   inquiryController.remove);
