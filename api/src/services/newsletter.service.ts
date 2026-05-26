import { newsletterRepository } from '../repositories/newsletter.repository';
import { ConflictError, NotFoundError } from '../middlewares/app-error';
import { ERROR_CODES } from '../constants/errors';

export const newsletterService = {
  async subscribe(email: string) {
    const existing = await newsletterRepository.findByEmail(email);
    if (existing) throw new ConflictError(ERROR_CODES.ALREADY_SUBSCRIBED, 'Email already subscribed');
    return newsletterRepository.create(email);
  },

  async unsubscribe(email: string) {
    const existing = await newsletterRepository.findByEmail(email);
    if (!existing) throw new NotFoundError(ERROR_CODES.SUBSCRIBER_NOT_FOUND, 'Subscriber');
    return newsletterRepository.delete(email);
  },

  async listSubscribers() {
    return newsletterRepository.findAll();
  },

  async getCount() {
    return newsletterRepository.count();
  },
};
