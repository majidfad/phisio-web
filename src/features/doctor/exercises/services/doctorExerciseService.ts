import { httpClient } from '@/api/http-client';

import type { DoctorExerciseDto } from '../types/doctor-exercise';

const DOCTOR_EXERCISES_BASE = '/doctor/exercises';

export const doctorExerciseService = {
  async getAll(): Promise<DoctorExerciseDto[]> {
    const { data } = await httpClient.get<DoctorExerciseDto[]>(DOCTOR_EXERCISES_BASE);
    return data;
  },
};
