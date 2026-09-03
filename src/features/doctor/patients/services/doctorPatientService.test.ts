import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { doctorPatientService } from '@/features/doctor/patients/services/doctorPatientService';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('doctorPatientService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches patients filtered by clinicId', async () => {
    const clinicId = '11111111-1111-1111-1111-111111111111';
    const patients = [
      {
        patientId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        patientName: 'Alice Patient',
        phoneNumber: '+15551111111',
        assignedAt: '2026-08-20T10:00:00Z',
        clinicId,
        clinicName: 'North Clinic',
      },
    ];

    vi.mocked(httpClient.get).mockResolvedValue({ data: patients });

    await expect(doctorPatientService.getAll(clinicId)).resolves.toEqual(patients);
    expect(httpClient.get).toHaveBeenCalledWith('/doctor/patients', { params: { clinicId } });
  });

  it('looks up a patient by phone and adds them with clinicId', async () => {
    const clinicId = '11111111-1111-1111-1111-111111111111';
    const lookup = {
      patientId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      patientName: 'Alice Patient',
      phoneNumber: '+15551111111',
    };
    const added = {
      ...lookup,
      assignedAt: '2026-08-20T10:00:00Z',
      clinicId,
      clinicName: 'North Clinic',
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: lookup });
    vi.mocked(httpClient.post).mockResolvedValue({ data: added });

    await expect(doctorPatientService.lookupByPhone('+15551111111')).resolves.toEqual(lookup);
    expect(httpClient.get).toHaveBeenCalledWith('/doctor/patients/lookup', {
      params: { phoneNumber: '+15551111111' },
    });

    await expect(
      doctorPatientService.addPatient({ patientId: lookup.patientId, clinicId }),
    ).resolves.toEqual(added);
    expect(httpClient.post).toHaveBeenCalledWith('/doctor/patients', {
      patientId: lookup.patientId,
      clinicId,
    });
  });

  it('approves a patient request with clinicId query param', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const clinicId = '11111111-1111-1111-1111-111111111111';
    const approved = {
      patientId,
      patientName: 'Alice Patient',
      phoneNumber: '+15551111111',
      assignedAt: '2026-08-20T10:00:00Z',
      clinicId,
      clinicName: 'North Clinic',
    };

    vi.mocked(httpClient.post).mockResolvedValue({ data: approved });

    await expect(doctorPatientService.approveRequest(patientId, clinicId)).resolves.toEqual(
      approved,
    );
    expect(httpClient.post).toHaveBeenCalledWith(`/doctor/patients/${patientId}/approve`, null, {
      params: { clinicId },
    });
  });

  it('rejects a patient request with clinicId query param', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const clinicId = '11111111-1111-1111-1111-111111111111';

    vi.mocked(httpClient.post).mockResolvedValue({});

    await expect(doctorPatientService.rejectRequest(patientId, clinicId)).resolves.toBeUndefined();
    expect(httpClient.post).toHaveBeenCalledWith(`/doctor/patients/${patientId}/reject`, null, {
      params: { clinicId },
    });
  });

  it('removes a patient relationship with clinicId query param', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const clinicId = '11111111-1111-1111-1111-111111111111';

    vi.mocked(httpClient.delete).mockResolvedValue({});

    await expect(doctorPatientService.remove(patientId, clinicId)).resolves.toBeUndefined();
    expect(httpClient.delete).toHaveBeenCalledWith(`/doctor/patients/${patientId}`, {
      params: { clinicId },
    });
  });

  it('fetches patient exercise plan from doctor patients endpoint', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const exercises = [
      {
        exerciseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        exerciseName: 'Hamstring Stretch',
        videoUrl: 'https://example.com/hamstring.mp4',
        assignedAt: '2024-01-15T10:00:00Z',
      },
    ];

    vi.mocked(httpClient.get).mockResolvedValue({ data: exercises });

    await expect(doctorPatientService.getPatientExercises(patientId)).resolves.toEqual(exercises);
    expect(httpClient.get).toHaveBeenCalledWith(`/doctor/patients/${patientId}/exercises`);
  });

  it('assigns exercises through doctor patients endpoint', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const request = {
      exerciseIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      scheduledDates: ['2026-06-15'],
    };
    const response = { assignedCount: 1 };

    vi.mocked(httpClient.post).mockResolvedValue({ data: response });

    await expect(doctorPatientService.assignExercises(patientId, request)).resolves.toEqual(
      response,
    );
    expect(httpClient.post).toHaveBeenCalledWith(
      `/doctor/patients/${patientId}/exercises`,
      request,
    );
  });

  it('fetches patient exercise history from doctor patients endpoint', async () => {
    const patientId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const history = {
      patient: {
        patientId,
        patientName: 'Alice Patient',
        phoneNumber: '+15551111111',
      },
      summary: {
        assignedExerciseCount: 2,
        completedDaysCount: 1,
        missedDaysCount: 0,
        adherencePercentage: 100,
      },
      dailyHistory: [],
      totalDays: 0,
      page: 1,
      pageSize: 10,
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: history });

    await expect(doctorPatientService.getExerciseHistory(patientId)).resolves.toEqual(history);
    expect(httpClient.get).toHaveBeenCalledWith(`/doctor/patients/${patientId}/exercise-history`, {
      params: { page: 1, pageSize: 10 },
    });
  });
});
