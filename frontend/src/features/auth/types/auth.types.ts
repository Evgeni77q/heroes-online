export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Account {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  account: Account;
  tokens: AuthTokens;
}
