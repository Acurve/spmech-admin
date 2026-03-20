import { cn } from '@/lib/utils'
import { type PropsWithChildren } from 'react';
import { LinkTag } from '../shared';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

type HeaderProps = PropsWithChildren<{
    className?: string,

}>
export const Header = ({ className = "", children }: HeaderProps) => {
    return (
        <div className={cn("w-full flex mb-4 items-center justify-between px-4 py-6 bg-white rounded-2xl ring-1 ring-sidebar-border", className)}>
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
        <LinkTag href={href} className='my-auto'>
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
