import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClinicDoctorDetailsModal } from '@/features/clinics/components/ClinicDoctorDetailsModal';
import { renderWithProviders } from '@/test/render';

const doctor = {
  doctorId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  name: 'Manager User',
  phoneNumber: '+15551111111',
  role: 4 as const,
  specialty: 'Physio',
  medicalLicenseNumber: 'MD-100',
  isClinicManager: true,
};

vi.mock('@/features/clinics/hooks/useClinics', () => ({
  useClinicPatients: () => ({
    data: [
      {
        patientId: '33333333-3333-3333-3333-333333333333',
        patientName: 'Reza Patient',
        phoneNumber: '+15553333333',
        assignedAt: '2026-08-12T10:00:00Z',
        clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        clinicName: 'North Clinic',
        doctorId: doctor.doctorId,
        doctorName: doctor.name,
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('ClinicDoctorDetailsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows doctor fields and clinic patients', async () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ClinicDoctorDetailsModal
        open
        clinicId="3fa85f64-5717-4562-b3fc-2c963f66afa6"
        doctor={doctor}
        onClose={onClose}
      />,
    );

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Doctor details')).toBeInTheDocument();
    expect(within(dialog).getByText('Manager User')).toBeInTheDocument();
    expect(within(dialog).getByText('MD-100')).toBeInTheDocument();
    expect(within(dialog).getByText('Physio')).toBeInTheDocument();
    expect(within(dialog).getByText('Reza Patient')).toBeInTheDocument();

    const closeButtons = within(dialog).getAllByRole('button', { name: 'Close' });
    await userEvent.click(closeButtons[closeButtons.length - 1]!);
    expect(onClose).toHaveBeenCalled();
  });
});
