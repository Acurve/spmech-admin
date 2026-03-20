"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MachineCreateInput, MachineUpdateInput } from "../schema";
import { MACHINE_QUERY_KEY } from "@/constants/queryKeys";
import { machinesApi } from "../services/machineApi";


export function useMachines() {
    return useQuery({
        queryKey: [MACHINE_QUERY_KEY],
        queryFn: machinesApi.getAll,
    });
}

export function useMachineKeys() {
    return useQuery({
        queryKey: ["MACHINE_KEYS"],
        queryFn: machinesApi.getKeys,
    });
}

export function useCategoryMachines(id: string) {
    return useQuery({
        queryKey: [MACHINE_QUERY_KEY, id],
        queryFn: () => machinesApi.getAllByCategoryId(id),
    });
}
export function useMachinesCount() {
    return useQuery({
        queryKey: [MACHINE_QUERY_KEY], // Identical key = Shared Cache
        queryFn: machinesApi.getAll,
        select: (res) => res?.data?.data?.length,
    })
}

export function useMachine(id: string) {
    return useQuery({
        queryKey: [MACHINE_QUERY_KEY, id],
        queryFn: () => machinesApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateMachine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newMachine: MachineCreateInput) => machinesApi.create(newMachine),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MACHINE_QUERY_KEY] });
        },
    });
}

export function useUpdateMachine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: MachineUpdateInput }) =>
            machinesApi.update(id, updates),

        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                [MACHINE_QUERY_KEY, variables.id],
                data
            );

            queryClient.invalidateQueries({
                queryKey: [MACHINE_QUERY_KEY],
            });
        }
    });
}
export function useDeleteMachine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => machinesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MACHINE_QUERY_KEY] });
        },
    });
}
