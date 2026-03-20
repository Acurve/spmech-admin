"use client";

import { useQuery } from "@tanstack/react-query";
import { contactsApi } from "../services/contactApi";
import { CONTACT_QUERY_KEY } from "@/constants/queryKeys";

export function useContacts() {
    return useQuery({
        queryKey: [CONTACT_QUERY_KEY],
        queryFn: contactsApi.getAll,
    });
}
export function useContactsCount() {
    return useQuery({
        queryKey: [CONTACT_QUERY_KEY],
        queryFn: contactsApi.getAll,
        select: (data) => data?.data?.length, // Only the number is returned to the component
    })
}
