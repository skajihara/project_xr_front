// src/components/CenterContents/Schedule/ScheduledTweetCard.tsx
'use client'

import styles from '@/styles/ScheduledTweetCard.module.css'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/hooks/useAccount'
import { ScheduledTweet } from '@/types/scheduledTweet'

export default function ScheduledTweetCard({ scheduled }: { scheduled: ScheduledTweet }) {
  const router = useRouter()
  const account = useAccount(scheduled.account_id)
  const icon = account?.icon?.trim() ? account.icon : '/icons/account/default_icon.svg'
  const goDetail = () => router.push(`/scheduled_tweet/${scheduled.id}`)

  return (
    <div onClick={goDetail} className={styles.container}>
      <div className={styles.header}>
        <Image
          src={icon}
          alt={scheduled.account_id}
          width={40}
          height={40}
          className={styles.icon}
        />
        <div>
          <p className={styles.account}>@{scheduled.account_id}</p>
          <p className={styles.datetime}>
            {new Date(scheduled.scheduled_datetime).toLocaleString()}
          </p>
        </div>
      </div>

      <p className={styles.text}>{scheduled.text}</p>

      {scheduled.location && (
        <p className={styles.location}>{scheduled.location}</p>
      )}

      {scheduled.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={scheduled.image}
            alt="scheduled image"
            fill
            className={styles.image}
            priority
          />
        </div>
      )}
    </div>
  )
}
