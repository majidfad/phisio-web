export const ReminderRepeatMode = {
  Daily: 1,
  DaysOfWeek: 2,
  Interval: 3,
} as const;

export type ReminderRepeatMode = (typeof ReminderRepeatMode)[keyof typeof ReminderRepeatMode];

export interface PatientReminderSettingsDto {
  exerciseRemindersEnabled: boolean;
  preferredReminderTime: string;
  timeZoneId: string;
  repeatMode: ReminderRepeatMode;
  daysOfWeekMask: number;
  intervalDays: number;
  anchorDate: string | null;
  followUpEnabled: boolean;
  followUpReminderTime: string;
}

export interface UpdatePatientReminderSettingsRequest {
  exerciseRemindersEnabled: boolean;
  preferredReminderTime: string;
  timeZoneId?: string;
  repeatMode: ReminderRepeatMode;
  daysOfWeekMask: number;
  intervalDays: number;
  followUpEnabled: boolean;
  followUpReminderTime?: string;
}

export const ALL_DAYS_MASK = 0b1111111;
export const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6] as const;

export function buildDaysOfWeekMask(days: number[]): number {
  return days.reduce((mask, day) => mask | (1 << day), 0);
}

export function daysFromMask(mask: number): number[] {
  return WEEKDAY_VALUES.filter((day) => (mask & (1 << day)) !== 0);
}
