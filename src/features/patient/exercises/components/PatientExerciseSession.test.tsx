import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PatientExerciseSession } from '@/features/patient/exercises/components/PatientExerciseSession';
import { patientExerciseService } from '@/features/patient/exercises/services/patientExerciseService';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';
import { ExerciseMediaType } from '@/features/exercises/types';
import { renderWithProviders } from '@/test/render';

vi.mock('@/features/patient/exercises/services/patientExerciseService', () => ({
  patientExerciseService: {
    completeExercises: vi.fn(),
  },
}));

vi.mock('@/features/patient/exercises/components/ExerciseMediaPlayer', () => ({
  ExerciseMediaPlayer: () => <div data-testid="media-player" />,
}));

function exercise(
  overrides: Partial<PatientTodayExerciseItemDto> = {},
): PatientTodayExerciseItemDto {
  return {
    userExerciseId: 'ue-1',
    exerciseId: 'ex-1',
    title: 'Back stretch',
    videoUrl: null,
    mediaType: ExerciseMediaType.UploadedVideo,
    instructions: 'Move slowly',
    sets: 1,
    reps: '10',
    patientCue: 'Breathe',
    scheduledDate: '2026-07-22',
    completedToday: false,
    ...overrides,
  };
}

describe('PatientExerciseSession', () => {
  beforeEach(() => {
    vi.mocked(patientExerciseService.completeExercises).mockReset();
    vi.mocked(patientExerciseService.completeExercises).mockResolvedValue({
      completionDate: '2026-07-22',
      createdUserExerciseIds: ['ue-1'],
      skippedUserExerciseIds: [],
    });
  });

  it('marks done via complete API and finishes session', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onExerciseCompleted = vi.fn().mockResolvedValue(undefined);
    const onSessionFinishedWithCompletions = vi.fn();

    renderWithProviders(
      <PatientExerciseSession
        open
        doctorName="Dr. A"
        exercises={[exercise()]}
        onClose={onClose}
        onExerciseCompleted={onExerciseCompleted}
        onSessionFinishedWithCompletions={onSessionFinishedWithCompletions}
      />,
    );

    expect(screen.getByRole('status', { name: /Exercise 1 of 1|تمرین 1 از 1/i })).toBeTruthy();
    await user.click(
      screen.getByRole('button', {
        name: /Exercise done|تمرین انجام شد|Mark done|انجام شد|Complete set|تکمیل ست/i,
      }),
    );

    await waitFor(() => {
      expect(patientExerciseService.completeExercises).toHaveBeenCalledWith({
        userExerciseIds: ['ue-1'],
      });
    });
    expect(onExerciseCompleted).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(onSessionFinishedWithCompletions).toHaveBeenCalledWith(1);
  });

  it('skips without calling complete API', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSessionFinishedWithCompletions = vi.fn();

    renderWithProviders(
      <PatientExerciseSession
        open
        doctorName="Dr. A"
        exercises={[exercise(), exercise({ userExerciseId: 'ue-2', title: 'Second' })]}
        onClose={onClose}
        onExerciseCompleted={vi.fn()}
        onSessionFinishedWithCompletions={onSessionFinishedWithCompletions}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Skip exercise|رد کردن تمرین/i }));
    expect(patientExerciseService.completeExercises).not.toHaveBeenCalled();
    expect(screen.getByText('Second')).toBeTruthy();
  });

  it('shows set progress with icon on the session page', () => {
    renderWithProviders(
      <PatientExerciseSession
        open
        doctorName="Dr. A"
        exercises={[
          exercise({
            sets: 3,
            reps: '10',
          }),
          exercise({ userExerciseId: 'ue-2', title: 'Second' }),
        ]}
        onClose={vi.fn()}
        onExerciseCompleted={vi.fn()}
        onSessionFinishedWithCompletions={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/Set 1 of 3|ست 1 از 3/i)).toBeTruthy();
    expect(screen.queryByText(/10 reps|10 تکرار/i)).toBeNull();
  });

  it('advances set progress without rest UI', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PatientExerciseSession
        open
        doctorName="Dr. A"
        exercises={[
          exercise({
            sets: 2,
            reps: '8',
            title: 'Bridge',
          }),
          exercise({ userExerciseId: 'ue-2', title: 'Second' }),
        ]}
        onClose={vi.fn()}
        onExerciseCompleted={vi.fn().mockResolvedValue(undefined)}
        onSessionFinishedWithCompletions={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Complete set|اتمام ست/i }));

    expect(screen.getByText('Bridge')).toBeTruthy();
    expect(screen.getByLabelText(/Set 2 of 2|ست 2 از 2/i)).toBeTruthy();
    expect(screen.queryByText(/^Rest$|^استراحت$/i)).toBeNull();
    expect(screen.getByTestId('media-player')).toBeTruthy();
  });

  it('opens instructions sheet from info button', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PatientExerciseSession
        open
        doctorName="Dr. A"
        exercises={[exercise()]}
        onClose={vi.fn()}
        onExerciseCompleted={vi.fn()}
        onSessionFinishedWithCompletions={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Show instructions|نمایش دستورالعمل/i }));

    expect(screen.getByText('Move slowly')).toBeTruthy();
    expect(screen.getByText('Breathe')).toBeTruthy();
  });
});
