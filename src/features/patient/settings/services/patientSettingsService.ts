import { httpClient } from '@/api/http-client';

import type {
  PatientReminderSettingsDto,
  UpdatePatientReminderSettingsRequest,
} from '../types/reminder-settings';

const BASE = '/patient/settings/reminders';

export const patientSettingsService = {
  async getReminderSettings(): Promise<PatientReminderSettingsDto> {
    const { data } = await httpClient.get<PatientReminderSettingsDto>(BASE);
    return data;
  },

  async updateReminderSettings(
    request: UpdatePatientReminderSettingsRequest,
  ): Promise<PatientReminderSettingsDto> {
    const { data } = await httpClient.put<PatientReminderSettingsDto>(BASE, request);
    return data;
  },
};
