'use client'

import { useState, useEffect } from 'react'
import { Tweet } from '@/types/tweet'

export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch('http://localhost:5000/tweets')
      .then(res => {
        if (!res.ok) throw new Error('ツイート取得に失敗しました')
        return res.json()
      })
      .then((data: Tweet[]) => {
        setTweets(data)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { tweets, loading, error }
}
