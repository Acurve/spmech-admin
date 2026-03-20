import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

export type Stat = {
    title: string,
    value: string | ReactNode,
    icon: LucideIcon,
}
