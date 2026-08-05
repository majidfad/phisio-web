import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { patientSettingsService } from '../services/patientSettingsService';
import type { UpdatePatientReminderSettingsRequest } from '../types/reminder-settings';
import { patientSettingsQueryKeys } from './patient-settings-query-keys';

export function usePatientReminderSettings(enabled = true) {
  return useQuery({
    queryKey: patientSettingsQueryKeys.reminders(),
    queryFn: () => patientSettingsService.getReminderSettings(),
    enabled,
  });
}

export function useUpdatePatientReminderSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdatePatientReminderSettingsRequest) =>
      patientSettingsService.updateReminderSettings(request),
    onSuccess: async (data) => {
      queryClient.setQueryData(patientSettingsQueryKeys.reminders(), data);
      await queryClient.invalidateQueries({ queryKey: patientSettingsQueryKeys.reminders() });
    },
  });
}
