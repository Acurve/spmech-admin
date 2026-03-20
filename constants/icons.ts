import { Cog, LucideIcon, Layers, LayoutDashboard, MessageSquare, Package, Trash, Download, SplinePointer, Calendar, Pencil, AlertTriangle, Plus, Upload, ExternalLink } from "lucide-react"

type Icons = Record<any, LucideIcon>

export const icons: Icons = {
    machine: Package,
    category: Layers,
    contact: MessageSquare,
    settings: Cog,
    dashboard: LayoutDashboard,
    delete: Trash,
    installation: Download,
    accuracy: SplinePointer,
    experience: Calendar,
    edit: Pencil,
    alertTriangle: AlertTriangle,
    plus: Plus,
    upload: Upload,
    externalLink: ExternalLink,
}