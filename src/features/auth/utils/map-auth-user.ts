import type { AuthResponse, AuthenticatedUser, MeResponse } from '@/types/auth';

import { normalizeUserRole, normalizeUserRoles, resolvePrimaryRole } from './normalize-user-role';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return '';
}

function readNullableString(record: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];

    if (value === null) {
      return null;
    }

    if (typeof value === 'string') {
      return value;
    }
  }

  return null;
}

function unwrapAuthPayload(raw: unknown): Record<string, unknown> {
  if (!isRecord(raw)) {
    return {};
  }

  if (isRecord(raw.value)) {
    return raw.value;
  }

  if (isRecord(raw.data) && ('accessToken' in raw.data || 'AccessToken' in raw.data)) {
    return raw.data;
  }

  return raw;
}

export function normalizeAuthResponse(raw: unknown): AuthResponse {
  const payload = unwrapAuthPayload(raw);

  return {
    accessToken: readString(payload, 'accessToken', 'AccessToken'),
    expiresAt: readString(payload, 'expiresAt', 'ExpiresAt'),
    userId: readString(payload, 'userId', 'UserId'),
    phoneNumber: readString(payload, 'phoneNumber', 'PhoneNumber'),
    email: readNullableString(payload, 'email', 'Email'),
    name: readString(payload, 'name', 'Name'),
    role: (payload.role ?? payload.Role) as AuthResponse['role'],
  };
}

export function mapAuthResponseToUser(response: AuthResponse): AuthenticatedUser {
  const normalized = normalizeAuthResponse(response);
  const role = normalizeUserRole(normalized.role);
  const roles = normalizeUserRoles([role], role);

  return {
    userId: normalized.userId,
    phoneNumber: normalized.phoneNumber,
    email: normalized.email,
    name: normalized.name,
    role,
    roles,
  };
}

export function mapMeResponseToUser(
  response: MeResponse,
  existingUser?: AuthenticatedUser | null,
): AuthenticatedUser {
  const fallbackRole = existingUser?.role ?? 'Patient';
  const apiRoles = normalizeUserRoles(response.roles, fallbackRole);
  const roles = [
    ...new Set([
      ...(existingUser ? [normalizeUserRole(existingUser.role)] : []),
      ...apiRoles,
    ]),
  ];
  const primaryRole = resolvePrimaryRole(roles, fallbackRole);

  return {
    userId: response.userId,
    phoneNumber: response.phoneNumber,
    email: response.email,
    name: existingUser?.name ?? response.phoneNumber,
    role: primaryRole,
    roles,
  };
}

export function normalizeAuthenticatedUser(user: AuthenticatedUser): AuthenticatedUser {
  const roles = normalizeUserRoles(user.roles, normalizeUserRole(user.role));

  return {
    ...user,
    role: resolvePrimaryRole(roles, normalizeUserRole(user.role)),
    roles,
  };
}
