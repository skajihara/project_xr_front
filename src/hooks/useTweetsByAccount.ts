// src/hooks/useTrends.ts
import { useState, useEffect } from 'react'
import { Tweet } from '@/types/tweet'
import { fetcher } from '@/lib/fetcher'

export function useTweetsByAccount(accountId: string) {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!accountId) return
    setLoading(true)
    setError(null)
    fetcher<Tweet[]>(`/tweets?account_id=${encodeURIComponent(accountId)}`)
      .then(data => setTweets(data))
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [accountId])

  return { tweets, loading, error }
}
