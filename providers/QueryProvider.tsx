"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'
import { queryClientConfig } from '@/config/queryClientConfig'

export default function QueryProvider({ children }: PropsWithChildren) {
    // MUST use the same config as the server
    const [queryClient] = useState(() => new QueryClient(queryClientConfig))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
