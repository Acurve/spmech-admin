import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/AppSidebar'

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {


    return (

        <SidebarProvider>
            <AppSidebar />
            <div className="w-full h-full">
                <div className='p-4 pl-4 md:pl-0'>
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}