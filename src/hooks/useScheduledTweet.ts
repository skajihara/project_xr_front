import useSWR from 'swr'
import { ScheduledTweet } from '@/types/scheduledTweet'
import { fetcher } from '@/lib/fetcher'

export function useScheduledTweet(id: string | number) {
  const key = id != null ? `/scheduledTweets/${id}` : null
  const { data: scheduled } = useSWR<ScheduledTweet>(
    key,
    fetcher,
    { suspense: true }
  )
  return scheduled!
}
