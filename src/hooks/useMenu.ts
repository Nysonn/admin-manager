import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "../api/endpoints";
import type { MenuItem, AddMenuItemInput } from "../types";

// Get all menu items query
export const useAllMenuItems = () => {
  return useQuery({
    queryKey: ["menu", "items"],
    queryFn: async () => {
      const response = await menuApi.getAllItems();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get menu query
export const useMenu = (id: number = 1) => {
  return useQuery({
    queryKey: ["menu", id],
    queryFn: async () => {
      const response = await menuApi.get(id);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update menu mutation
export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, items }: { id: number; items: MenuItem[] }) =>
      menuApi.update(id, { items }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["menu", response.data.id] });
      queryClient.invalidateQueries({ queryKey: ["menu", "items"] });
    },
  });
};

// Add menu item mutation
export const useAddMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, item }: { id: number; item: AddMenuItemInput }) =>
      menuApi.addItem(id, item),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["menu", response.data.id] });
      queryClient.invalidateQueries({ queryKey: ["menu", "items"] });
    },
  });
};

// Reorder menu items mutation
export const useReorderMenuItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, itemIds }: { id: number; itemIds: string[] }) =>
      menuApi.reorder(id, { itemIds }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["menu", response.data.id] });
      queryClient.invalidateQueries({ queryKey: ["menu", "items"] });
    },
  });
};
