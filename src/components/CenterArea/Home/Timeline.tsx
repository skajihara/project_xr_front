'use client'

import { useTweets } from '@/hooks/useTweets'
import TweetCard from '@/components/CenterArea/Tweet/TweetCard'

export default function Timeline() {
  const { tweets, loading, error } = useTweets()

  if (loading) return <p>ツイート読み込み中…</p>
  if (error)   return <p className="text-red-600">エラー: {error}</p>

  return (
    <ul className="space-y-4">
      {tweets.map(tweet => (
        <li key={tweet.id}>
          <TweetCard tweet={tweet} />
        </li>
      ))}
    </ul>
  )
}
