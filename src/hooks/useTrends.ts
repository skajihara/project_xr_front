// src/hooks/useTrends.ts
import { useState, useEffect } from 'react'
import { Trend } from '@/types/trend'
import { fetcher } from '@/lib/fetcher'

export function useTrends() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetcher<Trend[]>('/trends')
      .then(data => setTrends(data))
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [])

  return { trends, loading, error }
}
