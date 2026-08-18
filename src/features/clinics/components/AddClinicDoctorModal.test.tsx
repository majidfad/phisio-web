import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AddClinicDoctorModal } from '@/features/clinics/components/AddClinicDoctorModal';
import type { ClinicDoctorCandidateDto } from '@/features/clinics/types/clinic';
import { renderWithProviders } from '@/test/render';

const assignedDoctor: ClinicDoctorCandidateDto = {
  doctorId: '11111111-1111-1111-1111-111111111111',
  name: 'Assigned Doctor',
  phoneNumber: '+15551111111',
  specialty: 'Physio',
  isClinicManager: false,
};

const availableDoctor: ClinicDoctorCandidateDto = {
  doctorId: '22222222-2222-2222-2222-222222222222',
  name: 'Sara Ahmadi',
  phoneNumber: '+15552222222',
  specialty: 'Ortho',
  isClinicManager: false,
};

const otherClinicDoctor: ClinicDoctorCandidateDto = {
  doctorId: '33333333-3333-3333-3333-333333333333',
  name: 'Reza Karimi',
  phoneNumber: '+15553333333',
  specialty: 'Neuro',
  isClinicManager: true,
};

function renderModal(overrides: Partial<React.ComponentProps<typeof AddClinicDoctorModal>> = {}) {
  const props: React.ComponentProps<typeof AddClinicDoctorModal> = {
    isOpen: true,
    isSubmitting: false,
    isLoadingCandidates: false,
    isCandidatesError: false,
    assignedDoctorIds: new Set([assignedDoctor.doctorId]),
    candidates: [assignedDoctor, availableDoctor],
    onRetryCandidates: vi.fn(),
    onClose: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  return { props, ...renderWithProviders(<AddClinicDoctorModal {...props} />) };
}

describe('AddClinicDoctorModal', () => {
  it('shows a loading state while Doctor candidates load', () => {
    renderModal({ candidates: [], isLoadingCandidates: true });

    expect(document.querySelector('.ant-select-loading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add doctor' })).toBeDisabled();
  });

  it('searches, selects, and submits a Doctor by name', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderModal({ onSubmit });

    const select = screen.getByRole('combobox');
    await user.click(select);
    await user.type(select, 'Sara');

    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getByRole('option', { name: /Sara Ahmadi/ })).toBeInTheDocument();
    await user.click(await screen.findByText(/Sara Ahmadi/));
    await user.click(screen.getByRole('button', { name: 'Add doctor' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        selectedDoctorId: availableDoctor.doctorId,
      }),
    );
  });

  it('offers doctors from the whole system and excludes assigned ones', async () => {
    const user = userEvent.setup();
    renderModal({ candidates: [assignedDoctor, availableDoctor, otherClinicDoctor] });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).queryByText(/Assigned Doctor/)).not.toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /Sara Ahmadi/ })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /Reza Karimi/ })).toBeInTheDocument();
    expect(screen.queryByText('No other doctors are available to add.')).not.toBeInTheDocument();
  });

  it('shows empty and error states and can retry candidate loading', async () => {
    const user = userEvent.setup();
    const onRetryCandidates = vi.fn();
    const { rerender, props } = renderModal({
      candidates: [],
      assignedDoctorIds: new Set(),
    });

    expect(screen.getByText('No other doctors are available to add.')).toBeInTheDocument();

    rerender(
      <AddClinicDoctorModal
        {...props}
        candidates={[]}
        isCandidatesError
        onRetryCandidates={onRetryCandidates}
      />,
    );

    expect(screen.getByText('Failed to load available doctors.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetryCandidates).toHaveBeenCalledOnce();
  });
});
