// src/hooks/useTrends.ts
import { useState, useEffect } from 'react'
import { Account } from '@/types/account'
import { fetcher } from '@/lib/fetcher'

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetcher<Account[]>('/accounts')
      .then(data => setAccounts(data))
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [])

  return { accounts, loading, error }
}
