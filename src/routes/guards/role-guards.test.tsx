import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthContext } from '@/features/auth/context/auth-context';
import { GuestRoute } from '@/routes/guards/GuestRoute';
import { ProtectedRoute } from '@/routes/guards/ProtectedRoute';
import { RootRedirect } from '@/routes/guards/RootRedirect';
import { routes } from '@/routes/routes';
import { authSessionStore } from '@/store/auth-session';
import type { AuthenticatedUser, UserRole } from '@/types/auth';

function userForRole(role: UserRole): AuthenticatedUser {
  return {
    userId: `${role}-id`,
    phoneNumber: '+15550000000',
    email: null,
    name: role,
    role,
    roles: [role],
  };
}

function AuthWrapper({
  user,
  isInitializing = false,
  children,
}: {
  user: AuthenticatedUser | null;
  isInitializing?: boolean;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isInitializing,
        login: vi.fn(),
        logout: vi.fn(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function renderGuards(
  initialEntry: string,
  user: AuthenticatedUser | null,
  isInitializing = false,
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthWrapper user={user} isInitializing={isInitializing}>
        <Routes>
          <Route path={routes.root} element={<RootRedirect />} />
          <Route element={<GuestRoute />}>
            <Route path={routes.login} element={<div>login-screen</div>} />
          </Route>
          <Route path={routes.unauthorized} element={<div>unauthorized-screen</div>} />
          <Route element={<ProtectedRoute role="Admin" />}>
            <Route path={routes.admin.root} element={<div>admin-screen</div>} />
          </Route>
          <Route element={<ProtectedRoute role="ClinicManager" />}>
            <Route path={routes.clinicManager.root} element={<div>clinic-manager-screen</div>} />
          </Route>
          <Route element={<ProtectedRoute role="Doctor" />}>
            <Route path={routes.doctor.root} element={<div>doctor-screen</div>} />
          </Route>
          <Route element={<ProtectedRoute role="Patient" />}>
            <Route path={routes.patient.root} element={<div>patient-screen</div>} />
          </Route>
        </Routes>
      </AuthWrapper>
    </MemoryRouter>,
  );
}

describe('role-based route guards', () => {
  beforeEach(() => {
    authSessionStore.clear();
  });

  it.each([
    ['Admin', 'admin-screen'],
    ['ClinicManager', 'doctor-screen'],
    ['Doctor', 'doctor-screen'],
    ['Patient', 'patient-screen'],
  ] as const)('sends %s users from / to their home', (role, screenName) => {
    renderGuards(routes.root, userForRole(role));
    expect(screen.getByText(screenName)).toBeInTheDocument();
  });

  it('allows ClinicManager to open the clinic manager home', () => {
    renderGuards(routes.clinicManager.root, userForRole('ClinicManager'));
    expect(screen.getByText('clinic-manager-screen')).toBeInTheDocument();
  });

  it('allows ClinicManager to open Doctor routes', () => {
    renderGuards(routes.doctor.root, userForRole('ClinicManager'));
    expect(screen.getByText('doctor-screen')).toBeInTheDocument();
  });

  it('does not allow ClinicManager to open the Admin dashboard', () => {
    renderGuards(routes.admin.root, userForRole('ClinicManager'));
    expect(screen.getByText('unauthorized-screen')).toBeInTheDocument();
    expect(screen.queryByText('admin-screen')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users from protected routes to login', () => {
    renderGuards(routes.admin.root, null);
    expect(screen.getByText('login-screen')).toBeInTheDocument();
  });

  it('keeps Admin, Doctor, and Patient on their own homes', () => {
    renderGuards(routes.admin.root, userForRole('Admin'));
    expect(screen.getByText('admin-screen')).toBeInTheDocument();
  });

  it('sends an authenticated ClinicManager from login to the Doctor panel', () => {
    renderGuards(routes.login, userForRole('ClinicManager'));
    expect(screen.getByText('doctor-screen')).toBeInTheDocument();
    expect(screen.queryByText('login-screen')).not.toBeInTheDocument();
  });

  it('keeps protected routes loading while authentication is initializing', () => {
    authSessionStore.save({
      accessToken: 'admin-jwt',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      user: userForRole('Admin'),
    });

    renderGuards(routes.admin.root, userForRole('Admin'), true);

    expect(document.querySelector('.route-loading')).toBeInTheDocument();
    expect(screen.queryByText('admin-screen')).not.toBeInTheDocument();
  });
});
