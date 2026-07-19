import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AntdProvider } from '@/components/providers/AntdProvider';
import { PatientAppShell } from '@/layouts/components/PatientAppShell';
import { routes } from '@/routes/routes';
import { ThemeProvider } from '@/theme/ThemeProvider';

vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  return {
    ...actual,
    Grid: {
      ...actual.Grid,
      useBreakpoint: () => ({ md: false }),
    },
  };
});

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      userId: '1',
      name: 'Test Patient',
      phoneNumber: '09123456789',
      email: null,
      role: 'Patient',
      roles: ['Patient'],
    },
    logout: vi.fn(),
    login: vi.fn(),
    isInitializing: false,
  }),
}));

function renderPatientShell(initialRoute = routes.patient.root) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AntdProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <PatientAppShell />
          </MemoryRouter>
        </AntdProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('PatientAppShell', () => {
  it('renders bottom tab bar with safe-area class on mobile viewport', () => {
    renderPatientShell();

    const tabBar = document.querySelector('.dock-nav');
    expect(tabBar).toBeTruthy();
    expect(tabBar?.classList.contains('safe-area-bottom')).toBe(true);
  });

  it('renders navigation items for home, exercises, and progress', () => {
    renderPatientShell();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My exercises')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });
});
