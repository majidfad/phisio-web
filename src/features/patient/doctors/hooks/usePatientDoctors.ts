import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { patientDoctorService } from '../services/patientDoctorService';

import { patientDoctorQueryKeys } from './patient-doctor-query-keys';

export function usePatientDoctorDirectory(search: string, specialty: string) {
  return useQuery({
    queryKey: patientDoctorQueryKeys.directory(search, specialty),
    queryFn: () =>
      patientDoctorService.search({
        search: search || undefined,
        specialty: specialty || undefined,
      }),
  });
}

export function useMyDoctors() {
  return useQuery({
    queryKey: patientDoctorQueryKeys.mine(),
    queryFn: () => patientDoctorService.getMine(),
  });
}

export function usePatientDoctorProfile(doctorId: string | null) {
  return useQuery({
    queryKey: patientDoctorQueryKeys.profile(doctorId ?? ''),
    queryFn: () => patientDoctorService.getProfile(doctorId!),
    enabled: Boolean(doctorId),
  });
}

function invalidateDoctorQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: patientDoctorQueryKeys.all });
}

export function useRequestDoctorLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => patientDoctorService.requestLink(doctorId),
    onSuccess: async () => {
      await invalidateDoctorQueries(queryClient);
    },
  });
}

export function useCancelDoctorRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => patientDoctorService.cancelRequest(doctorId),
    onSuccess: async () => {
      await invalidateDoctorQueries(queryClient);
    },
  });
}

export function useUnlinkDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => patientDoctorService.unlink(doctorId),
    onSuccess: async () => {
      await invalidateDoctorQueries(queryClient);
    },
  });
}
