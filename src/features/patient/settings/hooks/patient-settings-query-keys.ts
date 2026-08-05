export const patientSettingsQueryKeys = {
  all: ['patient-settings'] as const,
  reminders: () => [...patientSettingsQueryKeys.all, 'reminders'] as const,
};
