// src/components/CenterArea/Tweet/TweetCard.tsx
'use client'

import styles from '@/styles/TweetCard.module.css' 

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/hooks/useAccount'
import { Tweet } from '@/types/tweet'

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  const router = useRouter()
  const account = useAccount(tweet.account_id)
  const icon = account?.icon?.trim() ? account.icon : '/icons/account/default_icon.svg'
  const location = tweet.location?.trim() ? tweet.location :  'unknown'

  const goTweet = () => router.push(`/tweet/${tweet.id}`)
  const goProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/profile/${tweet.account_id}`)
  }

  return (
    <div className={styles.container} onClick={goTweet}>
      <div className={styles.header}>
        <Image
          src={icon}
          alt={tweet.account_id}
          width={40}
          height={40}
          className={styles.icon}
          onClick={goProfile}
        />
        <div>
          <p className={styles.account}>@{tweet.account_id}</p>
          <p className={styles.datetime}>{new Date(tweet.datetime).toLocaleString()}</p>
        </div>
      </div>
      <p className={styles.text}>{tweet.text}</p>
      {tweet.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={tweet.image}
            alt="tweet image"
            fill
            className={styles.image}
            priority
          />
        </div>
      )}
      <div className={styles.footer}>
        <span>{location}</span>
        <span>❤ {tweet.likes}</span>
        <span>🔁 {tweet.retweets}</span>
        <span>💬 {tweet.replies}</span>
        <span>👁️ {tweet.views}</span>
      </div>
    </div>
  )
}
