import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WarmEmptyState } from '@/components/ui/WarmEmptyState';
import { renderWithProviders } from '@/test/render';

describe('WarmEmptyState', () => {
  it('renders title and description', () => {
    renderWithProviders(
      <WarmEmptyState title="Rest day" description="No exercises scheduled for today." />,
    );

    expect(screen.getByText('Rest day')).toBeInTheDocument();
    expect(screen.getByText('No exercises scheduled for today.')).toBeInTheDocument();
  });
});
