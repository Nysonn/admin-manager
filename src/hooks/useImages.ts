import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imagesApi } from "../api/endpoints";
import type { ImageFilters } from "../types";

// Get all images query
export const useImages = (filters?: ImageFilters) => {
  return useQuery({
    queryKey: ["images", filters],
    queryFn: () => imagesApi.getAll(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get single image query
export const useImage = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["images", id],
    queryFn: () => imagesApi.getOne(id),
    enabled,
    staleTime: 30 * 1000,
  });
};

// Upload image mutation
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => imagesApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
};

// Update image mutation
export const useUpdateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      imagesApi.update(id, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["images", data.id] });
    },
  });
};

// Delete image mutation
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => imagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
};
