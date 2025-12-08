import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "../api/endpoints";
import type { MenuItem, AddMenuItemInput } from "../types";

// Get all menu items query
export const useAllMenuItems = () => {
  return useQuery({
    queryKey: ["menu", "items"],
    queryFn: () => menuApi.getAllItems(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get menu query
export const useMenu = (id: number = 1) => {
  return useQuery({
    queryKey: ["menu", id],
    queryFn: () => menuApi.get(id),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Update menu mutation
export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, items }: { id: number; items: MenuItem[] }) =>
      menuApi.update(id, { items }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menu", data.id] });
    },
  });
};

// Add menu item mutation
export const useAddMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, item }: { id: number; item: AddMenuItemInput }) =>
      menuApi.addItem(id, item),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menu", data.id] });
    },
  });
};

// Reorder menu items mutation
export const useReorderMenuItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, itemIds }: { id: number; itemIds: string[] }) =>
      menuApi.reorder(id, { itemIds }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menu", data.id] });
    },
  });
};
