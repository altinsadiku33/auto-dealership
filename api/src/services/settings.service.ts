import { settingsRepository } from '../repositories/settings.repository';
import { z } from 'zod';
import { updateSettingsSchema } from '../validators/settings.validator';

type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>['body'];

export const settingsService = {
  async getSettings() {
    return settingsRepository.get();
  },

  async updateSettings(data: UpdateSettingsInput) {
    return settingsRepository.update(data);
  },
};
