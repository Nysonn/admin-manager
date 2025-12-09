import type { GetListParams, GetOneParams, GetManyParams, CreateParams, UpdateParams, DeleteParams } from "react-admin";
import { imagesApi } from "../../api/endpoints";
import { normalizeResponse } from "../../utils/normalizeResponse";
import type { Image } from "../../types";

export const imageHandlers = {
  getList: async (params: GetListParams) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const filters = params.filter || {};

    const response = await imagesApi.getAll({
      page,
      perPage,
      q: filters.q,
    });

    return {
      data: response.data as Image[],
      total: response.total,
    };
  },

  getOne: async (params: GetOneParams) => {
    try {
      const response = await imagesApi.getOne(Number(params.id));
      const data = normalizeResponse(response, params.id, "images");
      return { data: data as Image };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Image with ID ${params.id} does not exist or has been deleted.`);
      }
      throw error;
    }
  },

  getMany: async (params: GetManyParams) => {
    const promises = params.ids.map((id) => imagesApi.getOne(Number(id)));
    const data = await Promise.all(promises);
    return { data: data as Image[] };
  },

  create: async (params: CreateParams) => {
    const file = params.data.file?.rawFile;
    if (!file) {
      throw new Error("No file provided for upload");
    }
    const data = await imagesApi.upload(file);
    const normalized = normalizeResponse(data, undefined, "images");
    return { data: normalized as Image };
  },

  update: async (params: UpdateParams) => {
    try {
      const file = params.data.file?.rawFile;
      if (!file) {
        // Assume update might just be metadata if no new file is provided, 
        // but based on original code, we enforce file presence for this implementation.
        throw new Error("No file provided for update");
      }
      const response = await imagesApi.update(Number(params.id), file);
      const normalized = normalizeResponse(response, params.id, "images");
      return { data: normalized as Image };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Image with ID ${params.id} not found. It may have been deleted.`);
      }
      throw error;
    }
  },

  delete: async (params: DeleteParams) => {
    await imagesApi.delete(Number(params.id));
    return { data: { id: params.id } as Partial<Image> };
  },

  deleteMany: async (params: { ids: any[] }) => {
    await Promise.all(params.ids.map((id) => imagesApi.delete(Number(id))));
    return { data: params.ids };
  },
};