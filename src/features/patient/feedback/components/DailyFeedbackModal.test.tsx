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
    renderWithProviders(<DailyFeedbackModal isOpen onClose={vi.fn()} />);
    expect(screen.getByText('How do you feel after exercising?')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(<DailyFeedbackModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText('How do you feel after exercising?')).not.toBeInTheDocument();
  });

  it('submits feedback when score is selected', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<DailyFeedbackModal isOpen onClose={onClose} />);

    await user.click(screen.getByText(/Much better/));
    await user.click(screen.getByRole('button', { name: 'Submit feedback' }));

    await waitFor(() => {
      expect(patientDailyFeedbackService.submitFeedback).toHaveBeenCalledWith({
        improvementScore: 5,
        comment: null,
      });
    });
  });
});
