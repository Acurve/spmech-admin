"use client"

import { DisplayCard } from "@/components/shared"
import { CardLoader, SimpleLoader } from "@/components/loaders"
import { icons } from "@/constants/icons"
import { Stat } from "../types"
import { type ManufacturerInfo, useManufacturerInfoStats } from "@/features/company-settings"
import { LucideIcon } from "lucide-react"

export default function CompanyStatsContainer() {

    const { data: manufacturerInfoStats, isLoading } = useManufacturerInfoStats()


    if (isLoading) return <CardLoader />
    const statsIcons: LucideIcon[] = [
        icons.installation,
        icons.accuracy,
        icons.experience
    ]
    const stats: Stat[] = manufacturerInfoStats.map((stat: ManufacturerInfo["stats"][number], index: number) => ({

        title: stat.label,
        value: `${stat.value}${stat.suffix}` || <SimpleLoader />,
        icon: statsIcons[index],
    }))

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