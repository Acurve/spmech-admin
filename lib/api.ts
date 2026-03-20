import axios from 'axios';
import { API_PREFIX } from '@/config/apiPrefix';

export const api = axios.create({
    baseURL: API_PREFIX,
    withCredentials: true, // Crucial for cookies!
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);
