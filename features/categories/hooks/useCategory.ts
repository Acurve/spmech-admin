"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryCreateInput, CategoryUpdateInput } from "../schema";
import { CATEGORIES_QUERY_KEY } from "@/constants/queryKeys";
import { categoryApi } from "../services/categoryApi";



export function useCategories() {
    return useQuery({
        queryKey: [CATEGORIES_QUERY_KEY],
        queryFn: categoryApi.getAll,
    });
}
export function useCategoriesCount() {
    return useQuery({
        queryKey: [CATEGORIES_QUERY_KEY],
        queryFn: categoryApi.getAll,
        select: (data) => data.data.data.length, // Only the number is returned to the component
    })
}
export function useCategory(id: string) {
    return useQuery({
        queryKey: [CATEGORIES_QUERY_KEY, id],
        queryFn: () => categoryApi.getByIdOrSlug(id),
        enabled: !!id,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newCategory: CategoryCreateInput | FormData) => categoryApi.create(newCategory),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: CategoryUpdateInput | FormData }) =>
            categoryApi.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => categoryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
        },
    });
}
