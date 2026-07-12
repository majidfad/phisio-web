import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminListFilterToIsEnabled,
  type AdminListFilter,
} from '@/features/admin/types/admin-list-filter';

import { patientService } from '../services/patientService';

import type { CreatePatientRequest, UpdatePatientRequest } from '../types/patient';

import { patientQueryKeys } from './patient-query-keys';

export function usePatients(filter: AdminListFilter = 'active') {
  const isEnabled = adminListFilterToIsEnabled(filter);

  return useQuery({
    queryKey: patientQueryKeys.list(isEnabled),

    queryFn: () => patientService.getAll(isEnabled),
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: patientQueryKeys.detail(id ?? ''),

    queryFn: () => patientService.getById(id!),

    enabled: Boolean(id),
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePatientRequest) => patientService.create(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists() });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdatePatientRequest }) =>
      patientService.update(id, request),

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists() });

      await queryClient.invalidateQueries({ queryKey: patientQueryKeys.detail(variables.id) });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.delete(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists() });
    },
  });
}

export function useActivatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.activate(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists() });
    },
  });
}
