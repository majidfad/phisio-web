import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { patientVisitService } from '../services/patientVisitService';
import { patientVisitQueryKeys } from './patient-visit-query-keys';
import type {
  RegisterPatientVisitRequest,
  SubmitVisitFeedbackRequest,
} from '../types/patient-visit';

export function usePatientMostRecentVisit(
  patientId: string | null | undefined,
  params?: { clinicId?: string | null; doctorId?: string | null },
) {
  return useQuery({
    queryKey: patientVisitQueryKeys.recentForPatient(
      patientId ?? '',
      params?.clinicId ?? null,
      params?.doctorId ?? null,
    ),
    queryFn: () =>
      patientVisitService.getMostRecentVisit(patientId!, {
        clinicId: params?.clinicId ?? undefined,
        doctorId: params?.doctorId ?? undefined,
      }),
    enabled: Boolean(patientId),
    placeholderData: (prev) => prev,
  });
}

export function usePatientVisitHistory(
  patientId: string | null | undefined,
  params: {
    clinicId?: string | null;
    doctorId?: string | null;
    page?: number;
    pageSize?: number;
    search?: string | null;
  } = {},
) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  return useQuery({
    queryKey: patientVisitQueryKeys.historyForPatient(
      patientId ?? '',
      params.clinicId ?? null,
      params.doctorId ?? null,
      page,
      pageSize,
      params.search ?? null,
    ),
    queryFn: () =>
      patientVisitService.getPatientHistory(patientId!, {
        clinicId: params.clinicId ?? undefined,
        doctorId: params.doctorId ?? undefined,
        page,
        pageSize,
        search: params.search ?? undefined,
      }),
    enabled: Boolean(patientId),
    placeholderData: (prev) => prev,
  });
}

export function useMyPatientVisits(
  params: {
    clinicId?: string | null;
    doctorId?: string | null;
    page?: number;
    pageSize?: number;
    search?: string | null;
  } = {},
) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  return useQuery({
    queryKey: patientVisitQueryKeys.myHistory(
      params.clinicId ?? null,
      params.doctorId ?? null,
      page,
      pageSize,
      params.search ?? null,
    ),
    queryFn: () =>
      patientVisitService.getMyVisits({
        clinicId: params.clinicId ?? undefined,
        doctorId: params.doctorId ?? undefined,
        page,
        pageSize,
        search: params.search ?? undefined,
      }),
    enabled: true,
    placeholderData: (prev) => prev,
  });
}

export function useDoctorVisits(
  doctorId: string | null | undefined,
  params: {
    clinicId?: string | null;
    page?: number;
    pageSize?: number;
    search?: string | null;
  } = {},
) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  return useQuery({
    queryKey: patientVisitQueryKeys.doctorVisits(
      doctorId ?? '',
      params.clinicId ?? null,
      page,
      pageSize,
      params.search ?? null,
    ),
    queryFn: () =>
      patientVisitService.getDoctorVisits(doctorId!, {
        clinicId: params.clinicId ?? undefined,
        page,
        pageSize,
        search: params.search ?? undefined,
      }),
    enabled: Boolean(doctorId),
    placeholderData: (prev) => prev,
  });
}

export function useClinicVisits(
  clinicId: string | null | undefined,
  params: {
    doctorId?: string | null;
    page?: number;
    pageSize?: number;
    search?: string | null;
  } = {},
) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;

  return useQuery({
    queryKey: patientVisitQueryKeys.clinicVisits(
      clinicId ?? '',
      params.doctorId ?? null,
      page,
      pageSize,
      params.search ?? null,
    ),
    queryFn: () =>
      patientVisitService.getClinicVisits(clinicId!, {
        doctorId: params.doctorId ?? undefined,
        page,
        pageSize,
        search: params.search ?? undefined,
      }),
    enabled: Boolean(clinicId),
    placeholderData: (prev) => prev,
  });
}

export function useRegisterPatientVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RegisterPatientVisitRequest) =>
      patientVisitService.registerVisit(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientVisitQueryKeys.all });
    },
  });
}

export function useSubmitVisitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, request }: { visitId: string; request: SubmitVisitFeedbackRequest }) =>
      patientVisitService.submitVisitFeedback(visitId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientVisitQueryKeys.all });
    },
  });
}
