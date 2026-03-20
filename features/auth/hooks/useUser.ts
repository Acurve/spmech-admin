import { useQuery } from "@tanstack/react-query";
import { authApi } from "../services/authApi";

export const USER_QUERY_KEY = "user-profile";

export function useUser() {
    return useQuery({
        queryKey: [USER_QUERY_KEY],
        queryFn: authApi.getMe,
    });
}
