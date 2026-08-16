import { QueryClientProvider } from '@tanstack/react-query';
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { httpClient } from '@/api/http-client';
import { getRequestAuthorizationHeader } from '@/api/interceptors/request.interceptor';
import { queryClient } from '@/api/query-client';
import { AntdProvider } from '@/components/providers/AntdProvider';
import { env } from '@/constants/env';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ClinicManagerLayout } from '@/layouts/ClinicManagerLayout';
import { DoctorLayout } from '@/layouts/DoctorLayout';
import { PatientLayout } from '@/layouts/PatientLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { GuestRoute } from '@/routes/guards/GuestRoute';
import { ProtectedRoute } from '@/routes/guards/ProtectedRoute';
import { routes } from '@/routes/routes';
import { authSessionStore } from '@/store/auth-session';
import { ThemeProvider } from '@/theme/ThemeProvider';
import type { UserRole } from '@/types/auth';

interface LoginProfile {
  token: string;
  role: UserRole;
  name: string;
}

interface CapturedRequest {
  url: string;
  authorization?: string;
  persistedToken: string | null;
}

const profiles: Record<string, LoginProfile> = {
  '09111111111': { token: 'admin-jwt', role: 'Admin', name: 'Admin User' },
  '09122222222': {
    token: 'clinic-manager-jwt',
    role: 'ClinicManager',
    name: 'Clinic Manager',
  },
  '09133333333': { token: 'doctor-jwt', role: 'Doctor', name: 'Doctor User' },
  '09144444444': { token: 'patient-jwt', role: 'Patient', name: 'Patient User' },
};

const originalAdapter = httpClient.defaults.adapter;
const requests: CapturedRequest[] = [];
let holdMe: Promise<void> | null = null;

function response<T>(config: InternalAxiosRequestConfig, data: T): AxiosResponse<T> {
  return { data, status: 200, statusText: 'OK', headers: {}, config };
}

const adapter: AxiosAdapter = async (config) => {
  const url = String(config.url ?? '');
  requests.push({
    url,
    authorization: getRequestAuthorizationHeader(config),
    persistedToken: localStorage.getItem(env.authTokenStorageKey),
  });

  if (url.includes('/auth/login')) {
    const body =
      typeof config.data === 'string'
        ? (JSON.parse(config.data) as { phoneNumber: string })
        : (config.data as { phoneNumber: string });
    const profile = profiles[body.phoneNumber];

    return response(config, {
      AccessToken: profile.token,
      ExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      UserId: `${profile.role}-id`,
      PhoneNumber: body.phoneNumber,
      Email: null,
      Name: profile.name,
      Role: profile.role,
    });
  }

  if (url.includes('/auth/me')) {
    if (holdMe) {
      await holdMe;
    }
    const session = authSessionStore.get();
    return response(config, {
      userId: session?.user.userId ?? '',
      phoneNumber: session?.user.phoneNumber ?? '',
      email: session?.user.email ?? null,
      roles: session?.user.roles ?? [],
    });
  }

  if (url.includes('/admin/dashboard/stats')) {
    return response(config, { doctorCount: 1, patientCount: 2, exerciseCount: 3 });
  }

  if (url.includes('/notifications/unread-count')) {
    return response(config, { count: 0 });
  }

  if (url.includes('/notifications')) {
    return response(config, []);
  }

  return response(config, {});
};

function renderApp(initialEntry = routes.login) {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AntdProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={[initialEntry]}>
              <Routes>
                <Route element={<GuestRoute />}>
                  <Route path={routes.login} element={<LoginForm />} />
                </Route>
                <Route element={<ProtectedRoute role="Admin" />}>
                  <Route path={routes.admin.root} element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                  </Route>
                </Route>
                <Route element={<ProtectedRoute role="ClinicManager" />}>
                  <Route path={routes.clinicManager.root} element={<ClinicManagerLayout />}>
                    <Route index element={<div>clinic-manager-home</div>} />
                  </Route>
                </Route>
                <Route element={<ProtectedRoute role="Doctor" />}>
                  <Route path={routes.doctor.root} element={<DoctorLayout />}>
                    <Route index element={<div>doctor-home</div>} />
                  </Route>
                </Route>
                <Route element={<ProtectedRoute role="Patient" />}>
                  <Route path={routes.patient.root} element={<PatientLayout />}>
                    <Route index element={<div>patient-home</div>} />
                  </Route>
                </Route>
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </AntdProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

async function login(phoneNumber: string) {
  const user = userEvent.setup();
  await user.type(await screen.findByPlaceholderText('09121234567'), phoneNumber);
  const password = document.querySelector('input[name="password"]');
  expect(password).toBeTruthy();
  await user.type(password!, 'password123');
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('protected request authentication ordering', () => {
  beforeEach(() => {
    requests.length = 0;
    holdMe = null;
    authSessionStore.clear();
    localStorage.clear();
    queryClient.clear();
    httpClient.defaults.adapter = adapter;
  });

  afterEach(() => {
    holdMe = null;
    httpClient.defaults.adapter = originalAdapter;
    authSessionStore.clear();
    queryClient.clear();
  });

  it('persists and attaches the token before admin stats and unread count execute', async () => {
    renderApp();
    await login('09111111111');

    await waitFor(() => {
      expect(requests.some(({ url }) => url.includes('/admin/dashboard/stats'))).toBe(true);
      expect(requests.some(({ url }) => url.includes('/notifications/unread-count'))).toBe(true);
    });

    const protectedRequests = requests.filter(
      ({ url }) =>
        url.includes('/admin/dashboard/stats') || url.includes('/notifications/unread-count'),
    );

    for (const request of protectedRequests) {
      expect(request.persistedToken).toBe('admin-jwt');
      expect(request.authorization).toBe('Bearer admin-jwt');
    }
  });

  it('does not mount protected queries while session restoration is initializing', async () => {
    let releaseMe = () => {};
    holdMe = new Promise<void>((resolve) => {
      releaseMe = resolve;
    });
    authSessionStore.save({
      accessToken: 'admin-jwt',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      user: {
        userId: 'Admin-id',
        phoneNumber: '09111111111',
        email: null,
        name: 'Admin User',
        role: 'Admin',
        roles: ['Admin'],
      },
    });

    renderApp(routes.admin.root);
    await waitFor(() => expect(document.querySelector('.route-loading')).toBeInTheDocument());

    expect(requests.some(({ url }) => url.includes('/admin/dashboard/stats'))).toBe(false);
    expect(requests.some(({ url }) => url.includes('/notifications/unread-count'))).toBe(false);

    releaseMe();
    await waitFor(() =>
      expect(requests.some(({ url }) => url.includes('/admin/dashboard/stats'))).toBe(true),
    );
  });

  it.each([
    ['Admin', '09111111111', 'Welcome back, Admin User'],
    ['ClinicManager', '09122222222', 'doctor-home'],
    ['Doctor', '09133333333', 'doctor-home'],
    ['Patient', '09144444444', 'patient-home'],
  ] as const)('preserves %s login and authenticates its protected requests', async (
    _role,
    phone,
    home,
  ) => {
    renderApp();
    await login(phone);
    await waitFor(() => expect(screen.getByText(home)).toBeInTheDocument());
    await waitFor(() =>
      expect(requests.some(({ url }) => url.includes('/notifications/unread-count'))).toBe(true),
    );

    const profile = profiles[phone];
    const protectedRequests = requests.filter(({ url }) => url.includes('/notifications/'));
    expect(protectedRequests.length).toBeGreaterThan(0);
    for (const request of protectedRequests) {
      expect(request.persistedToken).toBe(profile.token);
      expect(request.authorization).toBe(`Bearer ${profile.token}`);
    }
  });
});
