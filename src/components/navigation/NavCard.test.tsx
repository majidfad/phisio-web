import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NavCard } from '@/components/navigation/NavCard';
import { renderWithProviders } from '@/test/render';

describe('NavCard', () => {
  it('renders link with label and active state', () => {
    renderWithProviders(<NavCard to="/patient" icon={<span>icon</span>} label="Home" active />);

    const link = screen.getByRole('link', { name: /home/i });
    expect(link).toHaveClass('nav-card--active');
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});
