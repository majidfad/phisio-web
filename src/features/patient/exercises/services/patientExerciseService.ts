import { httpClient } from '@/api/http-client';

import type {
  CompleteExercisesRequest,
  CompleteExercisesResponse,
  PatientExercisesResponse,
  PatientTodayExercisesResponse,
} from '../types/patient-exercise';

const PATIENT_EXERCISES_BASE = '/patient/exercises';

export const patientExerciseService = {
  async getTodayExercises(
    doctorId?: string | null,
    clinicId?: string | null,
  ): Promise<PatientTodayExercisesResponse> {
    const params: Record<string, string> = {};
    if (doctorId) {
      params.doctorId = doctorId;
    }
    if (clinicId) {
      params.clinicId = clinicId;
    }

    const { data } = await httpClient.get<PatientTodayExercisesResponse>(
      `${PATIENT_EXERCISES_BASE}/today`,
      Object.keys(params).length > 0 ? { params } : undefined,
    );
    return data;
  },

  /** Reserved for future tabs (upcoming / history). */
  async getExercises(
    scheduledDate?: string,
    doctorId?: string | null,
    clinicId?: string | null,
  ): Promise<PatientExercisesResponse> {
    const params: Record<string, string> = {};
    if (scheduledDate) {
      params.scheduledDate = scheduledDate;
    }
    if (doctorId) {
      params.doctorId = doctorId;
    }
    if (clinicId) {
      params.clinicId = clinicId;
    }

    const { data } = await httpClient.get<PatientExercisesResponse>(PATIENT_EXERCISES_BASE, {
      params: Object.keys(params).length > 0 ? params : undefined,
    });
    return data;
  },

  async completeExercises(request: CompleteExercisesRequest): Promise<CompleteExercisesResponse> {
    const { data } = await httpClient.post<CompleteExercisesResponse>(
      `${PATIENT_EXERCISES_BASE}/complete`,
      request,
    );
    return data;
  },
};
