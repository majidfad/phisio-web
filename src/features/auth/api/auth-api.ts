import { httpClient } from '@/api/http-client';
import type {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth';

const AUTH_BASE = '/auth';

export async function loginApi(request: LoginRequest): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>(`${AUTH_BASE}/login`, request, {
    skipAuth: true,
  });

  return data;
}

export async function registerApi(request: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await httpClient.post<RegisterResponse>(`${AUTH_BASE}/register`, request, {
    skipAuth: true,
  });

  return data;
}

export async function getMeApi(): Promise<MeResponse> {
  const { data } = await httpClient.get<MeResponse>(`${AUTH_BASE}/me`);

  return data;
}
