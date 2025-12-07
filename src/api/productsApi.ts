import api from "./axios";

export type Product = {
  id: number | string;
  title: string;
  description: string;
  price: number;
  category?: string;
  image?: string;
  rating?: { rate: number; count: number } | null;
};

// Query params we support for list fetching.
export type ProductListParams = {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

// fetchProducts: returns { data: Product[], total: number }
export async function fetchProducts(params: ProductListParams = {}) {
  const res = await api.get<Product[]>("/products");
  let items = res.data ?? [];

  // simple client-side filtering
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (params.category) {
    items = items.filter((p) => p.category === params.category);
  }
  if (typeof params.minPrice === "number") {
    items = items.filter((p) => p.price >= (params.minPrice ?? 0));
  }
  if (typeof params.maxPrice === "number") {
    items = items.filter((p) => p.price <= (params.maxPrice ?? Infinity));
  }

  const total = items.length;
  const page = params.page ?? 1;
  const perPage = params.perPage ?? 24;
  const start = (page - 1) * perPage;
  const paged = items.slice(start, start + perPage);

  return { data: paged, total, page, perPage };
}

export async function fetchProductById(id: number | string) {
  // fakestoreapi has /products/:id
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
}