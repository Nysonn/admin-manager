import apiClient from "./client";
import type { LoginCredentials, LoginResponse, User } from "../types";

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      "/api/auth/login",
      credentials
    );
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/api/auth/me");
    return data;
  },
};