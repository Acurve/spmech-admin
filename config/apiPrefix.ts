import { env } from "./env";


export const isServer = typeof window === 'undefined';
export const isDev = process.env.MODE === 'development';

export const API_PREFIX = isServer
    ? (isDev ? "http://127.0.0.1:3000/api/v1" : env.API_PREFIX)
    : "/api"