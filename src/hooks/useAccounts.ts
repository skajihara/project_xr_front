// src/hooks/useTrends.ts
import useSWR from 'swr'
import { Account } from '@/types/account'
import { fetcher } from '@/lib/fetcher'

export function useAccounts() {
  const { data: accounts } = useSWR<Account[]>(
    '/accounts',
    fetcher,
    { suspense: true }
  )
  return accounts!
}
