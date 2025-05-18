// src/hooks/useTweet.ts
import useSWR from 'swr'
import { Tweet } from '@/types/tweet'
import { fetcher } from '@/lib/fetcher'

export function useTweet(id: string | number) {
  const key = id != null ? `/tweet/${id}` : null
  const { data: tweet } = useSWR<Tweet>(key, fetcher, { suspense: true })
  return tweet!
}
