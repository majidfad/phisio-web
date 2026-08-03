export interface AdminSetPasswordRequest {
  password?: string;
  confirmPassword?: string;
  generatePassword: boolean;
}

export interface AdminSetPasswordResponse {
  message: string;
  generatedPassword?: string | null;
}
