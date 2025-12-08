import type { AuthProvider } from "react-admin";
import { authApi } from "../api/endpoints";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const LAST_VALIDATED_KEY = "lastValidated";
const VALIDATION_INTERVAL = 5 * 60 * 1000; // Validate every 5 minutes

const authProvider: AuthProvider = {
  login: async ({ email, password }: any) => {
    try {
      const response = await authApi.login({
        email: email,
        password: password,
      });

      // Store token, user info, and validation timestamp
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      localStorage.setItem(LAST_VALIDATED_KEY, Date.now().toString());
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error("Invalid credentials"));
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_VALIDATED_KEY);
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return Promise.reject();
    }

    // Check if we need to revalidate
    const lastValidated = localStorage.getItem(LAST_VALIDATED_KEY);
    const now = Date.now();
    
    if (lastValidated && (now - parseInt(lastValidated)) < VALIDATION_INTERVAL) {
      // Token was validated recently, trust it (backend cookie handles expiry)
      return Promise.resolve();
    }

    // Revalidate token periodically
    try {
      const user = await authApi.getCurrentUser();
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(LAST_VALIDATED_KEY, now.toString());
      return Promise.resolve();
    } catch (error) {
      // Only reject if we get a clear auth error
      if ((error as any)?.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(LAST_VALIDATED_KEY);
        return Promise.reject();
      }
      // For network errors, don't log out - rely on backend session cookie
      console.warn('Auth check failed but keeping session:', error);
      return Promise.resolve();
    }
  },

  checkError: async (error: any) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LAST_VALIDATED_KEY);
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: async () => {
    try {
      const user = await authApi.getCurrentUser();
      return Promise.resolve(user.role);
    } catch {
      return Promise.resolve(null);
    }
  },

  getIdentity: async () => {
    // Try cached user first to avoid API call
    const cachedUser = localStorage.getItem(USER_KEY);
    if (cachedUser) {
      try {
        const user = JSON.parse(cachedUser);
        return Promise.resolve({
          id: user.id,
          fullName: user.name,
          avatar: undefined,
        });
      } catch {
        // Fall through to API call
      }
    }

    // Fallback to API
    try {
      const user = await authApi.getCurrentUser();
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return Promise.resolve({
        id: user.id,
        fullName: user.name,
        avatar: undefined,
      });
    } catch {
      return Promise.reject();
    }
  },
};

export default authProvider;
