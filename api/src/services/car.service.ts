import { carRepository, CarFilters } from '../repositories/car.repository';
import { NotFoundError } from '../middlewares/app-error';
import { ERROR_CODES } from '../constants/errors';
import { z } from 'zod';
import { createCarSchema, updateCarSchema } from '../validators/car.validator';
import fs from 'fs';
import path from 'path';

type CreateCarInput = z.infer<typeof createCarSchema>['body'];
type UpdateCarInput = z.infer<typeof updateCarSchema>['body'];

export const carService = {
  async listCars(filters: CarFilters) {
    return carRepository.findAll(filters);
  },

  async getCar(id: number) {
    const car = await carRepository.findById(id);
    if (!car) throw new NotFoundError(ERROR_CODES.CAR_NOT_FOUND, 'Car');
    return car;
  },

  async createCar(data: CreateCarInput) {
    return carRepository.create(data);
  },

  async updateCar(id: number, data: UpdateCarInput) {
    await this.getCar(id);
    return carRepository.update(id, data);
  },

  async deleteCar(id: number) {
    await this.getCar(id);
    return carRepository.delete(id);
  },

  async addImages(carId: number, files: Express.Multer.File[]) {
    const car = await this.getCar(carId);
    const currentCount = car.images.length;
    const images = await Promise.all(
      files.map((file, i) => {
        const url = `/uploads/cars/${file.filename}`;
        return carRepository.addImage(carId, url, currentCount + i);
      })
    );
    return images;
  },

  async deleteImage(carId: number, imageId: number) {
    await this.getCar(carId);
    const image = await carRepository.findImage(imageId);
    if (!image || image.carId !== carId) throw new NotFoundError(ERROR_CODES.CAR_NOT_FOUND, 'Image');

    const filePath = path.join(process.cwd(), 'uploads', 'cars', path.basename(image.url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return carRepository.deleteImage(imageId);
  },
};
