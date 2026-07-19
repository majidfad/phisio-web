import { httpClient } from '@/api/http-client';

import type { CreateDoctorRequest, DoctorDto, UpdateDoctorRequest } from '../types/doctor';

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

  async create(request: CreateDoctorRequest): Promise<DoctorDto> {
    const { data } = await httpClient.post<DoctorDto>(DOCTORS_BASE, request);

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
};
