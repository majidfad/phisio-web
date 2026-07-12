import { httpClient } from '@/api/http-client';

import type {
  CompleteExercisesRequest,
  CompleteExercisesResponse,
  PatientExercisesResponse,
  PatientTodayExercisesResponse,
} from '../types/patient-exercise';

const PATIENT_EXERCISES_BASE = '/patient/exercises';

export const patientExerciseService = {
  async getTodayExercises(): Promise<PatientTodayExercisesResponse> {
    const { data } = await httpClient.get<PatientTodayExercisesResponse>(
      `${PATIENT_EXERCISES_BASE}/today`,
    );
    return data;
  },

  /** Reserved for future tabs (upcoming / history). */
  async getExercises(scheduledDate?: string): Promise<PatientExercisesResponse> {
    const { data } = scheduledDate
      ? await httpClient.get<PatientExercisesResponse>(PATIENT_EXERCISES_BASE, {
          params: { scheduledDate },
        })
      : await httpClient.get<PatientExercisesResponse>(PATIENT_EXERCISES_BASE);
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
