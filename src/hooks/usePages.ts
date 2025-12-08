import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "../api/endpoints";
import type { CreatePageInput, UpdatePageInput, PageFilters } from "../types";

// Get all pages query
export const usePages = (filters?: PageFilters) => {
  return useQuery({
    queryKey: ["pages", filters],
    queryFn: () => pagesApi.getAll(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get single page query
export const usePage = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["pages", id],
    queryFn: () => pagesApi.getOne(id),
    enabled,
    staleTime: 30 * 1000,
  });
};

// Create page mutation
export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePageInput) => pagesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};

// Update page mutation - Note: slug and status cannot be updated
export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdatePageInput }) =>
      pagesApi.update(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages", data.id] });
    },
  });
};

// Delete page mutation
export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};
