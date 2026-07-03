import { api } from "@/api/client";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth.types";

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const response = await api.post("/api/v1/account/register", payload);
  return response.data.data;
}

export async function login(
  payload: LoginRequest,
): Promise<AuthResponse> {
  const response = await api.post("/api/v1/account/login", payload);
  return response.data.data;
}
