import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'
import { queryClientConfig } from './queryClientConfig'

export const getQueryClient = cache(() => new QueryClient(queryClientConfig))