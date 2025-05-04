import useSWR from 'swr'
import { Trend } from '@/types/trend'
import { fetcher } from '@/lib/fetcher'

export function useTrends() {
  const { data: trends } = useSWR<Trend[]>(
    '/trends',
    fetcher,
    { suspense: true }
  )
  return trends!
}
