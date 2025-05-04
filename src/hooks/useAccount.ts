import useSWR from 'swr'
import { Account } from '@/types/account'
import { fetcher } from '@/lib/fetcher'

export function useAccount(id: string) {
  const key = id ? `/accounts/${id}` : null
  const { data: account } = useSWR<Account>(
    key,
    fetcher,
    { suspense: true }
  )
  return account!
}
