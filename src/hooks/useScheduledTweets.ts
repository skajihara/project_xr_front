// src/hooks/useScheduledTweets.ts
import { useState, useEffect } from 'react'

export type ScheduledTweet = {
  id: number
  account_id: string
  text: string
  image?: string
  location?: string
  scheduled_datetime: string
  created_datetime: string
  delete_flag: number
}

export function useScheduledTweets(accountId: string) {
  const [scheduledTweets, setScheduledTweets] = useState<ScheduledTweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accountId) return

    setLoading(true)
    setError(null)

    fetch(`http://localhost:5000/scheduledTweets?account_id=${encodeURIComponent(accountId)}`)
      .then(res => {
        if (!res.ok) throw new Error('予約ツイート取得に失敗しました')
        return res.json()
      })
      .then((data: ScheduledTweet[]) => {
        // delete_flag が 0 のものだけ残すならここで filter もできる
        setScheduledTweets(data)
      })
      .catch(err => {
        console.error(err)
        setError(err instanceof Error ? err.message : '不明なエラー')
      })
      .finally(() => setLoading(false))
  }, [accountId])

  return { scheduledTweets, loading, error }
}
