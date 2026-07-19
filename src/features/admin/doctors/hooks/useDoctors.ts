import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminListFilterToIsEnabled,
  type AdminListFilter,
} from '@/features/admin/types/admin-list-filter';

import { doctorService } from '../services/doctorService';

import type { CreateDoctorRequest, UpdateDoctorRequest } from '../types/doctor';

import { doctorQueryKeys } from './doctor-query-keys';

export function useDoctors(filter: AdminListFilter = 'active') {
  const isEnabled = adminListFilterToIsEnabled(filter);

  return useQuery({
    queryKey: doctorQueryKeys.list(isEnabled),

    queryFn: () => doctorService.getAll(isEnabled),
  });
}

export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: doctorQueryKeys.detail(id ?? ''),

    queryFn: () => doctorService.getById(id!),

    enabled: Boolean(id),
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateDoctorRequest) => doctorService.create(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorQueryKeys.lists() });
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateDoctorRequest }) =>
      doctorService.update(id, request),

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: doctorQueryKeys.lists() });

      await queryClient.invalidateQueries({ queryKey: doctorQueryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorService.delete(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorQueryKeys.lists() });
    },
  });
}

export function useActivateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorService.activate(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorQueryKeys.lists() });
    },
  });
}

export function useDeactivateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorService.deactivate(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: doctorQueryKeys.lists() });
    },
  });
}
