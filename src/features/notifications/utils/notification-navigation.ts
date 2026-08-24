import { routes } from '@/routes/routes';
import type { UserRole } from '@/types/auth';

import type { NotificationData, NotificationDto } from '../types/notification';

export function parseNotificationData(data: string | null): NotificationData {
  if (!data) {
    return {};
  }

  try {
    return JSON.parse(data) as NotificationData;
  } catch {
    return {};
  }
}

export function getNotificationHref(
  notification: NotificationDto,
  role: UserRole | undefined,
): string | null {
  const data = parseNotificationData(notification.data);

  switch (notification.type) {
    case 'PatientLinkRequested':
    case 'ExercisesCompleted':
    case 'DailyFeedbackReceived':
      return routes.doctor.patients;

    case 'LinkApproved':
    case 'LinkRejected':
    case 'PatientRemoved':
      return data.doctorId ? `${routes.patient.doctors}/${data.doctorId}` : routes.patient.doctors;

    case 'ExercisesAssigned':
    case 'ProgramCreated':
    case 'ExerciseReminder':
      return routes.patient.exercises;

    case 'DoctorPendingActivation':
      return routes.admin.doctors;

    case 'DoctorActivated':
      return routes.doctor.root;

    default:
      if (role === 'Admin') return routes.admin.root;
      if (role === 'ClinicManager') return routes.doctor.root;
      if (role === 'Doctor') return routes.doctor.root;
      if (role === 'Patient') return routes.patient.root;
      return null;
  }
}
