"use client";

import { MANUFACTURER_INFO_QUERY_KEY } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateManufacturerInfo } from "../schema";
import { manufacturerInfoApi } from "../services/manufacturerInfoApi";



export function useManufacturerInfo() {
    return useQuery({
        queryKey: [MANUFACTURER_INFO_QUERY_KEY],
        queryFn: manufacturerInfoApi.get,
    });
}
export function useManufacturerInfoStats() {
    return useQuery({
        queryKey: [MANUFACTURER_INFO_QUERY_KEY],
        queryFn: manufacturerInfoApi.get,
        select: (data) => data?.data.stats, // Only the number is returned to the component
    });
}


export function useUpdateManufacturerInfo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updates: UpdateManufacturerInfo) =>
            manufacturerInfoApi.update(updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MANUFACTURER_INFO_QUERY_KEY] });
        },
    });

}