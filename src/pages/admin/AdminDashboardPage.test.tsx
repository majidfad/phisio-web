import { vi } from 'vitest';
import { screen } from '@testing-library/react';

import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { renderWithProviders } from '@/test/render';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Admin User', role: 'Admin', roles: ['Admin'] },
    logout: vi.fn(),
    login: vi.fn(),
    isInitializing: false,
  }),
}));

vi.mock('@/features/admin/dashboard/hooks/useDashboardStats', () => ({
  useDashboardStats: () => ({
    data: { doctorCount: 5, patientCount: 10, exerciseCount: 20 },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('AdminDashboardPage', () => {
  it('renders dashboard greeting and summary stats', () => {
    renderWithProviders(<AdminDashboardPage />);

    expect(screen.getByText('Welcome back, Admin User')).toBeInTheDocument();
    expect(screen.getAllByText('Doctors').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Patients').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('CMS quick access')).toBeInTheDocument();
  });
});
