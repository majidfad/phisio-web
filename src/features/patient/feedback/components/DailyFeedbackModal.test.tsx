import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DailyFeedbackModal } from '@/features/patient/feedback/components/DailyFeedbackModal';
import { renderWithProviders } from '@/test/render';

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  return {
    ...actual,
    Grid: {
      ...actual.Grid,
      useBreakpoint: () => ({ md: true }),
    },
  };
});

vi.mock('@/features/patient/feedback/services/patientDailyFeedbackService', () => ({
  patientDailyFeedbackService: {
    submitFeedback: vi.fn().mockResolvedValue({}),
  },
}));

import { patientDailyFeedbackService } from '@/features/patient/feedback/services/patientDailyFeedbackService';

describe('DailyFeedbackModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    renderWithProviders(
      <DailyFeedbackModal isOpen doctorName="Dr. A" completedCount={2} onClose={vi.fn()} />,
    );
    expect(screen.getByText('How was your workout?')).toBeInTheDocument();
    expect(screen.getByText('Great job!')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(<DailyFeedbackModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText('How was your workout?')).not.toBeInTheDocument();
  });

  it('submits feedback when both scores are selected', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <DailyFeedbackModal
        isOpen
        doctorId="doc-1"
        doctorName="Dr. A"
        completedCount={3}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByText(/Very hard/));
    await user.click(screen.getByText(/Much better/));
    await user.click(screen.getByRole('button', { name: 'Submit feedback' }));

    await waitFor(() => {
      expect(patientDailyFeedbackService.submitFeedback).toHaveBeenCalledWith({
        doctorId: 'doc-1',
        hardnessScore: 5,
        improvementScore: 5,
        comment: null,
      });
    });
  });
});
