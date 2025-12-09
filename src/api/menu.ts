import apiClient from "./client";
import type { Menu, MenuItem, AddMenuItemInput, ReorderMenuItemsInput } from "../types";

// Menu API
export const menuApi = {
  getAllItems: async (): Promise<{ data: MenuItem[]; total: number }> => {
    const response = await apiClient.get<{ data: MenuItem[]; total: number }>(
      "/api/menu/items"
    );
    return response.data;
  },

  get: async (id: number = 1): Promise<{ data: Menu }> => {
    const response = await apiClient.get<{ data: Menu }>(`/api/menu/${id}`);
    return response.data;
  },

  update: async (
    id: number,
    menu: { items: MenuItem[] }
  ): Promise<{ data: Menu }> => {
    const response = await apiClient.put<{ data: Menu }>(
      `/api/menu/${id}`,
      menu
    );
    return response.data;
  },

  addItem: async (
    id: number,
    item: AddMenuItemInput
  ): Promise<{ data: Menu; newItem: MenuItem }> => {
    const response = await apiClient.post<{ data: Menu; newItem: MenuItem }>(
      `/api/menu/${id}/items`,
      item
    );
    return response.data;
  },

  reorder: async (
    id: number,
    input: ReorderMenuItemsInput
  ): Promise<{ data: Menu }> => {
    const response = await apiClient.post<{ data: Menu }>(
      `/api/menu/${id}/reorder`,
      input
    );
    return response.data;
  },
};