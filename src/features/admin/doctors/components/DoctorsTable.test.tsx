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
  isClinicManager: false,
  managedClinicNames: [],
};

const mockClinicManager: import('@/features/admin/doctors/types/doctor').DoctorDto = {
  id: 'm-1',
  name: 'Sara Manager',
  phoneNumber: '09121112233',
  email: null,
  specialty: '',
  medicalLicenseNumber: '',
  clinicAddress: '',
  isEnabled: true,
  createdAt: '2026-01-01T00:00:00Z',
  isClinicManager: true,
  managedClinicNames: ['North Clinic', 'South Clinic'],
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
        onDeactivate={vi.fn()}
        onChangePassword={vi.fn()}
      />,
    );

    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
    expect(screen.getByText('Physio')).toBeInTheDocument();
  });

  it('shows empty ClinicManager state for regular doctors', () => {
    renderWithProviders(
      <DoctorsTable
        doctors={[mockDoctor]}
        showInactiveView={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onActivate={vi.fn()}
        onDeactivate={vi.fn()}
        onChangePassword={vi.fn()}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Clinic manager' })).toBeInTheDocument();
    expect(screen.getByText('Not a clinic manager')).toBeInTheDocument();
  });

  it('shows managed clinic names for ClinicManagers', () => {
    renderWithProviders(
      <DoctorsTable
        doctors={[mockClinicManager]}
        showInactiveView={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onActivate={vi.fn()}
        onDeactivate={vi.fn()}
        onChangePassword={vi.fn()}
      />,
    );

    expect(screen.getByText('Sara Manager')).toBeInTheDocument();
    expect(screen.getByText('North Clinic, South Clinic')).toBeInTheDocument();
    expect(screen.queryByText('Not a clinic manager')).not.toBeInTheDocument();
  });

  it('shows empty state when no doctors', () => {
    renderWithProviders(
      <DoctorsTable
        doctors={[]}
        showInactiveView={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onActivate={vi.fn()}
        onDeactivate={vi.fn()}
        onChangePassword={vi.fn()}
      />,
    );

    expect(screen.getByText('No doctors registered yet.')).toBeInTheDocument();
  });
});
