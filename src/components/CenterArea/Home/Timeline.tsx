'use client'

import { useTweets } from '@/hooks/useTweets'
import TweetForm from '@/components/CenterArea/Home/TweetForm'
import TweetCard from '@/components/CenterArea/Tweet/TweetCard'

export default function Timeline() {
  const { tweets, loading, error } = useTweets()

  if (loading) return <p>ツイート読み込み中…</p>
  if (error)   return <p className="text-red-600">エラー: {error}</p>

  return (
    <>
      <TweetForm />
      {loading && <p>ツイート読み込み中…</p>}
      {error   && <p className="text-red-600">エラー: {error}</p>}
      {!loading && !error && (
        <ul className="space-y-4">
          {tweets.map((tweet) => (
            <li key={tweet.id}>
              <TweetCard tweet={tweet} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
