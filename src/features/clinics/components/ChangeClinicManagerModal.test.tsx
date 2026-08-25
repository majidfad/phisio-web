import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChangeClinicManagerModal } from '@/features/clinics/components/ChangeClinicManagerModal';
import type { ClinicDoctorCandidateDto } from '@/features/clinics/types/clinic';
import { renderWithProviders } from '@/test/render';

const currentManagerId = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
const nextManagerId = '22222222-2222-2222-2222-222222222222';

const candidates: ClinicDoctorCandidateDto[] = [
  {
    doctorId: currentManagerId,
    name: 'Manager User',
    phoneNumber: '+15551111111',
    specialty: 'Physio',
    isClinicManager: true,
  },
  {
    doctorId: nextManagerId,
    name: 'Sara Ahmadi',
    phoneNumber: '+15552222222',
    specialty: 'Ortho',
    isClinicManager: false,
  },
];

describe('ChangeClinicManagerModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('excludes the current manager and submits the selected doctor', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <ChangeClinicManagerModal
        isOpen
        isSubmitting={false}
        isLoadingCandidates={false}
        isCandidatesError={false}
        currentManagerId={currentManagerId}
        currentManagerName="Manager User"
        candidates={candidates}
        onRetryCandidates={vi.fn()}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByText(/Current manager: Manager User/)).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    const select = within(dialog).getByRole('combobox');
    await user.click(select);
    await user.type(select, 'Sara');

    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getByRole('option', { name: /Sara Ahmadi/ })).toBeInTheDocument();
    expect(within(listbox).queryByText(/Manager User/)).not.toBeInTheDocument();

    await user.click(await screen.findByText(/Sara Ahmadi/));
    await user.click(within(dialog).getByRole('button', { name: 'Change manager' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        clinicManagerId: nextManagerId,
      }),
    );
  });
});
