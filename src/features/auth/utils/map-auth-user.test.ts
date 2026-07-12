import { describe, expect, it } from 'vitest';

import { mapAuthResponseToUser, mapMeResponseToUser } from '@/features/auth/utils/map-auth-user';
import type { AuthResponse, MeResponse } from '@/types/auth';

describe('mapAuthResponseToUser', () => {
  it('maps login response to authenticated user', () => {
    const response: AuthResponse = {
      accessToken: 'token',
      expiresAt: '2026-01-01T00:00:00Z',
      userId: 'user-id',
      phoneNumber: '+15551234567',
      email: 'jane@example.com',
      name: 'Dr. Jane Smith',
      role: 'Doctor',
    };

    expect(mapAuthResponseToUser(response)).toEqual({
      userId: 'user-id',
      phoneNumber: '+15551234567',
      email: 'jane@example.com',
      name: 'Dr. Jane Smith',
      role: 'Doctor',
      roles: ['Doctor'],
    });
  });

  it('maps numeric API role values', () => {
    const response: AuthResponse = {
      accessToken: 'token',
      expiresAt: '2026-01-01T00:00:00Z',
      userId: 'user-id',
      phoneNumber: '+10000000000',
      email: 'admin@phisio.com',
      name: 'System Administrator',
      role: 3,
    };

    expect(mapAuthResponseToUser(response).role).toBe('Admin');
    expect(mapAuthResponseToUser(response).roles).toEqual(['Admin']);
  });
});

describe('mapMeResponseToUser', () => {
  it('maps me response and preserves existing display name', () => {
    const me: MeResponse = {
      userId: 'user-id',
      phoneNumber: '+15551234567',
      email: 'jane@example.com',
      roles: ['Doctor', 'Admin'],
    };

    const user = mapMeResponseToUser(me, {
      userId: 'user-id',
      phoneNumber: '+15551234567',
      email: 'jane@example.com',
      name: 'Dr. Jane Smith',
      role: 'Doctor',
      roles: ['Doctor'],
    });

    expect(user.name).toBe('Dr. Jane Smith');
    expect(user.role).toBe('Admin');
    expect(user.roles).toEqual(['Doctor', 'Admin']);
  });
});
