export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface UserRequest extends AuthRequest {
  name: string;
}
