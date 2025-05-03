// src/hooks/useTrends.ts
import { useState, useEffect } from 'react'
import { Account } from '@/types/account'
import { fetcher } from '@/lib/fetcher'

export function useAccount(id: string) {
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetcher<Account>(`/accounts/${id}`)
      .then(setAccount)
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [id])

  return { account, loading, error }
}
