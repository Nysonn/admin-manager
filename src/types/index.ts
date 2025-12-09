// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Page Types
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageInput {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
}

export interface UpdatePageInput {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
}

export interface PageFilters {
  page?: number;
  perPage?: number;
  q?: string;
  status?: "draft" | "published";
  slug?: string;
  _sort?: string;
  _order?: "asc" | "desc";
}

// Image Types
export interface Image {
  id: number;
  filename: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  width: number;
  height: number;
  uploadedAt: string;
}

export interface ImageFilters {
  page?: number;
  perPage?: number;
  q?: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  label: string;
  linkType: "internal" | "external";
  pageId?: number;
  url?: string;
  icon?: string;
  openInNewTab: boolean;
  showInMobile: boolean;
  children?: MenuItem[];
}

export interface Menu {
  id: number;
  items: MenuItem[];
  updatedAt?: string;
}

export interface AddMenuItemInput {
  label: string;
  linkType: "internal" | "external";
  pageId?: number;
  url?: string;
  icon?: string;
  openInNewTab: boolean;
  showInMobile: boolean;
}

export interface ReorderMenuItemsInput {
  itemIds: string[];
}

// Product Types
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface ProductFilters {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
