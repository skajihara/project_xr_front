// src/hooks/useAccounts.ts
import useSWR from 'swr'
import { Account } from '@/types/account'
import { fetcher } from '@/lib/fetcher'

export function useAccounts() {
  const { data: accounts } = useSWR<Account[]>('/account', fetcher, { suspense: true })
  return accounts!
}
