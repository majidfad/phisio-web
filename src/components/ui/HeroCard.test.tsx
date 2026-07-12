import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HeroCard } from '@/components/ui/HeroCard';
import { renderWithProviders } from '@/test/render';

describe('HeroCard', () => {
  it('renders title, description, and badge', () => {
    renderWithProviders(
      <HeroCard
        badge="Test badge"
        title="Welcome back"
        description="Your recovery journey continues"
        illustration="recovery"
      />,
    );

    expect(screen.getByText('Test badge')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Your recovery journey continues')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <HeroCard title="Title" description="Description">
        <button type="button">Action</button>
      </HeroCard>,
    );

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
