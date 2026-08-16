import { vi } from 'vitest';
import { screen } from '@testing-library/react';

import { ClinicsTable } from '@/features/clinics/components/ClinicsTable';
import type { ClinicDto } from '@/features/clinics/types/clinic';
import { renderWithProviders } from '@/test/render';

const clinic: ClinicDto = {
  clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'North Clinic',
  address: 'Tehran',
  clinicManagerId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  phoneNumbers: ['02112345678'],
  createdAt: '2026-08-12T10:00:00Z',
  isEnabled: true,
};

describe('ClinicsTable', () => {
  it('renders clinic rows and disable action', () => {
    renderWithProviders(
      <ClinicsTable
        clinics={[clinic]}
        showInactiveView={false}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDisable={vi.fn()}
      />,
    );

    expect(screen.getByText('North Clinic')).toBeInTheDocument();
    expect(screen.getByText('Tehran')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Disable' })).toBeInTheDocument();
  });

  it('shows empty state when no clinics', () => {
    renderWithProviders(
      <ClinicsTable
        clinics={[]}
        showInactiveView={false}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDisable={vi.fn()}
      />,
    );

    expect(screen.getByText('No clinics registered yet.')).toBeInTheDocument();
  });

  it('shows empty search state when provided', () => {
    renderWithProviders(
      <ClinicsTable
        clinics={[]}
        showInactiveView={false}
        emptyDescription="No clinics match this search."
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDisable={vi.fn()}
      />,
    );

    expect(screen.getByText('No clinics match this search.')).toBeInTheDocument();
  });

  it('hides disable action for inactive clinics', () => {
    renderWithProviders(
      <ClinicsTable
        clinics={[{ ...clinic, isEnabled: false }]}
        showInactiveView
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDisable={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Disable' })).not.toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});
