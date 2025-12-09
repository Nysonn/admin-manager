import apiClient from "./client";
import type {
  Page,
  CreatePageInput,
  UpdatePageInput,
  PageFilters,
  PaginatedResponse,
} from "../types";

// Pages API
export const pagesApi = {
  getAll: async (filters?: PageFilters): Promise<PaginatedResponse<Page>> => {
    const { data } = await apiClient.get<PaginatedResponse<Page>>(
      "/api/pages",
      { params: filters }
    );
    return data;
  },

  getOne: async (id: number): Promise<Page> => {
    const { data } = await apiClient.get<Page>(`/api/pages/${id}`);
    return data;
  },

  create: async (input: CreatePageInput): Promise<Page> => {
    const { data } = await apiClient.post<Page>("/api/pages", input);
    return data;
  },

  update: async (id: number, input: UpdatePageInput): Promise<Page> => {
    const { data } = await apiClient.put<Page>(`/api/pages/${id}`, input);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/pages/${id}`);
  },
};