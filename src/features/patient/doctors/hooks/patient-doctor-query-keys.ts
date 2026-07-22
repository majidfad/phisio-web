export const patientDoctorQueryKeys = {
  all: ['patient-doctors'] as const,
  directory: (search: string, specialty: string) =>
    [...patientDoctorQueryKeys.all, 'directory', search, specialty] as const,
  mine: () => [...patientDoctorQueryKeys.all, 'mine'] as const,
  profile: (doctorId: string) => [...patientDoctorQueryKeys.all, 'profile', doctorId] as const,
};
