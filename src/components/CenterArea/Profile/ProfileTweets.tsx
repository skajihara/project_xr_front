// src/components/CenterArea/Profile/ProfileTweets.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import TweetCard from '@/components/CenterArea/Tweet/TweetCard'
import { Tweet } from '@/hooks/useTweets'

export default function ProfileTweets() {
  const { accountId } = useParams() as { accountId: string }
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string|null>(null)

  useEffect(() => {
    if (!accountId) return
    fetch(`http://localhost:5000/tweets?account_id=${accountId}`)
      .then(res => {
        if (!res.ok) throw new Error('ツイート取得失敗')
        return res.json()
      })
      .then((data: Tweet[]) => setTweets(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [accountId])

  if (loading) return <p>ツイート読み込み中…</p>
  if (error)   return <p className="text-red-600">エラー: {error}</p>
  if (tweets.length === 0) return <p>まだツイートがないよ</p>

  return (
    <ul className="space-y-4 p-4 bg-white">
      {tweets.map(tweet => (
        <li key={tweet.id}>
          <TweetCard tweet={tweet} />
        </li>
      ))}
    </ul>
  )
}
