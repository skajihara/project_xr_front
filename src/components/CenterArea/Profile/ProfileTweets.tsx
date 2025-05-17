// src/components/CenterArea/Profile/ProfileTweets.tsx
'use client'

import styles from '@/styles/ProfileTweets.module.css'

import TweetCard from '@/components/CenterArea/Tweet/TweetCard'
import { useParams } from 'next/navigation'
import { useTweetsByAccount } from '@/hooks/useTweetsByAccount'

export default function ProfileTweets() {
  const { accountId } = useParams() as { accountId: string }
  const tweets = useTweetsByAccount(accountId)
  if (tweets.length === 0) return <p>まだツイートがないよ</p>
  return (
    <section className={styles.wrapper}>
      <ul className={styles.list}>
        {tweets.map(tweet => (
          <li key={tweet.id}>
            <TweetCard tweet={tweet} />
          </li>
        ))}
      </ul>
    </section>
  )
}
