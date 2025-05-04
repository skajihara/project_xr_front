import useSWR from 'swr'
import { Tweet } from '@/types/tweet'
import { fetcher } from '@/lib/fetcher'

export function useTweets() {
  const { data: tweets } = useSWR<Tweet[]>(
    '/tweets',
    fetcher,
    { suspense: true }
  )
  return tweets!
}
