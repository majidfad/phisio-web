import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { doctorExerciseService } from '@/features/doctor/exercises/services/doctorExerciseService';
import { doctorExerciseQueryKeys } from '@/features/doctor/exercises/hooks/doctor-exercise-query-keys';

import { doctorPatientService } from '../services/doctorPatientService';
import type {
  AddDoctorPatientRequest,
  DoctorPatientClinicActionRequest,
} from '../types/doctor-patient';
import type { AssignPatientExercisesRequest } from '../types/patient-exercise-plan';
import type {
  CreateExerciseProgramRequest,
  UpdateExerciseProgramRequest,
} from '../types/exercise-program';

import { doctorPatientQueryKeys } from './doctor-patient-query-keys';

export function useDoctorPatients(clinicId?: string | null) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.list(clinicId),
    queryFn: () => doctorPatientService.getAll(clinicId ?? undefined),
  });
}

export function useDoctorPatientRequests(clinicId?: string | null) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.requests(clinicId),
    queryFn: () => doctorPatientService.getPendingRequests(clinicId ?? undefined),
  });
}

export function useDoctorClinics() {
  return useQuery({
    queryKey: doctorPatientQueryKeys.clinics(),
    queryFn: () => doctorPatientService.getMyClinics(),
  });
}

export function useLookupDoctorPatient() {
  return useMutation({
    mutationFn: (phoneNumber: string) => doctorPatientService.lookupByPhone(phoneNumber),
  });
}

export function useAddDoctorPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddDoctorPatientRequest) => doctorPatientService.addPatient(request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.clinics() }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.all }),
      ]);
    },
  });
}

export function useApproveDoctorPatientRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, clinicId }: DoctorPatientClinicActionRequest) =>
      doctorPatientService.approveRequest(patientId, clinicId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.clinics() }),
      ]);
    },
  });
}

export function useRejectDoctorPatientRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, clinicId }: DoctorPatientClinicActionRequest) =>
      doctorPatientService.rejectRequest(patientId, clinicId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.clinics() }),
      ]);
    },
  });
}

export function useRemoveDoctorPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, clinicId }: DoctorPatientClinicActionRequest) =>
      doctorPatientService.remove(patientId, clinicId),
    onMutate: async ({ patientId, clinicId }) => {
      await queryClient.cancelQueries({ queryKey: doctorPatientQueryKeys.lists() });
      const previous = queryClient.getQueriesData({ queryKey: doctorPatientQueryKeys.lists() });

      queryClient.setQueriesData({ queryKey: doctorPatientQueryKeys.lists() }, (current) =>
        Array.isArray(current)
          ? current.filter(
              (patient: { patientId: string; clinicId: string }) =>
                !(patient.patientId === patientId && patient.clinicId === clinicId),
            )
          : current,
      );

      return { previous };
    },
    onError: (_error, _patientId, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: doctorPatientQueryKeys.clinics() }),
      ]);
    },
  });
}

export function usePatientExercisePlan(patientId: string | null, clinicId?: string | null) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.exercises(patientId ?? '', clinicId),
    queryFn: () => doctorPatientService.getPatientExercises(patientId!, clinicId ?? undefined),
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

export function useAssignPatientExercises(patientId: string, clinicId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AssignPatientExercisesRequest) =>
      doctorPatientService.assignExercises(patientId, request, clinicId ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: doctorPatientQueryKeys.exercises(patientId, clinicId),
      });
    },
  });
}

export function usePatientExerciseHistory(
  patientId: string | null,
  params: { page?: number; pageSize?: number } = {},
  clinicId?: string | null,
) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  return useQuery({
    queryKey: doctorPatientQueryKeys.exerciseHistoryPage(patientId ?? '', page, pageSize, clinicId),
    queryFn: () =>
      doctorPatientService.getExerciseHistory(
        patientId!,
        { page, pageSize },
        clinicId ?? undefined,
      ),
    enabled: Boolean(patientId),
    placeholderData: (previous) => previous,
  });
}

export function usePatientOverview(patientId: string | null, clinicId?: string | null) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.overview(patientId ?? '', clinicId),
    queryFn: () => doctorPatientService.getPatientOverview(patientId!, clinicId ?? undefined),
    enabled: Boolean(patientId),
  });
}

export function useSavePatientProgram(patientId: string, clinicId?: string | null) {
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
        ? doctorPatientService.updateProgram(patientId, programId, request, clinicId ?? undefined)
        : doctorPatientService.createProgram(patientId, request, clinicId ?? undefined),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.overview(patientId, clinicId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.programs(patientId, clinicId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exercises(patientId, clinicId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exerciseHistory(patientId, clinicId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exerciseStats(patientId, clinicId),
        }),
      ]);
    },
  });
}

export function useDeletePatientProgram(patientId: string, clinicId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) =>
      doctorPatientService.deleteProgram(patientId, programId, clinicId ?? undefined),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.overview(patientId, clinicId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.programs(patientId, clinicId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exercises(patientId, clinicId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exerciseHistory(patientId, clinicId),
        }),
        queryClient.invalidateQueries({
          queryKey: doctorPatientQueryKeys.exerciseStats(patientId, clinicId),
        }),
      ]);
    },
  });
}

export function usePatientExerciseStats(
  patientId: string | null,
  params: { from: string; to: string } | null,
  clinicId?: string | null,
) {
  return useQuery({
    queryKey: doctorPatientQueryKeys.exerciseStatsRange(
      patientId ?? '',
      params?.from ?? '',
      params?.to ?? '',
      clinicId,
    ),
    queryFn: () =>
      doctorPatientService.getExerciseStats(
        patientId!,
        {
          from: params!.from,
          to: params!.to,
        },
        clinicId ?? undefined,
      ),
    enabled: Boolean(patientId && params),
  });
}
