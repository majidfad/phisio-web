export type UserRole = 'Doctor' | 'Patient' | 'Admin';

export const UserRole = {
  Doctor: 'Doctor',
  Patient: 'Patient',
  Admin: 'Admin',
} as const satisfies Record<UserRole, UserRole>;

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

/** API serializes UserRole enum as number. */
export const UserRoleCode = {
  Doctor: 1,
  Patient: 2,
  Admin: 3,
} as const satisfies Record<UserRole, number>;

export interface RegisterRequest {
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: number;
  medicalLicenseNumber?: string;
  specialty?: string;
}

export interface RegisterResponse {
  userId: string;
  phoneNumber: string;
  name: string;
  role: UserRole | number;
  message?: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  userId: string;
  phoneNumber: string;
  email: string | null;
  name: string;
  /** API serializes enum as number; normalized in auth mappers. */
  role: UserRole | number;
}

export interface MeResponse {
  userId: string;
  phoneNumber: string;
  email: string | null;
  roles: string[];
}

export interface AuthenticatedUser {
  userId: string;
  phoneNumber: string;
  email: string | null;
  name: string;
  role: UserRole;
  roles: string[];
}
