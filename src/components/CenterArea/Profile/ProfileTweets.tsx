// src/components/CenterArea/Profile/ProfileTweets.tsx
'use client'

import TweetCard from '@/components/CenterArea/Tweet/TweetCard'
import { useParams } from 'next/navigation'
import { useTweetsByAccount } from '@/hooks/useTweetsByAccount'

export default function ProfileTweets() {
  const { accountId } = useParams() as { accountId: string }
  const { tweets, loading, error } = useTweetsByAccount(accountId)

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
