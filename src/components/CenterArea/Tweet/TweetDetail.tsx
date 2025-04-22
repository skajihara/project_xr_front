// src/components/CenterContents/Tweet/TweetDetail.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import TweetCard from '@/components/CenterArea/Tweet/TweetCard'
import { Tweet } from '@/hooks/useTweets'

export default function TweetDetail() {
  const { tweetId } = useParams() as { tweetId: string }
  const [tweet, setTweet] = useState<Tweet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tweetId) return
    setLoading(true)
    setError(null)
    fetch(`http://localhost:5000/tweets?id=${tweetId}`)
      .then(res => {
        if (!res.ok) throw new Error('ツイート詳細取得失敗')
        return res.json()
      })
      .then((data: Tweet[]) => {
        if (data.length > 0) {
          setTweet(data[0])
        } else {
          throw new Error('ツイートが見つかりません')
        }
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [tweetId])

  if (loading) return <p>詳細読み込み中…</p>
  if (error)   return <p className="text-red-600">エラー: {error}</p>
  if (!tweet)  return <p>ツイートが見つかりません</p>

  return (
    <div className="space-y-4">
      <Link href="/home" className="text-blue-500 hover:underline">
        ← 戻る
      </Link>
      <TweetCard tweet={tweet} />
    </div>
  )
}
