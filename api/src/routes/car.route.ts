import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { carController } from '../controllers/car.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createCarSchema,
  updateCarSchema,
  carIdSchema,
  listCarsSchema,
} from '../validators/car.validator';

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'uploads', 'cars'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

export const carRouter = Router();

carRouter.get('/',    validate(listCarsSchema),  carController.list);
carRouter.get('/:id', validate(carIdSchema),     carController.getOne);
carRouter.post('/',   authMiddleware, validate(createCarSchema), carController.create);
carRouter.put('/:id', authMiddleware, validate(updateCarSchema), carController.update);
carRouter.delete('/:id', authMiddleware, validate(carIdSchema),  carController.remove);

carRouter.post('/:id/images', authMiddleware, upload.array('files', 20), carController.uploadImages);
carRouter.delete('/:id/images/:imageId', authMiddleware, carController.deleteImage);
