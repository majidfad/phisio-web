import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { patientDoctorService } from '@/features/patient/doctors/services/patientDoctorService';
import { DoctorPatientStatusCode } from '@/features/patient/doctors/types/patient-doctor';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('patientDoctorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches doctor clinics for the selected doctor', async () => {
    const doctorId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const clinics = [
      {
        clinicId: '11111111-1111-1111-1111-111111111111',
        name: 'North Clinic',
        address: 'Tehran',
        relationshipStatus: DoctorPatientStatusCode.Pending,
      },
    ];

    vi.mocked(httpClient.get).mockResolvedValue({ data: clinics });

    await expect(patientDoctorService.getDoctorClinics(doctorId)).resolves.toEqual(clinics);
    expect(httpClient.get).toHaveBeenCalledWith(`/patient/doctors/${doctorId}/clinics`);
  });

  it('fetches doctor profile with optional clinicId', async () => {
    const doctorId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const clinicId = '11111111-1111-1111-1111-111111111111';
    const profile = {
      doctorId,
      name: 'Dr Ahmadi',
      specialty: 'Physio',
      medicalLicenseNumber: 'MD-1',
      clinicAddress: 'Address',
      phoneNumber: '+15551111111',
      relationshipStatus: DoctorPatientStatusCode.Pending,
      relationshipCreatedAt: '2026-08-20T10:00:00Z',
      clinicId,
      clinicName: 'North Clinic',
    };

    vi.mocked(httpClient.get).mockResolvedValue({ data: profile });

    await expect(patientDoctorService.getProfile(doctorId, clinicId)).resolves.toEqual(profile);
    expect(httpClient.get).toHaveBeenCalledWith(`/patient/doctors/${doctorId}`, {
      params: { clinicId },
    });
  });

  it('requests a link with clinicId in the body', async () => {
    const doctorId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const clinicId = '11111111-1111-1111-1111-111111111111';
    const linked = {
      doctorId,
      name: 'Dr Ahmadi',
      specialty: 'Physio',
      medicalLicenseNumber: 'MD-1',
      clinicAddress: 'Address',
      phoneNumber: '+15551111111',
      status: DoctorPatientStatusCode.Pending,
      createdAt: '2026-08-20T10:00:00Z',
      clinicId,
      clinicName: 'North Clinic',
    };

    vi.mocked(httpClient.post).mockResolvedValue({ data: linked });

    await expect(patientDoctorService.requestLink(doctorId, { clinicId })).resolves.toEqual(linked);
    expect(httpClient.post).toHaveBeenCalledWith(`/patient/doctors/${doctorId}/request`, {
      clinicId,
    });
  });

  it('cancels a request with clinicId query param', async () => {
    const doctorId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const clinicId = '11111111-1111-1111-1111-111111111111';

    vi.mocked(httpClient.delete).mockResolvedValue({});

    await expect(patientDoctorService.cancelRequest(doctorId, clinicId)).resolves.toBeUndefined();
    expect(httpClient.delete).toHaveBeenCalledWith(`/patient/doctors/${doctorId}/request`, {
      params: { clinicId },
    });
  });

  it('unlinks a doctor with clinicId query param', async () => {
    const doctorId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const clinicId = '11111111-1111-1111-1111-111111111111';

    vi.mocked(httpClient.delete).mockResolvedValue({});

    await expect(patientDoctorService.unlink(doctorId, clinicId)).resolves.toBeUndefined();
    expect(httpClient.delete).toHaveBeenCalledWith(`/patient/doctors/${doctorId}`, {
      params: { clinicId },
    });
  });
});
