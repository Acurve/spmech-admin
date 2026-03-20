import { api } from "@/lib/api";
import { ContactRequest } from "../schema";

export const contactsApi = {
    getAll: async (): Promise<any> => {
        const { data } = await api.get(`/contacts`);
        return data;
    },

};
