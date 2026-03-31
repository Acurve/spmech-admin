"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateClients } from "../schema";
import { CLIENTS_QUERY_KEY } from "@/constants/queryKeys";
import { clientsApi } from "../services/clientsApi";



export function useClients() {
    return useQuery({
        queryKey: [CLIENTS_QUERY_KEY],
        queryFn: clientsApi.get,
    });
}
export function useClientsStats() {
    return useQuery({
        queryKey: [CLIENTS_QUERY_KEY],
        queryFn: clientsApi.get,
        select: (data) => data?.data.stats, // Only the number is returned to the component
    })
}


export function useUpdateClients() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updates: UpdateClients | FormData) =>
            clientsApi.update(updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
        },
    });
}

