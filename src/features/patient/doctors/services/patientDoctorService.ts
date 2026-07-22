import { httpClient } from '@/api/http-client';

import type {
  PatientDoctorDirectoryItemDto,
  PatientDoctorProfileDto,
  PatientLinkedDoctorDto,
} from '../types/patient-doctor';

const PATIENT_DOCTORS_BASE = '/patient/doctors';

export const patientDoctorService = {
  async search(params?: {
    search?: string;
    specialty?: string;
  }): Promise<PatientDoctorDirectoryItemDto[]> {
    const { data } = await httpClient.get<PatientDoctorDirectoryItemDto[]>(PATIENT_DOCTORS_BASE, {
      params,
    });
    return data;
  },

  async getMine(): Promise<PatientLinkedDoctorDto[]> {
    const { data } = await httpClient.get<PatientLinkedDoctorDto[]>(
      `${PATIENT_DOCTORS_BASE}/mine`,
    );
    return data;
  },

  async getProfile(doctorId: string): Promise<PatientDoctorProfileDto> {
    const { data } = await httpClient.get<PatientDoctorProfileDto>(
      `${PATIENT_DOCTORS_BASE}/${doctorId}`,
    );
    return data;
  },

  async requestLink(doctorId: string): Promise<PatientLinkedDoctorDto> {
    const { data } = await httpClient.post<PatientLinkedDoctorDto>(
      `${PATIENT_DOCTORS_BASE}/${doctorId}/request`,
    );
    return data;
  },

  async cancelRequest(doctorId: string): Promise<void> {
    await httpClient.delete(`${PATIENT_DOCTORS_BASE}/${doctorId}/request`);
  },

  async unlink(doctorId: string): Promise<void> {
    await httpClient.delete(`${PATIENT_DOCTORS_BASE}/${doctorId}`);
  },
};
