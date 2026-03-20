"use client"

import { Header, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout"
import PageSkeleton from "@/components/loaders/PageSkeleton"
import InquiryCard from "@/features/inquiries/components/InquiryCard"
import { useContacts } from "@/features/inquiries/hooks/useContact"
import { ContactRequest } from "@/features/inquiries/schema"

const InquiriesPage = () => {
    const { data: rawContacts, isLoading } = useContacts()
    if (isLoading) return <PageSkeleton />
    const contacts = rawContacts?.data || []
    return (
        <>
            <Header>
                <HeaderGroup className="flex-col">
                    <HeaderTitle>Inquiries</HeaderTitle>
                    <HeaderDescription>View and respond to inquiries.</HeaderDescription>
                </HeaderGroup>
            </Header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {contacts.map((enquiry: ContactRequest) => (
                    <InquiryCard key={enquiry.id} enquiry={enquiry} />
                ))}
            </div>
        </>
    )
}

export default InquiriesPage