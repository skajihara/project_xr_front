// src/components/CenterArea/Home/Timeline.tsx
'use client'

import styles from '@/styles/Timeline.module.css' 

import { useTweets } from '@/hooks/useTweets'
import TweetForm from '@/components/CenterArea/Home/TweetForm'
import TweetCard from '@/components/CenterArea/Tweet/TweetCard'

export default function Timeline() {
  const tweets = useTweets()
  return (
    <section className={styles.wrapper}>
      <TweetForm />
      <ul className={styles.list}>
        {tweets.map((tweet) => (
          <li key={tweet.id}>
            <TweetCard tweet={tweet} />
          </li>
        ))}
      </ul>
    </section>
  )
}
