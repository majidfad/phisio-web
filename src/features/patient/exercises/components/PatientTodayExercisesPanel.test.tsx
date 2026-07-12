import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PatientTodayExercisesPanel } from '@/features/patient/exercises/components/PatientTodayExercisesPanel';
import { renderWithProviders } from '@/test/render';

const mockRefetch = vi.fn();

vi.mock('@/features/patient/exercises/hooks/usePatientExercises', () => ({
  usePatientTodayExercises: vi.fn(),
}));

import { usePatientTodayExercises } from '@/features/patient/exercises/hooks/usePatientExercises';

const mockedUseExercises = vi.mocked(usePatientTodayExercises);

describe('PatientTodayExercisesPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRefetch.mockResolvedValue(undefined);
  });

  it('shows loading skeleton when loading', () => {
    mockedUseExercises.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof usePatientTodayExercises>);

    const { container } = renderWithProviders(<PatientTodayExercisesPanel />);
    expect(container.querySelector('.ant-skeleton')).toBeTruthy();
  });

  it('shows empty state when no exercises', () => {
    mockedUseExercises.mockReturnValue({
      data: { doctorGroups: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof usePatientTodayExercises>);

    renderWithProviders(<PatientTodayExercisesPanel />);
    expect(screen.getByText('No exercises scheduled for today.')).toBeInTheDocument();
  });

  it('renders exercise list when data is available', () => {
    mockedUseExercises.mockReturnValue({
      data: {
        doctorGroups: [
          {
            doctorName: 'Dr. Smith',
            exercises: [
              {
                userExerciseId: 'ue-1',
                exerciseId: 'ex-1',
                title: 'Knee Extension',
                videoUrl: null,
                scheduledDate: '2026-07-06',
                completedToday: false,
              },
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof usePatientTodayExercises>);

    renderWithProviders(<PatientTodayExercisesPanel />);
    expect(screen.getByText('Knee Extension')).toBeInTheDocument();
  });
});

describe('PatientTodayExercisesPanel checkbox', () => {
  it('allows toggling exercise checkbox', async () => {
    const user = userEvent.setup();

    mockedUseExercises.mockReturnValue({
      data: {
        doctorGroups: [
          {
            doctorName: 'Dr. Smith',
            exercises: [
              {
                userExerciseId: 'ue-1',
                exerciseId: 'ex-1',
                title: 'Knee Extension',
                videoUrl: null,
                scheduledDate: '2026-07-06',
                completedToday: false,
              },
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof usePatientTodayExercises>);

    renderWithProviders(<PatientTodayExercisesPanel />);

    const checkbox = screen.getByRole('checkbox', { name: 'Knee Extension' });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });
});
