// Mininmal Auth Provider for the React Admin
import type { AuthProvider } from "react-admin";

const TOKEN_KEY = "admin_manager_token";

const authProvider: AuthProvider = {
  login: async ({ username, password }: any) => {
    // Accept any non-empty username/password
    if (username && password) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify({ token: "fake-jwt-token", username }));
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid credentials"));
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) return Promise.resolve();
    return Promise.reject();
  },

  checkError: async (error: any) => {
    // react-admin calls this on fetch errors
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: async () => {
    // single admin role for now
    return Promise.resolve(["admin"]);
  },
};

export default authProvider;
