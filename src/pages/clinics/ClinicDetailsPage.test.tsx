import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClinicDetailsPage } from '@/pages/clinics/ClinicDetailsPage';
import { renderWithProviders } from '@/test/render';

const unassignedDoctorId = '22222222-2222-2222-2222-222222222222';
const addDoctorMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const changeManagerMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const authUserMock = vi.hoisted(() => ({
  current: {
    userId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Admin User',
    role: 'Admin' as const,
    roles: ['Admin'] as string[],
  },
}));
const candidatesMock = vi.hoisted(() => ({
  data: [
    {
      doctorId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      name: 'Manager User',
      phoneNumber: '+15551111111',
      specialty: 'Physio',
      isClinicManager: true,
    },
    {
      doctorId: '22222222-2222-2222-2222-222222222222',
      name: 'Sara Ahmadi',
      phoneNumber: '+15552222222',
      specialty: 'Ortho',
      isClinicManager: false,
    },
  ],
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => ({ clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
  };
});

vi.mock('@/features/auth', () => ({
  useAuth: () => ({
    user: authUserMock.current,
  }),
}));

vi.mock('@/features/clinics/hooks/useClinics', () => ({
  useClinic: () => ({
    data: {
      clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'North Clinic',
      address: 'Tehran, Valiasr',
      clinicManagerId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      phoneNumbers: ['02112345678'],
      createdAt: '2026-08-12T10:00:00Z',
      isEnabled: true,
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useClinicDoctors: () => ({
    data: [
      {
        doctorId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        name: 'Manager User',
        phoneNumber: '+15551111111',
        role: 4,
        specialty: 'Physio',
        medicalLicenseNumber: 'MD-100',
        isClinicManager: true,
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useClinicPatients: (_clinicId?: string, doctorId?: string) => ({
    data:
      doctorId === '7c9e6679-7425-40de-944b-e07fc1f90ae7' || doctorId === undefined
        ? [
            {
              patientId: '33333333-3333-3333-3333-333333333333',
              patientName: 'Reza Patient',
              phoneNumber: '+15553333333',
              assignedAt: '2026-08-12T10:00:00Z',
              clinicId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              clinicName: 'North Clinic',
              doctorId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
              doctorName: 'Manager User',
            },
          ]
        : [],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useClinicDoctorCandidates: () => candidatesMock,
  useUpdateClinic: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDisableClinic: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useChangeClinicManager: () => ({ mutateAsync: changeManagerMock, isPending: false }),
  useAddClinicDoctor: () => ({ mutateAsync: addDoctorMock, isPending: false }),
  useRemoveClinicDoctor: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe('ClinicDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authUserMock.current = {
      userId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Admin User',
      role: 'Admin',
      roles: ['Admin'],
    };
  });

  it('renders clinic details and doctor list', () => {
    renderWithProviders(<ClinicDetailsPage />);

    expect(screen.getAllByText('North Clinic').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Tehran, Valiasr')).toBeInTheDocument();
    expect(screen.getAllByText('Manager User').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Reza Patient')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add doctor' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Change manager' })).toBeInTheDocument();
  });

  it('opens doctor details modal with patients', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ClinicDetailsPage />);

    await user.click(screen.getByRole('button', { name: 'View details' }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Doctor details')).toBeInTheDocument();
    expect(within(dialog).getByText('MD-100')).toBeInTheDocument();
    expect(within(dialog).getByText('Reza Patient')).toBeInTheDocument();
    expect(within(dialog).getByText('Patients at this clinic')).toBeInTheDocument();
  });

  it('hides change manager for non-admin users', () => {
    authUserMock.current = {
      userId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      name: 'Clinic Manager',
      role: 'ClinicManager',
      roles: ['ClinicManager'],
    };

    renderWithProviders(<ClinicDetailsPage />);

    expect(screen.queryByRole('button', { name: 'Change manager' })).not.toBeInTheDocument();
  });

  it('adds a system doctor who is not yet a member of the clinic', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ClinicDetailsPage />);

    await user.click(screen.getByRole('button', { name: 'Add doctor' }));

    const dialog = await screen.findByRole('dialog');
    const select = within(dialog).getByRole('combobox');
    await user.click(select);
    await user.type(select, 'Sara');

    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getByRole('option', { name: /Sara Ahmadi/ })).toBeInTheDocument();
    expect(within(listbox).queryByText(/Manager User/)).not.toBeInTheDocument();

    await user.click(await screen.findByText(/Sara Ahmadi/));
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Add doctor' }),
    );

    await waitFor(() => expect(addDoctorMock).toHaveBeenCalledWith(unassignedDoctorId));
  });

  it('changes the clinic manager as admin', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ClinicDetailsPage />);

    await user.click(screen.getByRole('button', { name: 'Change manager' }));

    const dialog = await screen.findByRole('dialog');
    const select = within(dialog).getByRole('combobox');
    await user.click(select);
    await user.type(select, 'Sara');
    await user.click(await screen.findByText(/Sara Ahmadi/));
    await user.click(within(dialog).getByRole('button', { name: 'Change manager' }));

    await waitFor(() =>
      expect(changeManagerMock).toHaveBeenCalledWith({
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        request: { clinicManagerId: unassignedDoctorId },
      }),
    );
  });
});
