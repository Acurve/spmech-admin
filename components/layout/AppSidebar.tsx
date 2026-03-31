'use client'

import { useState, useEffect } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
    SidebarGroupLabel,
    SidebarGroup
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Text } from "../typography/Text"
import { X, Ellipsis } from "lucide-react"
import Image from 'next/image'
import { LinkTag } from '../shared'
import { icons } from '@/constants/icons'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { authApi } from '@/features/auth'

const overviewItems = [
    { label: 'Dashboard', icon: icons.dashboard, href: '/' },
    { label: 'Machines', icon: icons.machine, href: '/machines' },
    { label: 'Categories', icon: icons.category, href: '/categories' },
    { label: 'Inquiries', icon: icons.contact, href: '/inquiries' },
    { label: 'Clients', icon: icons.client, href: '/clients' },
]

export default function AppSidebar() {
    // 1. Add the mounted state
    const [isMounted, setIsMounted] = useState(false)

    const { toggleSidebar, state, isMobile } = useSidebar()
    const pathname = usePathname()
    const router = useRouter()
    const linkClassName = "hover:bg-orange-50"

    // 2. Set mounted to true once the client takes over
    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleLogout = async () => {
        authApi.logout()
            .then(() => router.push('/login'))
            .catch((err) => console.error(err))
    }

    // 3. Return a skeleton or null during SSR to avoid the ID mismatch
    if (!isMounted) {
        // Returning null works, but returning a blank sidebar skeleton 
        // prevents the rest of your app layout from shifting when it loads.
        return (
            <div className="w-(--sidebar-width) h-screen border-r bg-white" />
        )
    }

    return (
        <Sidebar collapsible="icon" variant='floating'>
            <SidebarHeader className="border-b bg-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                    {/* spmechlogo */}
                    <div className='py-6 flex gap-1 items-center'>
                        <Image src="/BrandLogo.svg" alt="SP Mech" width={52} height={52} />
                        <Text as="span" size="lg" className={`font-medium transition-all shrink-0 duration-200 ${(state === 'collapsed' && !isMobile) ? 'hidden' : ''}`}>
                            SP Mech
                        </Text>
                    </div>

                    <Button
                        onClick={toggleSidebar}
                        className="rounded-md p-1 hover:bg-sidebar-accent"
                        aria-label="Toggle sidebar"
                        variant="ghost"
                    >
                        {(state === "expanded" || isMobile) ? (
                            <X className="size-5 transition-transform duration-200" />
                        ) : (
                            <Ellipsis className="size-5 transition-transform duration-200" />
                        )}
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent className="py-4 bg-white rounded-b-2xl">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase">Overview</SidebarGroupLabel>
                    <SidebarMenu>
                        {overviewItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                {/* Tooltips use Radix internally, which causes ID mismatches */}
                                <SidebarMenuButton asChild tooltip={item.label} isActive={pathname === item.href} className={cn("", linkClassName)}>
                                    <LinkTag href={item.href} variant="custom" className="flex items-center py-5">
                                        <item.icon className="size-8" />
                                        <Text as="span" size="sm" className="font-medium">{item.label}</Text>
                                    </LinkTag>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase">settings</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem key={"settings"}>
                            <SidebarMenuButton asChild tooltip="settings" isActive={pathname === "/company-settings"} className={cn("", linkClassName)}>
                                <LinkTag href="/company-settings" className="flex items-center py-5">
                                    <icons.settings className="" />
                                    <Text as="span" size="sm" className="font-medium">settings</Text>
                                </LinkTag>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* DropdownMenu uses Radix internally, causing ID mismatches */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="cursor-pointer">
                                    <Avatar className="size-6-">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <Text as="span" size="sm" className="font-medium">User Profile</Text>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="end" className="w-56">
                                <DropdownMenuItem>
                                    <LinkTag href='/profile' className='py-2 w-full font-medium' variant='custom'>Profile</LinkTag>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button variant="destructive" className="w-full" onClick={handleLogout}>Logout</Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}