"use client"

import { DisplayCard } from "@/components/shared"
import { useCategoriesCount } from "@/features/categories/hooks/useCategory"
import { useContactsCount } from "@/features/inquiries/hooks/useContact"
import { useMachinesCount } from "@/features/machines/hooks/useMachine"
import { SimpleLoader } from "@/components/loaders"
import { icons } from "@/constants/icons"
import { Stat } from "../types"


export default function StatsContainer() {
    const { data: totalMachines } = useMachinesCount()
    const { data: totalCategories } = useCategoriesCount()
    const { data: totalContacts } = useContactsCount()


    const stats: Stat[] = [
        {
            title: "total machines",
            value: totalMachines !== undefined ? totalMachines : <SimpleLoader />,
            icon: icons.machine,
        },
        {
            title: "total categories",
            value: totalCategories !== undefined ? totalCategories : <SimpleLoader />,
            icon: icons.category,
        },
        {
            title: "total inquired",
            value: totalContacts !== undefined ? totalContacts : <SimpleLoader />,
            icon: icons.contact,
        },
    ]
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {
                stats.map((stat, index) => (
                    <DisplayCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={<stat.icon className="size-6" />}
                    />
                ))
            }
        </div>
    )
}