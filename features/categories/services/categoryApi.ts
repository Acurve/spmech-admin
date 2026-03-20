import { api } from "@/lib/api";
import { Category, CategoryCreateInput, CategoryUpdateInput } from "../schema";


export const categoryApi = {
    getAll: async (): Promise<any> => {
        const { data } = await api.get(`/products/categories`);
        return data;
    },

    getByIdOrSlug: async (idOrSlug: string): Promise<any> => {
        const { data } = await api.get(`/products/categories/${idOrSlug}`);
        return data;
    },

    create: async (category: CategoryCreateInput | FormData): Promise<any> => {
        const { data } = await api.post(`/products/categories`, category);
        return data;
    },

    update: async (id: string, updates: CategoryUpdateInput | FormData): Promise<Category> => {
        const { data } = await api.put(`/products/categories/${id}`, updates);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/products/categories/${id}`);
    },
};
