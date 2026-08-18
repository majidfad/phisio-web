import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ClinicFormModal } from '@/features/clinics/components/ClinicFormModal';
import { renderWithProviders } from '@/test/render';

const doctorId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
const otherDoctorId = '11111111-1111-1111-1111-111111111111';
const doctors = [
  { id: doctorId, name: 'Sara Ahmadi' },
  { id: otherDoctorId, name: 'Reza Karimi' },
];

function renderModal(overrides: Partial<React.ComponentProps<typeof ClinicFormModal>> = {}) {
  const props: React.ComponentProps<typeof ClinicFormModal> = {
    isOpen: true,
    mode: 'create',
    clinic: null,
    requireClinicManagerId: true,
    doctors,
    isLoadingDoctors: false,
    isDoctorsError: false,
    isSubmitting: false,
    onRetryDoctors: vi.fn(),
    onClose: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  return { props, ...renderWithProviders(<ClinicFormModal {...props} />) };
}

describe('ClinicFormModal clinic manager selector', () => {
  it('shows a loading state while doctors are loading', () => {
    renderModal({ doctors: [], isLoadingDoctors: true });

    expect(document.querySelector('.ant-select-loading')).toBeInTheDocument();
  });

  it('searches by doctor name, selects a doctor, and submits its user ID', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderModal({ onSubmit });

    await user.type(
      document.querySelector<HTMLInputElement>('input[name="name"]')!,
      'North Clinic',
    );
    await user.type(
      document.querySelector<HTMLTextAreaElement>('textarea[name="address"]')!,
      'Tehran',
    );
    await user.type(document.querySelector<HTMLInputElement>('input[type="tel"]')!, '02112345678');

    const managerSelect = screen.getByRole('combobox');
    await user.click(managerSelect);
    await user.type(managerSelect, 'Sara');

    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getByRole('option', { name: 'Sara Ahmadi' })).toBeInTheDocument();
    expect(within(listbox).queryByRole('option', { name: 'Reza Karimi' })).not.toBeInTheDocument();

    await user.click(await screen.findByText('Sara Ahmadi'));
    await user.click(screen.getByRole('button', { name: 'Create clinic' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ clinicManagerId: doctorId })),
    );
  });

  it('requires selecting a clinic manager', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderModal({ onSubmit });

    await user.type(
      document.querySelector<HTMLInputElement>('input[name="name"]')!,
      'North Clinic',
    );
    await user.type(
      document.querySelector<HTMLTextAreaElement>('textarea[name="address"]')!,
      'Tehran',
    );
    await user.click(screen.getByRole('button', { name: 'Create clinic' }));

    expect(await screen.findByText('Clinic manager is required.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows empty and error states and can retry loading doctors', async () => {
    const user = userEvent.setup();
    const onRetryDoctors = vi.fn();
    const { rerender, props } = renderModal({ doctors: [] });

    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByText('No doctors found.')).toBeInTheDocument();

    rerender(
      <ClinicFormModal {...props} doctors={[]} isDoctorsError onRetryDoctors={onRetryDoctors} />,
    );

    expect(screen.getByText('Failed to load doctors.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetryDoctors).toHaveBeenCalledOnce();
  });
});
