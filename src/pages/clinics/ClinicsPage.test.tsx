import { vi } from 'vitest';
import { screen } from '@testing-library/react';

import { ClinicsPage } from '@/pages/clinics/ClinicsPage';
import { renderWithProviders } from '@/test/render';

vi.mock('@/features/auth', () => ({
  useAuth: () => ({
    user: {
      userId: 'user-id',
      name: 'Clinic Manager',
      role: 'ClinicManager',
      roles: ['ClinicManager'],
    },
  }),
}));

vi.mock('@/features/admin/doctors/hooks/useDoctors', () => ({
  useDoctors: () => ({
    data: [],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/features/clinics/hooks/useClinics', () => ({
  useClinics: () => ({
    data: [
      {
        clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'North Clinic',
        address: 'Tehran',
        clinicManagerId: 'user-id',
        phoneNumbers: ['02112345678'],
        createdAt: '2026-08-12T10:00:00Z',
        isEnabled: true,
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCreateClinic: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateClinic: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDisableClinic: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe('ClinicsPage', () => {
  it('renders clinic list and create action', () => {
    renderWithProviders(<ClinicsPage />);

    expect(screen.getByText('Clinics')).toBeInTheDocument();
    expect(screen.getByText('North Clinic')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create clinic' })).toBeInTheDocument();
  });
});
