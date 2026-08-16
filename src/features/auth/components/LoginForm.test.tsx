import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { renderWithProviders } from '@/test/render';

const mockLogin = vi.fn();

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: vi.fn(),
    user: null,
    isInitializing: false,
  }),
}));

async function submitLogin() {
  const user = userEvent.setup();
  renderWithProviders(<LoginForm />);

  await user.type(screen.getByPlaceholderText('09121234567'), '09123456789');
  const passwordInput = document.querySelector('input[name="password"]');
  expect(passwordInput).toBeTruthy();
  await user.type(passwordInput!, 'password123');
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation errors for empty submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Phone number is required.')).toBeInTheDocument();
  });

  it('submits credentials and lets auth state drive navigation', async () => {
    mockLogin.mockResolvedValue({
      userId: '1',
      role: 'Patient',
      name: 'Patient',
      phoneNumber: '09123456789',
      email: null,
      roles: ['Patient'],
    });

    await submitLogin();

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        phoneNumber: '09123456789',
        password: 'password123',
      });
    });
  });
});
