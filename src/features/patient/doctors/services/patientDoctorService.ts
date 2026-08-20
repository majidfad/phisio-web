import { httpClient } from '@/api/http-client';

import type {
  PatientDoctorClinicOptionDto,
  PatientDoctorDirectoryItemDto,
  PatientDoctorProfileDto,
  PatientLinkedDoctorDto,
  RequestPatientDoctorLinkRequest,
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
    const { data } = await httpClient.get<PatientLinkedDoctorDto[]>(`${PATIENT_DOCTORS_BASE}/mine`);
    return data;
  },

  async getProfile(doctorId: string, clinicId?: string): Promise<PatientDoctorProfileDto> {
    const { data } = await httpClient.get<PatientDoctorProfileDto>(
      `${PATIENT_DOCTORS_BASE}/${doctorId}`,
      {
        params: clinicId ? { clinicId } : undefined,
      },
    );
    return data;
  },

  async getDoctorClinics(doctorId: string): Promise<PatientDoctorClinicOptionDto[]> {
    const { data } = await httpClient.get<PatientDoctorClinicOptionDto[]>(
      `${PATIENT_DOCTORS_BASE}/${doctorId}/clinics`,
    );
    return data;
  },

  async requestLink(
    doctorId: string,
    request: RequestPatientDoctorLinkRequest,
  ): Promise<PatientLinkedDoctorDto> {
    const { data } = await httpClient.post<PatientLinkedDoctorDto>(
      `${PATIENT_DOCTORS_BASE}/${doctorId}/request`,
      request,
    );
    return data;
  },

  async cancelRequest(doctorId: string, clinicId: string): Promise<void> {
    await httpClient.delete(`${PATIENT_DOCTORS_BASE}/${doctorId}/request`, {
      params: { clinicId },
    });
  },

  async unlink(doctorId: string, clinicId: string): Promise<void> {
    await httpClient.delete(`${PATIENT_DOCTORS_BASE}/${doctorId}`, {
      params: { clinicId },
    });
  },
};
