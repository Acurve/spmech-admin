import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Crucial for cookies!
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Proxy rejected the request! Send them to login.
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);