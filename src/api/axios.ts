import axios from "axios";

// Shared axios instance for API calls.
const BASE =
  import.meta.env.VITE_PRODUCTS_API_BASE ??
  "https://fakestoreapi.com"; // fallback for demo

const api = axios.create({
  baseURL: BASE,
  timeout: 15_000,
});

// Response interceptor to normalize data shape or errors
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    // You can transform or enrich error here for react-query
    return Promise.reject(error);
  }
);

export default api;
