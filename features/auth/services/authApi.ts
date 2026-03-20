import { api } from "@/lib/api";
import { LoginSchemaType } from "../schema";


export const authApi = {
    login: async (credentials: LoginSchemaType): Promise<any> => {
        try {
            const { data } = await api.post(`/auth/login`, credentials);
            return data;
        } catch (error: any) {
            throw error;
        }
    },
    getMe: async (): Promise<any> => {
        try {
            const { data } = await api.get(`/auth/me`);
            return data;
        } catch (error: any) {
            throw error;
        }
    },
    logout: async (): Promise<any> => {
        try {
            const { data } = await api.post(`/auth/logout`, { withCredentials: true });
            return data;
        } catch (error: any) {
            throw error;
        }
    },
};
