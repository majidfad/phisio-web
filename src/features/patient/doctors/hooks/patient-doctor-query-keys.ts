export const patientDoctorQueryKeys = {
  all: ['patient-doctors'] as const,
  directory: (search: string, specialty: string) =>
    [...patientDoctorQueryKeys.all, 'directory', search, specialty] as const,
  mine: () => [...patientDoctorQueryKeys.all, 'mine'] as const,
  profile: (doctorId: string, clinicId = '') =>
    [...patientDoctorQueryKeys.all, 'profile', doctorId, clinicId] as const,
  clinics: (doctorId: string) => [...patientDoctorQueryKeys.all, 'clinics', doctorId] as const,
};
