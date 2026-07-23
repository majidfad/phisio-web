import { httpClient } from '@/api/http-client';

import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';

import type { CreateDoctorExerciseRequest, DoctorExerciseDto } from '../types/doctor-exercise';

const DOCTOR_EXERCISES_BASE = '/doctor/exercises';

export const doctorExerciseService = {
  async getLibrary(): Promise<DoctorExerciseDto[]> {
    const { data } = await httpClient.get<DoctorExerciseDto[]>(DOCTOR_EXERCISES_BASE);
    return data;
  },

  async getCatalog(): Promise<ExerciseDto[]> {
    const { data } = await httpClient.get<ExerciseDto[]>(`${DOCTOR_EXERCISES_BASE}/catalog`);
    return data;
  },

  async uploadVideo(
    exerciseName: string,
    file: File,
  ): Promise<{ videoUrl: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exerciseName', exerciseName);
    const { data } = await httpClient.post<{ videoUrl: string; fileName: string }>(
      `${DOCTOR_EXERCISES_BASE}/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120_000 },
    );
    return data;
  },

  async create(request: CreateDoctorExerciseRequest): Promise<DoctorExerciseDto> {
    const { data } = await httpClient.post<DoctorExerciseDto>(DOCTOR_EXERCISES_BASE, request);
    return data;
  },

  async update(id: string, request: CreateDoctorExerciseRequest): Promise<DoctorExerciseDto> {
    const { data } = await httpClient.put<DoctorExerciseDto>(
      `${DOCTOR_EXERCISES_BASE}/${id}`,
      request,
    );
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`${DOCTOR_EXERCISES_BASE}/${id}`);
  },
};
