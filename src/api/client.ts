import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://admin-api-qgh7.onrender.com";

// Retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // Base delay in ms (increased for better rate limit handling)

// Create axios instance for API requests
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Disabled: cross-site cookies not needed (using token auth)
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle 429 Rate Limit with exponential backoff retry
    if (error.response?.status === 429) {
      const retryCount = config._retryCount || 0;
      
      if (retryCount < MAX_RETRIES) {
        config._retryCount = retryCount + 1;
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        
        // Check for Retry-After header (common in rate limiting)
        const retryAfter = error.response?.headers?.['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;
        
        console.warn(`Rate limited. Retrying in ${waitTime}ms (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return apiClient.request(config);
      }
      
      console.error(`Rate limit exceeded after ${MAX_RETRIES} retries`);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
