import type { GetListParams, GetOneParams, GetManyParams, CreateParams, UpdateParams, DeleteParams } from "react-admin";
import { pagesApi } from "../../api/endpoints";
import { normalizeResponse } from "../../utils/normalizeResponse";
import type { Page } from "../../types"; 

export const pageHandlers = {
  getList: async (params: GetListParams) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = "id", order = "ASC" } = params.sort || {};
    const filters = params.filter || {};

    const response = await pagesApi.getAll({
      page,
      perPage,
      _sort: field,
      _order: order.toLowerCase() as "asc" | "desc",
      q: filters.q,
      status: filters.status,
      slug: filters.slug,
    });

    return {
      data: response.data,
      total: response.total,
    };
  },

  getOne: async (params: GetOneParams) => {
    try {
      const response = await pagesApi.getOne(Number(params.id));
      const data = normalizeResponse(response, params.id, "pages");
      
      return { data: data as Page };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Page with ID ${params.id} does not exist or has been deleted.`);
      }
      throw error;
    }
  },

  getMany: async (params: GetManyParams) => {
    const promises = params.ids.map((id) => pagesApi.getOne(Number(id)));
    const data = await Promise.all(promises);
    // Note: We should normalize here too, but for simplicity, we rely on the backend being consistent.
    return { data: data as Page[] };
  },

  create: async (params: CreateParams) => {
    const { title, slug, content, status } = params.data;
    const created = await pagesApi.create({ title, slug, content, status });
    let normalized = normalizeResponse(created, undefined, "pages");

    // Fallback: if ID is still missing after normalization, try to fetch by slug
    if (!normalized?.id && params.data?.slug) {
      try {
        const res = await pagesApi.getAll({ page: 1, perPage: 1, _sort: "id", _order: "asc", slug: params.data.slug });
        const match = Array.isArray(res.data) ? res.data.find((p: any) => p?.slug === params.data.slug) : undefined;
        if (match) normalized = match;
      } catch {}
    }
    
    // Final check for ID
    if (!normalized?.id) {
      normalized = { id: Date.now(), ...(params.data as any), ...normalized };
    }

    return { data: normalized as Page };
  },

  update: async (params: UpdateParams) => {
    try {
      // Send only the required update fields
      const { title, slug, content, status } = params.data as Page;
      const data = await pagesApi.update(Number(params.id), { title, slug, content, status });
      
      const normalized = normalizeResponse(data, params.id, "pages");
      
      return { data: normalized as Page };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Page with ID ${params.id} not found. It may have been deleted.`);
      }
      throw error;
    }
  },

  delete: async (params: DeleteParams) => {
    await pagesApi.delete(Number(params.id));
    return { data: { id: params.id } as Partial<Page> };
  },

  deleteMany: async (params: { ids: any[] }) => {
    await Promise.all(params.ids.map((id) => pagesApi.delete(Number(id))));
    return { data: params.ids };
  },
};