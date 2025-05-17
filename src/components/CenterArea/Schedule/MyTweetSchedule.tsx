// src/components/CenterContents/Schedule/MyTweetSchedule.tsx
'use client'

import styles from '@/styles/MyTweetSchedule.module.css'

import { useUserStore } from '@/stores/useUserStore'
import { useScheduledTweets } from '@/hooks/useScheduledTweets'
import ScheduledTweetCard from '@/components/CenterArea/Schedule/ScheduledTweetCard'
import ScheduleTweetForm from '@/components/CenterArea/Schedule/ScheduleTweetForm'

export default function MyTweetSchedule() {
  const user = useUserStore(s => s.user)!
  const scheduledTweets = useScheduledTweets(user.id)
  return (
    <section className={styles.wrapper}>
      <ScheduleTweetForm />
      <ul className={styles.list}>
        {scheduledTweets.map(st => (
          <li key={st.id}>
            <ScheduledTweetCard scheduled={st} />
          </li>
        ))}
      </ul>
    </section>
  )
}
