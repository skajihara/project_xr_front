// src/components/CenterArea/Home/Timeline.tsx
'use client'

import { useTweets } from '@/hooks/useTweets'
import TweetForm from '@/components/CenterArea/Home/TweetForm'
import TweetCard from '@/components/CenterArea/Tweet/TweetCard'

export default function Timeline() {
  const tweets = useTweets()
  return (
    <>
      <TweetForm />
      <ul className="space-y-4">
        {tweets.map((tweet) => (
          <li key={tweet.id}>
            <TweetCard tweet={tweet} />
          </li>
        ))}
      </ul>
    </>
  )
}
