"use client"
import { cn } from '@/lib/utils'
import { type PropsWithChildren } from 'react';
import { LinkTag } from '../shared';
import { ArrowLeft, Ellipsis } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

type HeaderProps = PropsWithChildren<{
    className?: string,

}>
export const Header = ({ className = "", children }: HeaderProps) => {
    const { isMobile, setOpenMobile, openMobile } = useSidebar()

    return (
        <div className={cn("w-full relative flex flex-col md:flex-row gap-4 items-start mb-4 md:items-center justify-between px-4 py-6 bg-white rounded-2xl ring-1 ring-sidebar-border", (!openMobile && isMobile) && "pl-16", className)}>
            <Button
                variant="secondary"
                onClick={() => setOpenMobile(true)}
                className={cn("absolute top-6 bottom-0 left-4 rounded-lg", (!openMobile && isMobile) ? "flex" : "hidden")}>
                <Ellipsis className="aspect-square transition-transform duration-200" />
            </Button>
            {children}
        </div>
    )
}

type HeaderGroupProps = PropsWithChildren<{
    className?: string,

}>

export const HeaderGroup = ({ children, className = "" }: HeaderGroupProps) => {
    return (
        <div className={cn("flex", className)}>
            {children}
        </div>
    )
}


type HeaderBackNavigationProps = PropsWithChildren<{
    href: string,
}>
export const HeaderBackNavigation = ({ href }: HeaderBackNavigationProps) => {
    return (
        <LinkTag href={href}>
            <Button variant="outline" className='cursor-pointer h-12 w-12'>

                <ArrowLeft />
            </Button>
        </LinkTag>
    )
}

type HeaderTitleProps = PropsWithChildren<{
    className?: string,

}>
export const HeaderTitle = ({ children, className = "" }: HeaderTitleProps) => {
    return (
        <h1 className={cn("text-xl font-bold text-slate-900 tracking-tight", className)}>
            {children}
        </h1>
    )
}

type HeaderDescriptionProps = PropsWithChildren<{
    className?: string,

}>
export const HeaderDescription = ({ children, className = "" }: HeaderDescriptionProps) => {
    return (
        <p className={cn("text-sm text-slate-500 mt-1", className)}>
            {children}
        </p>
    )
}
