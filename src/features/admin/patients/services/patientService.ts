import { httpClient } from '@/api/http-client';

import type { CreatePatientRequest, PatientDto, UpdatePatientRequest } from '../types/patient';

const PATIENTS_BASE = '/admin/patients';

export const patientService = {
  async getAll(isEnabled = true): Promise<PatientDto[]> {
    const { data } = await httpClient.get<PatientDto[]>(PATIENTS_BASE, {
      params: { isEnabled },
    });

    return data;
  },

  async getById(id: string): Promise<PatientDto> {
    const { data } = await httpClient.get<PatientDto>(`${PATIENTS_BASE}/${id}`);

    return data;
  },

  async create(request: CreatePatientRequest): Promise<PatientDto> {
    const { data } = await httpClient.post<PatientDto>(PATIENTS_BASE, request);

    return data;
  },

  async update(id: string, request: UpdatePatientRequest): Promise<PatientDto> {
    const { data } = await httpClient.put<PatientDto>(`${PATIENTS_BASE}/${id}`, request);

    return data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${PATIENTS_BASE}/${id}`);
  },

  async activate(id: string): Promise<void> {
    await httpClient.patch(`${PATIENTS_BASE}/${id}/activate`);
  },
};
