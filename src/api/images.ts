import apiClient from "./client";
import type { Image, ImageFilters, PaginatedResponse } from "../types";

// Images API
export const imagesApi = {
  getAll: async (filters?: ImageFilters): Promise<PaginatedResponse<Image>> => {
    const { data } = await apiClient.get<PaginatedResponse<Image>>(
      "/api/images",
      { params: filters }
    );
    return data;
  },

  getOne: async (id: number): Promise<Image> => {
    const { data } = await apiClient.get<Image>(`/api/images/${id}`);
    return data;
  },

  upload: async (file: File): Promise<Image> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<Image>("/api/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  update: async (id: number, file: File): Promise<Image> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.put<Image>(
      `/api/images/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/images/${id}`);
  },
};