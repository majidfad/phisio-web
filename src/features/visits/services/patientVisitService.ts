import { httpClient } from '@/api/http-client';

import type {
  PatientVisitDto,
  PatientVisitHistoryResponse,
  RegisterPatientVisitRequest,
  SubmitVisitFeedbackRequest,
  VisitFeedbackDto,
} from '../types/patient-visit';

const VISITS_BASE = '/visits';
const MY_VISITS_BASE = '/patient/visits';

export const patientVisitService = {
  async registerVisit(request: RegisterPatientVisitRequest): Promise<PatientVisitDto> {
    const { data } = await httpClient.post<PatientVisitDto>(VISITS_BASE, request);
    return data;
  },

  async getPatientHistory(
    patientId: string,
    params?: {
      clinicId?: string | null;
      doctorId?: string | null;
      page?: number;
      pageSize?: number;
      search?: string | null;
    },
  ): Promise<PatientVisitHistoryResponse> {
    const { data } = await httpClient.get<PatientVisitHistoryResponse>(
      `${VISITS_BASE}/patients/${patientId}`,
      {
        params: {
          clinicId: params?.clinicId ?? undefined,
          doctorId: params?.doctorId ?? undefined,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
          search: params?.search ?? undefined,
        },
      },
    );
    return data;
  },

  async getMostRecentVisit(
    patientId: string,
    params?: {
      clinicId?: string | null;
      doctorId?: string | null;
    },
  ): Promise<PatientVisitDto | null> {
    const { data } = await httpClient.get<PatientVisitDto | null>(
      `${VISITS_BASE}/patients/${patientId}/recent`,
      {
        params: {
          clinicId: params?.clinicId ?? undefined,
          doctorId: params?.doctorId ?? undefined,
        },
      },
    );
    return data;
  },

  async getClinicVisits(
    clinicId: string,
    params?: {
      doctorId?: string | null;
      page?: number;
      pageSize?: number;
      search?: string | null;
    },
  ): Promise<PatientVisitHistoryResponse> {
    const { data } = await httpClient.get<PatientVisitHistoryResponse>(
      `${VISITS_BASE}/clinics/${clinicId}`,
      {
        params: {
          doctorId: params?.doctorId ?? undefined,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
          search: params?.search ?? undefined,
        },
      },
    );
    return data;
  },

  async getDoctorVisits(
    doctorId: string,
    params?: {
      clinicId?: string | null;
      page?: number;
      pageSize?: number;
      search?: string | null;
    },
  ): Promise<PatientVisitHistoryResponse> {
    const { data } = await httpClient.get<PatientVisitHistoryResponse>(
      `${VISITS_BASE}/doctors/${doctorId}`,
      {
        params: {
          clinicId: params?.clinicId ?? undefined,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
          search: params?.search ?? undefined,
        },
      },
    );
    return data;
  },

  async getMyVisits(params?: {
    clinicId?: string | null;
    doctorId?: string | null;
    page?: number;
    pageSize?: number;
    search?: string | null;
  }): Promise<PatientVisitHistoryResponse> {
    const { data } = await httpClient.get<PatientVisitHistoryResponse>(`${MY_VISITS_BASE}/mine`, {
      params: {
        clinicId: params?.clinicId ?? undefined,
        doctorId: params?.doctorId ?? undefined,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
        search: params?.search ?? undefined,
      },
    });
    return data;
  },

  async getMyMostRecentVisit(params?: {
    clinicId?: string | null;
    doctorId?: string | null;
  }): Promise<PatientVisitDto | null> {
    const { data } = await httpClient.get<PatientVisitDto | null>(`${MY_VISITS_BASE}/recent`, {
      params: {
        clinicId: params?.clinicId ?? undefined,
        doctorId: params?.doctorId ?? undefined,
      },
    });
    return data;
  },

  async submitVisitFeedback(
    visitId: string,
    request: SubmitVisitFeedbackRequest,
  ): Promise<VisitFeedbackDto> {
    const { data } = await httpClient.post<VisitFeedbackDto>(
      `${MY_VISITS_BASE}/${visitId}/feedback`,
      request,
    );
    return data;
  },
};
