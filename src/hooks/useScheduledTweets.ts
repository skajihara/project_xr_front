// src/hooks/useScheduledTweets.ts
import { useState, useEffect } from 'react'
import { ScheduledTweet } from '@/types/scheduledTweet'
import { fetcher } from '@/lib/fetcher'

export function useScheduledTweets(accountId: string) {
  const [scheduledTweets, setScheduledTweets] = useState<ScheduledTweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accountId) return
    setLoading(true)
    setError(null)
    fetcher<ScheduledTweet[]>(`/scheduledTweets?account_id=${encodeURIComponent(accountId)}`)
      .then(data => setScheduledTweets(data))
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [accountId])

  return { scheduledTweets, loading, error }
}
