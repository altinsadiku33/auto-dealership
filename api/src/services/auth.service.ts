import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { UnauthorizedError, NotFoundError, ConflictError, AppError } from '../middlewares/app-error';
import { ERROR_CODES } from '../constants/errors';
import { env } from '../env';
import { z } from 'zod';
import { createUserSchema, updateUserSchema } from '../validators/auth.validator';

type CreateUserInput = z.infer<typeof createUserSchema>['body'];
type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.active) throw new UnauthorizedError('INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError('INVALID_CREDENTIALS');

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as `${number}${'s' | 'm' | 'h' | 'd' | 'w'}` }
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND, 'User');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new AppError(ERROR_CODES.WRONG_PASSWORD, 'Current password is incorrect', 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await userRepository.update(userId, { password: hashed });
  },
};

export const userService = {
  async listUsers() {
    return userRepository.findAll();
  },

  async getUser(id: number) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError(ERROR_CODES.USER_NOT_FOUND, 'User');
    return user;
  },

  async createUser(data: CreateUserInput) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError(ERROR_CODES.EMAIL_ALREADY_EXISTS, 'Email already in use');
    const hashed = await bcrypt.hash(data.password, 12);
    return userRepository.create({ ...data, password: hashed });
  },

  async updateUser(id: number, data: UpdateUserInput) {
    await this.getUser(id);
    const update: Record<string, unknown> = { ...data };
    if (data.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing.id !== id) throw new ConflictError(ERROR_CODES.EMAIL_ALREADY_EXISTS, 'Email already in use');
    }
    if (data.password) {
      update['password'] = await bcrypt.hash(data.password, 12);
    }
    return userRepository.update(id, update);
  },

  async deleteUser(requesterId: number, targetId: number) {
    if (requesterId === targetId) throw new ConflictError(ERROR_CODES.CANNOT_DELETE_SELF, 'Cannot delete your own account');
    if (targetId === 1) throw new ConflictError(ERROR_CODES.CANNOT_DELETE_ADMIN, 'Cannot delete the default admin');
    await this.getUser(targetId);
    return userRepository.delete(targetId);
  },
};
