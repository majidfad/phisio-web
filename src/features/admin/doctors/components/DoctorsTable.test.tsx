import { vi } from 'vitest';
import { screen } from '@testing-library/react';

import { DoctorsTable } from '@/features/admin/doctors/components/DoctorsTable';
import { renderWithProviders } from '@/test/render';

const mockDoctor: import('@/features/admin/doctors/types/doctor').DoctorDto = {
  id: 'd-1',
  name: 'Dr. Test',
  phoneNumber: '09123456789',
  email: null,
  specialty: 'Physio',
  medicalLicenseNumber: 'LIC-1',
  clinicAddress: 'Tehran',
  isEnabled: true,
  createdAt: '2026-01-01T00:00:00Z',
};

describe('DoctorsTable', () => {
  it('renders doctor rows', () => {
    renderWithProviders(
      <DoctorsTable
        doctors={[mockDoctor]}
        showInactiveView={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onActivate={vi.fn()}
      />,
    );

    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
    expect(screen.getByText('Physio')).toBeInTheDocument();
  });

  it('shows empty state when no doctors', () => {
    renderWithProviders(
      <DoctorsTable
        doctors={[]}
        showInactiveView={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onActivate={vi.fn()}
      />,
    );

    expect(screen.getByText('No doctors registered yet.')).toBeInTheDocument();
  });
});
