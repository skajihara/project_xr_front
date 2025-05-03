// src/hoolks/useTrends.ts
import { useState, useEffect } from 'react'
import { ScheduledTweet } from '@/types/scheduledTweet'
import { fetcher } from '@/lib/fetcher'

export function useScheduledTweet(id: string | number) {
  const [scheduled, setScheduled] = useState<ScheduledTweet | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    if (!id && id !== 0) return
    setLoading(true)
    setError(null)
    fetcher<ScheduledTweet>(`/scheduledTweets/${id}`)
      .then(setScheduled)
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [id])

  return { scheduled, loading, error }
}
