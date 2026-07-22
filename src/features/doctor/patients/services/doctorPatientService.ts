import { httpClient } from '@/api/http-client';

import type { DoctorPatientDto, DoctorPatientRequestDto } from '../types/doctor-patient';
import type {
  AssignPatientExercisesRequest,
  AssignPatientExercisesResultDto,
  DoctorPatientExerciseDto,
} from '../types/patient-exercise-plan';
import type { PatientExerciseHistoryResponse } from '../types/patient-exercise-history';

const DOCTOR_PATIENTS_BASE = '/doctor/patients';

export const doctorPatientService = {
  async getAll(): Promise<DoctorPatientDto[]> {
    const { data } = await httpClient.get<DoctorPatientDto[]>(DOCTOR_PATIENTS_BASE);
    return data;
  },

  async getPendingRequests(): Promise<DoctorPatientRequestDto[]> {
    const { data } = await httpClient.get<DoctorPatientRequestDto[]>(
      `${DOCTOR_PATIENTS_BASE}/requests`,
    );
    return data;
  },

  async approveRequest(patientId: string): Promise<DoctorPatientDto> {
    const { data } = await httpClient.post<DoctorPatientDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/approve`,
    );
    return data;
  },

  async rejectRequest(patientId: string): Promise<void> {
    await httpClient.post(`${DOCTOR_PATIENTS_BASE}/${patientId}/reject`);
  },

  async getPatientExercises(patientId: string): Promise<DoctorPatientExerciseDto[]> {
    const { data } = await httpClient.get<DoctorPatientExerciseDto[]>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercises`,
    );
    return data;
  },

  async assignExercises(
    patientId: string,
    request: AssignPatientExercisesRequest,
  ): Promise<AssignPatientExercisesResultDto> {
    const { data } = await httpClient.post<AssignPatientExercisesResultDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercises`,
      request,
    );
    return data;
  },

  async remove(patientId: string): Promise<void> {
    await httpClient.delete(`${DOCTOR_PATIENTS_BASE}/${patientId}`);
  },

  async getExerciseHistory(patientId: string): Promise<PatientExerciseHistoryResponse> {
    const { data } = await httpClient.get<PatientExerciseHistoryResponse>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercise-history`,
    );
    return data;
  },
};
