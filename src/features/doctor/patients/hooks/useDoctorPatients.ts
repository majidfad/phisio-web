import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { doctorExerciseService } from '@/features/doctor/exercises/services/doctorExerciseService';
import { doctorExerciseQueryKeys } from '@/features/doctor/exercises/hooks/doctor-exercise-query-keys';

import { doctorPatientService } from '../services/doctorPatientService';
import type { AssignPatientExercisesRequest } from '../types/patient-exercise-plan';
import type {
  CreateExerciseProgramRequest,
  UpdateExerciseProgramRequest,
} from '../types/exercise-program';

import { doctorPatientQueryKeys } from './doctor-patient-query-keys';

export function useDoctorPatients() {
  return useQuery({
    queryKey: doctorPatientQueryKeys.list(),
    queryFn: () => doctorPatientService.getAll(),
  });
}

export function useDoctorPatientRequests() {
  return useQuery({
    queryKey: doctorPatientQueryKeys.requests(),
    queryFn: () => doctorPatientService.getPendingRequests(),
  });
}

export function useApproveDoctorPatientRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => doctorPatientService.approveRequest(patientId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.requests() }),
      ]);
    },
  });
}

export function useRejectDoctorPatientRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) => doctorPatientService.rejectRequest(patientId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.requests() });
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
    queryKey: doctorExerciseQueryKeys.library(),
    queryFn: () => doctorExerciseService.getLibrary(),
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

export function usePatientExerciseHistory(
  patientId: string | null,
  params: { page?: number; pageSize?: number } = {},
) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  return useQuery({
    queryKey: doctorPatientQueryKeys.exerciseHistoryPage(patientId ?? '', page, pageSize),
    queryFn: () => doctorPatientService.getExerciseHistory(patientId!, { page, pageSize }),
    enabled: Boolean(patientId),
    placeholderData: (previous) => previous,
  });
}

export function usePatientOverview(patientId: string | null) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.overview(patientId ?? ''),
    queryFn: () => doctorPatientService.getPatientOverview(patientId!),
    enabled: Boolean(patientId),
  });
}

export function useSavePatientProgram(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programId,
      request,
    }: {
      programId?: string;
      request: CreateExerciseProgramRequest | UpdateExerciseProgramRequest;
    }) =>
      programId
        ? doctorPatientService.updateProgram(patientId, programId, request)
        : doctorPatientService.createProgram(patientId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.overview(patientId) }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.programs(patientId) }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.exercises(patientId) }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exerciseHistory(patientId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exerciseStats(patientId),
        }),
      ]);
    },
  });
}

export function useDeletePatientProgram(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) => doctorPatientService.deleteProgram(patientId, programId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.overview(patientId) }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.programs(patientId) }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.exercises(patientId) }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exerciseHistory(patientId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exerciseStats(patientId),
        }),
      ]);
    },
  });
}

export function usePatientExerciseStats(
  patientId: string | null,
  params: { from: string; to: string } | null,
) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.exerciseStatsRange(
      patientId ?? '',
      params?.from ?? '',
      params?.to ?? '',
    ),
    queryFn: () =>
      doctorPatientService.getExerciseStats(patientId!, {
        from: params!.from,
        to: params!.to,
      }),
    enabled: Boolean(patientId && params),
  });
}
