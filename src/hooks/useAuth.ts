import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/endpoints";
import type { LoginCredentials } from "../types";
import { useAppDispatch } from "../store/hooks";
import { setCredentials, setUser, logout as logoutAction } from "../store/slices/authSlice";
import { useEffect } from "react";

// Login mutation
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token, user: data.user }));
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

// Get current user query
export const useCurrentUser = (enabled: boolean = true) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setUser(query.data));
    }
  }, [query.data, dispatch]);

  return query;
};

// Logout mutation
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Just clear local state, no API call needed
      return Promise.resolve();
    },
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
};
