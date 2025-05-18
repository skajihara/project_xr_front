// src/hooks/useScheduledTweet.ts
import useSWR from 'swr'
import { ScheduledTweet } from '@/types/scheduledTweet'
import { fetcher } from '@/lib/fetcher'

export function useScheduledTweets(accountId: string) {
  const key = accountId ? `/schedule/account/${encodeURIComponent(accountId)}` : null
  const { data: scheduledTweets } = useSWR<ScheduledTweet[]>(key, fetcher, { suspense: true })
  return scheduledTweets!
}
