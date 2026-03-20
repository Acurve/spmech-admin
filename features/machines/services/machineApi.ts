import { api } from "@/lib/api";
import { Machine, MachineCreateInput, MachineUpdateInput } from "../schema";

export const machinesApi = {
    getAll: async (): Promise<any> => {
        const { data } = await api.get(`/products/machines`);
        return data;
    },

    getAllByCategoryId: async (id: string): Promise<any> => {
        const { data } = await api.get(`/products/machines/?categoryId=${id}`);
        return data;
    },

    getKeys: async (): Promise<any> => {
        const { data } = await api.get(`/products/machines/keys`);
        return data;
    },

    getById: async (id: string): Promise<any> => {
        const { data } = await api.get(`/products/machines/${id}`);
        return data;
    },

    create: async (machine: MachineCreateInput | FormData): Promise<Machine> => {
        const { data } = await api.post(`/products/machines`, machine);
        return data;
    },

    update: async (id: string, updates: MachineUpdateInput | FormData): Promise<any> => {
        const { data } = await api.put(`/products/machines/${id}`, updates);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/products/machines/${id}`);
    },
};
