// src/hooks/useTweetsByAccount.ts
import useSWR from 'swr'
import { Tweet } from '@/types/tweet'
import { fetcher } from '@/lib/fetcher'

export function useTweetsByAccount(accountId: string) {
  const key = accountId? `/tweet/account/${encodeURIComponent(accountId)}` : null
  const { data: tweets } = useSWR<Tweet[]>(key, fetcher, { suspense: true })
  return tweets!
}
