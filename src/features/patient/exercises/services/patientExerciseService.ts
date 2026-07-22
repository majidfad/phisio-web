import { httpClient } from '@/api/http-client';

import type {
  CompleteExercisesRequest,
  CompleteExercisesResponse,
  PatientExercisesResponse,
  PatientTodayExercisesResponse,
} from '../types/patient-exercise';

const PATIENT_EXERCISES_BASE = '/patient/exercises';

export const patientExerciseService = {
  async getTodayExercises(doctorId?: string | null): Promise<PatientTodayExercisesResponse> {
    const { data } = await httpClient.get<PatientTodayExercisesResponse>(
      `${PATIENT_EXERCISES_BASE}/today`,
      {
        params: doctorId ? { doctorId } : undefined,
      },
    );
    return data;
  },

  /** Reserved for future tabs (upcoming / history). */
  async getExercises(
    scheduledDate?: string,
    doctorId?: string | null,
  ): Promise<PatientExercisesResponse> {
    const { data } = await httpClient.get<PatientExercisesResponse>(PATIENT_EXERCISES_BASE, {
      params: {
        ...(scheduledDate ? { scheduledDate } : {}),
        ...(doctorId ? { doctorId } : {}),
      },
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
