import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminListFilterToIsEnabled,
  type AdminListFilter,
} from '@/features/admin/types/admin-list-filter';

import { clinicService } from '../services/clinicService';
import type { CreateClinicRequest, UpdateClinicRequest } from '../types/clinic';
import { clinicQueryKeys } from './clinic-query-keys';

export function useClinics(filter: AdminListFilter = 'active') {
  const isEnabled = adminListFilterToIsEnabled(filter);

  return useQuery({
    queryKey: clinicQueryKeys.list(isEnabled),
    queryFn: () => clinicService.getAll(isEnabled),
  });
}

export function useClinic(id: string | undefined) {
  return useQuery({
    queryKey: clinicQueryKeys.detail(id ?? ''),
    queryFn: () => clinicService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useClinicDoctors(clinicId: string | undefined) {
  return useQuery({
    queryKey: clinicQueryKeys.doctors(clinicId ?? ''),
    queryFn: () => clinicService.getDoctors(clinicId!),
    enabled: Boolean(clinicId),
  });
}

export function useClinicDoctorCandidates(enabled: boolean) {
  return useQuery({
    queryKey: clinicQueryKeys.doctorCandidates(),
    enabled,
    queryFn: () => clinicService.getDoctorCandidates(),
  });
}

export function useCreateClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateClinicRequest) => clinicService.create(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.doctorCandidates() });
    },
  });
}

export function useUpdateClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateClinicRequest }) =>
      clinicService.update(id, request),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.detail(variables.id) });
    },
  });
}

export function useDisableClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clinicService.disable(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.detail(id) });
    },
  });
}

export function useAddClinicDoctor(clinicId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => clinicService.addDoctor(clinicId!, doctorId),
    onSuccess: async () => {
      if (!clinicId) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.doctors(clinicId) });
      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.doctorCandidates() });
    },
  });
}

export function useRemoveClinicDoctor(clinicId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => clinicService.removeDoctor(clinicId!, doctorId),
    onSuccess: async () => {
      if (!clinicId) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.doctors(clinicId) });
      await queryClient.invalidateQueries({ queryKey: clinicQueryKeys.doctorCandidates() });
    },
  });
}
