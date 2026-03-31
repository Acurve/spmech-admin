import { api } from "@/lib/api";
import { type UpdateClients } from "../schema";


export const clientsApi = {
    get: async (): Promise<any> => {
        const { data } = await api.get(`/clients`);
        return data;
    },

    update: async (updates: UpdateClients | FormData): Promise<any> => {
        const { data } = await api.put(`/clients`, updates, { withCredentials: true });
        return data;
    },

};
