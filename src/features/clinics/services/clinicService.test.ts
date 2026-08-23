import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpClient } from '@/api/http-client';
import { clinicService } from '@/features/clinics/services/clinicService';

vi.mock('@/api/http-client', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const clinic = {
  clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'North Clinic',
  address: 'Tehran',
  clinicManagerId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  phoneNumbers: ['02112345678'],
  createdAt: '2026-08-12T10:00:00Z',
  isEnabled: true,
};

describe('clinicService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches clinics with isEnabled filter', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({ data: [clinic] });

    await expect(clinicService.getAll(true)).resolves.toEqual([clinic]);
    expect(httpClient.get).toHaveBeenCalledWith('/clinics', { params: { isEnabled: true } });
  });

  it('fetches a clinic by id', async () => {
    vi.mocked(httpClient.get).mockResolvedValue({ data: clinic });

    await expect(clinicService.getById(clinic.clinicId)).resolves.toEqual(clinic);
    expect(httpClient.get).toHaveBeenCalledWith(`/clinics/${clinic.clinicId}`);
  });

  it('creates a clinic', async () => {
    const request = {
      name: clinic.name,
      address: clinic.address,
      phoneNumbers: clinic.phoneNumbers,
      clinicManagerId: clinic.clinicManagerId,
    };
    vi.mocked(httpClient.post).mockResolvedValue({ data: clinic });

    await expect(clinicService.create(request)).resolves.toEqual(clinic);
    expect(httpClient.post).toHaveBeenCalledWith('/clinics', request);
  });

  it('updates a clinic', async () => {
    const request = {
      name: clinic.name,
      address: clinic.address,
      phoneNumbers: clinic.phoneNumbers,
    };
    vi.mocked(httpClient.put).mockResolvedValue({ data: clinic });

    await expect(clinicService.update(clinic.clinicId, request)).resolves.toEqual(clinic);
    expect(httpClient.put).toHaveBeenCalledWith(`/clinics/${clinic.clinicId}`, request);
  });

  it('disables a clinic with delete', async () => {
    vi.mocked(httpClient.delete).mockResolvedValue({});

    await expect(clinicService.disable(clinic.clinicId)).resolves.toBeUndefined();
    expect(httpClient.delete).toHaveBeenCalledWith(`/clinics/${clinic.clinicId}`);
  });

  it('fetches clinic doctors', async () => {
    const doctors = [
      {
        doctorId: clinic.clinicManagerId,
        name: 'Manager',
        phoneNumber: '+15551111111',
        role: 4,
        specialty: 'Physio',
        isClinicManager: true,
      },
    ];
    vi.mocked(httpClient.get).mockResolvedValue({ data: doctors });

    await expect(clinicService.getDoctors(clinic.clinicId)).resolves.toEqual(doctors);
    expect(httpClient.get).toHaveBeenCalledWith(`/clinics/${clinic.clinicId}/doctors`);
  });

  it('looks up clinics by phone numbers', async () => {
    const lookup = {
      status: 'Found',
      clinic,
      conflictingClinics: [],
    };
    vi.mocked(httpClient.post).mockResolvedValue({ data: lookup });

    await expect(clinicService.lookupByPhones(['02112345678'])).resolves.toEqual(lookup);
    expect(httpClient.post).toHaveBeenCalledWith('/clinics/lookup-by-phones', {
      phoneNumbers: ['02112345678'],
    });
  });

  it('fetches doctor candidates from the clinic scoped endpoint', async () => {
    const candidates = [
      {
        doctorId: '11111111-1111-1111-1111-111111111111',
        name: 'Dr. Ali',
        phoneNumber: '+15552222222',
        specialty: 'Ortho',
        isClinicManager: false,
      },
    ];
    vi.mocked(httpClient.get).mockResolvedValue({ data: candidates });

    await expect(clinicService.getDoctorCandidates()).resolves.toEqual(candidates);
    expect(httpClient.get).toHaveBeenCalledWith('/clinics/doctor-candidates');
  });

  it('adds a clinic doctor', async () => {
    const doctorId = '11111111-1111-1111-1111-111111111111';
    const member = {
      doctorId,
      name: 'Dr. Ali',
      phoneNumber: '+15552222222',
      role: 1,
      specialty: 'Ortho',
      isClinicManager: false,
    };
    vi.mocked(httpClient.post).mockResolvedValue({ data: member });

    await expect(clinicService.addDoctor(clinic.clinicId, doctorId)).resolves.toEqual(member);
    expect(httpClient.post).toHaveBeenCalledWith(`/clinics/${clinic.clinicId}/doctors/${doctorId}`);
  });

  it('removes a clinic doctor', async () => {
    const doctorId = '11111111-1111-1111-1111-111111111111';
    vi.mocked(httpClient.delete).mockResolvedValue({});

    await expect(clinicService.removeDoctor(clinic.clinicId, doctorId)).resolves.toBeUndefined();
    expect(httpClient.delete).toHaveBeenCalledWith(
      `/clinics/${clinic.clinicId}/doctors/${doctorId}`,
    );
  });
});
