'use client'

import { useState, useEffect } from 'react'

export interface Tweet {
  id: number
  account_id: string
  text: string
  image?: string | null
  likes: number
  retweets: number
  replies: number
  views: number
  datetime: string
  location?: string | null
  delete_flag: number
}

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
