import { carRepository, CarFilters } from '../repositories/car.repository';
import { NotFoundError } from '../middlewares/app-error';
import { ERROR_CODES } from '../constants/errors';
import { z } from 'zod';
import { createCarSchema, updateCarSchema } from '../validators/car.validator';

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
};
