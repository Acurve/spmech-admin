"use client";

import PageSkeleton from "@/components/loaders/PageSkeleton";
import ManageCompanySettingsForm from "@/features/company-settings/components/ManageCompanySettingsForm";
import { useManufacturerInfo } from "@/features/company-settings/hooks/useManufacturerInfo";

export default function CompanySettingsPage() {
    const { data: responseData, isLoading, isError } = useManufacturerInfo();

    if (isLoading) return <PageSkeleton />

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center text-red-500">
                Failed to load manufacturer settings. Please try again.
            </div>
        );
    }

    const companyData = responseData?.data || {};

    return (
        <ManageCompanySettingsForm companyData={companyData} />
    );
}