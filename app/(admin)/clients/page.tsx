"use client";

import PageSkeleton from "@/components/loaders/PageSkeleton";
import ManageClientsForm from "@/features/clients/components/ManageClientsForm";
import { useClients } from "@/features/clients/hooks/useClients";

export default function ClientsPage() {
    const { data: responseData, isLoading, isError } = useClients();

    if (isLoading) return <PageSkeleton />

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center text-red-500">
                Failed to load clients. Please try again.
            </div>
        );
    }

    const clientsData = responseData?.data || { clients: [] };

    return (
        <ManageClientsForm clientsData={clientsData} />
    );
}
