import { httpClient } from '@/api/http-client';

import type {
  AddDoctorPatientRequest,
  DoctorClinicOptionDto,
  DoctorPatientDto,
  DoctorPatientLookupDto,
  DoctorPatientRequestDto,
} from '../types/doctor-patient';
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

async function getJson<T>(url: string, params?: Record<string, string | number | undefined>) {
  const response = params ? await httpClient.get<T>(url, { params }) : await httpClient.get<T>(url);
  return response.data;
}

async function postJson<T>(
  url: string,
  body: unknown,
  params?: Record<string, string | number | undefined>,
) {
  const response = params
    ? await httpClient.post<T>(url, body, { params })
    : await httpClient.post<T>(url, body);
  return response.data;
}

async function putJson<T>(
  url: string,
  body: unknown,
  params?: Record<string, string | number | undefined>,
) {
  const response = params
    ? await httpClient.put<T>(url, body, { params })
    : await httpClient.put<T>(url, body);
  return response.data;
}

export const doctorPatientService = {
  async getAll(clinicId?: string): Promise<DoctorPatientDto[]> {
    return getJson<DoctorPatientDto[]>(DOCTOR_PATIENTS_BASE, clinicId ? { clinicId } : undefined);
  },

  async getPendingRequests(clinicId?: string): Promise<DoctorPatientRequestDto[]> {
    return getJson<DoctorPatientRequestDto[]>(
      `${DOCTOR_PATIENTS_BASE}/requests`,
      clinicId ? { clinicId } : undefined,
    );
  },

  async getMyClinics(): Promise<DoctorClinicOptionDto[]> {
    const { data } = await httpClient.get<DoctorClinicOptionDto[]>(
      `${DOCTOR_PATIENTS_BASE}/clinics`,
    );
    return data;
  },

  async lookupByPhone(phoneNumber: string): Promise<DoctorPatientLookupDto> {
    const { data } = await httpClient.get<DoctorPatientLookupDto>(
      `${DOCTOR_PATIENTS_BASE}/lookup`,
      { params: { phoneNumber } },
    );
    return data;
  },

  async addPatient(request: AddDoctorPatientRequest): Promise<DoctorPatientDto> {
    const { data } = await httpClient.post<DoctorPatientDto>(DOCTOR_PATIENTS_BASE, request);
    return data;
  },

  async approveRequest(patientId: string, clinicId: string): Promise<DoctorPatientDto> {
    const { data } = await httpClient.post<DoctorPatientDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/approve`,
      null,
      { params: { clinicId } },
    );
    return data;
  },

  async rejectRequest(patientId: string, clinicId: string): Promise<void> {
    await httpClient.post(`${DOCTOR_PATIENTS_BASE}/${patientId}/reject`, null, {
      params: { clinicId },
    });
  },

  async getPatientExercises(
    patientId: string,
    clinicId?: string,
  ): Promise<DoctorPatientExerciseDto[]> {
    return getJson<DoctorPatientExerciseDto[]>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercises`,
      clinicId ? { clinicId } : undefined,
    );
  },

  async assignExercises(
    patientId: string,
    request: AssignPatientExercisesRequest,
    clinicId?: string,
  ): Promise<AssignPatientExercisesResultDto> {
    return postJson<AssignPatientExercisesResultDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercises`,
      request,
      clinicId ? { clinicId } : undefined,
    );
  },

  async remove(patientId: string, clinicId: string): Promise<void> {
    await httpClient.delete(`${DOCTOR_PATIENTS_BASE}/${patientId}`, {
      params: { clinicId },
    });
  },

  async getExerciseHistory(
    patientId: string,
    params: PatientExerciseHistoryParams = {},
    clinicId?: string,
  ): Promise<PatientExerciseHistoryResponse> {
    const { data } = await httpClient.get<PatientExerciseHistoryResponse>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercise-history`,
      {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
          ...(clinicId ? { clinicId } : {}),
        },
      },
    );
    return data;
  },

  async getPatientOverview(
    patientId: string,
    clinicId?: string,
  ): Promise<DoctorPatientOverviewDto> {
    return getJson<DoctorPatientOverviewDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/overview`,
      clinicId ? { clinicId } : undefined,
    );
  },

  async getPatientPrograms(patientId: string, clinicId?: string): Promise<ExerciseProgramDto[]> {
    return getJson<ExerciseProgramDto[]>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/programs`,
      clinicId ? { clinicId } : undefined,
    );
  },

  async createProgram(
    patientId: string,
    request: CreateExerciseProgramRequest,
    clinicId?: string,
  ): Promise<CreateExerciseProgramResultDto> {
    return postJson<CreateExerciseProgramResultDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/programs`,
      request,
      clinicId ? { clinicId } : undefined,
    );
  },

  async updateProgram(
    patientId: string,
    programId: string,
    request: UpdateExerciseProgramRequest,
    clinicId?: string,
  ): Promise<CreateExerciseProgramResultDto> {
    return putJson<CreateExerciseProgramResultDto>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/programs/${programId}`,
      request,
      clinicId ? { clinicId } : undefined,
    );
  },

  async deleteProgram(patientId: string, programId: string, clinicId?: string): Promise<void> {
    await httpClient.delete(`${DOCTOR_PATIENTS_BASE}/${patientId}/programs/${programId}`, {
      params: clinicId ? { clinicId } : undefined,
    });
  },

  async getExerciseStats(
    patientId: string,
    params: PatientExerciseStatsParams = {},
    clinicId?: string,
  ): Promise<PatientExerciseStatsResponse> {
    const { data } = await httpClient.get<PatientExerciseStatsResponse>(
      `${DOCTOR_PATIENTS_BASE}/${patientId}/exercise-stats`,
      {
        params: {
          from: params.from,
          to: params.to,
          ...(clinicId ? { clinicId } : {}),
        },
      },
    );
    return data;
  },
};
