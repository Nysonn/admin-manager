import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/endpoints";
import type { ProductFilters } from "../types";

// Get all products query
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Refresh products mutation
export const useRefreshProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productsApi.refresh(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
