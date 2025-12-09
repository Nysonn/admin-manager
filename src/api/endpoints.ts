import apiClient from "./client";
import type {
  LoginCredentials,
  LoginResponse,
  User,
  Page,
  CreatePageInput,
  UpdatePageInput,
  PageFilters,
  PaginatedResponse,
  Image,
  ImageFilters,
  Menu,
  MenuItem,
  AddMenuItemInput,
  ReorderMenuItemsInput,
  Product,
  ProductFilters,
} from "../types";

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      "/api/auth/login",
      credentials
    );
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/api/auth/me");
    return data;
  },
};

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

// Menu API
export const menuApi = {
  getAllItems: async (): Promise<{ data: MenuItem[]; total: number }> => {
    const response = await apiClient.get<{ data: MenuItem[]; total: number }>("/api/menu/items");
    return response.data;
  },

  get: async (id: number = 1): Promise<{ data: Menu }> => {
    const response = await apiClient.get<{ data: Menu }>(`/api/menu/${id}`);
    return response.data;
  },

  update: async (id: number, menu: { items: MenuItem[] }): Promise<{ data: Menu }> => {
    const response = await apiClient.put<{ data: Menu }>(`/api/menu/${id}`, menu);
    return response.data;
  },

  addItem: async (id: number, item: AddMenuItemInput): Promise<{ data: Menu; newItem: MenuItem }> => {
    const response = await apiClient.post<{ data: Menu; newItem: MenuItem }>(`/api/menu/${id}/items`, item);
    return response.data;
  },

  reorder: async (id: number, input: ReorderMenuItemsInput): Promise<{ data: Menu }> => {
    const response = await apiClient.post<{ data: Menu }>(
      `/api/menu/${id}/reorder`,
      input
    );
    return response.data;
  },
};

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
