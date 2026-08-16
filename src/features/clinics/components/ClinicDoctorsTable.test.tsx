import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClinicDoctorsTable } from '@/features/clinics/components/ClinicDoctorsTable';
import type { ClinicDoctorMemberDto } from '@/features/clinics/types/clinic';
import { renderWithProviders } from '@/test/render';

const manager: ClinicDoctorMemberDto = {
  doctorId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  name: 'Manager User',
  phoneNumber: '+15551111111',
  role: 4,
  specialty: 'Physio',
  isClinicManager: true,
};

const doctor: ClinicDoctorMemberDto = {
  doctorId: '11111111-1111-1111-1111-111111111111',
  name: 'Dr. Ali',
  phoneNumber: '+15552222222',
  role: 1,
  specialty: 'Ortho',
  isClinicManager: false,
};

describe('ClinicDoctorsTable', () => {
  it('renders assigned doctors', () => {
    renderWithProviders(<ClinicDoctorsTable doctors={[manager, doctor]} onRemove={vi.fn()} />);

    expect(screen.getByText('Manager User')).toBeInTheDocument();
    expect(screen.getByText('Dr. Ali')).toBeInTheDocument();
  });

  it('prevents removing the clinic manager', () => {
    renderWithProviders(<ClinicDoctorsTable doctors={[manager, doctor]} onRemove={vi.fn()} />);

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    const managerRemove = removeButtons.find((button) => button.hasAttribute('disabled'));
    const doctorRemove = removeButtons.find((button) => !button.hasAttribute('disabled'));

    expect(managerRemove).toBeDisabled();
    expect(doctorRemove).toBeEnabled();
  });

  it('requests removal for a non-manager Doctor', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderWithProviders(<ClinicDoctorsTable doctors={[manager, doctor]} onRemove={onRemove} />);

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    await user.click(removeButtons.find((button) => !button.hasAttribute('disabled'))!);

    expect(onRemove).toHaveBeenCalledWith(doctor);
  });

  it('shows empty state when no doctors', () => {
    renderWithProviders(<ClinicDoctorsTable doctors={[]} onRemove={vi.fn()} />);

    expect(screen.getByText('No doctors are assigned to this clinic yet.')).toBeInTheDocument();
  });
});
