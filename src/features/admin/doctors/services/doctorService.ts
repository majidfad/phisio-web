import { httpClient } from '@/api/http-client';

import type {
  AdminSetPasswordRequest,
  AdminSetPasswordResponse,
} from '../../password/types/admin-password';
import type {
  CreateDoctorRequest,
  CreateDoctorResponse,
  DoctorDto,
  UpdateDoctorRequest,
} from '../types/doctor';

const DOCTORS_BASE = '/admin/doctors';

export const doctorService = {
  async getAll(isEnabled = true): Promise<DoctorDto[]> {
    const { data } = await httpClient.get<DoctorDto[]>(DOCTORS_BASE, {
      params: { isEnabled },
    });

    return data;
  },

  async getById(id: string): Promise<DoctorDto> {
    const { data } = await httpClient.get<DoctorDto>(`${DOCTORS_BASE}/${id}`);

    return data;
  },

  async create(request: CreateDoctorRequest): Promise<CreateDoctorResponse> {
    const { data } = await httpClient.post<CreateDoctorResponse>(DOCTORS_BASE, request);

    return data;
  },

  async update(id: string, request: UpdateDoctorRequest): Promise<DoctorDto> {
    const { data } = await httpClient.put<DoctorDto>(`${DOCTORS_BASE}/${id}`, request);

    return data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${DOCTORS_BASE}/${id}`);
  },

  async activate(id: string): Promise<void> {
    await httpClient.patch(`${DOCTORS_BASE}/${id}/activate`);
  },

  async deactivate(id: string): Promise<void> {
    await httpClient.patch(`${DOCTORS_BASE}/${id}/deactivate`);
  },

  async setPassword(
    id: string,
    request: AdminSetPasswordRequest,
  ): Promise<AdminSetPasswordResponse> {
    const { data } = await httpClient.put<AdminSetPasswordResponse>(
      `${DOCTORS_BASE}/${id}/password`,
      request,
    );

    return data;
  },
};
