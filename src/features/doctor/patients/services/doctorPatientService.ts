import { httpClient } from '@/api/http-client';

import type { DoctorPatientDto, DoctorPatientRequestDto } from '../types/doctor-patient';
import type {
  AssignPatientExercisesRequest,
  AssignPatientExercisesResultDto,
  DoctorPatientExerciseDto,
} from '../types/patient-exercise-plan';
import type {
  PatientExerciseHistoryParams,
  PatientExerciseHistoryResponse,
} from '../types/patient-exercise-history';
import type {
  CreateExerciseProgramRequest,
  CreateExerciseProgramResultDto,
  DoctorPatientOverviewDto,
  ExerciseProgramDto,
  UpdateExerciseProgramRequest,
} from '../types/exercise-program';
import type {
  PatientExerciseStatsParams,
  PatientExerciseStatsResponse,
} from '../types/patient-exercise-stats';

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

  async getExerciseHistory(
    patientId: string,
    params: PatientExerciseHistoryParams = {},
  ): Promise<PatientExerciseHistoryResponse> {
    const { data } = await httpClient.get<PatientExerciseHistoryResponse>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercise-history`,
      {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
        },
      },
    );
    return data;
  },

  async getPatientOverview(patientId: string): Promise<DoctorPatientOverviewDto> {
    const { data } = await httpClient.get<DoctorPatientOverviewDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/overview`,
    );
    return data;
  },

  async getPatientPrograms(patientId: string): Promise<ExerciseProgramDto[]> {
    const { data } = await httpClient.get<ExerciseProgramDto[]>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/programs`,
    );
    return data;
  },

  async createProgram(
    patientId: string,
    request: CreateExerciseProgramRequest,
  ): Promise<CreateExerciseProgramResultDto> {
    const { data } = await httpClient.post<CreateExerciseProgramResultDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/programs`,
      request,
    );
    return data;
  },

  async updateProgram(
    patientId: string,
    programId: string,
    request: UpdateExerciseProgramRequest,
  ): Promise<CreateExerciseProgramResultDto> {
    const { data } = await httpClient.put<CreateExerciseProgramResultDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/programs/${programId}`,
      request,
    );
    return data;
  },

  async deleteProgram(patientId: string, programId: string): Promise<void> {
    await httpClient.delete(`${DOCTOR_PATIENTS_BASE}/${patientId}/programs/${programId}`);
  },

  async getExerciseStats(
    patientId: string,
    params: PatientExerciseStatsParams = {},
  ): Promise<PatientExerciseStatsResponse> {
    const { data } = await httpClient.get<PatientExerciseStatsResponse>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercise-stats`,
      {
        params: {
          from: params.from,
          to: params.to,
        },
      },
    );
    return data;
  },
};
