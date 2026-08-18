import { describe, expect, it } from 'vitest';

import {
  mapAuthResponseToUser,
  mapMeResponseToUser,
  normalizeAuthResponse,
} from '@/features/auth/utils/map-auth-user';
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

  it('maps ClinicManager numeric API role values', () => {
    const response: AuthResponse = {
      accessToken: 'token',
      expiresAt: '2026-01-01T00:00:00Z',
      userId: 'user-id',
      phoneNumber: '+10000000000',
      email: null,
      name: 'Clinic Manager',
      role: 4,
    };

    expect(mapAuthResponseToUser(response).role).toBe('ClinicManager');
    expect(mapAuthResponseToUser(response).roles).toEqual(['ClinicManager', 'Doctor']);
  });
});

describe('normalizeAuthResponse', () => {
  it('reads PascalCase login payloads', () => {
    const normalized = normalizeAuthResponse({
      AccessToken: 'jwt-token',
      ExpiresAt: '2026-01-01T00:00:00Z',
      UserId: 'user-id',
      PhoneNumber: '+15551234567',
      Email: null,
      Name: 'Clinic Manager',
      Role: 4,
    });

    expect(normalized.accessToken).toBe('jwt-token');
    expect(normalized.role).toBe(4);
    expect(mapAuthResponseToUser(normalized).role).toBe('ClinicManager');
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

  it('keeps ClinicManager from the login snapshot when /me only returns Doctor', () => {
    const user = mapMeResponseToUser(
      {
        userId: 'manager-id',
        phoneNumber: '+15550000004',
        email: null,
        roles: ['Doctor'],
      },
      {
        userId: 'manager-id',
        phoneNumber: '+15550000004',
        email: null,
        name: 'Clinic Manager',
        role: 'ClinicManager',
        roles: ['ClinicManager'],
      },
    );

    expect(user.role).toBe('ClinicManager');
    expect(user.roles).toEqual(['ClinicManager', 'Doctor']);
  });
});
