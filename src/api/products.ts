import apiClient from "./client";
import type { Product, ProductFilters, PaginatedResponse } from "../types";

// Products API
export const productsApi = {
  getAll: async (
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    const { data } = await apiClient.get<PaginatedResponse<Product>>(
      "/api/products",
      { params: filters }
    );
    return data;
  },

  getOne: async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/api/products/${id}`);
    return data;
  },

  refresh: async (): Promise<{ message: string; count: number }> => {
    const { data } = await apiClient.post<{ message: string; count: number }>(
      "/api/products/refresh"
    );
    return data;
  },
};