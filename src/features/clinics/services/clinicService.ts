import { httpClient } from '@/api/http-client';

import type {
  ChangeClinicManagerRequest,
  ClinicDoctorCandidateDto,
  ClinicDoctorMemberDto,
  ClinicDto,
  ClinicPatientDto,
  ClinicPhoneLookupResultDto,
  CreateClinicRequest,
  UpdateClinicRequest,
} from '../types/clinic';
import type { ClinicAdherenceResponse } from '../types/clinic-adherence';

const CLINICS_BASE = '/clinics';

export const clinicService = {
  async getAll(isEnabled = true): Promise<ClinicDto[]> {
    const { data } = await httpClient.get<ClinicDto[]>(CLINICS_BASE, {
      params: { isEnabled },
    });

    return data;
  },

  async getById(id: string): Promise<ClinicDto> {
    const { data } = await httpClient.get<ClinicDto>(`${CLINICS_BASE}/${id}`);

    return data;
  },

  async create(request: CreateClinicRequest): Promise<ClinicDto> {
    const { data } = await httpClient.post<ClinicDto>(CLINICS_BASE, request);

    return data;
  },

  async update(id: string, request: UpdateClinicRequest): Promise<ClinicDto> {
    const { data } = await httpClient.put<ClinicDto>(`${CLINICS_BASE}/${id}`, request);

    return data;
  },

  async changeManager(id: string, request: ChangeClinicManagerRequest): Promise<ClinicDto> {
    const { data } = await httpClient.put<ClinicDto>(`${CLINICS_BASE}/${id}/manager`, request);

    return data;
  },

  async disable(id: string): Promise<void> {
    await httpClient.delete(`${CLINICS_BASE}/${id}`);
  },

  async getDoctors(clinicId: string): Promise<ClinicDoctorMemberDto[]> {
    const { data } = await httpClient.get<ClinicDoctorMemberDto[]>(
      `${CLINICS_BASE}/${clinicId}/doctors`,
    );

    return data;
  },

  async getPatients(clinicId: string, doctorId?: string): Promise<ClinicPatientDto[]> {
    const { data } = await httpClient.get<ClinicPatientDto[]>(
      `${CLINICS_BASE}/${clinicId}/patients`,
      { params: doctorId ? { doctorId } : undefined },
    );

    return data;
  },

  async getAdherence(clinicId: string, doctorId?: string): Promise<ClinicAdherenceResponse> {
    const { data } = await httpClient.get<ClinicAdherenceResponse>(
      `${CLINICS_BASE}/${clinicId}/adherence`,
      { params: doctorId ? { doctorId } : undefined },
    );

    return data;
  },

  async getDoctorCandidates(): Promise<ClinicDoctorCandidateDto[]> {
    const { data } = await httpClient.get<ClinicDoctorCandidateDto[]>(
      `${CLINICS_BASE}/doctor-candidates`,
    );

    return data;
  },

  async lookupByPhones(phoneNumbers: string[]): Promise<ClinicPhoneLookupResultDto> {
    const { data } = await httpClient.post<ClinicPhoneLookupResultDto>(
      `${CLINICS_BASE}/lookup-by-phones`,
      { phoneNumbers },
    );

    return data;
  },

  async addDoctor(clinicId: string, doctorId: string): Promise<ClinicDoctorMemberDto> {
    const { data } = await httpClient.post<ClinicDoctorMemberDto>(
      `${CLINICS_BASE}/${clinicId}/doctors/${doctorId}`,
    );

    return data;
  },

  async removeDoctor(clinicId: string, doctorId: string): Promise<void> {
    await httpClient.delete(`${CLINICS_BASE}/${clinicId}/doctors/${doctorId}`);
  },
};
