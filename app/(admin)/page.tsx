import { CATEGORIES_QUERY_KEY, CONTACT_QUERY_KEY, MACHINE_QUERY_KEY } from '@/constants/queryKeys'
import { machinesApi } from '@/features/machines'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/config/getQueryClient'
import { categoryApi } from '@/features/categories'
import { contactsApi } from '@/features/inquiries'
import { Header, HeaderDescription, HeaderGroup, HeaderTitle } from '@/components/layout'
import StatsContainer from '@/features/dashboard/components/StatsContainer'
import { Text } from '@/components/typography/Text'
import CompanyStatsContainer from '@/features/dashboard/components/CompanyStatsContainer'



export default async function Dashboard() {


    const queryClient = getQueryClient()

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: [MACHINE_QUERY_KEY],
            queryFn: machinesApi.getAll
        }),
        queryClient.prefetchQuery({
            queryKey: [CATEGORIES_QUERY_KEY],
            queryFn: categoryApi.getAll
        }),
        queryClient.prefetchQuery({
            queryKey: [CONTACT_QUERY_KEY],
            queryFn: contactsApi.getAll
        })
    ])

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>

            <Header>
                <HeaderGroup className='flex-col'>
                    <HeaderTitle>Dashboard</HeaderTitle>
                    <HeaderDescription>Overview of your business management system</HeaderDescription>
                </HeaderGroup>
            </Header>

            <div className='space-y-2'>
                <Text as='h4' size='sm' className='uppercase font-medium text-slate-500'>Platform Metrics</Text>
                <StatsContainer />
            </div>
            <div className='space-y-2 mt-4'>
                <Text as='h4' size='sm' className='uppercase font-medium text-slate-500'>Company Stats</Text>
                <CompanyStatsContainer />
            </div>
        </HydrationBoundary>
    )
}
