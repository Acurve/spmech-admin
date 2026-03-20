import { api } from "@/lib/api";
import { UpdateManufacturerInfo } from "../schema";


export const manufacturerInfoApi = {
    get: async (): Promise<any> => {
        const { data } = await api.get(`/products/manufacturer`);
        console.log(data)
        return data;
    },

    update: async (updates: UpdateManufacturerInfo | FormData): Promise<any> => {
        const { data } = await api.put(`/products/manufacturer`, updates, { withCredentials: true });
        return data;
    },

};
