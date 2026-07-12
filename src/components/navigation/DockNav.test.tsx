import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DockNav } from '@/components/navigation/DockNav';
import { renderWithProviders } from '@/test/render';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DockNav', () => {
  it('marks active item and navigates on click', async () => {
    const user = userEvent.setup();
    mockNavigate.mockClear();

    renderWithProviders(
      <DockNav
        ariaLabel="Patient navigation"
        selectedKey="/exercises"
        items={[
          { key: '/home', icon: <span>H</span>, label: 'Home' },
          { key: '/exercises', icon: <span>E</span>, label: 'Exercises' },
        ]}
      />,
    );

    const exercisesButton = screen.getByRole('button', { name: /exercises/i });
    expect(exercisesButton).toHaveClass('dock-nav__item--active');

    await user.click(screen.getByRole('button', { name: /home/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
