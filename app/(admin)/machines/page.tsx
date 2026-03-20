"use client";

import { useMemo } from "react";
import { Header, HeaderDescription, HeaderGroup, HeaderTitle } from "@/components/layout";
import { LinkTag } from "@/components/shared";
import { useMachines } from "@/features/machines/hooks/useMachine";
import { useCategories } from "@/features/categories/hooks/useCategory";
import MachineGroupContainer from "@/features/machines/components/MachineGroup";
import { Plus } from "lucide-react";
import { MachineResponse } from "@/features/machines";

export type Machine = {
    id?: string,
    name: string,
    imageSrc: string,
    description?: string,
    href: string,
}

export type MachineGroupProps = {
    machines: Machine[],
    className?: string
    groupName: string,
    groupHref: string,
    groupDescription?: string,
}


type GroupedMachines = Pick<MachineGroupProps, "groupName" | "groupDescription" | "groupHref" | "machines">

export default function MachinesPage() {

    // 1. Fetch all data (will be instant if prefetched on server)
    const { data: categoriesRes } = useCategories();
    const { data: machinesRes } = useMachines();

    const categories = categoriesRes?.data?.data || [];
    const allMachines = machinesRes?.data?.data || [];


    // 3. Group them in memory (Efficient & follows React rules)
    const groupedCategories: GroupedMachines[] = useMemo(() => {
        // Defensive check: if categories or allMachines are missing, return empty
        if (!categories || !allMachines) return [];
        console.log(allMachines)
        return categories.map((category: any) => {
            const categoryMachines = allMachines
                .filter((m: any) => m.categoryId?._id === category._id)
                .map((m: MachineResponse) => ({
                    id: `#${category.slug.split('-')[0]}-`,
                    name: m.modelName,
                    href: `/machines/${m.categoryId.slug}/${m.slug}`,
                    imageSrc: m.image1,
                    description: m.description
                }));

            return {
                groupName: category.categoryName,
                groupHref: `/categories/${category.slug}`,
                groupDescription: category.description,
                machines: categoryMachines
            };
        });
    }, [categories, allMachines]);

    console.log(groupedCategories)

    return (
        <div>
            <Header>
                <HeaderGroup className="flex-col">
                    <HeaderTitle>Machines Library</HeaderTitle>
                    <HeaderDescription>Manage, add, and organize your complete machinery.</HeaderDescription>
                </HeaderGroup>
                <LinkTag href={"/machines/add"} variant="button-brand" className="flex bg-primary text-white gap-2 items-center rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Machine</span>
                </LinkTag>
            </Header>
            <MachineGroupContainer groupedMachines={groupedCategories} />
        </div>
    );
}
