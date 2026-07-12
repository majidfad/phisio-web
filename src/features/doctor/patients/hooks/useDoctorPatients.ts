import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { exerciseCatalogService } from '@/features/exercises/services/exerciseCatalogService';

import { doctorPatientService } from '../services/doctorPatientService';
import type { AddDoctorPatientRequest } from '../types/doctor-patient';
import type { AssignPatientExercisesRequest } from '../types/patient-exercise-plan';

import { doctorPatientQueryKeys, exerciseCatalogQueryKeys } from './doctor-patient-query-keys';

export function useDoctorPatients() {
  return useQuery({
    queryKey: doctorPatientQueryKeys.list(),
    queryFn: () => doctorPatientService.getAll(),
  });
}

export function useAddDoctorPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddDoctorPatientRequest) => doctorPatientService.add(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.lists() });
    },
  });
}

export function useRemoveDoctorPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => doctorPatientService.remove(patientId),
    onMutate: async (patientId) => {
      await queryClient.cancelQueries({ queryKey: doctorPatientQueryKeys.list() });
      const previous = queryClient.getQueryData(doctorPatientQueryKeys.list());

      queryClient.setQueryData(doctorPatientQueryKeys.list(), (current: typeof previous) =>
        Array.isArray(current)
          ? current.filter((patient) => patient.patientId !== patientId)
          : current,
      );

      return { previous };
    },
    onError: (_error, _patientId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(doctorPatientQueryKeys.list(), context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.lists() });
    },
  });
}

export function usePatientExercisePlan(patientId: string | null) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.exercises(patientId ?? ''),
    queryFn: () => doctorPatientService.getPatientExercises(patientId!),
    enabled: Boolean(patientId),
  });
}

export function useExerciseCatalog(enabled: boolean) {
  return useQuery({
    queryKey: exerciseCatalogQueryKeys.list(),
    queryFn: () => exerciseCatalogService.getAll(),
    enabled,
  });
}

export function useAssignPatientExercises(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AssignPatientExercisesRequest) =>
      doctorPatientService.assignExercises(patientId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: doctorPatientQueryKeys.exercises(patientId),
      });
    },
  });
}

export function usePatientExerciseHistory(patientId: string | null) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.exerciseHistory(patientId ?? ''),
    queryFn: () => doctorPatientService.getExerciseHistory(patientId!),
    enabled: Boolean(patientId),
  });
}
