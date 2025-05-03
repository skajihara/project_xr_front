// src/hooks/useTrends.ts
import { useState, useEffect } from 'react'
import { Tweet } from '@/types/tweet'
import { fetcher } from '@/lib/fetcher'

export function useTweet(id: string | number) {
  const [tweet, setTweet]   = useState<Tweet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id && id !== 0) return
    setLoading(true)
    setError(null)
    fetcher<Tweet>(`/tweets/${id}`)
      .then(setTweet)
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [id])

  return { tweet, loading, error }
}
